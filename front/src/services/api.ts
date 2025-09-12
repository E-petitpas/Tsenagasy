// Désactivé pour le mode démo - pas d'appels API réels
const BASE_URL = '';

class ApiService {
  private getHeaders(accessToken?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || 'demo-token'}`
    };
    return headers;
  }

  private async request(endpoint: string, options: RequestInit = {}, accessToken?: string) {
    // Mode démo - toutes les requêtes retournent des données simulées
    console.log(`Demo mode: API call to ${endpoint} intercepted`);
    
    // Simule une réponse basée sur l'endpoint
    if (endpoint.includes('/auth/signup') || endpoint.includes('/auth/signin')) {
      return {
        user: { id: 'demo-user', email: 'demo@tsena.mg' },
        session: { access_token: 'demo-token' },
        profile: { name: 'Utilisateur Démo', user_type: 'client' }
      };
    }
    
    if (endpoint.includes('/products')) {
      return { products: [] };
    }
    
    if (endpoint.includes('/orders')) {
      return { orders: [] };
    }
    
    if (endpoint.includes('/vendor/stats')) {
      return { 
        stats: {
          totalRevenue: 1250000,
          totalOrders: 89,
          activeProducts: 23,
          newCustomers: 45
        }
      };
    }
    
    return { message: 'Demo mode response' };
  }

  // Auth methods
  async signup(userData: {
    email: string;
    password: string;
    name: string;
    userType: 'client' | 'vendor';
    phone?: string;
    location?: string;
    businessName?: string;
    businessType?: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async signin(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Product methods
  async getProducts(filters?: {
    category?: string;
    search?: string;
    vendorId?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.vendorId) params.append('vendor_id', filters.vendorId);
    
    const queryString = params.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any, accessToken: string) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }, accessToken);
  }

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    payment_method: string;
    shipping_address: any;
  }, accessToken: string) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, accessToken);
  }

  async getOrders(userType: 'client' | 'vendor', accessToken: string) {
    return this.request(`/orders?user_type=${userType}`, {
      method: 'GET'
    }, accessToken);
  }

  // Review methods
  async createReview(reviewData: {
    product_id: string;
    rating: number;
    comment: string;
  }, accessToken: string) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    }, accessToken);
  }

  // Vendor stats
  async getVendorStats(accessToken: string) {
    return this.request('/vendor/stats', {
      method: 'GET'
    }, accessToken);
  }

  // Initialize sample data
  async initSampleData() {
    return this.request('/init-sample-data', {
      method: 'POST'
    });
  }
}

export const apiService = new ApiService();