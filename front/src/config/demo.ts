// Configuration du mode démo pour Tsena.mg
export const DEMO_CONFIG = {
  // Force le mode démo - désactive tous les appels API
  FORCE_DEMO_MODE: true,
  
  // Désactive Supabase
  DISABLE_SUPABASE: true,
  
  // Utilisateurs de démonstration
  DEMO_USERS: {
    client: {
      id: 'demo-client-001',
      name: 'Client Démo',
      email: 'client@tsena.mg',
      type: 'client' as const
    },
    vendor: {
      id: 'demo-vendor-001', 
      name: 'Vendeur Démo',
      email: 'vendeur@tsena.mg',
      type: 'vendor' as const
    }
  },
  
  // Message affiché dans l'app
  DEMO_MESSAGE: 'Application en mode démonstration - Toutes les données sont simulées'
};

// Helper pour vérifier si on est en mode démo
export const isDemoMode = () => DEMO_CONFIG.FORCE_DEMO_MODE;

// Helper pour obtenir un utilisateur démo
export const getDemoUser = (type: 'client' | 'vendor') => ({
  ...DEMO_CONFIG.DEMO_USERS[type],
  accessToken: 'demo-token'
});