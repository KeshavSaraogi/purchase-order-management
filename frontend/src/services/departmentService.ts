import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | undefined;
  manager_id: string;
  budget: number;
  budget_used: number;
  budget_period: 'monthly' | 'quarterly' | 'yearly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  description?: string | undefined;
  manager_id: string;
  budget: number;
  budget_period: 'monthly' | 'quarterly' | 'yearly';
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  description?: string | undefined;
  manager_id?: string;
  budget?: number;
  budget_used?: number;
  budget_period?: 'monthly' | 'quarterly' | 'yearly';
  is_active?: boolean;
}

export interface BudgetStatus {
  budget: number;
  used: number;
  remaining: number;
  percentage: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const departmentService = {
  async getAll(): Promise<Department[]> {
    try {
      const response = await api.get<ApiResponse<Department[]>>('departments');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Department | null> {
    try {
      const response = await api.get<ApiResponse<Department>>(`departments/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch department ${id}:`, error);
      return null;
    }
  },

  async getBudgetStatus(id: string): Promise<BudgetStatus | null> {
    try {
      const response = await api.get<ApiResponse<BudgetStatus>>(`/departments/${id}/budget-status`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch budget status for department ${id}:`, error);
      return null;
    }
  },

  async create(departmentData: CreateDepartmentInput): Promise<Department | null> {
    try {
      const response = await api.post<ApiResponse<Department>>('departments', departmentData);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create department:', error);
      throw error;
    }
  },

  async update(id: string, updateData: UpdateDepartmentInput): Promise<Department | null> {
    try {
      const response = await api.put<ApiResponse<Department>>(`departments/${id}`, updateData);
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to update department ${id}:`, error);
      throw error;
    }
  },

  async updateBudgetUsed(id: string, amount: number): Promise<boolean> {
    try {
      await api.put(`/departments/${id}/budget-used`, { amount });
      return true;
    } catch (error) {
      console.error(`Failed to update budget used for department ${id}:`, error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`departments/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete department ${id}:`, error);
      return false;
    }
  },
};

export const {
  getAll: getAllDepartments,
  getById: getDepartmentById,
  getBudgetStatus: getDepartmentBudgetStatus,
  create: createDepartment,
  update: updateDepartment,
  updateBudgetUsed: updateDepartmentBudgetUsed,
  delete: deleteDepartment,
} = departmentService;