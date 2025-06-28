import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocal 
  ? (import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:5001/api')
  : (import.meta.env.VITE_API_BASE_URL || 'https://purchase-order-management-6fb7.onrender.com/api');

console.log('🌍 Environment:', isLocal ? 'Local Development' : 'Production');
console.log('🔗 Using API_BASE_URL:', API_BASE_URL);
console.log('📊 Environment variables:');
console.log('  - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('  - VITE_API_BASE_URL_LOCAL:', import.meta.env.VITE_API_BASE_URL_LOCAL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Data:', error.response?.data);
    console.error('  - URL:', error.config?.url);
    console.error('  - Method:', error.config?.method);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('🔒 Authentication required - user may need to login');
    }
    
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
      console.log('📋 Fetching all departments...');
      const response = await api.get<ApiResponse<Department[]>>('/api/departments'); 
      
      if (response.data.success) {
        console.log(`✅ Retrieved ${response.data.data?.length || 0} departments`);
        return response.data.data || [];
      } else {
        console.error('❌ API returned success: false');
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to fetch departments:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Department | null> {
    try {
      console.log(`📋 Fetching department ${id}...`);
      const response = await api.get<ApiResponse<Department>>(`/api/departments/${id}`);
      
      if (response.data.success) {
        console.log(`✅ Retrieved department: ${response.data.data?.name}`);
        return response.data.data || null;
      } else {
        console.error('❌ API returned success: false');
        return null;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch department ${id}:`, error);
      return null;
    }
  },

  async getBudgetStatus(id: string): Promise<BudgetStatus | null> {
    try {
      console.log(`💰 Fetching budget status for department ${id}...`);
      const response = await api.get<ApiResponse<BudgetStatus>>(`/api/departments/${id}/budget-status`);
      
      if (response.data.success) {
        console.log(`✅ Retrieved budget status`);
        return response.data.data || null;
      } else {
        console.error('❌ API returned success: false');
        return null;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch budget status for department ${id}:`, error);
      return null;
    }
  },

  async create(departmentData: CreateDepartmentInput): Promise<Department | null> {
    try {
      console.log(`➕ Creating department: ${departmentData.name}`);
      const response = await api.post<ApiResponse<Department>>('/api/departments', departmentData);
      
      if (response.data.success) {
        console.log(`✅ Created department: ${response.data.data?.name}`);
        return response.data.data || null;
      } else {
        console.error('❌ API returned success: false');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to create department:', error);
      throw error;
    }
  },

  async update(id: string, updateData: UpdateDepartmentInput): Promise<Department | null> {
    try {
      console.log(`📝 Updating department ${id}`);
      const response = await api.put<ApiResponse<Department>>(`/api/departments/${id}`, updateData);
      
      if (response.data.success) {
        console.log(`✅ Updated department: ${response.data.data?.name}`);
        return response.data.data || null;
      } else {
        console.error('❌ API returned success: false');
        return null;
      }
    } catch (error) {
      console.error(`❌ Failed to update department ${id}:`, error);
      throw error;
    }
  },

  async updateBudgetUsed(id: string, amount: number): Promise<boolean> {
    try {
      console.log(`💰 Updating budget used for department ${id}: ${amount}`);
      await api.put(`/api/departments/${id}/budget-used`, { amount });

      console.log(`✅ Budget updated successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to update budget used for department ${id}:`, error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting department ${id}`);
      await api.delete(`/api/departments/${id}`);
      
      console.log(`✅ Department deleted successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete department ${id}:`, error);
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