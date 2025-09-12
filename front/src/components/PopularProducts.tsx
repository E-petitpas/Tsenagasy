import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ProductCard } from './ProductCard';

interface PopularProductsProps {
  onAddToCart: (productId: string) => void;
  onProductClick: (productId: string) => void;
}

// Mock data pour les produits populaires
const mockProducts = [
  {
    id: '1',
    name: 'Tissu Lamba traditionnel',
    price: 45000,
    originalPrice: 60000,
    rating: 4.8,
    reviewCount: 23,
    image: 'https://images.unsplash.com/photo-1660695828374-4ff51ac9df5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGV4dGlsZXMlMjBjb2xvcmZ1bCUyMGZhYnJpY3xlbnwxfHx8fDE3NTY2NzgxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    vendor: {
      name: 'Artisan Malagasy',
      location: 'Antananarivo',
      isVerified: true
    },
    isPromoted: true
  },
  {
    id: '2',
    name: 'Panier artisanal en raphia',
    price: 25000,
    originalPrice: 32000,
    rating: 4.6,
    reviewCount: 15,
    image: 'https://images.unsplash.com/photo-1606077089838-0ac4a27fc96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRhZ2FzY2FyJTIwaGFuZGNyYWZ0JTIwYXJ0aXNhbiUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NjY3ODE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    vendor: {
      name: 'Vannerie Malgache',
      location: 'Fianarantsoa',
      isVerified: true
    },
    isPromoted: false
  },
  {
    id: '3',
    name: 'Épices traditionnelles mélangées',
    price: 12000,
    originalPrice: 15000,
    rating: 4.9,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBtYWRhZ2FzY2FyJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzU2Njc4MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    vendor: {
      name: 'Épices de Madagascar',
      location: 'Sambava',
      isVerified: true
    },
    isPromoted: false
  },
  {
    id: '4',
    name: 'Sculpture en bois de rose',
    price: 85000,
    originalPrice: 95000,
    rating: 4.7,
    reviewCount: 8,
    image: 'https://images.unsplash.com/photo-1692689383138-c2df3476072c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFya2V0JTIwY29sb3JmdWwlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTY2NzgxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    vendor: {
      name: 'Sculpture Artisanale',
      location: 'Antsirabe',
      isVerified: true
    },
    isPromoted: true
  }
];

export function PopularProducts({ onAddToCart, onProductClick }: PopularProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(mockProducts); // Still use mock data even on error
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Chargement des produits...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Produits populaires
            </h2>
            <p className="text-gray-600">
              Découvrez les coups de cœur de nos clients malgaches
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center">
            Voir tout
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onClick={onProductClick}
            />
          ))}
        </div>

        <div className="text-center md:hidden">
          <Button variant="outline" className="w-full">
            Voir tous les produits
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}