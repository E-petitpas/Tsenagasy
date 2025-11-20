import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { AuthModal } from '../components/AuthModal';
import { PromoBanner } from '../components/PromoBanner';
import { PopularProducts } from '../components/PopularProducts';
import { ProductDetail } from '../components/ProductDetail';
import { CartCheckout } from '../components/CartCheckout';
import { RechargeWalletModal } from '../components/RechargeWalletModal';
import { TransferFundsModal } from '../components/TransferFundsModal';
import { toast } from 'sonner';
import { UserData } from '../config/authStorage';
import { VendorAuthModal } from '../components/vendorAuthModal';

type Page = 'home' | 'product' | 'cart' | 'wallet' | 'locations' | 'search';

interface HomeProps {
  currentUser: UserData | null;
  cartItemCount: number;
  globalWalletBalance: number;
  onLogin: (user: UserData) => void;
  onLogout: () => void;
  onAddToCart: (productId: string) => Promise<void>;
  onGlobalWalletRecharge: (amount: number, method: string) => void;
  onTransferSuccess: (amount: number, method: string, recipient: string) => void;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function Home({
  currentUser,
  cartItemCount,
  globalWalletBalance,
  onLogin,
  onLogout,
  onAddToCart,
  onGlobalWalletRecharge,
  onTransferSuccess,
  setCartItemCount
}: HomeProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWalletRechargeModalOpen, setIsWalletRechargeModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedProductId(null);
  };

  const navigateToCart = () => {
    setCurrentPage('cart');
  };

  const navigateToVendorDashboard = () => {
    if (currentUser?.role === 'vendor') {
      navigate('/dashboard');
    } else {
      toast.error('Connexion vendeur requise', {
        description: 'Connectez-vous pour accéder à votre tableau de bord vendeur'
      });
      setIsAuthModalOpen(true);
    }
  };
  
