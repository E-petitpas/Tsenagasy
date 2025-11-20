// UserDashboard.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  LogOut,
  Home,
  ArrowLeft,
  Star,
  ShoppingCart,
  BarChart3
} from "lucide-react";

import "../styles/AdminDashboard.css";
import ClientDashboardPage from "./clientDashboard";
import VendorDashboard from "./vendorDashboard";
import { UserData } from "../config/authStorage";

interface Props {
  currentUser: UserData;
  onLogout: () => void;
}

export default function UserDashboard({ currentUser, onLogout }: Props) {

  const navigate = useNavigate();

  // Onglet actif principal (client ou vendeur)
  const [activeTab, setActiveTab] = useState<"client" |
  "vendor" |
  "vendor-products" |
  "vendor-sponsors" |
  "vendor-orders" |
  "vendor-analytics">(
    currentUser.role === "vendor" ? "vendor" : "client"
  );

  const handleViewChange = (view: typeof activeTab) => {
    setActiveTab(view);
  };

  useEffect(() => {
    const savedTab = sessionStorage.getItem("userActiveTab") as typeof activeTab | null;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("userActiveTab", activeTab);
  }, [activeTab]);
  
  const getBreadcrumb = () => {
    // Si onglet client
    if (activeTab === "client") {
      return "Espace Client";
    }

    // Si onglet vendeur
    const vendorTitles: Record<typeof activeTab, string> = {
      vendor: "Vue d’ensemble",
      "vendor-products": "Produits",
      "vendor-sponsors": "Sponsors",
      "vendor-orders": "Commandes", 
      "vendor-analytics": "Analyses"
    };

   return (
    <>
      Espace Vendeur &gt;
      <span className="text-[#2D8A47] font-medium">  {vendorTitles[activeTab]}</span>
    </>
  );
  };

  const getPageTitle = () => {
    const titles: Record<typeof activeTab, string> = {
      client: "Espace Client",
      vendor: "Vue d’ensemble",
      "vendor-products": "Produits",
      "vendor-sponsors": "Sponsors",
      "vendor-orders": "Commandes",
      "vendor-analytics": "Analyses"
    };

    return titles[activeTab];
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ------------ SIDEBAR ------------ */}
      <aside className="sidebar">

        <div className="sidebar-header">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Home size={20} /> Tableau de bord
          </h1>
          <p className="text-xs text-white text-opacity-75">Tsena.mg</p>
        </div>

        <nav className="sidebar-nav">

          {/* ---- ACCUEIL ---- */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all"
          >
            <ArrowLeft size={20} />
            <span>Accueil</span>
          </button>

          {/* ---- ESPACE CLIENT ---- */}
          <button
            onClick={() => setActiveTab("client")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
              ${activeTab === "client" ? "active" : ""}`}
          >
            <Users size={20} />
            <span>Espace Client</span>
          </button>

          {/* ---- LABEL vendeur (pas un bouton) ---- */}
          {currentUser.role === "vendor" && (
            <div className="mt-6 mb-2 px-4 text-xs font-semibold uppercase text-white text-opacity-60">
              Espace vendeur
            </div>
          )}

          {/* ---- Sous-pages vendeur ---- */}
          {currentUser.role === "vendor" && (
            <>
              <button
                onClick={() => setActiveTab("vendor")}
                className={`sub-btn ${activeTab === "vendor" ? "active" : ""}`}
              >
                Vue d’ensemble
                <div className={`ml-auto ${activeTab === "vendor" ? "icon-active" : "icon-inactive"}`}>
                  <BarChart3 size={16} />
                </div>
              </button>

              <button
                onClick={() => setActiveTab("vendor-products")}
                className={`sub-btn ${activeTab === "vendor-products" ? "active" : ""}`}
              >                
                Produits
                  <div className={`ml-auto ${activeTab === "vendor-products" ? "icon-active" : "icon-inactive"}`}>
                    <Package size={16} />
                  </div>                
              </button>

              <button
                onClick={() => setActiveTab("vendor-sponsors")}
                className={`sub-btn ${activeTab === "vendor-sponsors" ? "active" : ""}`}
              >
                Sponsors
                <div className={`ml-auto ${activeTab === "vendor-sponsors" ? "icon-active" : "icon-inactive"}`}>
                  <Star size={16} />
                </div>
              </button>

              <button
                onClick={() => setActiveTab("vendor-orders")}
                className={`sub-btn ${activeTab === "vendor-orders" ? "active" : ""}`}
              >
                Commandes
                <div className={`ml-auto ${activeTab === "vendor-orders" ? "icon-active" : "icon-inactive"}`}>
                  <ShoppingCart size={16} />
                </div>
              </button>

              <button
                onClick={() => setActiveTab("vendor-analytics")}
                className={`sub-btn ${activeTab === "vendor-analytics" ? "active" : ""}`}
              >
                Analyses
                <div className={`ml-auto ${activeTab === "vendor-analytics" ? "icon-active" : "icon-inactive"}`}>
                  <BarChart3 size={16} />
                </div>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => { sessionStorage.removeItem("userActiveTab"); onLogout();}}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ------------ CONTENU ------------ */}
      <div className="flex-1">

        {/* HEADER */}
        <header className="header-horizontal">
          <div className="header-content">
            <div className="header-left">
              <h2 className="font-bold text-xl">{getPageTitle()}</h2>
              <p className="text-sm text-gray-500">{getBreadcrumb()}</p>
            </div>
            <div className="header-right">
              <p>Bienvenue {currentUser.name}</p>
              <p>{new Date().toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </header>

        {/* CONTENU */}
        <main className="p-6 w-full max-w-[1550px] mx-auto">

          {activeTab === "client" && (
            <ClientDashboardPage
              currentUser={{ ...currentUser, type: "client" }}
              onLogout={onLogout}
            />
          )}

          {activeTab.startsWith("vendor") && currentUser.role === "vendor" && (
            <VendorDashboard
              currentUser={{ ...currentUser, type: "vendor" }}
              activeView={activeTab}      
              onLogout={onLogout}
              onChangeView={handleViewChange}
            />
          )}

        </main>
      </div>

    </div>
  );
}
