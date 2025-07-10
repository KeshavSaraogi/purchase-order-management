import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: `${API_BASE}/api/departments`
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔑 Injected token:', token);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Department {
  id: string
  name: string
  code: string
  description: string | null
  budget: number
  budget_used: number
  budget_period: 'monthly' | 'quarterly' | 'yearly'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateDepartmentInput {
  name: string
  code: string
  description?: string
  budget: number
  budget_period: 'monthly' | 'quarterly' | 'yearly'
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  is_active?: boolean
}

export interface DepartmentStats {
  total: number
  active: number
  totalBudget: number
  totalBudgetUsed: number
}

const getAll = async (filters?: { active?: boolean; search?: string }): Promise<Department[]> => {
  const params = new URLSearchParams()
  if (filters?.active !== undefined) params.append('active', filters.active.toString())
  if (filters?.search) params.append('search', filters.search)

  const res = await api.get(`?${params.toString()}`)
  return res.data.data
}

const getStats = async (): Promise<DepartmentStats> => {
  const res = await api.get('/stats')
  return res.data.data
}

const create = async (input: CreateDepartmentInput): Promise<Department> => {
  const res = await api.post('', input)
  return res.data.data
}

const update = async (id: string, input: UpdateDepartmentInput): Promise<Department> => {
  const res = await api.put(`/${id}`, input)
  return res.data.data
}

const toggleStatus = async (id: string): Promise<Department> => {
  const res = await api.patch(`/${id}/status`)
  return res.data.data
}

const remove = async (id: string): Promise<void> => {
  await api.delete(`/${id}`)
}

export default {
  getAll,
  getStats,
  create,
  update,
  toggleStatus,
  delete: remove
}
