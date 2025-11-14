// back/src/controller/dashboardController.ts

import { Request, Response } from 'express'
import prisma from '../config/db'

// statistique pour les cartes dans vendeur
export const getVendorStats = async (req: Request, res: Response) => {
  try {
    const { magasinId } = req.params;

    if (!magasinId) {
      return res.status(400).json({ error: "magasinId requis." });
    }

    // 1️⃣ Commandes du vendeur
    const totalOrders = await prisma.vente.count({
      where: {
        panier: {
          lignes: {
            some: {
              produit: { magasinId }
            }
          }
        }
      }
    });

    // 2️⃣ Produits actifs
    const activeProducts = await prisma.produit.count({
      where: {
        magasinId,
        statut: {
          in: ["publie", "publié", "approuvé", "validé"]
        }
      }
    });

    // 3️⃣ Sponsors validés
    const validSponsors = await prisma.sponsor.count({
      where: {
        statut: "validé",
        produit: { magasinId }
      }
    });

    return res.json({
      totalOrders,
      activeProducts,
      validSponsors
    });

  } catch (error) {
    console.error("Erreur getVendorStats :", error);
    res.status(500).json({ error: "Erreur lors du chargement des statistiques." });
  }
};