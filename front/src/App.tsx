// front/src/App.tsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { AuthStorage, UserData } from './config/authStorage';
import Home from './pages/home';
import ClientDashboardPage from './pages/clientDashboard';
import VendorDashboard from './pages/vendorDashboard';
import AdminDashboard from './pages/adminDashboard';
import UserDashboard from './pages/UserDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [globalWalletBalance, setGlobalWalletBalance] = useState(45000);

  useEffect(() => { 
    const checkSavedAuth = () => {
      try {
        const savedUser = AuthStorage.getUser();
        if (savedUser && savedUser.accessToken) {
          console.log('Utilisateur trouvé en mémoire:', savedUser.name);
          setCurrentUser(savedUser);
          toast.success(`Bon retour ${savedUser.name} !`);
        } else {
          console.log(' Aucun utilisateur sauvegardé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données auth:', error);
      } finally {
        setIsLoadingAuth(false); // Chargement terminé
      }
    };

    checkSavedAuth();
  }, []);

  const handleLogin = (user: UserData) => {
    setCurrentUser(user);
    toast.success(`Bienvenue ${user.name} !`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    AuthStorage.clearUser();
    toast.info('Vous êtes déconnecté');
  };

  const handleAddToCart = async (productId: string) => {
    setCartItemCount(prev => prev + 1);
    toast.success('Produit ajouté au panier !', {
      description: 'Vous pouvez continuer vos achats ou voir votre panier.'
    });

    if (currentUser?.accessToken) {
      try {
        console.log('Adding product to cart:', productId);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  const handleGlobalWalletRecharge = (amount: number, method: string) => {
    setGlobalWalletBalance(prev => prev + amount);
  };

  const handleTransferSuccess = (amount: number, method: string, recipient: string) => {
    if (method === 'wallet') {
      setGlobalWalletBalance(prev => prev - amount);
    }
  };

  const sharedProps = {
    currentUser,
    cartItemCount,
    globalWalletBalance,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onAddToCart: handleAddToCart,
    onGlobalWalletRecharge: handleGlobalWalletRecharge,
    onTransferSuccess: handleTransferSuccess,
    setCartItemCount
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D8A47] mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" richColors />
        
        <Routes>
          <Route 
            path="/" 
            element={currentUser?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Home {...sharedProps} />
                )} 
          />
          
          {/* ROUTE COMMUNE CLIENT + VENDEUR */}
          <Route
            path="/dashboard/*"
            element={
              currentUser
                ? <UserDashboard currentUser={currentUser} onLogout={handleLogout} />
                : <Navigate to="/" replace />
            }
          />
          
          <Route
            path="/admin/*"
            element={
              currentUser?.role === 'admin'
                ? <AdminDashboard currentUser={currentUser as UserData & { type: "admin" }} onLogout={handleLogout} />
                : <Navigate to="/" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}