// back/src/controller/user.controller.ts

import { Request, Response } from 'express'
import prisma from '../config/db'
import * as jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

// Mapper rôle DB → rôle normalisé anglais
const roleMapper = (role: string): string => {
  switch (role) {
    case 'acheteur': return 'client'
    case 'commercant': return 'vendor'
    case 'relationClient': return 'customerSupport'
    case 'superAdmin': return 'admin'
    default: return 'client'
  }
}

// création user
export const addClient = async (req: Request, res: Response) => {
  try {
    const { email, nom, tel, adresse, role, motDePasse, type, nomEntreprise } = req.body

    if (!email || !motDePasse || !role || !nom || !tel || !adresse) {
      return res.status(400).json({ message: "Nom, email, téléphone, adresse, rôle et mot de passe sont requis" })
    }

    if (role === "commercant" && (!type || !nomEntreprise)) {
      return res.status(400).json({ message: "Un commerçant doit fournir un type et un nomEntreprise" })
    }

    // Vérifier doublon
    const existing = await prisma.utilisateur.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: "Utilisateur déjà existant" })

    // Création dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password: motDePasse })
    
    if (error) return res.status(400).json({ message: error.message })
    const supabaseId = data.user?.id
    if (!supabaseId) return res.status(500).json({ message: "Erreur Supabase: pas de supabaseId" })

    // Création Prisma
    const utilisateur = await prisma.utilisateur.create({
      data: {
        supabaseId,
        email,
        nom,
        tel,
        adresse,
        role: roleMapper(role),
        lastLogin: new Date()
      }
    });

    let magasin = null;
    if (role === "commercant") {
      magasin = await prisma.magasin.create({
        data: {
          nom_Magasin: nomEntreprise,
          statut: "en-attente",
          id_proprietaire: utilisateur.id,
        },
      });
    }
    const idMagasin = magasin?.id_magasin || null;

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      token: data.session?.access_token, // identique à login
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        role: utilisateur.role,
        magasinId: idMagasin,
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

// login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, motDePasse } = req.body

    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    // 1. Vérifier via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse
    })

    if (error) return res.status(401).json({ message: error.message })
    if (!data.user) return res.status(404).json({ message: 'Utilisateur Supabase introuvable' })

    // 2. Récupérer l’utilisateur côté Prisma
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      include: {
        magasins: true, 
      },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé dans Prisma' });
    }

    // MAJ lastLogin
    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { lastLogin: new Date() }
    });

    let idMagasin = null;
    if (utilisateur.role === "vendor") { // rôle normalisé
      // tu peux aussi filtrer uniquement les magasins valides ou actifs si besoin
      idMagasin = utilisateur.magasins?.[0]?.id_magasin || null;
    }

    return res.json({
      message: 'Connexion réussie',
      token: data.session?.access_token, 
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        role: utilisateur.role,
        magasinId: idMagasin,
      }
    });
  } catch (error) {
    console.error('Erreur login:', error)
    return res.status(500).json({ message: 'Erreur serveur', error })
  }
}


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    // Vérifier si utilisateur existe dans Prisma
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
    }

    // Demander à Supabase d’envoyer le lien de reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password", // ou ton domaine
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ message: "Un email de réinitialisation a été envoyé !" });
  } catch (error) {
    console.error("Erreur forgotPassword:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Nouveau mot de passe requis" });
    }

    // Ici, Supabase utilise la session en cours (après clic sur le lien envoyé par email).
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Récupérer tous les utilisateurs avec rôle
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;

    const users = await prisma.utilisateur.findMany({
      where: { id: { not: adminId } },
      orderBy: { createdAt: 'desc' }
    });

    // Formater les données de retour
    const formattedUsers = users.map(u => ({
      id: u.id,
      nom: u.nom,
      email: u.email,
      tel: u.tel,
      adresse: u.adresse,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));

    return res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Mettre à jour le statut d’un vendeur (Magasin)
export const updateVendorStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { statut } = req.body; // "approuve" ou "refuse"

    if (!['approuve', 'refuse'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Récupérer le magasin associé à ce vendeur
    const magasin = await prisma.magasin.findFirst({
      where: { id_proprietaire: userId }
    });

    if (!magasin) {
      return res.status(404).json({ message: "Magasin du vendeur introuvable" });
    }

    const updatedMagasin = await prisma.magasin.update({
      where: { id_magasin: magasin.id_magasin },
      data: { statut }
    });

    return res.json({ message: "Statut du vendeur mis à jour", magasin: updatedMagasin });
  } catch (error) {
    console.error("Erreur updateVendorStatus:", error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};