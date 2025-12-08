// back/src/controller/orderController.ts
import { Request, Response } from 'express'
import prisma from '../config/db'
import { generateFacturePDF } from "../services/factureService";
import { sendFactureEmail } from "../services/mailService";
import path from "path";
import fs from "fs/promises";

const buildFactureNumero = (venteId: string) => {
    //ex : F-20251208-B1F3C9E2
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const shortId = venteId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `F-${yyyy}${mm}${dd}-${shortId}`;
};

//création commande
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      panierId,
      idUser,
      adresse_livraison,
      contact_phone,
      mode = "standard",
      frais_livraison = 0,
      total,
    } = req.body;

    if (!panierId || !idUser || !adresse_livraison || !contact_phone || total == null) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const panier = await prisma.panier.findUnique({
      where: { id: panierId },
      select: {
        id: true,
        idClient: true,
        lignes: {
          select: {
            idProduit: true,
            quantite: true,
            prix_Unitaire: true,
            total: true,
            produit: { select: { nom: true, magasinId: true } },
          },
        },
      },
    });

    if (!panier) return res.status(404).json({ error: "Panier introuvable" });
    if (panier.idClient !== idUser) return res.status(403).json({ error: "Ce panier ne t'appartient pas" });
    if (panier.lignes.length === 0) return res.status(400).json({ error: "Panier vide" });

    const subtotal = panier.lignes.reduce((sum, l) => sum + Number(l.total), 0);
    const totalCheck = subtotal + Number(frais_livraison);

    if (Number(total) !== Number(totalCheck)) {
      return res.status(400).json({
        error: "Total invalide",
        detail: { subtotal, frais_livraison, totalCheck, total },
      });
    }

    // 1) Transaction DB
    const vente = await prisma.$transaction(async (tx) => {
      // a) créer la vente SANS facture_numero au début
      const v = await tx.vente.create({
        data: {
          idPanier: panier.id,
          idUser,
          total,
          statut: "en_preparation",
          facture_url: null,

          livraison: {
            create: {
              adresse_livraison,
              contact_phone,
              mode,
              frais_livraison,
              statut: "préparée",
              paiement_collecte: false,
            },
          },

          paiement: {
            create: {
              mode: "paypal",
              montant: total,
              statut: "en attente",
            },
          },
        },
      });

      // b) générer numero facture avec l'id réel
      const factureNumero = buildFactureNumero(v.id);

      // c) update vente avec facture_numero
      await tx.vente.update({
        where: { id: v.id },
        data: { facture_numero: factureNumero },
      });

      // d) créer lignes vente en batch
      await tx.ligneVente.createMany({
        data: panier.lignes.map((l) => ({
          venteId: v.id,
          produitId: l.idProduit,
          magasinId: l.produit.magasinId,
          quantite: l.quantite,
          prix_Unitaire: l.prix_Unitaire,
          total: l.total,
        })),
      });

      // e) vider panier
      await tx.lignePanier.deleteMany({ where: { idPanier: panier.id } });

      return v;
    });

    // 2) Re-fetch complet (avec numero facture ok)
    const venteFull = await prisma.vente.findUnique({
      where: { id: vente.id },
      include: {
        lignes: { include: { produit: true } },
        livraison: true,
        paiement: true,
        user: true,
      },
    });

    if (!venteFull) return res.status(500).json({ error: "Vente introuvable après création" });

    // 3) Générer PDF
    const { filePath, publicUrl } = await generateFacturePDF({
      factureNumero: venteFull.facture_numero!,
      date: venteFull.dateVente,
      client: {
        nom: venteFull.user.nom,
        email: venteFull.user.email,
        tel: venteFull.user.tel,
        adresse: venteFull.user.adresse,
      },
      lignes: venteFull.lignes.map((l) => ({
        nom: l.produit.nom,
        quantite: l.quantite,
        prix_Unitaire: Number(l.prix_Unitaire),
        total: Number(l.total),
      })),
      frais_livraison: Number(venteFull.livraison?.frais_livraison || 0),
      total: Number(venteFull.total),
    });

    // 4) MAJ url facture
    const venteUpdated = await prisma.vente.update({
      where: { id: venteFull.id },
      data: { facture_url: publicUrl },
      include: { lignes: true, livraison: true, paiement: true },
    });

    // 5) Envoyer email
    try {
        const html = `
    <p>Bonjour ${venteFull.user.nom},</p>

    <p>Merci pour votre commande sur TsenaGasy.</p>

    <p>
      Veuillez trouver votre facture en pièce jointe.<br/>
      Elle contient tous les détails relatifs à votre achat, ainsi que le montant total réglé.
    </p>

    <p>Nous restons à votre disposition pour toute question.</p>

    <p>Cordialement,<br/>L’équipe TsenaGasy</p>
  `;

  const text = `Bonjour ${venteFull.user.nom},

Merci pour votre commande sur TsenaGasy.

Veuillez trouver votre facture en pièce jointe.
Elle contient tous les détails relatifs à votre achat, ainsi que le montant total réglé.

Nous restons à votre disposition pour toute question.

Cordialement,
L’équipe TsenaGasy`;
        
      await sendFactureEmail({
        to: venteFull.user.email,
        subject: `Votre facture ${venteFull.facture_numero}`,
        text,
        html,
        filePath,
        filename: `${venteFull.facture_numero}.pdf`,
      });
    } catch (mailErr) {
      console.error("Email facture non envoyé:", mailErr);
    }

    return res.status(201).json({
      venteId: venteUpdated.id,
      createdAt: venteUpdated.dateVente,
      total: venteUpdated.total,
      statut: venteUpdated.statut,
      lignes: venteUpdated.lignes,
      facture_numero: venteUpdated.facture_numero,
      facture_url: venteUpdated.facture_url,
      livraison: venteUpdated.livraison,
      paiement: venteUpdated.paiement,
    });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({
      error: "Erreur serveur createOrder",
      detail: e?.message,
    });
  }
};

// afficher les commandes
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "userId manquant" });

    const ventes = await prisma.vente.findMany({
      where: { idUser: userId },
      orderBy: { dateVente: "desc" },
      include: {
        lignes: {
          include: {
            produit: { select: { nom: true } },
          },
        },
        livraison: true,
        paiement: true,
      },
    });

    return res.json(ventes);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Erreur getMyOrders", detail: e?.message });
  }
};

//suppression de commande
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: "orderId manquant" });
    }

    // 1) vérifier que la vente existe + statut expedie
    const vente = await prisma.vente.findUnique({
      where: { id: orderId },
      include: { livraison: true },
    });

    if (!vente) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    if (vente.statut !== "expedie") {
      return res.status(403).json({
        error: "Suppression autorisée uniquement quand la commande est expédié.",
        statut: vente.statut,
      });
    }

    // suppression PDF
    if (vente.facture_url) {
      const fileName = path.basename(vente.facture_url);
      const facturePath = path.join(
        process.cwd(),
        "src/public/factures",
        fileName
      );

      try {
        await fs.unlink(facturePath);
        console.log(" Facture supprimée :", facturePath);
      } catch (err: any) {
        console.warn("⚠️ Impossible de supprimer la facture :", err?.message);
      }
    }

    // 2) supprimer la vente (cascade fera le reste)
    await prisma.vente.delete({
      where: { id: orderId },
    });

    return res.json({ success: true, message: "Commande supprimée." });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({
      error: "Erreur deleteOrder",
      detail: e?.message,
    });
  }
};