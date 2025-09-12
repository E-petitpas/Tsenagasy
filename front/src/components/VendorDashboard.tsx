import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewProductModal } from './NewProductModal';
import { toast } from 'sonner@2.0.3';

interface VendorDashboardProps {
  onBack: () => void;
  accessToken?: string;
}

const mockStats = {
  totalRevenue: 1250000,
  totalOrders: 89,
  activeProducts: 23,
  newCustomers: 45
};

const mockProducts = [
  {
    id: '1',
    name: 'Tissu Lamba traditionnel',
    price: 45000,
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1660695828374-4ff51ac9df5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGV4dGlsZXMlMjBjb2xvcmZ1bCUyMGZhYnJpY3xlbnwxfHx8fDE3NTY2NzgxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sales: 23,
    views: 456
  },
  {
    id: '2',
    name: 'Panier artisanal en raphia',
    price: 25000,
    stock: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606077089838-0ac4a27fc96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRhZ2FzY2FyJTIwaGFuZGNyYWZ0JTIwYXJ0aXNhbiUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NjY3ODE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sales: 15,
    views: 234
  },
  {
    id: '3',
    name: 'Épices mélangées traditionnelles',
    price: 12000,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTY2NzgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sales: 89,
    views: 1234
  }
];

const mockOrders = [
  {
    id: 'ORD001',
    customer: 'Hery Rakoto',
    products: ['Tissu Lamba traditionnel'],
    total: 45000,
    status: 'completed',
    date: '2024-01-15',
    payment: 'mvola'
  },
  {
    id: 'ORD002',
    customer: 'Fara Andry',
    products: ['Panier artisanal', 'Épices mélangées'],
    total: 37000,
    status: 'processing',
    date: '2024-01-14',
    payment: 'orange_money'
  },
  {
    id: 'ORD003',
    customer: 'Rivo Hery',
    products: ['Épices mélangées traditionnelles'],
    total: 12000,
    status: 'shipped',
    date: '2024-01-13',
    payment: 'card'
  }
];

export function VendorDashboard({ onBack, accessToken }: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(mockStats);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(true);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // Simulate loading delay for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of API calls
        setStats(mockStats);
        setProducts(mockProducts);
        setOrders(mockOrders);
        
      } catch (error) {
        console.error('Failed to load vendor data:', error);
        // Still set mock data even if there's an error
        setStats(mockStats);
        setProducts(mockProducts);
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    loadVendorData();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleNewProduct = (newProduct: any) => {
    setProducts(prev => [...prev, newProduct]);
    toast.success('Produit ajouté avec succès !');
  };

  const handleEditProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsNewProductModalOpen(true);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Produit supprimé avec succès');
    }
  };

  const handleViewProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.info(`Consultation du produit: ${product.name}`);
      // Here you could open a preview modal or navigate to product page
    }
  };

  const handleExportData = () => {
    const data = {
      stats: mockStats,
      products: products,
      orders: orders,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsena-vendor-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Données exportées avec succès !');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mg-MG').format(price) + ' Ar';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actif', className: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' },
      out_of_stock: { label: 'Rupture', className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0' },
      draft: { label: 'Brouillon', className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0' },
      completed: { label: 'Terminé', className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0' },
      processing: { label: 'En cours', className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0' },
      shipped: { label: 'Expédié', className: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
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
              <div className="w-12 h-12 bg-[#2D8A47] rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🏪</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Espace Vendeur</h1>
                <p className="text-gray-600">Gérez votre boutique sur Tsena.mg</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExportData} className="border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button 
                className="bg-[#2D8A47] hover:bg-[#245A35] text-white"
                onClick={() => setIsNewProductModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau produit
              </Button>
            </div>
          </div>
        </div>
        

      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Produits</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Commandes</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-[#2D8A47] to-[#4CAF50] text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-100">Chiffre d'affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatPrice(mockStats.totalRevenue)}</div>
                      <div className="text-xs text-green-100 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% ce mois
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#FFA726] to-[#FF9800] text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-100">Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
                      <div className="text-xs text-orange-100 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8% ce mois
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-100">Produits actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockStats.activeProducts}</div>
                      <div className="text-xs text-blue-100 mt-1">3 en rupture</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-100">Nouveaux clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockStats.newCustomers}</div>
                      <div className="text-xs text-purple-100 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15% ce mois
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-[#FFA726] shadow-md">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                  <CardTitle className="flex items-center text-[#FF9800]">
                    <Package className="h-5 w-5 mr-2" />
                    Commandes récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-sm text-[#2D8A47] font-bold">{formatPrice(order.total)}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#2D8A47] shadow-md">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                  <CardTitle className="flex items-center text-[#2D8A47]">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Produits populaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{product.name}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-[#FFA726] font-medium">{product.sales} ventes</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{product.views} vues</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-[#2D8A47]">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mes produits</CardTitle>
                  <Button 
                    className="bg-[#2D8A47] hover:bg-[#245A35]"
                    onClick={() => setIsNewProductModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('Filtres avancés à venir')}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Ventes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.views} vues</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                          <TableCell>{product.stock > 0 ? product.stock : <span className="text-red-500">Rupture</span>}</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell>{product.sales}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewProduct(product.id)}
                                title="Voir le produit"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product.id)}
                                title="Modifier le produit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Supprimer le produit"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Commande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Produits</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.products.map((product, index) => (
                                <div key={index}>{product}</div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-[#2D8A47]">{formatPrice(order.total)}</TableCell>
                          <TableCell>
                            <span className="capitalize text-sm">{order.payment.replace('_', ' ')}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des ventes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                      <p>Graphique des ventes à venir</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition des paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>MVola</span>
                      </div>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Orange Money</span>
                      </div>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Carte bancaire</span>
                      </div>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                        <span>Airtel Money</span>
                      </div>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Product Modal */}
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => {
          setIsNewProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleNewProduct}
      />
    </div>
  );
}