import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ClientDashboard as ClientDashboardComponent } from '../components/ClientDashboard';
import { User } from '../App';

interface ClientDashboardProps {
  currentUser: User | null;
  cartItemCount: number;
  globalWalletBalance: number;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onAddToCart: (productId: string) => Promise<void>;
  onGlobalWalletRecharge: (amount: number, method: string) => void;
  onTransferSuccess: (amount: number, method: string, recipient: string) => void;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function ClientDashboard({
  currentUser,
  cartItemCount,
  globalWalletBalance,
  onLogin,
  onLogout,
  onAddToCart,
  onGlobalWalletRecharge,
  onTransferSuccess,
  setCartItemCount
}: ClientDashboardProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ClientDashboardComponent 
            onBack={handleBack} 
            user={currentUser!} 
          />
        } 
      />
      {/* Ajoutez ici d'autres routes spécifiques au client si nécessaire */}
      <Route 
        path="/orders" 
        element={
          <ClientDashboardComponent 
            onBack={handleBack} 
            user={currentUser!} 
          />
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ClientDashboardComponent 
            onBack={handleBack} 
            user={currentUser!} 
          />
        } 
      />
    </Routes>
  );
}