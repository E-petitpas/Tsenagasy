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
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { NewProductModal } from '../components/NewProductModal';
import { ModifyProductModal } from '../components/modifyProductModal';
import { ViewProductModal } from "../components/viewProductModal";
import { NewLocationModal } from '../components/NewLocationModal';
import { StatusBadge } from "../components/StatusBadge";
import { toast } from 'sonner';
import { UserData } from '../config/authStorage';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import Swal from 'sweetalert2';

interface VendorDashboardProps {
  currentUser: UserData & { type: "vendor" };
  onLogout: () => void;
}

const mockStats = {
  totalRevenue: 1250000,
  totalOrders: 89,
  activeProducts: 23,
  newCustomers: 45
};

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

export default function VendorDashboard({ currentUser, onLogout }: VendorDashboardProps){
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('vendorActiveTab') || 'overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(mockStats);
  const [orders, setOrders] = useState(mockOrders);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isModifyProductModalOpen, setModifyProductModalOpen] = useState(false);
  const [isNewLocationModalOpen, setIsNewLocationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string, nom: string }[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  const [viewedProduct, setViewedProduct] = useState<any>(null);
  

  useEffect(() => {
    if (selectedProduct) {
      setModifyProductModalOpen(true);
    }
  }, [selectedProduct]);
  
  useEffect(() => {
    fetchProducts();
  }, [currentUser]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getCategories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur récupération catégories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // lancer la recherche
  useEffect(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.nom.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (Number(term) === p.price) ||
        (Number(term) === p.stock)
      );
      setFilteredProducts(filtered);
    }
  }, [debouncedSearchTerm, products]);

  // Changement d'onglet
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    sessionStorage.setItem('vendorActiveTab', tab);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getProductbyMerchand/${currentUser.magasinId}`);

      const produits = response.data.produits || response.data || []; 

      if (produits.length === 0) {
        toast.info("Vous n'avez pas encore ajouté de produit!");
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

    const formatted = produits.map((p: any) => ({
        ...p,
        nom: p.name,
        image: p.images?.[0] || '',
        views: p.views || 0,
        price: Number(p.price),
        status: p.status,
        createdAt: p.createdAt
      })).sort(
        (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setProducts(formatted);
      setFilteredProducts(formatted);
      console.log(formatted)
    } catch (error) {
      console.error('Erreur Axios:', error);
      toast.error('Impossible de récupérer les produits');
    }
  };

  const handleNewProduct = async (newProduct: any) => {
    await fetchProducts();
    setIsNewProductModalOpen(false);
  };
    
  const handleEditProduct = (productId: string) => {
      const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    await Swal.fire({
      title: `Confirmation de suppression ?`,
      text: `Souhaitez-vous supprimer le produit "${product.nom}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/deleteProduct/${productId}`, {
            data: { imageUrl: product.image }
          });

          // MAJ du tableau
          await fetchProducts();

          return true; // ferme ensuite le Swal
        } catch (error) {
          console.error('Erreur suppression produit:', error);
          Swal.showValidationMessage(`Erreur lors de la suppression`);
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(' Produit supprimé avec succès');
      }
    });
  };

  const handleViewProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setViewedProduct(product);
      setIsViewProductModalOpen(true);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mg-MG').format(price) + ' Ar';
  };

  const handleSearchProducts = async (filters: { status?: string, categoryId?: string, isLocation?: boolean, query?: string }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/productbyMerchand/search/${currentUser.id}`,
        filters
      );

      const produits = response.data || [];

      const formatted = produits.map((p: any) => ({
        ...p,
        nom: p.name,
        image: p.images?.[0] || '',
        sales: p.sales || 0,
        views: p.views || 0,
        price: Number(p.price),
        status: p.status,
        createdAt: p.createdAt,
        typeProduit: p.typeProduit,
        locationDetails: p.locationDetails || null
      }));

      setFilteredProducts(formatted);
    } catch (error) {
      console.error('Erreur recherche produits:', error);
      toast.error('Impossible de rechercher les produits');
    }
    };
  
  const sections = [
    {
      title: "Type",
      type: "typeProduit",
      options: [
        { label: "Vente", value: "vente" },
        { label: "Location", value: "location" }
      ]
    },
    {
      title: "Statut",
      type: "status",
      options: [
      { label: "Tous", value: "all" },
        { label: "Publié", value: "publie" },
        { label: "Brouillon", value: "brouillon" },
        { label: "En attente", value: "en_attente" }
      ]
    },
    {
      title: "Catégorie",
      type: "categoryId",
      options: categories.map(c => ({ label: c.nom, value: c.id }))
    }
  ];

  const handleApplyFilter = async (type: string, value: any) => {
    try {

      if (type === "status" && value === "all") {
        setFilteredProducts(products);
        setShowFilterDropdown(false);
        return;
      }
      
      const filters: any = {};

      if (type === "status") filters.status = value;
      if (type === "categoryId") filters.categoryId = value;
      if (type === "typeProduit") {
        if (value === "location") filters.isLocation = true;
        if (value === "vente") filters.isLocation = false;
      }

      await handleSearchProducts(filters);

      // Ferme le dropdown
      setShowFilterDropdown(false);
    } catch (error) {
      toast.error("Erreur lors de l'application du filtre");
    }
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
              onClick={() => window.history.back()}
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
              <Button
                variant="destructive"
                onClick={() => {
                  sessionStorage.clear(); 
                  onLogout();             
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
        

      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Produits</TabsTrigger>
            <TabsTrigger value="sponsor" className="data-[state=active]:bg-[#2D8A47] data-[state=active]:text-white">Sponsors</TabsTrigger>
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
                        {<StatusBadge status={order.status} />}
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
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.nom}
                          className="w-12 h-12 object-cover rounded border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{product.nom}</p>
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
                  <CardTitle>Mes produits et services locations</CardTitle>
                  <div className='flex items-center justify-end space-x-3'>
                    <Button 
                      className="bg-[#2D8A47] hover:bg-[#245A35]"
                      onClick={() => setIsNewProductModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un produit
                    </Button>
                    <Button 
                      style={{ backgroundColor: "#2563EB", color: "white", transition: "0.2s" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                      onClick={() => setIsNewLocationModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle location
                    </Button>
                  </div>
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
                      onChange={(e: any) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Bouton Filtres */}
                  <div className="relative inline-block">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilterDropdown(prev => !prev)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>

                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-1 w-auto max-h-[550px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 whitespace-nowrap" style={{ minWidth: "260px" }}>
                        {sections.map((section, index) => {
                          const isOpen = openSections[index] || false;
                          return (
                            <div key={index} className="border-b border-gray-100">
                              <button
                                onClick={() =>
                                  setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
                                }
                                className="w-full px-3 py-2 flex justify-between items-center text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                              >
                                {section.title}
                                <svg
                                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {isOpen && (
                                <div className="px-2 pb-2">
                                  {section.options.map((opt: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleApplyFilter(section.type, opt.value)}
                                      className="block w-full text-left px-3 py-1 text-sm rounded
                                                transition-shadow
                                                hover:bg-gray-500 hover:shadow-lg hover:text-gray-900"
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Détails location</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Statut</TableHead>
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
                                alt={product.nom}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{product.nom}</p>
                                <p className="text-sm text-gray-600">{product.views} vues</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                          <TableCell>{<StatusBadge status={product.typeProduit} />}</TableCell>
                          <TableCell>
                            {product.typeProduit === "location" ? (
                              <div className="text-sm leading-tight text-gray-700">
                                <p className="font-medium">{product.locationDetails?.typePrix || "—"}</p>
                                <p className="font-medium">
                                  Caution : {formatPrice(product.locationDetails?.caution || 0)}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </TableCell>
                          <TableCell>{product.stock > 0 ? product.stock : <span className="text-red-500">Rupture</span>}</TableCell>
                          <TableCell>{<StatusBadge status={product.status} />}</TableCell>
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

          <TabsContent value="sponsor">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mes produits sponsorisés</CardTitle>
                  <Button 
                    className="bg-[#2D8A47] hover:bg-[#245A35]"
                    onClick={() => setIsNewLocationModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle location
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
                      onChange={(e: any) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Bouton Filtres */}
                  <div className="relative inline-block">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilterDropdown(prev => !prev)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>

                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-1 w-auto max-h-[550px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 whitespace-nowrap" style={{ minWidth: "260px" }}>
                        {sections.map((section, index) => {
                          const isOpen = openSections[index] || false;
                          return (
                            <div key={index} className="border-b border-gray-100">
                              <button
                                onClick={() =>
                                  setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
                                }
                                className="w-full px-3 py-2 flex justify-between items-center text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                              >
                                {section.title}
                                <svg
                                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {isOpen && (
                                <div className="px-2 pb-2">
                                  {section.options.map((opt: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleApplyFilter(section.type, opt.value)}
                                      className="block w-full text-left px-3 py-1 text-sm rounded
                                                transition-shadow
                                                hover:bg-gray-500 hover:shadow-lg hover:text-gray-900"
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                        <TableHead>Type</TableHead>
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
                                alt={product.nom}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{product.nom}</p>
                                <p className="text-sm text-gray-600">{product.views} vues</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                          <TableCell>{product.stock > 0 ? product.stock : <span className="text-red-500">Rupture</span>}</TableCell>
                          <TableCell>{<StatusBadge status={product.status} />}</TableCell>
                          <TableCell>{<StatusBadge status={product.typeProduit} />}</TableCell>
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
                          <TableCell>{<StatusBadge status={order.status} />}</TableCell>
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
        categories={categories}
        onSave={handleNewProduct}
      />

      <ModifyProductModal
        isOpen={isModifyProductModalOpen}
        onClose={() => {
          setModifyProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={async (updatedProduct) => {
          await fetchProducts();
          setModifyProductModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
      />

      <ViewProductModal
        isOpen={isViewProductModalOpen}
        onClose={() => setIsViewProductModalOpen(false)}
        product={viewedProduct}
        categories={categories}
      />

      <NewLocationModal
        isOpen={isNewLocationModalOpen}
        onClose={() => {
          setIsNewLocationModalOpen(false);
          setSelectedProduct(null);
        }}
        categories={categories}
        onSave={handleNewProduct}
      />
    </div>
  );
}