import React from 'react';
import { Star, ShoppingCart, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  vendor: {
    name: string;
    location: string;
    isVerified: boolean;
  };
  isPromoted?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onClick: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mg-MG').format(price) + ' Ar';
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(product.id)}
    >
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {product.isPromoted && (
          <Badge className="absolute top-2 left-2 bg-[#FFA726] text-black">
            Promu
          </Badge>
        )}
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-[#2D8A47] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg font-bold text-[#2D8A47]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Vendor Info */}
        <div className="flex items-center space-x-1 mb-3">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-600">
            {product.vendor.name} • {product.vendor.location}
          </span>
          {product.vendor.isVerified && (
            <Badge variant="outline" className="text-xs border-green-500 text-green-600">
              ✓
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={(e: any) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
          className="w-full bg-[#2D8A47] hover:bg-[#245A35]"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}