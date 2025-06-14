import { api } from './api';
import type { User } from '../types/index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/login', credentials);
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const payload = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      role: userData.role,
      password: userData.password
    };

    const response = await api.post('/api/register', payload);
    return response.data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  }
}