  const navigateToDashboard = () => {
    if (!currentUser) {
      toast.error("Connexion requise");
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleNavigation = (page: Page) => {
    if (page === 'wallet' || page === 'locations') {
      if (!currentUser) {
        toast.error('Connexion requise', {
          description: 'Créez un compte pour accéder aux services avancés'
        });
        setIsAuthModalOpen(true);
        return;
      }
    }
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    toast.info(`Recherche pour: "${query}"`);
    setCurrentPage('search');
  };

  const handleNavigationClick = (section: string) => {
    switch (section) {
      case 'categories':
        toast.info('Navigation vers les catégories');
        break;
      case 'offers':
        toast.info('Navigation vers les offres du jour');
        break;
      case 'services':
        handleNavigation('search');
        break;
      case 'vendors':
        toast.info('Navigation vers les vendeurs locaux');
        break;
      case 'support':
        toast.info('Navigation vers le support client');
        break;
      default:
        break;
    }
  };

  const handleLoginSuccess = (user: UserData) => {
    onLogin(user);
    navigate('/dashboard'); // 🚀 redirection unique
  };

  if (currentPage === 'product' && selectedProductId) {
    return (
      <ProductDetail
        productId={selectedProductId}
        onBack={navigateToHome}
        onAddToCart={onAddToCart}
      />
    );
  }

  if (currentPage === 'cart') {
    return <CartCheckout onBack={navigateToHome} />;
  }

  // Demo pages pour wallet, locations, search
  if (currentPage === 'wallet') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={navigateToHome} className="mb-6 text-[#2D8A47] hover:underline">
            ← Retour à l'accueil
          </button>
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-2xl font-bold mb-4">Wallet Tsena</h1>
            <p className="text-gray-600 mb-6">
              Gérez vos paiements mobiles et votre portefeuille électronique
            </p>
            <div className="bg-[#2D8A47] text-white p-4 rounded-lg mb-6">
              <div className="text-2xl font-bold">{globalWalletBalance.toLocaleString()} Ar</div>
              <div className="text-sm opacity-90">Solde disponible</div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setIsWalletRechargeModalOpen(true)}
                className="bg-white text-[#2D8A47] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Recharger le wallet
              </button>
              <button 
                onClick={() => setIsTransferModalOpen(true)}
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#2D8A47] transition-colors"
              >
                Transférer des fonds
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm font-medium">MVola</div>
                <div className="text-xs text-gray-500">Sans frais</div>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="text-2xl mb-2">🟠</div>
                <div className="text-sm font-medium">Orange Money</div>
                <div className="text-xs text-gray-500">100 Ar</div>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="text-2xl mb-2">🔴</div>
                <div className="text-sm font-medium">Airtel Money</div>
                <div className="text-xs text-gray-500">150 Ar</div>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="text-2xl mb-2">💳</div>
                <div className="text-sm font-medium">Carte Bancaire</div>
                <div className="text-xs text-gray-500">200 Ar</div>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="text-2xl mb-2">🔵</div>
                <div className="text-sm font-medium">PayPal</div>
                <div className="text-xs text-gray-500">300 Ar</div>
              </div>
              <div className="p-4 border rounded-lg border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-xl mb-1">+</div>
                  <div className="text-xs">Plus bientôt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'locations') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={navigateToHome} className="mb-6 text-[#2D8A47] hover:underline">
            ← Retour à l'accueil
          </button>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏠</div>
              <h1 className="text-2xl font-bold mb-4">Locations Tsena</h1>
              <p className="text-gray-600">Trouvez des appartements et véhicules à louer à Madagascar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <div className="text-3xl mb-3">🏘️</div>
                <h3 className="font-bold mb-2">Appartements</h3>
                <p className="text-gray-600 text-sm mb-4">Studios, F2, F3 dans tout Antananarivo</p>
                <div className="text-[#2D8A47] font-bold">À partir de 200,000 Ar/mois</div>
              </div>
              <div className="border rounded-lg p-6">
                <div className="text-3xl mb-3">🚗</div>
                <h3 className="font-bold mb-2">Véhicules</h3>
                <p className="text-gray-600 text-sm mb-4">Voitures, motos, vélos disponibles</p>
                <div className="text-[#2D8A47] font-bold">À partir de 50,000 Ar/jour</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'search') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={navigateToHome} className="mb-6 text-[#2D8A47] hover:underline">
            ← Retour à l'accueil
          </button>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-2xl font-bold mb-4">Recherche Avancée</h1>
              <p className="text-gray-600">Trouvez exactement ce que vous cherchez</p>
            </div>
            <div className="max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Rechercher des produits..." 
                className="w-full p-4 border rounded-lg mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 border rounded-lg hover:bg-gray-50">Artisanat</button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">Alimentation</button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">Textiles</button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">Cosmétiques</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        cartItemCount={cartItemCount}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onCartClick={navigateToCart}
        onSearchClick={handleSearch}
        onNavigationClick={handleNavigationClick}
        onProfileClick={() => {
          navigateToDashboard();
        }}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLoginSuccess}
      />

      <main>
        {/* Hero Banner */}
        <PromoBanner 
          currentUser={currentUser}
          onLogin={handleLoginSuccess} 
        />

        {/* Popular Products */}
        <PopularProducts
          onAddToCart={onAddToCart}
          onProductClick={handleProductClick}
        />

        {/* Local Vendors Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos vendeurs partenaires
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez les artisans et entreprises malgaches qui font la richesse de notre marketplace.
                Chaque achat soutient l'économie locale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#2D8A47] bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏺</span>
                </div>
                <h3 className="font-semibold mb-2">Artisans traditionnels</h3>
                <p className="text-gray-600 text-sm">
                  Découvrez l'artisanat malgache authentique : tissus, paniers, sculptures et bijoux traditionnels.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#FFA726] bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏪</span>
                </div>
                <h3 className="font-semibold mb-2">PME locales</h3>
                <p className="text-gray-600 text-sm">
                  Soutenez les petites et moyennes entreprises malgaches qui innovent et créent des emplois.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-500 bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="font-semibold mb-2">Freelances</h3>
                <p className="text-gray-600 text-sm">
                  Services digitaux, créatifs et techniques proposés par des professionnels malgaches talentueux.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setIsVendorModalOpen(true)}
                  className="bg-[#2D8A47] text-white px-6 py-3 rounded-lg hover:bg-[#245A35] transition-colors"
                >
                  Devenir vendeur
                </button>
                <VendorAuthModal
                  isOpen={isVendorModalOpen}
                  onClose={() => setIsVendorModalOpen(false)}
                  onLogin={handleLoginSuccess}
                />
                <button 
                  onClick={navigateToCart}
                  className="border border-[#2D8A47] text-[#2D8A47] px-6 py-3 rounded-lg hover:bg-[#2D8A47] hover:text-white transition-colors"
                >
                  Voir mon panier ({cartItemCount})
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Quick Access */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nos services
              </h2>
              <p className="text-gray-600">Au-delà de la marketplace, découvrez tous nos services</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <button 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
                onClick={() => handleNavigation('locations')}
              >
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="font-semibold mb-2">Locations</h3>
                <p className="text-gray-600 text-sm">Appartements & véhicules</p>
              </button>
              
              <button 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
                onClick={() => handleNavigation('wallet')}
              >
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold mb-2">Wallet</h3>
                <p className="text-gray-600 text-sm">Paiements mobiles</p>
              </button>
              
              <button 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
                onClick={navigateToVendorDashboard}
              >
                <div className="text-4xl mb-3">🏪</div>
                <h3 className="font-semibold mb-2">Vendre</h3>
                <p className="text-gray-600 text-sm">Tableau de bord vendeur</p>
              </button>
              
              <button 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
                onClick={() => handleNavigation('search')}
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold mb-2">Recherche</h3>
                <p className="text-gray-600 text-sm">Trouvez vos produits</p>
              </button>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pourquoi choisir Tsena.mg ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">Paiements sécurisés</h3>
                <p className="text-gray-600 text-sm">MVola, Orange Money, Airtel Money et cartes bancaires</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="font-semibold mb-2">Livraison rapide</h3>
                <p className="text-gray-600 text-sm">24-48h dans toute l'île, gratuite dès 50 000 Ar</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Commerce équitable</h3>
                <p className="text-gray-600 text-sm">Prix justes pour les vendeurs et les acheteurs</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="font-semibold mb-2">Support local</h3>
                <p className="text-gray-600 text-sm">Service client en français et malgache</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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

      {/* Modal de rechargement wallet global */}
      <RechargeWalletModal
        isOpen={isWalletRechargeModalOpen}
        onClose={() => setIsWalletRechargeModalOpen(false)}
        onRechargeSuccess={onGlobalWalletRecharge}
        currentBalance={globalWalletBalance}
      />

      {/* Modal de transfert de fonds */}
      <TransferFundsModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransferSuccess={onTransferSuccess}
        currentBalance={globalWalletBalance}
      />
    </>
  );
}