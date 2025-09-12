import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Share2, MapPin, Truck, Shield, MessageCircle, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (productId: string) => void;
}

const mockProduct = {
  id: '1',
  name: 'Tissu Lamba traditionnel - Soie sauvage authentique',
  price: 45000,
  originalPrice: 60000,
  rating: 4.8,
  reviewCount: 23,
  stock: 12,
  images: [
    'https://images.unsplash.com/photo-1660695828374-4ff51ac9df5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGV4dGlsZXMlMjBjb2xvcmZ1bCUyMGZhYnJpY3xlbnwxfHx8fDE3NTY2NzgxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1606077089838-0ac4a27fc96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRhZ2FzY2FyJTIwaGFuZGNyYWZ0JTIwYXJ0aXNhbiUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NjY3ODE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ],
  description: 'Magnifique lamba traditionnel malgache tissé à la main en soie sauvage. Ce tissu authentique représente tout le savoir-faire artisanal de Madagascar. Parfait pour les occasions spéciales ou comme pièce décorative unique.',
  features: [
    '100% soie sauvage malgache',
    'Tissé à la main selon la tradition',
    'Dimensions: 180cm x 120cm',
    'Motifs traditionnels authentiques',
    'Lavage à sec recommandé'
  ],
  vendor: {
    name: 'Artisan Malagasy',
    location: 'Antananarivo',
    isVerified: true,
    rating: 4.9,
    totalSales: 156,
    joinedDate: '2021'
  }
};

const mockReviews = [
  {
    id: '1',
    userName: 'Hery R.',
    rating: 5,
    comment: 'Produit authentique et de très belle qualité ! Livraison rapide.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    userName: 'Fara M.',
    rating: 5,
    comment: 'Magnifique lamba, exactement comme décrit. Je recommande ce vendeur.',
    date: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    userName: 'Rivo T.',
    rating: 4,
    comment: 'Beau produit, couleurs vives. Emballage soigné.',
    date: '2024-01-05',
    verified: false
  }
];

export function ProductDetail({ productId, onBack, onAddToCart }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(mockProduct);
  const [vendor, setVendor] = useState(mockProduct.vendor);
  const [reviews, setReviews] = useState(mockReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { apiService } = await import('../services/api');
        const response = await apiService.getProduct(productId);
        
        if (response.product) {
          setProduct({
            ...response.product,
            images: response.product.images || [mockProduct.images[0]],
            features: [
              '100% artisanal malgache',
              'Livraison rapide disponible',
              'Garantie qualité',
              'Support vendeur local'
            ]
          });
        }
        
        if (response.vendor) {
          setVendor(response.vendor);
        }
        
        if (response.reviews) {
          setReviews(response.reviews);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        // Keep default mock data on error
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Chargement du produit...</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mg-MG').format(price) + ' Ar';
  };

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 border-b">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative">
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 md:h-[500px] object-cover rounded-lg"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-[#2D8A47]' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating || 0} ({product.review_count || 0} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-[#2D8A47]">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <p className="text-green-600 mb-4">
                ✓ En stock ({product.stock || 0} articles disponibles)
              </p>
            </div>

            {/* Vendor Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#2D8A47] text-white">
                      {vendor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{vendor.name}</span>
                      {vendor.is_verified && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                          ✓ Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contacter
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                ⭐ {vendor.rating || 0} • {vendor.total_sales || 0} ventes • Membre depuis {new Date(vendor.joined_date || vendor.created_at).getFullYear()}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span>Quantité :</span>
                <div className="flex border rounded">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => quantity < (product.stock || 0) && setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-[#2D8A47] hover:bg-[#245A35]"
                  onClick={() => onAddToCart(productId)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  Acheter maintenant
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoris
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-[#2D8A47]" />
                <span>Livraison gratuite à Antananarivo (24-48h)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-[#FFA726]" />
                <span>Garantie satisfait ou remboursé 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Caractéristiques</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({mockProduct.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {mockProduct.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <ul className="space-y-2">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#2D8A47] rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Achat vérifié
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}