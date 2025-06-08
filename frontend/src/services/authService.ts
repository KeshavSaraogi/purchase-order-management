import { api } from './api'
import type { User } from '../types/index'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  employeeId?: string
  role: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/auth/me')
    return response.data
  }
}