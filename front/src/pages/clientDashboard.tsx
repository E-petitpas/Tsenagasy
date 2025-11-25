import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
   X, Lock, Heart, CreditCard, User, Bell, Settings,
  ShoppingBag, Clock, Star, ChevronRight
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { StatusBadge } from "../components/StatusBadge";
import { RechargeWalletModal } from "../components/RechargeWalletModal";
import { toast } from "sonner";

interface ClientDashboardPageProps {
  profileUser: ProfileUser | null;
  activeTab: ClientTab;
  onChangeTab: (view: ClientTab) => void;
}

type ProfileUser = {
  id: string;
  role: string; 
  name: string;
  email?: string | null;
  tel?: string | null;
  adresse?: string | null;
  storeName?: string | null;
  type: "client" | "vendor";
};

 export type ClientTab =
  | "client-dashboard"
  | "client-orders"
  | "client-wishlist"
  | "client-wallet"
  | "client-profile";

const demoOrders = [
  {
    id: "1",
    date: "2024-01-15",
    status: "livré",
    total: 125000,
    items: [
      { name: "Lamba Mena Traditionnel", price: 75000, quantity: 1 },
      { name: "Panier en Raphia", price: 50000, quantity: 1 },
    ],
  },
  {
    id: "2",
    date: "2024-01-10",
    status: "shipping",
    total: 95000,
    items: [
      { name: "Huile Essentielle Ylang-Ylang", price: 45000, quantity: 2 },
      { name: "Savon Naturel Coco", price: 5000, quantity: 1 },
    ],
  },
  {
    id: "3",
    date: "2024-01-05",
    status: "processing",
    total: 200000,
    items: [{ name: "Sculpture Bois de Rose", price: 200000, quantity: 1 }],
  },
];

const demoWishlist = [
  { id: "1", name: "Collier Perles Madagascar", price: 85000, image: "💎" },
  { id: "2", name: "Thé Vanilla Premium", price: 35000, image: "🫖" },
  { id: "3", name: "Broderie Silk Malgache", price: 120000, image: "🧵" },
  { id: "4", name: "Broderie Silk Malgache", price: 120000, image: "🧵" },
  { id: "5", name: "Broderie Silk Malgache", price: 120000, image: "🧵" },
];

const demoRecommendations = [
  { id: "1", name: "Miel de Litchi Bio", price: 25000, image: "🍯", rating: 4.8 },
  { id: "2", name: "Épices Romazava Mix", price: 15000, image: "🌶️", rating: 4.9 },
  { id: "3", name: "Chapeau Raphia", price: 45000, image: "👒", rating: 4.7 },
];


