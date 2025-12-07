// front/src/components/productGrid.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "./ProductCard"; 
import { ProductDetailModal } from "./productDetailModal";
import type { ProductDetailData } from "./productDetailModal";
import { API_BASE_URL } from "../config/api";

interface ProductGridProps {
  onAddToCart?: (productId: string, qty?: number) => void | Promise<void>;
  userId?: string;
}

export function ProductGrid({ onAddToCart, userId }: ProductGridProps) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailData | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<ProductCardData[]>(
          `${API_BASE_URL}/api/getAllproduct`
        );
        setProducts(res.data);
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.error || e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!userId) return; // si public => rien

    const loadFavs = async () => {
      try {
        const res = await axios.get<any[]>(
          `${API_BASE_URL}/api/getFavByUser/${userId}`
        );

        const map: Record<string, boolean> = {};
        res.data.forEach((p) => (map[p.id] = true));
        setFavorites(map);
      } catch (e) {
        console.error("Erreur loadFavs", e);
      }
    };

    loadFavs();
  }, [userId]);
  
  const openModal = async (id: string) => {
    // 1) ouvrir tout de suite
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError(null);

    const preview = products.find(p => p.id === id);
    if (preview) {
      setSelectedProduct({
        id: preview.id,
        nom: preview.nom,
        prix: preview.prix,
        stock: preview.stock,
        images: preview.images,
        tags: preview.tags,
        descriptions: "",     // sera rempli après fetch
        poids: 0,
        dimensions: "",
        materiaux: "",
        isLocation: preview.isLocation,
        categorie: preview.categorie,
        magasin: preview.magasin,
        produitLocation: null,
        Sponsor: preview.Sponsor ?? null
      } as ProductDetailData);
    } else {
      setSelectedProduct(null);
    }

    // 3) fetch réel
    try {
      const res = await axios.get<any>(`${API_BASE_URL}/api/getDetails/${id}`);
      const data = res.data.product ?? res.data;
      setSelectedProduct(data);
    } catch (e: any) {
      console.error("Erreur chargement détails produit", e);
      setModalError("Impossible de charger les détails.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalLoading(false);
    setModalError(null);
  };

  const toggleFavorite = async (produitId: string) => {
    if (!userId) return; // public => pas de back

    const isFav = !!favorites[produitId];

    // UI instantanée
    setFavorites((prev) => ({ ...prev, [produitId]: !isFav }));

    try {
      if (!isFav) {
        await axios.post(`${API_BASE_URL}/api/addFavori/${userId}`, { produitId });
      } else {
        await axios.delete(`${API_BASE_URL}/api/removeFav/${userId}/${produitId}`);
      }
    } catch (e) {
      console.error("Erreur toggleFavorite", e);
      // rollback si erreur
      setFavorites((prev) => ({ ...prev, [produitId]: isFav }));
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Chargement des produits...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">❌ {error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Tous les produits
            </h2>
            <p className="text-gray-600">
              Découvrez les produits disponibles sur Tsena.mg
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={openModal} 
                onAddToCart={(id) => onAddToCart?.(id, 1)}

                // AJOUT favoris
                isFavorite={!!favorites[product.id]}
                onToggleFavorite={userId ? toggleFavorite : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ✅ AJOUT: modal */}
      {isModalOpen && (
        <ProductDetailModal
          product={selectedProduct}
          loading={modalLoading}
          error={modalError}
          onClose={closeModal}
          onAddToCart={(id, qty) => onAddToCart?.(id, qty)}
          isFavorite={selectedProduct ? !!favorites[selectedProduct.id] : false}
          onToggleFavorite={userId ? toggleFavorite : undefined}
        />
      )}
    </>
  );
}
