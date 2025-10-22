// back/src/controller/productController.ts

import { Request, Response } from 'express'
import prisma from '../config/db'
import { supabaseAdmin } from "../config/supabase";
import fs from "fs"
import path from "path";

// Récupérer toutes les catégories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categorie.findMany({
      select: { id: true, nom: true }
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur getCategories:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ajout produits
export const createProduct = async (req: Request, res: Response) => {

  try {
    const { nom, prix, stock, categorieId, commercantId, tags, description, poids, dimensions, materiaux, statut } = req.body;
    console.log('ato e')
    if ( !nom || !prix || !stock || !categorieId || !commercantId || !description || !poids || !dimensions || !materiaux || !statut) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    const commercant = await prisma.commercant.findUnique({
      where: { id: commercantId },
      select: { nomEntreprise: true },
    });

    if (!commercant) {
      return res.status(404).json({ error: "Commerçant introuvable" });
    }

    const nomEntreprise = commercant.nomEntreprise
      .replace(/\s+/g, "_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    // envoie de l'img dans supabase
    const uploadedFiles = req.files as Express.Multer.File[] | undefined;
    const imageUrls: string[] = [];

    console.log("Fichiers uploadés :", uploadedFiles?.length);

    if (uploadedFiles && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const ext = path.extname(file.originalname).toLowerCase();
        const cleanName = nom
          .replace(/\s+/g, "_")                 // remplace espaces par _
          .normalize("NFD")                     // retire les accents
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "");
        const uniqueId = Date.now();
        const fileName = `${cleanName}_${uniqueId}_${i + 1}${ext}`; // 1.png, 2.png, etc.
        const filePath = `${nomEntreprise}_${commercantId}/${fileName}`;

        console.log(` Upload du fichier : ${file.originalname} → ${filePath}`);

        const { error: uploadError } = await supabaseAdmin!.storage
          .from("Produits")
          .upload(filePath, fs.createReadStream(file.path), {
            cacheControl: "3600",
            upsert: true,
            contentType: file.mimetype,
            duplex: "half" as any,
          });

        if (uploadError) {
          console.error("Erreur upload Supabase:", uploadError.message);
          return res
            .status(500)
            .json({ error: "Erreur lors de l'upload de l'image" });
        }

        // Get the public URL
        const { data: publicUrlData } = supabaseAdmin!.storage
          .from("Produits")
          .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);

        fs.unlinkSync(file.path); // Remove temporary local file
      }
    }

    const produit = await prisma.produit.create({
      data: {
        nom,
        prix: parseFloat(prix),
        stock: parseInt(stock),
        categorieId,
        commercantId,
        images: imageUrls,
        tags: tags ? tags.split(",") : [],
        description,
        poids: parseInt(poids),
        dimensions,
        materiaux,
        statut,
      },
    });

    res.status(201).json({
      message: "Produit créé avec succès",
      produit,
    });
  } catch (error) {
    console.error("Erreur createProduct:", error);
    res.status(500).json({ error: "Erreur lors de la création du produit" });
  }
};

