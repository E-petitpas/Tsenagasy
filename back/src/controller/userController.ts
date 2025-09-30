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

/**
 * ============================
 * Signup (création utilisateur)
 * ============================
 */
export const addClient = async (req: Request, res: Response) => {
  try {
    const { email, nom, tel, adresse, role, motDePasse } = req.body as {
      email?: string
      nom?: string
      tel?: string
      adresse?: string
      role?: string
      motDePasse?: string
    }

    if (!email || !role || !motDePasse) {
      return res.status(400).json({ message: 'Email, rôle et mot de passe requis' })
    }

    // Vérifier si déjà existant côté Prisma
    const existing = await prisma.utilisateur.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Utilisateur déjà existant' })

    // 1. Créer l’utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse
    })
    if (error) return res.status(400).json({ message: error.message })
    const supabaseId = data.user?.id
    if (!supabaseId) return res.status(500).json({ message: 'Erreur Supabase: pas de supabaseId' })

    // 2. Créer dans Prisma
    const utilisateur = await prisma.utilisateur.create({
      data: { supabaseId, email, nom: nom ?? null, tel: tel ?? null, adresse: adresse ?? null }
    })

    // 3. Lier au rôle spécifique
    switch (role) {
      case 'superAdmin':
        await prisma.superAdmin.create({ data: { utilisateurId: utilisateur.id } })
        break
      case 'relationClient':
        await prisma.relationClient.create({ data: { utilisateurId: utilisateur.id } })
        break
      case 'acheteur':
        await prisma.acheteur.create({ data: { utilisateurId: utilisateur.id } })
        break
      case 'commercant':
        await prisma.commercant.create({ data: { utilisateurId: utilisateur.id } })
        break
      default:
        return res.status(400).json({ message: 'Rôle invalide' })
    }

    // 4. Générer un JWT maison si tu veux unifier ton API
    const normalizedRole = roleMapper(role)
    const token = jwt.sign({ utilisateurId: utilisateur.id, role: normalizedRole }, JWT_SECRET, { expiresIn: '1d' })

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      supabaseSession: data.session, // ajoute ça !
      utilisateur: { id: utilisateur.id, email: utilisateur.email, nom: utilisateur.nom, role: normalizedRole }
    })

  } catch (error: unknown) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur', error: error instanceof Error ? error.message : error })
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
      include: { acheteur: true, commercant: true, relationClient: true, superAdmin: true }
    })
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé dans Prisma' })
    }

    // 3. Déterminer le rôle
    let role: string | null = null
    if (utilisateur.superAdmin) role = 'superAdmin'
    else if (utilisateur.relationClient) role = 'relationClient'
    else if (utilisateur.acheteur) role = 'acheteur'
    else if (utilisateur.commercant) role = 'commercant'

    if (!role) return res.status(403).json({ message: 'Rôle introuvable' })

    const normalizedRole = roleMapper(role)

    return res.json({
      message: 'Connexion réussie',
      supabaseSession: data.session, // access_token + refresh_token
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        role: normalizedRole
      }
    })
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

