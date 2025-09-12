import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import Home from './pages/home';
import ClientDashboard from './pages/clientDashboard';
import VendorDashboard from './pages/vendorDashboard';

export interface User {
  name: string;
  type: 'client' | 'vendor';
  accessToken?: string;
  id?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [globalWalletBalance, setGlobalWalletBalance] = useState(45000);

  // Afficher un message d'information sur le mode démo au chargement
  React.useEffect(() => {
    const timer = setTimeout(() => {
      toast.info('Mode Démonstration', {
        description: 'Toutes les fonctionnalités sont simulées. Aucune donnée réelle n\'est utilisée.',
        duration: 4000
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    toast.success(`Bienvenue ${user.name} !`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
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

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" richColors />
        
        <Routes>
          <Route 
            path="/" 
            element={<Home {...sharedProps} />} 
          />
          <Route 
            path="/client/*" 
            element={
              currentUser?.type === 'client' ? 
                <ClientDashboard {...sharedProps} /> : 
                <Navigate to="/" replace />
            } 
          />
          { <Route 
            path="/vendor/*" 
            element={
              currentUser?.type === 'vendor' ? 
                <VendorDashboard {...sharedProps} /> : 
                <Navigate to="/" replace />
            } 
          /> }
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}