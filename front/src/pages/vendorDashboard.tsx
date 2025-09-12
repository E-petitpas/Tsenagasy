import React, { Dispatch, SetStateAction } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { VendorDashboard as VendorDashboardComponent } from '../components/VendorDashboard';
import { User } from '../App';

interface VendorDashboardProps {
  currentUser: User | null;
  cartItemCount: number;
  globalWalletBalance: number;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onAddToCart: (productId: string) => Promise<void>;
  onGlobalWalletRecharge: (amount: number, method: string) => void;
  onTransferSuccess: (amount: number, method: string, recipient: string) => void;
  setCartItemCount: Dispatch<SetStateAction<number>>;
}

export default function VendorDashboard({
  currentUser,
  cartItemCount,
  globalWalletBalance,
  onLogin,
  onLogout,
  onAddToCart,
  onGlobalWalletRecharge,
  onTransferSuccess,
  setCartItemCount
}: VendorDashboardProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <VendorDashboardComponent 
            onBack={handleBack} 
            accessToken={currentUser?.accessToken} 
          />
        } 
      />
      {/* Ajoutez ici d'autres routes spécifiques au vendeur si nécessaire */}
      <Route 
        path="/products" 
        element={
          <VendorDashboardComponent 
            onBack={handleBack} 
            accessToken={currentUser?.accessToken} 
          />
        } 
      />
      <Route 
        path="/orders" 
        element={
          <VendorDashboardComponent 
            onBack={handleBack} 
            accessToken={currentUser?.accessToken} 
          />
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <VendorDashboardComponent 
            onBack={handleBack} 
            accessToken={currentUser?.accessToken} 
          />
        } 
      />
    </Routes>
  );
}