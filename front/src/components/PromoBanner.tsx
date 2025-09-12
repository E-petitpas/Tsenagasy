import React from 'react';
import { ChevronRight, Truck, Shield, HeartHandshake } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PromoBanner() {
  return (
    <div className="relative">
      {/* Main Banner */}
      <div className="relative bg-gradient-to-r from-[#2D8A47] to-[#4CAF50] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Découvrez le meilleur de Madagascar
              </h1>
              <p className="text-lg mb-6 opacity-90">
                Des produits authentiques, des vendeurs locaux, des prix justes.
                Soutenez l'économie malgache en achetant local !
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#FFA726] text-black hover:bg-[#FF9800] font-medium"
                >
                  Découvrir les produits
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-[#2D8A47]"
                >
                  Devenir vendeur
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1692689383138-c2df3476072c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFya2V0JTIwY29sb3JmdWwlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTY2NzgxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Marché coloré africain"
                className="rounded-lg shadow-xl object-cover w-full h-64 md:h-80"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
      </div>

      {/* Features Strip */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-[#2D8A47] bg-opacity-10 p-3 rounded-full">
                <Truck className="h-6 w-6 text-[#2D8A47]" />
              </div>
              <div>
                <h3 className="font-medium">Livraison rapide</h3>
                <p className="text-sm text-gray-600">24-48h dans toute l'île</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-[#FFA726] bg-opacity-10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-[#FFA726]" />
              </div>
              <div>
                <h3 className="font-medium">Paiement sécurisé</h3>
                <p className="text-sm text-gray-600">Mvola, Orange Money, Airtel Money</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
                <HeartHandshake className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Commerce équitable</h3>
                <p className="text-sm text-gray-600">Soutenez les vendeurs locaux</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}