export const getProductsByCommercant = async (req: Request, res: Response) => {
  try {
    const { commercantId } = req.params;

    if (!commercantId) {
      return res.status(400).json({ error: "ID du commerçant requis" });
    }

    const commercant = await prisma.commercant.findUnique({
      where: { id: commercantId },
    });

    if (!commercant) {
      return res.status(404).json({ error: "Commerçant introuvable" });
    }

    const produits = await prisma.produit.findMany({
      where: { commercantId },
      orderBy: { createdAt: "asc" },
    });

    if (produits.length === 0) {
      return res.status(200).json({ message: "Aucun produit trouvé", produits: [] });
    }

    // Transformation des clés avant envoi
    const mappedProducts = produits.map(p => ({
      id: p.id,
      name: p.nom,
      price: p.prix,
      stock: p.stock,
      category: p.categorieId,
      images: p.images,
      tags: p.tags,
      description: p.description,
      weight: p.poids,
      dimensions: p.dimensions,
      materials: p.materiaux,
      status: p.statut,
      commercantId: p.commercantId,
      createdAt: p.createdAt
    }));

    return res.status(200).json(mappedProducts);

  } catch (error) {
    console.error("Erreur getProductsByCommercant:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération des produits" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { imageUrl } = req.body;
    console.log(productId)
    console.log(imageUrl)

    if (!productId) {
      return res.status(400).json({ error: "ID du produit requis" });
    }

    // Vérifier si le produit existe
    const produit = await prisma.produit.findUnique({
      where: { id: productId },
    });

    if (!produit) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    // Vérifier que Supabase est initialisé
    if (!supabaseAdmin) {
      return res.status(500).json({ error: "Supabase non initialisé" });
    }

    // Supprimer les images dans Supabase
    if (produit.images && produit.images.length > 0) {
      for (const url of produit.images) {
        try {
          // Extraire le chemin relatif à partir de l’URL publique
          const filePath = url.split("/Produits/")[1];
          console.log("🗑️ Chemin détecté :", filePath);

          if (filePath) {
            const { error } = await supabaseAdmin.storage
              .from("Produits")
              .remove([filePath]);

            if (error) {
              console.error(" Erreur suppression Supabase:", error.message);
            } else {
              console.log(" Image supprimée avec succès :", filePath);
            }
          } else {
            console.warn(" Aucun chemin détecté pour :", url);
          }
        } catch (err) {
          console.error("Erreur suppression image :", err);
        }
      }
    }

    // Supprimer le produit en base
    await prisma.produit.delete({
      where: { id: productId },
    });

    return res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteProduct:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
};

// modification
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { nom, prix, stock, categorieId, tags, description, poids, dimensions, materiaux, images: imagesEnvoyeesJson, statut } = req.body;

    if (!productId || !nom || !prix || !stock || !categorieId || !description || !poids || !dimensions || !materiaux) {
      return res.status(400).json({ error: "Certains champs obligatoires sont manquants." });
    }

    // Vérifier si le produit existe
    const produit = await prisma.produit.findUnique({
      where: { id: productId },
    });

    if (!produit) return res.status(404).json({ error: "Produit introuvable." });

    const oldImages = produit.images || [];

    const imagesEnvoyees = imagesEnvoyeesJson ? JSON.parse(imagesEnvoyeesJson) : [];

    // 🔹 Déterminer les images supprimées
    const imagesASupprimer = oldImages.filter((img) => !imagesEnvoyees.includes(img));

    // 🔹 Supprimer les images retirées du front
    for (const url of imagesASupprimer) {
      try {
        const filePath = url.split("/Produits/")[1];
        if (filePath) {
          await supabaseAdmin!.storage.from("Produits").remove([filePath]);
        }
      } catch (err) {
        console.error("Erreur lors de la suppression d'image :", err);
      }
    }

    // 🔹 Upload des nouvelles images (si présentes)
    const uploadedFiles = req.files as Express.Multer.File[] | undefined;
    const newImageUrls: string[] = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      const commercant = await prisma.commercant.findUnique({
        where: { id: produit.commercantId },
      });

      if (!commercant) return res.status(404).json({ error: "Commerçant introuvable" });

      const nomEntreprise = commercant.nomEntreprise
        .replace(/\s+/g, "_")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      let fileCounter = oldImages.length + 1;

      for (const file of uploadedFiles) {
        const ext = path.extname(file.originalname).toLowerCase();
        const cleanName = nom
          .replace(/\s+/g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "");
        const uniqueId = Date.now();
        const fileName = `${cleanName}_${uniqueId}_${fileCounter}${ext}`;
        const filePath = `${nomEntreprise}_${produit.commercantId}/${fileName}`;

        const { error: uploadError } = await supabaseAdmin!.storage
          .from("Produits")
          .upload(filePath, fs.createReadStream(file.path), {
            cacheControl: "3600",
            upsert: true,
            contentType: file.mimetype,
            duplex: "half" as any,
          });

        if (uploadError) throw new Error(`Erreur upload Supabase: ${uploadError.message}`);

        const { data: publicUrlData } = supabaseAdmin!.storage
          .from("Produits")
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrlData.publicUrl);
        fs.unlinkSync(file.path);
      }
    }

    // 🔹 Fusion finale : anciennes images gardées + nouvelles images uploadées
    const finalImages = [...imagesEnvoyees, ...newImageUrls];

    // 🔹 Mise à jour du produit
    const updatedProduct = await prisma.produit.update({
      where: { id: productId },
      data: {
        nom,
        prix: parseFloat(prix),
        stock: parseInt(stock),
        categorieId,
        tags: tags ? tags.split(",") : [],
        description,
        poids: parseInt(poids),
        dimensions,
        materiaux,
        images: finalImages,
        ...(statut && { statut }),
      },
    });

    const mappedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.nom,
      price: updatedProduct.prix,
      stock: updatedProduct.stock,
      category: updatedProduct.categorieId,
      images: updatedProduct.images,
      tags: updatedProduct.tags,
      description: updatedProduct.description,
      weight: updatedProduct.poids,
      dimensions: updatedProduct.dimensions,
      materials: updatedProduct.materiaux,
      status: updatedProduct.statut,
      commercantId: updatedProduct.commercantId,
      createdAt: updatedProduct.createdAt,
    };

    return res.status(200).json({
      message: " Produit modifié avec succès",
      produit: mappedProduct,
    });
  } catch (error) {
    console.error("Erreur updateProduct:", error);
    return res.status(500).json({ error: "Erreur interne lors de la modification du produit." });
  }
};

export const searchProductsbyCommercant = async (req: Request, res: Response) => {
  try {
    const { commercantId } = req.params;
    const { status, categoryId, query } = req.body; 

    if (!commercantId) return res.status(400).json({ error: "ID du commerçant requis" });

    // Construire la condition where
    const whereClause: any = { commercantId };

    if (status) whereClause.statut = status;
    if (categoryId) whereClause.categorieId = categoryId;

    if (query) {
      whereClause.OR = [
        { nom: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ];
    }

    const produits = await prisma.produit.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
    });

    const mappedProducts = produits.map(p => ({
      id: p.id,
      name: p.nom,
      price: p.prix,
      stock: p.stock,
      category: p.categorieId,
      images: p.images,
      tags: p.tags,
      description: p.description,
      weight: p.poids,
      dimensions: p.dimensions,
      materials: p.materiaux,
      status: p.statut,
      commercantId: p.commercantId,
      createdAt: p.createdAt,
    }));

    return res.status(200).json(mappedProducts);
  } catch (error) {
    console.error("Erreur searchProducts:", error);
    return res.status(500).json({ error: "Erreur lors de la recherche de produits" });
  }
};
