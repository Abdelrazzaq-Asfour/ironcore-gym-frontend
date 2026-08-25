// ============================================================================
// Unified API & Services Hub (src/services/api.js)
// ============================================================================

class ApiClient {
  async request(endpoint, options = {}) {
    let token = null;
    try {
      const storedUser = localStorage.getItem('ironcore_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        token = parsed.accessToken || parsed.token || parsed.data?.accessToken || parsed.data?.token;
      }
    } catch (e) {
      // Fail silently if storage is restricted
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(endpoint, config);
      
      // التعامل الآمن مع الاستجابات الفارغة
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return { success: true, data: null };
      }

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || 'An unexpected API error occurred.');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();

// ============================================================================
// Authentication Services
// ============================================================================
export const authService = {
  async login(credentials) {
    return apiClient.post('http://localhost:8080/api/v1/auth/login', credentials);
  },
  async register(userData) {
    return apiClient.post('http://localhost:8080/api/v1/auth/register', userData);
  }
};

// ============================================================================
// User Management Services
// ============================================================================
export const userService = {
  async getUsers() {
    const result = await apiClient.get('http://localhost:8080/api/v1/users');
    return result.data || result;
  },
  async updateRole(userId, newRoleId) {
    const result = await apiClient.put('http://localhost:8080/api/v1/users/role', { userId, newRoleId });
    return result.data || result;
  }
};

// ============================================================================
// Booking Services
// ============================================================================
export const bookingService = {
  async getBookings() {
    const result = await apiClient.get('http://localhost:8080/api/v1/bookings');
    return result.data || result;
  },
  async createBooking(bookingData) {
    const result = await apiClient.post('http://localhost:8080/api/v1/bookings', bookingData);
    return result.data || result;
  }
};