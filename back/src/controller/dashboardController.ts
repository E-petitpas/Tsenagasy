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

// pour profile dans client
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId requis." });
    }

    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      include: {
        magasins: true, // le vendeur peut avoir plusieurs magasins
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    const firstStore = user.role === "vendor" && user.magasins.length > 0
      ? user.magasins[0].nom_Magasin
      : null;

    const formattedProfile = {
      id: user.id,
      role: user.role,

      name: user.nom,
      email: user.email,
      tel: user.tel,
      adresse: user.adresse,

      storeName: firstStore, // null si pas vendeur
    };

    return res.json(formattedProfile);

  } catch (error) {
    console.error("Erreur getUserProfile :", error);
    return res.status(500).json({
      error: "Erreur lors de la récupération du profil utilisateur.",
    });
  }
};

// pour les sponsors dans la bannière
export const getAllSponsoredProducts = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const sponsors = await prisma.sponsor.findMany({
      where: {
        statut: "validé",
        dateFin: { gt: now }, // sponsor encore valide
      },
      include: {
        produit: {
          include: {
            magasin: true,
            categorie: true,
            produitLocation: true,
          },
        },
      },
      orderBy: { dateDebut: "asc" },
    });

    if (!sponsors || sponsors.length === 0) {
      return res.status(200).json([]);
    }

    // FORMATAGE DES DONNÉES POUR LE FRONT
    const formatted = sponsors.map((s) => ({
      id: s.id,
      produitId: s.produitId,

      // --- Produit ---
      title: s.produit.nom,
      desc: s.produit.descriptions,
      price: Number(s.produit.prix), // on renvoie un number propre
      images: s.produit.images ?? [],
      tags: s.produit.tags ?? [],
      typeProduit: s.produit.isLocation ? "location" : "vente",
      typePrix: s.produit.produitLocation?.typePrix ?? null,

      // --- Catégorie ---
      category: s.produit.categorie?.nomCat ?? null,

      // --- Magasin ---
      magasin: s.produit.magasin?.nom_Magasin ?? null,
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error("Erreur getAllSponsoredProducts :", error);
    return res.status(500).json({ error: "Erreur lors du chargement des sponsors." });
  }
};