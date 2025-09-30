import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Heart, CreditCard, User, Bell, Settings, 
  ShoppingBag, Clock, Star, LogOut, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { RechargeWalletModal } from '../components/RechargeWalletModal';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { UserData } from '../config/authStorage';

interface ClientDashboardPageProps {
  currentUser: UserData & { type: "client" };
  onLogout: () => void;
}

const demoOrders = [
  {
    id: '1',
    date: '2024-01-15',
    status: 'delivered',
    total: 125000,
    items: [
      { name: 'Lamba Mena Traditionnel', price: 75000, quantity: 1 },
      { name: 'Panier en Raphia', price: 50000, quantity: 1 }
    ]
  },
  {
    id: '2',
    date: '2024-01-10',
    status: 'shipping',
    total: 95000,
    items: [
      { name: 'Huile Essentielle Ylang-Ylang', price: 45000, quantity: 2 },
      { name: 'Savon Naturel Coco', price: 5000, quantity: 1 }
    ]
  },
  {
    id: '3',
    date: '2024-01-05',
    status: 'processing',
    total: 200000,
    items: [
      { name: 'Sculpture Bois de Rose', price: 200000, quantity: 1 }
    ]
  }
];

const demoWishlist = [
  { id: '1', name: 'Collier Perles Madagascar', price: 85000, image: '💎' },
  { id: '2', name: 'Thé Vanilla Premium', price: 35000, image: '🫖' },
  { id: '3', name: 'Broderie Silk Malgache', price: 120000, image: '🧵' }
];

const demoRecommendations = [
  { id: '1', name: 'Miel de Litchi Bio', price: 25000, image: '🍯', rating: 4.8 },
  { id: '2', name: 'Épices Romazava Mix', price: 15000, image: '🌶️', rating: 4.9 },
  { id: '3', name: 'Chapeau Raphia', price: 45000, image: '👒', rating: 4.7 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
    case 'shipping': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0';
    case 'processing': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'delivered': return 'Livré';
    case 'shipping': return 'En cours de livraison';
    case 'processing': return 'En préparation';
    default: return 'Inconnu';
  }
};

