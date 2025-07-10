import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  X,
  Save
} from 'lucide-react'
import departmentService from '@services/departmentService'
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentStats
} from '@services/departmentService'
import { useAuthStore } from '@store/authStore'

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [stats, setStats] = useState<DepartmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreateDepartmentInput>({
    name: '',
    code: '',
    description: '',
    budget: 0,
    budget_period: 'yearly'
  })

  const { isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    loadDepartments()
    loadStats()
  }, [searchTerm, filterActive])

  const loadDepartments = async () => {
    try {
      setLoading(true)

      const filters: { active?: boolean; search?: string } = {}
      if (filterActive !== undefined) filters.active = filterActive
      if (searchTerm.trim()) filters.search = searchTerm.trim()

      const data = await departmentService.getAll(filters)
      setDepartments(data)
    } catch (error) {
      console.error('Failed to load departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await departmentService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      budget: 0,
      budget_period: 'yearly'
    })
  }

  const handleCreate = async () => {
    try {
      await departmentService.create(formData)
      setShowCreateModal(false)
      resetForm()
      loadDepartments()
      loadStats()
      alert('Department created successfully!')
    } catch (error) {
      console.error('Failed to create department:', error)
      alert('Failed to create department. Please try again.')
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || '',
      budget: department.budget,
      budget_period: department.budget_period
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editingDepartment) return

    try {
      const updateData: UpdateDepartmentInput = { ...formData }
      await departmentService.update(editingDepartment.id, updateData)
      setShowEditModal(false)
      setEditingDepartment(null)
      resetForm()
      loadDepartments()
      loadStats()
      alert('Department updated successfully!')
    } catch (error) {
      console.error('Failed to update department:', error)
      alert('Failed to update department. Please try again.')
    }
  }

  const handleToggleStatus = async (department: Department) => {
    try {
      await departmentService.toggleStatus(department.id)
      loadDepartments()
      loadStats()
      alert(`Department ${department.is_active ? 'deactivated' : 'activated'} successfully!`)
    } catch (error) {
      console.error('Failed to toggle department status:', error)
      alert('Failed to toggle department status. Please try again.')
    }
  }

  const handleDelete = async (department: Department) => {
    if (!confirm(`Are you sure you want to delete "${department.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await departmentService.delete(department.id)
      loadDepartments()
      loadStats()
      alert('Department deleted successfully!')
    } catch (error) {
      console.error('Failed to delete department:', error)
      alert('Failed to delete department. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getBudgetUsagePercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600">Manage your organization departments</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Department
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Departments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalBudget)}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Used</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalBudgetUsed)}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterActive === undefined ? '' : filterActive.toString()}
                onChange={(e) => setFilterActive(e.target.value === '' ? undefined : e.target.value === 'true')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading departments...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No departments found
                    </td>
                  </tr>
                ) : (
                  departments.map((department) => {
                    const usagePercentage = getBudgetUsagePercentage(department.budget_used, department.budget)
                    return (
                      <tr key={department.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{department.name}</div>
                            {department.description && (
                              <div className="text-sm text-gray-500">{department.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {department.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(department.budget)}</div>
                          <div className="text-sm text-gray-500">{department.budget_period}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  {formatCurrency(department.budget_used)}
                                </span>
                                <span className="text-sm text-gray-500">{usagePercentage}%</span>
                              </div>
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    usagePercentage > 90 ? 'bg-red-500' :
                                    usagePercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            department.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {department.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(department)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(department)}
                              className={`${department.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                              title={department.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {department.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(department)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Department</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Department name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Department code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Department description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Budget amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Period</label>
                <select
                  name="budget_period"
                  value={formData.budget_period}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingDepartment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Department</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingDepartment(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Department name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Department code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Department description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Budget amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Period</label>
                <select
                  name="budget_period"
                  value={formData.budget_period}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingDepartment(null)
                  resetForm()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepartmentsPage