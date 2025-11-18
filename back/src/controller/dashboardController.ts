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

    // Commandes du vendeur
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

    // Produits actifs
    const activeProducts = await prisma.produit.count({
      where: {
        magasinId,
        statut: {
          in: ["publie", "publié", "approuvé", "validé"]
        }
      }
    });

    //Sponsors validés
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

// pour dashboard d'admin
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Total utilisateurs
    const totalUsers = await prisma.utilisateur.count();

    // Utilisateurs actifs (connexion < 3 mois)
    const activeUsers = await prisma.utilisateur.count({
      where: {
        lastLogin: {
          gte: threeMonthsAgo
        }
      }
    });

    // Produits validés
    const totalProducts = await prisma.produit.count({
      where: { statut: "validé" }
    });

    // Sponsors validés
    const totalSponsors = await prisma.sponsor.count({
      where: { statut: "validé" }
    });

    res.json({
      totalUsers,
      activeUsers,
      totalProducts,
      totalSponsors
    });

  } catch (error) {
    console.error("Erreur getAdminStats :", error);
    res.status(500).json({ error: "Erreur récupération statistiques" });
  }
};