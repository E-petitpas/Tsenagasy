// back/src/controller/panierController.ts

import { Request, Response } from 'express'
import prisma from '../config/db'
import { supabaseAdmin } from "../config/supabase";

// Ajout un produit en favori
export const addFavori = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { produitId } = req.body as { produitId?: string };

    if (!userId) return res.status(400).json({ error: "userId requis" });
    if (!produitId) return res.status(400).json({ error: "produitId requis" });

    // vérifier user existe
    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    // vérifier produit existe
    const produit = await prisma.produit.findUnique({
      where: { id: produitId },
      select: { id: true },
    });
    if (!produit) return res.status(404).json({ error: "Produit introuvable" });

    // créer favori (la contrainte unique empêche doublons)
    const fav = await prisma.favori.create({
      data: { userId, produitId },
    });

    return res.status(201).json(fav);
  } catch (e: any) {
    console.error("Erreur addFavori:", e);

    // doublon (déjà en favori)
    if (e.code === "P2002") {
      return res.status(409).json({ error: "Produit déjà en favori" });
    }

    return res.status(500).json({ error: "Erreur ajout favori" });
  }
};

// Supprimer un produit des favoris
export const removeFavori = async (req: Request, res: Response) => {
  try {
    const { userId, produitId } = req.params;

    if (!userId) return res.status(400).json({ error: "userId requis" });
    if (!produitId) return res.status(400).json({ error: "produitId requis" });

    // supprimer via clé composite
    await prisma.favori.delete({
      where: {
        userId_produitId: {
          userId,
          produitId,
        },
      },
    });

    return res.status(200).json({ message: "Favori supprimé" });
  } catch (e: any) {
    console.error("Erreur removeFavori:", e);

    // si pas trouvé
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Favori introuvable" });
    }

    return res.status(500).json({ error: "Erreur suppression favori" });
  }
};

// Récupérer les favoris d'un utilisateur
export const getFavorisByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId requis" });

    // vérifier user existe
    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const favoris = await prisma.favori.findMany({
      where: { userId },
      include: {
        produit: {
          include: {
            magasin: { select: { nom_Magasin: true, type: true } },
            categorie: { select: { nomCat: true } },
            produitLocation: true, 
            Sponsor: true,         
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = favoris.map((f) => {
      const p = f.produit;

      return {
        id: p.id,
        nom: p.nom,
        prix: Number(p.prix),
        stock: p.stock,
        images: p.images ?? [],
        tags: p.tags ?? [],
        descriptions: p.descriptions,
        poids: p.poids,
        dimensions: p.dimensions,
        materiaux: p.materiaux,
        isLocation: p.isLocation,

        // obligatoires
        categorie: { nomCat: p.categorie.nomCat },
        magasin: { nom_Magasin: p.magasin.nom_Magasin, type: p.magasin.type },

        // optionnels (comme détails produit)
        produitLocation: p.produitLocation ?? null,
        Sponsor: p.Sponsor ?? null,

        // optionnel propre aux favoris
        favoriCreatedAt: f.createdAt,
      };
    });

    return res.status(200).json(formatted);
  } catch (e) {
    console.error("Erreur getFavorisByUser:", e);
    return res.status(500).json({ error: "Erreur récupération favoris" });
  }
};
