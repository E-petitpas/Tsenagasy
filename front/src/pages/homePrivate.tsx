import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../components/Header';
import { PromoBanner } from '../components/PromoBanner';
import { ProductGrid } from '../components/productGrid';
import { CartCheckout } from '../components/CartCheckout';

import { UserData } from '../config/authStorage';

type Page = 'home' | 'cart' | 'search';

interface HomePrivateProps {
  currentUser: UserData;
  cartItemCount: number;
  onAddToCart: (productId: string) => Promise<void>;
    setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
    onLogout: () => void;
}

export default function HomePrivate({currentUser, cartItemCount, onAddToCart, setCartItemCount, onLogout }: HomePrivateProps) {

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<Page>('home');

  // ---------------------------
  // Navigation interne simplifiée
  // ---------------------------

  const openCart = () => setCurrentPage('cart');
  const backToHome = () => setCurrentPage('home');

  // ---------------------------
  // Pages spécifiques
  // ---------------------------

  if (currentPage === 'cart') {
    return <CartCheckout onBack={backToHome} />;
  }

  // ---------------------------
  // HOME PRIVATE
  // ---------------------------

  return (
    <>
      {/* HEADER simplifié */}
      <Header
        cartItemCount={cartItemCount}
        currentUser={currentUser}  // 🔥 connecté = header complet
        onLoginClick={() => {}}
        onCartClick={openCart}
        onSearchClick={() => setCurrentPage('search')}
        onNavigationClick={() => {}}
        onProfileClick={() => navigate('/dashboard')}
        onLogoutClick={onLogout}
      />

      <main>

        {/* ---------------- PROMO adaptée (sans CTA login) ---------------- */}
        <PromoBanner isPublicHome={false} onAddToCart={onAddToCart}/>

        {/* ---------------- PRODUITS ---------------- */}
        <ProductGrid
          onAddToCart={onAddToCart}
        />

        {/* ---------------- QUICK SERVICES (adapté connecté) ---------------- */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6">Accès rapide</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* DASHBOARD */}
              <button
                className="p-6 border rounded-lg hover:shadow-md transition text-center"
                onClick={() => navigate('/dashboard')}
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold">Mon compte</h3>
                <p className="text-gray-600 text-sm">Profil, commandes, wallet</p>
              </button>

              {/* WALLET */}
              <button
                className="p-6 border rounded-lg hover:shadow-md transition text-center"
                onClick={() => navigate('/dashboard')}
              >
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold">Mon Wallet</h3>
                <p className="text-gray-600 text-sm">Recharger & transférer</p>
              </button>

              {/* VENTES */}
              {currentUser.role === 'vendor' && (
                <button
                  className="p-6 border rounded-lg hover:shadow-md transition text-center"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="text-4xl mb-3">🏪</div>
                  <h3 className="font-semibold">Espace vendeur</h3>
                  <p className="text-gray-600 text-sm">Gérer ma boutique</p>
                </button>
              )}

              {/* RECHERCHE */}
              <button
                className="p-6 border rounded-lg hover:shadow-md transition text-center"
                onClick={() => setCurrentPage('search')}
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold">Recherche</h3>
                <p className="text-gray-600 text-sm">Trouver un produit</p>
              </button>

            </div>
          </div>
        </section>

        {/* ---------------- FOOTER minimal ---------------- */}
        <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#4CAF50] mb-4">Tsena.mg</h3>
              <p className="text-gray-300 text-sm mb-4">
                La marketplace qui valorise l'économie malgache et connecte acheteurs et vendeurs locaux.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:text-[#4CAF50]">📘</span>
                <span className="text-2xl cursor-pointer hover:text-[#4CAF50]">📷</span>
                <span className="text-2xl cursor-pointer hover:text-[#4CAF50]">🐦</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Acheteurs</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Comment acheter</a></li>
                <li><a href="#" className="hover:text-white">Paiements</a></li>
                <li><a href="#" className="hover:text-white">Livraisons</a></li>
                <li><a href="#" className="hover:text-white">Retours</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Vendeurs</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Devenir vendeur</a></li>
                <li><a href="#" className="hover:text-white">Guide du vendeur</a></li>
                <li><a href="#" className="hover:text-white">Frais et commissions</a></li>
                <li><a href="#" className="hover:text-white">Support vendeur</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Nous contacter</a></li>
                <li><a href="#" className="hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Tsena.mg - Made with ❤️ in Madagascar
            </p>
          </div>
        </div>
      </footer>

      </main>
    </>
  );
}