export default function ClientDashboardPage({ currentUser, onLogout }: ClientDashboardPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [walletBalance, setWalletBalance] = useState(25000);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'recharge',
      description: 'Recharge MVola',
      amount: 50000,
      date: '2024-01-15T14:30:00',
      method: 'MVola'
    },
    {
      id: '2',
      type: 'purchase',
      description: 'Achat produit',
      amount: -25000,
      date: '2024-01-14T16:45:00',
      method: 'Wallet'
    }
  ]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setActiveTab('dashboard');
  }, []);
  
  const handleBack = () => {
    navigate('/');
  };
  const totalOrders = demoOrders.length;

  const handleRechargeSuccess = (amount: number, method: string) => {
    setWalletBalance(prev => prev + amount);
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      type: 'recharge' as const,
      description: `Recharge ${method}`,
      amount,
      date: new Date().toISOString(),
      method
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-[#2D8A47] hover:text-[#245A35] hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil Tsena.mg
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-[#2D8A47]">
                <AvatarFallback className="bg-[#2D8A47] text-white text-lg font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Salama, {currentUser.name} ! 👋</h1>
                <p className="text-gray-600">Votre espace personnel sur Tsena.mg</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#2D8A47] hover:bg-green-50">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${settingsOpen 
                      ? "text-[#2D8A47] border border-[#2D8A47] bg-green-50" 
                      : "text-gray-600 hover:text-[#2D8A47] hover:bg-green-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setActiveTab("dashboard")}>
                    <Package className="h-4 w-4 mr-2 text-[#2D8A47]" />
                    Tableau de bord
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("orders")}>
                    <ShoppingBag className="h-4 w-4 mr-2 text-[#2D8A47]" />
                    Commandes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("wishlist")}>
                    <Heart className="h-4 w-4 mr-2 text-pink-500" />
                    Favoris
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("wallet")}>
                    <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                    Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                    <User className="h-4 w-4 mr-2 text-purple-600" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Badge className="bg-green-100 text-green-700 border border-green-200">
                ✓ Client vérifié
              </Badge>
            </div>
          </div>
          
          {/* Fil d’Ariane */}
          <nav className="text-sm font-medium mt-6" aria-label="Fil d'Ariane">
            <ol className="flex items-center space-x-1 text-gray-500">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="text-[#2D8A47] hover:text-[#245A35] transition-colors"
                >
                  Tableau de bord
                </button>
              </li>

              {activeTab !== "dashboard" && (
                <>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                    <span className="text-gray-700 capitalize font-semibold">
                      {activeTab === "orders" && "Mes commandes"}
                      {activeTab === "wishlist" && "Mes favoris"}
                      {activeTab === "wallet" && "Mon wallet"}
                      {activeTab === "profile" && "Mon profil"}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>          
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* ---------------- dashboard ---------------- */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalOrders}</div>
                      <div className="text-xs text-blue-100 mt-1">Total passées</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-pink-100">Favoris</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{demoWishlist.length}</div>
                      <div className="text-xs text-pink-100 mt-1">Produits aimés</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent orders */}
            <Card className="border-l-4 border-l-blue-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <Clock className="h-5 w-5" />
                  <span>Commandes récentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">Commande #{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.date).toLocaleDateString('fr-FR')} • {order.items.length} article(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#2D8A47]">{order.total.toLocaleString()} Ar</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-l-4 border-l-[#FFA726] shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                <CardTitle className="flex items-center space-x-2 text-[#FFA726]">
                  <Star className="h-5 w-5" />
                  <span>Recommandations pour vous</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {demoRecommendations.map((item) => (
                    <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:scale-105 transition-all duration-200">
                      <div className="text-center mb-3">
                        <div className="text-4xl mb-2">{item.image}</div>
                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2D8A47]">{item.price.toLocaleString()} Ar</span>
                        <div className="flex items-center text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {item.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Orders ---------------- */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600 text-xl font-bold">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Mes commandes
              </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {demoOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold">Commande #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Passée le {new Date(order.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          <div className="font-bold mt-1">{order.total.toLocaleString()} Ar</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>{item.price.toLocaleString()} Ar</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Wishlist ---------------- */}
          <TabsContent value="wishlist" className="space-y-6">
            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
              <span className="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-red-500 rounded-full mr-3"></span>
              Mes favoris
            </h2>
            <Card className="border-l-4 border-l-pink-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-white">
                <CardTitle className="flex items-center space-x-2 text-pink-600">
                  <Heart className="h-5 w-5" />
                  <span>Ma liste de souhaits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {demoWishlist.map((item) => (
                    <div key={item.id} className="bg-gradient-to-br from-white to-pink-50 border-2 border-pink-100 rounded-lg p-4 hover:shadow-lg hover:scale-105 transition-all duration-200">
                      <div className="relative">
                        <Heart className="absolute top-0 right-0 h-5 w-5 text-pink-500 fill-current" />
                        <div className="text-center mb-3">
                          <div className="text-4xl mb-2">{item.image}</div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2D8A47]">{item.price.toLocaleString()} Ar</span>
                          <Button size="sm" className="bg-gradient-to-r from-[#2D8A47] to-[#4CAF50] hover:from-[#245A35] hover:to-[#388E3C] text-white border-0">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Wallet ---------------- */}
          <TabsContent value="wallet" className="space-y-6">
            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
              <span className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></span>
              Mon wallet
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-[#2D8A47] shadow-md">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                  <CardTitle className="flex items-center space-x-2 text-[#2D8A47]">
                    <CreditCard className="h-5 w-5" />
                    <span>Wallet Tsena</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#2D8A47] mb-2">{walletBalance.toLocaleString()} Ar</div>
                    <p className="text-gray-600 mb-6">Solde disponible</p>

                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        className="bg-[#2D8A47] hover:bg-[#245A35] text-white"
                        onClick={() => setIsRechargeModalOpen(true)}
                      >
                        Recharger le wallet
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-[#2D8A47] text-[#2D8A47] hover:bg-green-50"
                        onClick={() => toast.info('Fonctionnalité', { description: 'Le transfert de fonds sera bientôt disponible.' })}
                      >
                        Transférer des fonds
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <span className="text-lg">💳</span>
                    <span>Paiements mobiles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                          M
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">MVola</div>
                          <div className="text-sm text-gray-600">Connecté</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                          O
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Orange Money</div>
                          <div className="text-sm text-gray-600">Non connecté</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                        Connecter
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg opacity-60">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                          A
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Airtel Money</div>
                          <div className="text-sm text-gray-600">Non connecté</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        Connecter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Historique des transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${transaction.type === 'recharge' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                          <span className={`${transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'} text-sm`}>
                            {transaction.type === 'recharge' ? '+' : '-'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('fr-FR')} - {new Date(transaction.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'recharge' ? '+' : ''}{transaction.amount.toLocaleString()} Ar
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <p>Aucune transaction pour le moment</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Profile ---------------- */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-l-4 border-l-purple-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-500 rounded-md shadow-sm">
                <CardTitle className="flex items-center text-purple-700 text-xl font-bold">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  Mon profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-[#2D8A47] to-[#4CAF50] rounded-lg text-white">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarFallback className="bg-white text-[#2D8A47] text-2xl font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl">{currentUser.name}</h3>
                    <p className="text-green-100">Client Tsena.mg</p>
                    <Badge className="bg-white text-[#2D8A47] mt-2 font-medium">
                      ✓ Membre vérifié
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">📧</span>
                      Email
                    </label>
                    <p className="p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg">
                      {currentUser.id?.includes('demo') ? 'demo@tsena.mg' : 'utilisateur@tsena.mg'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">📱</span>
                      Téléphone
                    </label>
                    <p className="p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg">+261 xx xxx xx xx</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">📍</span>
                      Adresse
                    </label>
                    <p className="p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg">Antananarivo, Madagascar</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">📅</span>
                      Membre depuis
                    </label>
                    <p className="p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg">Janvier 2024</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button className="bg-gradient-to-r from-[#2D8A47] to-[#4CAF50] hover:from-[#245A35] hover:to-[#388E3C] text-white border-0 px-6">
                    Modifier le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recharge modal */}
      <RechargeWalletModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onRechargeSuccess={handleRechargeSuccess}
        currentBalance={walletBalance}
      />
    </div>
  );
}
