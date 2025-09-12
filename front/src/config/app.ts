// Configuration de l'application Tsena.mg
export const appConfig = {
  // Mode de démonstration activé - pas d'appels API réels
  isDemoMode: true,
  
  // URL de base pour les API (non utilisé en mode démo)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Configuration Supabase (non utilisé en mode démo)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },
  
  // Configuration des paiements mobiles (simulation en mode démo)
  paymentMethods: {
    mvola: {
      enabled: true,
      apiKey: process.env.MVOLA_API_KEY || 'demo-key'
    },
    orangeMoney: {
      enabled: true,
      apiKey: process.env.ORANGE_MONEY_API_KEY || 'demo-key'
    },
    airtelMoney: {
      enabled: true,
      apiKey: process.env.AIRTEL_MONEY_API_KEY || 'demo-key'
    }
  },
  
  // Utilisateurs de démonstration
  demoUsers: {
    client: {
      name: 'Client Démo',
      email: 'client@tsena.mg',
      type: 'client' as const,
      id: 'demo-client-001'
    },
    vendor: {
      name: 'Vendeur Démo',
      email: 'vendeur@tsena.mg',
      type: 'vendor' as const,
      id: 'demo-vendor-001'
    }
  }
};

// Helper pour vérifier si on est en mode démo
export const isDemoMode = () => appConfig.isDemoMode;

// Helper pour obtenir un utilisateur démo
export const getDemoUser = (type: 'client' | 'vendor') => {
  return {
    ...appConfig.demoUsers[type],
    accessToken: 'demo-token'
  };
};