export default function ClientDashboardPage({ profileUser, activeTab, onChangeTab }: ClientDashboardPageProps) {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(25000);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isVendor = profileUser?.role === "vendor";

  const [name, setName] = useState(profileUser?.name ?? "");
  const [email, setEmail] = useState(profileUser?.email ?? "");
  const [address, setAddress] = useState(profileUser?.adresse ?? "");
  const [tel, setTel] = useState(profileUser?.tel ?? "");
  const [storeName, setStoreName] = useState(profileUser?.storeName ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  useEffect(() => {
    setName(profileUser?.name ?? "");
    setEmail(profileUser?.email ?? "");
    setAddress(profileUser?.adresse ?? "");
    setTel(profileUser?.tel ?? "");
    setStoreName(profileUser?.storeName ?? "");
  }, [profileUser]);

  useEffect(() => {
    setOldPassword("");
    setNewPassword("");
  }, [activeTab]);
  
  useEffect(() => {
  console.log("profileUser reçu dans ClientDashboardPage:", profileUser);
}, [profileUser]);
  
  
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      type: "recharge",
      description: "Recharge MVola",
      amount: 50000,
      date: "2024-01-15T14:30:00",
    },
    {
      id: "2",
      type: "purchase",
      description: "Achat produit",
      amount: -25000,
      date: "2024-01-14T16:45:00",
    },
  ]);

 const renderDashboard = () => (
    <>
      {/* --- CARDS PRINCIPALES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* COMMANDES */}
        <Card
          className="!bg-transparent bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg cursor-pointer hover:scale-[1.02] transition"
          onClick={() => onChangeTab("client-orders")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-100">Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                <ShoppingBag className="h-6 w-6" style={{ color: "#3B82F6" }}/>
              </div>
              <div>
                <div className="text-3xl font-bold">{demoOrders.length}</div>
                <p className="text-xs text-blue-100 mt-1 opacity-90">
                  Commandes passées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAVORIS */}
        <Card
          className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-0 shadow-lg cursor-pointer hover:scale-[1.02] transition"
          onClick={() => onChangeTab("client-wishlist")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-100">Favoris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                <Heart className="h-6 w-6" style={{ color: "#EC4899" }}/>
              </div>
              <div>
                <div className="text-3xl font-bold">{demoWishlist.length}</div>
                <p className="text-xs text-pink-100 mt-1 opacity-90">
                  Produits aimés
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- COMMANDES RÉCENTES (THÈME BLEU) --- */}
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader className="bg-blue-50 to-white">
          <CardTitle className="flex items-center text-blue-600">
            <Clock className="h-5 w-5 mr-2" />
            Commandes récentes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {demoOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-lg hover:shadow-md transition"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">Commande #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.date).toLocaleDateString("fr-FR")} •{" "}
                    {order.items.length} articles
                  </p>
                </div>

                <div className="text-right font-bold text-blue-600">
                  {order.total.toLocaleString()} Ar
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderOrders = () => (
    <Card className="border-l-4 border-l-blue-500 shadow-md">
      <CardHeader className="bg-blue-50 to-white">
        <CardTitle className="flex items-center text-blue-600 text-xl">
          <ShoppingBag className="h-5 w-5 mr-2" /> Mes commandes
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-4">

          {demoOrders.map((o) => (
            <div
              key={o.id}
              className="p-4 bg-white border border-blue-100 rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-bold text-blue-700">Commande #{o.id}</h3>
                  <p className="text-gray-600">
                    Passée le {new Date(o.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="text-right">
                  <StatusBadge status={o.status} />
                  <div className="font-bold mt-1 text-blue-600">
                    {o.total.toLocaleString()} Ar
                  </div>
                </div>
              </div>

              {o.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{item.price.toLocaleString()} Ar</span>
                </div>
              ))}

            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderWishlist = () => (
    <Card
      className="shadow-md"
      style={{
        borderLeft: "4px solid #ec4899", // rose principal
      }}
    >
      {/* HEADER */}
      <CardHeader
        style={{
          backgroundColor: "#fdf2f8", // rose très clair
          borderBottom: "1px solid #fbcfe8",
        }}
      >
        <CardTitle
          className="flex items-center"
          style={{ color: "#db2777" }}
        >
          <Heart className="h-5 w-5 mr-2" style={{ color: "#db2777" }} />
          Ma liste de souhaits
        </CardTitle>
      </CardHeader>

      {/* CONTENU */}
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoWishlist.map((item) => (
            <div
              key={item.id}
              className="rounded-lg p-4 hover:shadow-lg hover:scale-105 transition relative"
              style={{
                backgroundColor: "#fdf2f8",
                border: "1px solid #fbcfe8",
              }}
            >

              {/* ❌ BOUTON SUPPRESSION */}
              <button
                onClick={() => console.log("Supprimer", item.id)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  border: "1px solid #fca5a5", // rose/rouge clair
                  color: "#db2777", 
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "0",
                }}
              >
                <X style={{ width: "15px", height: "15px", color: "#db2777" }} />
              </button>

              <div className="text-center mb-3">
                <div className="text-4xl">{item.image}</div>
                <h4 className="font-medium">{item.name}</h4>
              </div>

              <div className="flex justify-between">
                <span className="font-bold" style={{ color: "#2D8A47" }}>
                  {item.price.toLocaleString()} Ar
                </span>

                <Button
                  size="sm"
                  style={{
                    backgroundColor: "#db2777",
                    color: "white",
                  }}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );


  const renderWallet = () => (
    <>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Solde */}
        <Card className="border-l-4 border-l-[#2D8A47] shadow-md">
          <CardHeader className="bg-green-50 to-white">
            <CardTitle className="flex items-center text-[#2D8A47]">
              <CreditCard className="h-5 w-5 mr-2" /> Wallet Tsena
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <div className="text-3xl font-bold text-[#2D8A47] mb-2">
              {walletBalance.toLocaleString()} Ar
            </div>

            <p className="text-gray-600 mb-6">Solde disponible</p>

            <div className="grid gap-3">
              <Button
                className="bg-[#2D8A47] text-white"
                onClick={() => setIsRechargeModalOpen(true)}
              >
                Recharger le wallet
              </Button>

              <Button
                variant="outline"
                className="border-[#2D8A47] text-[#2D8A47]"
                onClick={() =>
                  toast.info("Fonctionnalité bientôt disponible.")
                }
              >
                Transférer des fonds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paiements mobiles */}
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader className="bg-blue-50 to-white">
            <CardTitle className="flex items-center text-blue-600">
              💳 Paiements mobiles
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* MVola */}
            <div className="flex justify-between p-3 bg-red-50 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold">
                  M
                </div>
                <div>
                  <p className="font-medium">MVola</p>
                  <p className="text-sm text-gray-600">Connecté</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Actif</Badge>
            </div>

            {/* OM */}
            <div className="flex justify-between p-3 bg-orange-50 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <p className="font-medium">Orange Money</p>
                  <p className="text-sm text-gray-600">Non connecté</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-600">
                Connecter
              </Button>
            </div>

            {/* Airtel */}
            <div className="flex justify-between p-3 bg-red-50 border rounded-lg opacity-70">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <p className="font-medium">Airtel Money</p>
                  <p className="text-sm text-gray-600">Non connecté</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-red-300 text-red-600">
                Connecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique */}
      <Card
        className="mt-8"
        style={{
          borderLeft: "4px solid #6b7280", 
        }}
      >
        <CardHeader
          style={{
            backgroundColor: "#f3f4f6",  
            borderBottom: "1px solid #e5e7eb", 
          }}
        >
          <CardTitle
            className="flex items-center"
            style={{ color: "#374151" }} 
          >
            <Clock className="h-5 w-5 mr-2" style={{ color: "#374151" }} />
            Historique des transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      t.type === "recharge"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.type === "recharge" ? "+" : "-"}
                  </div>

                  <div>
                    <p className="font-medium text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.date).toLocaleDateString("fr-FR")} ·{" "}
                      {new Date(t.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p
                  className={`font-medium ${
                    t.type === "recharge" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "recharge" ? "+" : ""}
                  {t.amount.toLocaleString()} Ar
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderProfile = () => {
  return (
    <Card className="border-l-4 border-l-purple-500 shadow-md">
      {/* HEADER */}
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center text-purple-600">
          <User className="h-5 w-5 mr-2" /> Mon profil
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        {/* AVATAR */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl px-4 py-2 mb-6 text-white shadow-lg">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-white text-purple-600 text-3xl font-bold">
                {profileUser?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold mb-1">{profileUser?.name}</h2>
              <p className="text-purple-100 mb-2">{profileUser?.email}</p>
              <Badge className="bg-white bg-opacity-20 text-white border-0">
                {isVendor ? "Vendeur" : "Client"}
              </Badge>
            </div>
          </div>
        </div>

        {/* 2 COLONNES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* INFORMATIONS PERSONNELLES - BARRE BLEUE */}
          <div className="rounded-lg p-4 bg-white"
            style={{ borderLeft: "4px solid #2563eb" }}>
            <h3 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Informations personnelles
            </h3>

            <div className="space-y-4">
              
              {/* NOM */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nom complet</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input 
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>

              {/* TEL */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                <Input 
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+261 XX XX XXX XX"
                />
              </div>

              {/* ADRESSE */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Adresse</label>
                <Input 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Votre adresse"
                />
              </div>

              {/* MAGASIN */}
              {isVendor && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nom du magasin</label>
                  <Input 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Nom de la boutique"
                  />
                </div>
              )}

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2.5">
                Enregistrer
              </Button>
            </div>
          </div>

          {/* SÉCURITÉ - BARRE VERTE */}
          <div className="rounded-lg p-4 bg-white"
            style={{ borderLeft: "4px solid #2D8A47" }}>
            <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Sécurité
            </h3>

            <div className="space-y-4">
              
              {/* ANCIEN MDP */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Ancien mot de passe</label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* NOUVEAU MDP */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5">
                Effectuer
              </Button>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

  return (
    <div className="px-6 py-4">

      {/* Main content */}
      <div className="p-6 w-full max-w-[1550px] mx-auto">
        <Tabs value={activeTab} onValueChange={(val) => onChangeTab(val as ClientTab)} className="space-y-6">
          <TabsContent value="client-dashboard">{renderDashboard()}</TabsContent>
          <TabsContent value="client-orders">{renderOrders()}</TabsContent>
          <TabsContent value="client-wishlist">{renderWishlist()}</TabsContent>
          <TabsContent value="client-wallet">{renderWallet()}</TabsContent>
          <TabsContent value="client-profile">{renderProfile()}</TabsContent>
        </Tabs>
      </div>

      <RechargeWalletModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onRechargeSuccess={(amount, method) => {
          setWalletBalance(walletBalance + amount);
          setTransactions((t) => [
            {
              id: crypto.randomUUID(),
              type: "recharge",
              description: `Recharge ${method}`,
              amount,
              date: new Date().toISOString(),
            },
            ...t,
          ]);
        }}
        currentBalance={walletBalance}
      />
    </div>
  );
}
