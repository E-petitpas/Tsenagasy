import React, { Dispatch, SetStateAction } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { VendorDashboard as VendorDashboardComponent } from '../components/VendorDashboard';
import { UserData } from '../config/authStorage';
import { Button } from "../components/ui/button";

interface VendorDashboardProps {
  currentUser: UserData & { type: "vendor" };
  cartItemCount: number;
  globalWalletBalance: number;
  onLogin: (user: UserData) => void;
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
    <>
      {/* Petit bouton en haut */}
      <div className="p-4 flex justify-end">
        <Button 
          onClick={onLogout} 
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Déconnexion
        </Button>
      </div>

      {/* Les routes */}
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
    </>
  );
}