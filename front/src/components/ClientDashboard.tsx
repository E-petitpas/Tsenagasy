import React, { useState } from 'react';
import { ArrowLeft, Package, Heart, MapPin, CreditCard, User, Bell, Settings, ShoppingBag, TrendingUp, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { RechargeWalletModal } from './RechargeWalletModal';
import { toast } from 'sonner@2.0.3';

interface ClientDashboardProps {
  onBack: () => void;
  user: {
    name: string;
    type: 'client' | 'vendor';
    accessToken?: string;
    id?: string;
  };
}

// Données de démonstration pour le client
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

export function ClientDashboard({ onBack, user }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
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

  const totalSpent = demoOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = demoOrders.length;

  const handleRechargeSuccess = (amount: number, method: string) => {
    setWalletBalance(prev => prev + amount);
    
    // Ajouter la transaction à l'historique
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      type: 'recharge' as const,
      description: `Recharge ${method}`,
      amount: amount,
      date: new Date().toISOString(),
      method: method
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec style cohérent */}
      <header className="bg-white border-b shadow-sm">
        {/* Barre de retour */}
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-[#2D8A47] hover:text-[#245A35] hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil Tsena.mg
            </Button>
          </div>
        </div>
        
        {/* En-tête principal */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-[#2D8A47]">
                <AvatarFallback className="bg-[#2D8A47] text-white text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Salama, {user.name} ! 👋</h1>
                <p className="text-gray-600">Votre espace personnel sur Tsena.mg</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#2D8A47] hover:bg-green-50">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#2D8A47] hover:bg-green-50">
                <Settings className="h-5 w-5" />
              </Button>
              <Badge className="bg-green-100 text-green-700 border border-green-200">
                ✓ Client vérifié
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Aperçu</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Commandes</TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Favoris</TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Wallet</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Profil</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-[#2D8A47] to-[#4CAF50] text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Total dépensé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalSpent.toLocaleString()} Ar</div>
                      <div className="text-xs text-green-100 mt-1">Cette année</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

            {/* Recent Orders */}
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

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes commandes</CardTitle>
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

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card className="border-l-4 border-l-pink-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-white">
                <CardTitle className="flex items-center space-x-2 text-pink-600">
                  <Heart className="h-5 w-5" />
                  <span>Ma liste de souhaits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {demoWishlist.map((item, index) => (
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

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Solde principal */}
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

              {/* Méthodes de paiement */}
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

            {/* Historique des transactions */}
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-l-4 border-l-purple-500 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                <CardTitle className="flex items-center space-x-2 text-purple-600">
                  <User className="h-5 w-5" />
                  <span>Mon profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-[#2D8A47] to-[#4CAF50] rounded-lg text-white">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarFallback className="bg-white text-[#2D8A47] text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl">{user.name}</h3>
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
                      {user.id?.includes('demo') ? 'demo@tsena.mg' : 'utilisateur@tsena.mg'}
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

      {/* Modal de rechargement */}
      <RechargeWalletModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onRechargeSuccess={handleRechargeSuccess}
        currentBalance={walletBalance}
      />
    </div>
  );
}