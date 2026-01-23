import axios from 'axios';

// Base API URL - adjust this to match your Django server
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Add this at the very top to handle the types
export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  name: string;
  email: string;
  role: string;
  role_name: string;
  department: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // const response = await api.post('/auth/login/', { email, password });
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, { email, password });
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/auth/logout/', { refresh: refreshToken });
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    // const response = await api.post('/auth/refresh/', { refresh });
    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh });
    return response.data;
  },
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  createUser: async (userData: {
    email: string;
    name: string;
    password: string;
    role: number;
    department: string;
    is_active?: boolean;
  }) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: any) => {
    const response = await api.patch(`/users/${id}/`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },
};

// Role API
export const roleAPI = {
  getAllRoles: async () => {
    const response = await api.get('/roles/');
    return response.data;
  },
};

export default api;