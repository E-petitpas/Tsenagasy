import React, { useState, useEffect } from 'react';
import { Users, Package, Star, BarChart3, Settings, LogOut, Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import AddUserModal from '../components/addUserModal';
import { UserData } from '../config/authStorage';
import { API_BASE_URL } from '../config/api';
import { StatusBadge } from "../components/StatusBadge";
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import '../styles/AdminDashboard.css';

type TabType = 'overview' | 'accounts' | 'products' | 'sponsors' | 'analytics' | 'settings';

type AdminDashboardProps = {
  currentUser: UserData;
  onLogout: () => void;
};

export default function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'en_attente' | 'refuse'>('en_attente');
  const [adhesionRequests, setAdhesionRequests] = useState<any[]>([]);
  const [showRejected, setShowRejected] = useState(false);

  // Données de démonstration
  const stats = {
    totalUsers: 1247,
    totalVendors: 89,
    totalProducts: 456,
    totalSponsors: 12,
    revenue: 45600000,
    activeOrders: 34
  };

  const recentAccounts = [
    { id: 1, name: 'Rakoto Jean', email: 'rakoto@email.mg', role: 'client', status: 'active', joinDate: '2024-10-15' },
    { id: 2, name: 'Rabe Marie', email: 'rabe@email.mg', role: 'vendor', status: 'active', joinDate: '2024-10-14' },
    { id: 3, name: 'Andrianina Paul', email: 'paul@email.mg', role: 'client', status: 'pending', joinDate: '2024-10-13' },
  ];

  const recentProducts = [
    { id: 1, name: 'Panier artisanal', vendor: 'Rakoto Artisanat', price: 25000, stock: 15, status: 'active' },
    { id: 2, name: 'Vanille de Madagascar', vendor: 'Épices du Sud', price: 45000, stock: 8, status: 'active' },
    { id: 3, name: 'Lamba traditionnel', vendor: 'Tissus Malgaches', price: 85000, stock: 3, status: 'low_stock' },
  ];

  const sponsors = [
    { id: 1, company: 'Telma Madagascar', plan: 'Premium', budget: 5000000, status: 'active', endDate: '2025-03-15' },
    { id: 2, company: 'Jirama', plan: 'Standard', budget: 2000000, status: 'active', endDate: '2025-01-20' },
    { id: 3, company: 'Air Madagascar', plan: 'Premium', budget: 4500000, status: 'pending', endDate: '2025-06-30' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  useEffect(() => {
    fetchAdhesionRequests();
    fetchAccounts();
    const savedTab = sessionStorage.getItem('activeTab') as TabType | null;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  const fetchAdhesionRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getAdhesion/vendor`);
      setAdhesionRequests(res.data.demandes);
    } catch (error) {
      console.error("Erreur récupération demandes :", error);
    }
  };

  const handleDeleteRejected = async (idMagasin: string, nomMagasin: string) => {

    await Swal.fire({
      title: `Confirmation de suppression`,
      text: `Souhaitez-vous supprimer dénitivement le magasin "${nomMagasin}" ?`,
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
          await axios.delete(`${API_BASE_URL}/deleteAdhesion/${idMagasin}`);
          await fetchAdhesionRequests(); // mise à jour du tableau
          return true;
        } catch (error) {
          console.error("Erreur suppression :", error);
          Swal.showValidationMessage(`Erreur lors de la suppression`);
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Magasin supprimé avec succès !");
      }
    });
  };


  const fetchAccounts = async () => {
    try {
      const adminId = currentUser.id;
      const res = await axios.get(`${API_BASE_URL}/getAllUser/${adminId}`);
      const users = res.data.users.map((u: any) => ({
        id: u.id,
        name: u.nom,                
        email: u.email,
        role: u.role,
        statut: u.statut || 'en_attente', 
        activityStatus: u.activityStatus || 'inactif',              
        joinDate: new Date(u.createdAt).toLocaleDateString(),
      }));
      setAccounts(users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdhesionDecision = async (idMagasin: string, decision: 'approuve' | 'refuse') => {
    try {
      console.log('ato')
      await axios.put(`${API_BASE_URL}/adhesionDecision/${idMagasin}`, { 
        statut: decision 
      });

      await fetchAdhesionRequests();
      toast.success(`Vendeur ${decision} avec succès !`);
      
      console.log(`Demande ${decision === 'approuve' ? 'approuvée' : 'refusée'} avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la ${decision === 'approuve' ? 'approbation' : 'refus'} :`, error);
      // Gérer l'erreur (afficher un message à l'utilisateur par exemple)
    }
  };

  const handleAccept = async (id: number) => {
  // exemple logique backend
  await axios.put(`${API_BASE_URL}/users/${id}/activate`);
  setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
};

const handleReject = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/users/${id}`);
  setAccounts(prev => prev.filter(a => a.id !== id));
};
const handleRoleChange = async (id: number, role: string) => {
  await axios.put(`${API_BASE_URL}/users/${id}`, { role });
  setAccounts(prev => prev.map(a => a.id === id ? { ...a, role } : a));
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('activeTab'); // 🔥 supprime le tab actif sauvegardé
    onLogout(); // ta logique de déconnexion (redirection, suppression token, etc.)
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border-l-4 border-[#2D8A47]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Utilisateurs totaux</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    <p className="text-[#2D8A47] text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> +12% ce mois
                    </p>
                  </div>
                  <div className="bg-[#2D8A47] bg-opacity-10 p-3 rounded-lg">
                    <Users className="text-[#2D8A47]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-[#FFA726]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Vendeurs actifs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVendors}</p>
                    <p className="text-[#FFA726] text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> +8% ce mois
                    </p>
                  </div>
                  <div className="bg-[#FFA726] bg-opacity-10 p-3 rounded-lg">
                    <Users className="text-[#FFA726]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-[#FFD700]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Produits</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                    <p className="text-[#FFD700] text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> +23% ce mois
                    </p>
                  </div>
                  <div className="bg-[#FFD700] bg-opacity-10 p-3 rounded-lg">
                    <Package className="text-[#FFD700]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-[#2D8A47]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">Revenu mensuel</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{(stats.revenue / 1000000).toFixed(1)}M Ar</p>
                    <p className="text-[#2D8A47] text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> +15% ce mois
                    </p>
                  </div>
                  <div className="bg-[#2D8A47] bg-opacity-10 p-3 rounded-lg">
                    <BarChart3 className="text-[#2D8A47]" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Comptes récents</h3>
                <div className="space-y-3">
                  {recentAccounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2D8A47] bg-opacity-10 flex items-center justify-center">
                          <Users className="text-[#2D8A47]" size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <p className="text-sm text-gray-500">{account.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        account.status === 'active' ? 'bg-[#2D8A47] bg-opacity-10 text-[#2D8A47]' : 'bg-[#FFA726] bg-opacity-10 text-[#FFA726]'
                      }`}>
                        {account.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produits récents</h3>
                <div className="space-y-3">
                  {recentProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFD700] bg-opacity-20 flex items-center justify-center">
                          <Package className="text-[#FFD700]" size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.price.toLocaleString()} Ar</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-[#2D8A47] bg-opacity-10 text-[#2D8A47]' : 'bg-red-100 text-red-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6">
            {/* SECTION 1 : DEMANDES  */}
            <div className="section-card">
              <h3 className="text-xl font-bold mb-4">Demandes d'adhésion des vendeurs</h3>

              <div className="mb-4 flex justify-end gap-2">
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${filterStatus === 'en_attente' ? 'bg-[#FFA726] text-white hover:bg-[#FFB74D]' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setFilterStatus('en_attente')}
                >
                  En attente
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${filterStatus === 'refuse' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setFilterStatus('refuse')}
                >
                  Refusées
                </button>
              </div>

              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Magasin</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Propriétaire</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Rôle</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Adresse</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Contact</th>
                      <th className="px-4 py-2 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(() => {
                      const filtered = adhesionRequests.filter(r =>
                        filterStatus === 'en_attente'
                          ? r.statut === 'en_attente'
                          : r.statut === 'refuse'
                      );

                      if (filtered.length === 0) {
                        return (
                          <tr className="bg-gray-50">
                            <td colSpan={8} className="text-center py-3 text-gray-600 text-sm">
                              {filterStatus === 'en_attente'
                                ? "Aucune demande d'adhésion en attente."
                                : "Aucune demande refusée."}
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map(request => (
                        <tr key={request.idMagasin} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{request.nomMagasin}</td>
                          <td className="px-4 py-2">{request.type}</td>
                          <td className="px-4 py-2">{request.proprietaire.nom}</td>
                          <td className="px-4 py-2">{request.proprietaire.email}</td>
                          <td className="px-4 py-2">{request.proprietaire.role}</td>
                          <td className="px-4 py-2">{request.proprietaire.adresse}</td>
                          <td className="px-4 py-2">{request.proprietaire.tel}</td>
                          <td className="px-4 py-2 text-center">
                            {filterStatus === 'en_attente' ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleAdhesionDecision(request.idMagasin, 'approuve')}
                                  className="bg-[#2D8A47] text-white px-3 py-1 rounded hover:bg-[#245A35] text-sm"
                                >
                                  Accepter
                                </button>
                                <button
                                  onClick={() => handleAdhesionDecision(request.idMagasin, 'refuse')}
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                  Refuser
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleAdhesionDecision(request.idMagasin, 'approuve')}
                                  className="bg-[#2D8A47] text-white px-3 py-1 rounded hover:bg-[#245A35] text-sm"
                                >
                                  Réapprouver
                                </button>
                                <button
                                  onClick={() => handleDeleteRejected(request.idMagasin, request.nomMagasin)}
                                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* SECTION 2 : GESTION GÉNÉRALE  */}
            <div className="section-card">
              <h3 className="text-xl font-bold mb-4">Gestion des comptes</h3>
              <div className="mb-4 flex items-center gap-3">
                {/* Barre de recherche */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}  />
                  <input
                    type="text"
                    placeholder="Rechercher un compte..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D8A47]"
                  />
                </div>
                <button
                  className="bg-[#2D8A47] text-white px-4 py-2 rounded-lg hover:bg-[#245A35] flex items-center gap-2"
                  onClick={() => setIsAddUserModalOpen(true)}
                >
                  <Plus size={18} /> Ajouter un compte
                </button>
              </div>

              {/* Tableau général */}
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rôle</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Activité</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date d'inscription</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accounts
                      .filter(account =>
                        (account?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                        (account?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                      )
                      .map(account => (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{account.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{account.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                            <select
                              value={account.role}
                              onChange={(e) => handleRoleChange(account.id, e.target.value)}
                              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8A47]"
                            >
                              <option value="client">Client</option>
                              <option value="vendor">Vendeur</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={account.statut} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={account.activityStatus} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{account.joinDate}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {account.status === 'pending' && (
                                <button
                                  onClick={() => handleAccept(account.id)}
                                  className="bg-[#2D8A47] text-white px-3 py-1 rounded hover:bg-[#245A35] transition-colors text-sm"
                                >
                                  Accepter
                                </button>
                              )}
                              <button
                                onClick={() => handleReject(account.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Modal d’ajout utilisateur */}
              {isAddUserModalOpen && (
                <AddUserModal
                  isOpen={isAddUserModalOpen}
                  onClose={() => setIsAddUserModalOpen(false)}
                  role="client"
                  onUserAdded={(newUser) => {
                    // Ajouter le nouvel utilisateur à la liste existante
                    setAccounts(prev => [newUser, ...prev]);
                  }}
                />
              )}
            </div>
          </div>    
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Gestion des produits</h3>
                <button className="bg-[#2D8A47] text-white px-4 py-2 rounded-lg hover:bg-[#245A35] transition-colors flex items-center gap-2">
                  <Plus size={18} /> Nouveau produit
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D8A47]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produit</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendeur</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prix</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.vendor}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{product.price.toLocaleString()} Ar</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.stock > 10 ? 'bg-[#2D8A47] bg-opacity-10 text-[#2D8A47]' : 'bg-red-100 text-red-600'
                          }`}>
                            {product.stock} unités
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-medium bg-[#2D8A47] bg-opacity-10 text-[#2D8A47]">
                            <CheckCircle size={12} /> Actif
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-[#2D8A47] hover:bg-[#2D8A47] hover:bg-opacity-10 p-2 rounded">
                              <Eye size={16} />
                            </button>
                            <button className="text-[#FFA726] hover:bg-[#FFA726] hover:bg-opacity-10 p-2 rounded">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-500 hover:bg-red-50 p-2 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'sponsors':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Gestion des sponsors</h3>
                <button className="bg-[#2D8A47] text-white px-4 py-2 rounded-lg hover:bg-[#245A35] transition-colors flex items-center gap-2">
                  <Plus size={18} /> Nouveau sponsor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2D8A47] text-white rounded-lg p-6">
                  <p className="text-sm opacity-90">Sponsors actifs</p>
                  <p className="text-3xl font-bold mt-2">{sponsors.filter(s => s.status === 'active').length}</p>
                </div>
                <div className="bg-[#FFA726] text-white rounded-lg p-6">
                  <p className="text-sm opacity-90">Budget total</p>
                  <p className="text-3xl font-bold mt-2">{(sponsors.reduce((sum, s) => sum + s.budget, 0) / 1000000).toFixed(1)}M Ar</p>
                </div>
                <div className="bg-[#FFD700] text-white rounded-lg p-6">
                  <p className="text-sm opacity-90">En attente</p>
                  <p className="text-3xl font-bold mt-2">{sponsors.filter(s => s.status === 'pending').length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Entreprise</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plan</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Budget</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date de fin</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sponsors.map(sponsor => (
                      <tr key={sponsor.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{sponsor.company}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sponsor.plan === 'Premium' ? 'bg-[#FFD700] bg-opacity-20 text-[#FFA726]' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {sponsor.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{(sponsor.budget / 1000000).toFixed(1)}M Ar</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-medium ${
                            sponsor.status === 'active' ? 'bg-[#2D8A47] bg-opacity-10 text-[#2D8A47]' : 'bg-[#FFA726] bg-opacity-10 text-[#FFA726]'
                          }`}>
                            {sponsor.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {sponsor.status === 'active' ? 'Actif' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{sponsor.endDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-[#2D8A47] hover:bg-[#2D8A47] hover:bg-opacity-10 p-2 rounded">
                              <Eye size={16} />
                            </button>
                            <button className="text-[#FFA726] hover:bg-[#FFA726] hover:bg-opacity-10 p-2 rounded">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-500 hover:bg-red-50 p-2 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Analytiques et rapports</h3>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto text-gray-300" size={64} />
                <p className="text-gray-500 mt-4">Graphiques et statistiques à venir</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Paramètres administrateur</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Paramètres généraux</h4>
                  <p className="text-gray-600 text-sm">Configuration de la plateforme</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Sécurité</h4>
                  <p className="text-gray-600 text-sm">Gestion des accès et permissions</p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Notifications</h4>
                  <p className="text-gray-600 text-sm">Configuration des alertes système</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar verticale */}
      <aside className="sidebar">
        {/* Header du sidebar */}
        <div className="sidebar-header">
          <h1 className="text-xl font-bold flex items-center gap-2">
            🏛️ Admin Dashboard
          </h1>
          <p className="text-xs text-white text-opacity-75 mt-1">Tsena.mg</p>
        </div>

        {/* Navigation verticale */}
        <nav className="flex-1 py-4">
          <div className="sidebar-nav">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 size={20} /> },
              { id: 'accounts', label: 'Comptes', icon: <Users size={20} /> },
              { id: 'products', label: 'Produits', icon: <Package size={20} /> },
              { id: 'sponsors', label: 'Sponsors', icon: <Star size={20} /> },
              { id: 'analytics', label: 'Analytiques', icon: <TrendingUp size={20} /> },
              { id: 'settings', label: 'Paramètres', icon: <Settings size={20} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bouton déconnexion en bas */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-[#1F4F25] transition-all"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header supérieur */}
        <header className="header-horizontal">
        <div className="header-content">
          <div className="header-left">
            <h2>
              {activeTab === 'overview' && "Vue d'ensemble"}
              {activeTab === 'accounts' && "Gestion des comptes"}
              {activeTab === 'products' && "Gestion des produits"}
              {activeTab === 'sponsors' && "Gestion des sponsors"}
              {activeTab === 'analytics' && "Analytiques et rapports"}
              {activeTab === 'settings' && "Paramètres"}
            </h2>
            <p>Plateforme d'administration Tsena.mg</p>
          </div>
          <div className="header-right">
            <p>{formatDate(currentDate)}</p>
            <p>Antananarivo, Madagascar</p>
          </div>
        </div>
      </header>

        {/* Zone de contenu */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}