// ============================================================================
// Unified API & Services Hub with Mock/Real Toggle (src/services/api.js)
// ============================================================================

import { mockDatabase } from '../data/mockData';

const USE_MOCK_DATA = true;

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
// Authentication Services (Mock vs Real)
// ============================================================================
export const authService = {
  async login(credentials) {
    if (USE_MOCK_DATA) {
      // محاكاة تسجيل الدخول من البيانات الوهمية
      const identifier = credentials.identifier || credentials.username;
      const user = mockDatabase.users.find(u => u.username === identifier || u.email === identifier);
      
      if (!user) {
        throw new Error('Invalid credentials (Mock)');
      }

      const primaryRole = user.roles[0]?.name || 'ROLE_USER';
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: primaryRole,
        token: 'mock-jwt-token-xyz-123',
        message: 'Success (Mock)'
      };
    }
    
    return apiClient.post('http://localhost:8080/api/v1/auth/login', credentials);
  },

  async register(userData) {
    if (USE_MOCK_DATA) {
      const exists = mockDatabase.users.some(u => u.username === userData.username || u.email === userData.email);
      if (exists) {
        throw new Error('Username or email already taken (Mock)');
      }

      const newUser = {
        id: mockDatabase.users.length + 1,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber || '+962790000000',
        isActive: true,
        roles: [{ id: 1, name: 'ROLE_USER', description: 'Standard member' }]
      };
      mockDatabase.users.push(newUser);

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: 'ROLE_USER',
        token: 'mock-jwt-token-new',
        message: 'Registration Successful (Mock)'
      };
    }

    return apiClient.post('http://localhost:8080/api/v1/auth/register', userData);
  }
};

// ============================================================================
// User Management Services (Mock vs Real)
// ============================================================================
export const userService = {
  async getUsers() {
    if (USE_MOCK_DATA) {
      return mockDatabase.users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.roles[0]?.name || 'ROLE_USER'
      }));
    }

    const result = await apiClient.get('http://localhost:8080/api/v1/users');
    return result.data || result;
  },

  async updateRole(userId, newRoleId) {
    if (USE_MOCK_DATA) {
      const user = mockDatabase.users.find(u => u.id === Number(userId));
      const roleObj = mockDatabase.roles.find(r => r.id === Number(newRoleId));
      
      if (user && roleObj) {
        user.roles = [roleObj];
        return { success: true, message: 'Role updated successfully (Mock)' };
      }
      throw new Error('User or Role not found (Mock)');
    }

    const result = await apiClient.put('http://localhost:8080/api/v1/users/role', { userId, newRoleId });
    return result.data || result;
  }
};

// ============================================================================
// Booking Services (Mock vs Real)
// ============================================================================
export const bookingService = {
  async getBookings() {
    if (USE_MOCK_DATA) {
      return mockDatabase.bookings;
    }

    const result = await apiClient.get('http://localhost:8080/api/v1/bookings');
    return result.data || result;
  },

  async createBooking(bookingData) {
    if (USE_MOCK_DATA) {
      const newBooking = {
        id: mockDatabase.bookings.length + 1,
        ...bookingData,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      };
      mockDatabase.bookings.push(newBooking);
      return newBooking;
    }

    const result = await apiClient.post('http://localhost:8080/api/v1/bookings', bookingData);
    return result.data || result;
  }
};