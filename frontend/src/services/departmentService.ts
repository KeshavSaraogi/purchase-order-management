import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

// Type declarations
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

// API methods
const getAll = async (filters: { active?: boolean; search?: string }) => {
  const params = new URLSearchParams()
  if (filters.active !== undefined) params.append('active', filters.active.toString())
  if (filters.search) params.append('search', filters.search)

  const res = await axios.get(`${API_BASE}/departments?${params.toString()}`, getAuthHeader())
  return res.data.data
}

const getStats = async (): Promise<DepartmentStats> => {
  const res = await axios.get(`${API_BASE}/departments/stats`, getAuthHeader())
  return res.data.data
}

const create = async (input: CreateDepartmentInput): Promise<Department> => {
  const res = await axios.post(`${API_BASE}/departments`, input, getAuthHeader())
  return res.data.data
}

const update = async (id: string, input: UpdateDepartmentInput): Promise<Department> => {
  const res = await axios.put(`${API_BASE}/departments/${id}`, input, getAuthHeader())
  return res.data.data
}

const toggleStatus = async (id: string): Promise<Department> => {
  const res = await axios.patch(
    `${API_BASE}/departments/${id}/status`,
    {},
    getAuthHeader()
  )
  return res.data.data
}

const remove = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/departments/${id}`, getAuthHeader())
}

export default {
  getAll,
  getStats,
  create,
  update,
  toggleStatus,
  delete: remove
}
