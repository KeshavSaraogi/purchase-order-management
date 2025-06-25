import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, DollarSign, Users, Lock, Eye } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { departmentService } from '../../services/departmentService';
import type { Department, CreateDepartmentInput, UpdateDepartmentInput } from '../../services/departmentService';

const DepartmentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<CreateDepartmentInput>({
    name: '',
    code: '',
    description: '',
    manager_id: '',
    budget: 0,
    budget_period: 'yearly',
  });

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canCreate = isAdmin;
  const canDelete = isAdmin;
  const canView = true;

  const canEditDepartment = (dept: Department): boolean => {
    if (isAdmin) return true;
    if (isManager && dept.manager_id === user?.id) return true;
    return false;
  };

  useEffect(() => {
    if (!canView) return;
    loadDepartments();
  }, [canView]);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to load departments:', error);
      alert('Failed to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      manager_id: '',
      budget: 0,
      budget_period: 'yearly',
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      alert('You do not have permission to create departments.');
      return;
    }

    try {
      await departmentService.create(formData);
      setShowCreateForm(false);
      resetForm();
      loadDepartments();
      alert('Department created successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create department';
      alert(errorMessage);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;

    if (!canEditDepartment(editingDepartment)) {
      alert('You do not have permission to edit this department.');
      return;
    }

    try {
      const updateData: UpdateDepartmentInput = {};
      
      if (formData.name && formData.name !== editingDepartment.name) {
        updateData.name = formData.name;
      }
      
      if (formData.code && formData.code !== editingDepartment.code) {
        updateData.code = formData.code;
      }
      
      if (formData.description !== editingDepartment.description) {
        updateData.description = formData.description || undefined;
      }
      
      if (formData.manager_id && formData.manager_id !== editingDepartment.manager_id) {
        updateData.manager_id = formData.manager_id;
      }
      
      if (formData.budget !== editingDepartment.budget) {
        updateData.budget = formData.budget;
      }
      
      if (formData.budget_period !== editingDepartment.budget_period) {
        updateData.budget_period = formData.budget_period;
      }

      if (Object.keys(updateData).length === 0) {
        alert('No changes detected.');
        return;
      }

      await departmentService.update(editingDepartment.id, updateData);
      setShowEditForm(false);
      setEditingDepartment(null);
      resetForm();
      loadDepartments();
      alert('Department updated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update department';
      alert(errorMessage);
    }
  };

  const handleEdit = (dept: Department) => {
    if (!canEditDepartment(dept)) {
      alert('You do not have permission to edit this department.');
      return;
    }

    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      manager_id: dept.manager_id,
      budget: dept.budget,
      budget_period: dept.budget_period,
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id: string, deptName: string) => {
    if (!canDelete) {
      alert('You do not have permission to delete departments.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${deptName}"? This action cannot be undone.`)) {
      try {
        await departmentService.delete(id);
        loadDepartments();
        alert('Department deleted successfully!');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to delete department';
        alert(errorMessage);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getBudgetPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage > 90) return 'text-red-600 bg-red-100';
    if (percentage > 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (!canView) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="mt-2 text-gray-500">You do not have permission to view departments.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">Loading departments...</div>
        </div>
      </div>
    );
  }

  const DepartmentForm = ({ 
    isEdit = false, 
    onSubmit, 
    onCancel 
  }: { 
    isEdit?: boolean; 
    onSubmit: (e: React.FormEvent) => void; 
    onCancel: () => void; 
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? 'Edit Department' : 'Create New Department'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Information Technology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., IT"
              disabled={isEdit}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Department description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager ID *
            </label>
            <input
              type="text"
              required
              value={formData.manager_id}
              onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Manager User ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              disabled={!isAdmin}
            />
            {!isAdmin && (
              <p className="text-xs text-gray-500 mt-1">Only administrators can modify budgets</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Period *
            </label>
            <select
              required
              value={formData.budget_period}
              onChange={(e) => setFormData({ ...formData, budget_period: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isAdmin}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Update Department' : 'Create Department'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="mr-2 h-6 w-6" />
              Departments
            </h1>
            <p className="text-gray-600">
              Manage organizational departments and budgets
              {!isAdmin && (
                <span className="text-sm text-gray-500 block">
                  ({user?.role === 'manager' ? 'Manager view - Edit your department only' : 'Read-only access'})
                </span>
              )}
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Eye className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-700">
              {isManager && 'You can edit your own department. '}
              Contact an administrator for department changes.
            </span>
          </div>
        </div>
      )}

      {showCreateForm && (
        <DepartmentForm
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setShowCreateForm(false);
            resetForm();
          }}
        />
      )}

      {showEditForm && (
        <DepartmentForm
          isEdit={true}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setShowEditForm(false);
            setEditingDepartment(null);
            resetForm();
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
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
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No departments found. 
                    {canCreate && ' Create your first department to get started.'}
                  </td>
                </tr>
              ) : (
                departments.map((dept) => {
                  const budgetPercentage = getBudgetPercentage(dept.budget_used, dept.budget);
                  const remaining = dept.budget - dept.budget_used;
                  const canEditThis = canEditDepartment(dept);
                  
                  return (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                          {dept.description && (
                            <div className="text-sm text-gray-500">{dept.description}</div>
                          )}
                          {dept.manager_id === user?.id && (
                            <div className="text-xs text-blue-600 font-medium">Your Department</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {dept.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(dept.budget)}
                        <div className="text-xs text-gray-500 capitalize">{dept.budget_period}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(dept.budget_used)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(remaining)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBudgetColor(budgetPercentage)}`}>
                          {budgetPercentage}% Used
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {canEditThis && (
                            <button 
                              onClick={() => handleEdit(dept)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit department"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              onClick={() => handleDelete(dept.id, dept.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete department"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {!canEditThis && !canDelete && (
                            <span className="text-gray-400" title="View only">
                              <Eye className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(departments.reduce((sum, dept) => sum + dept.budget, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {isManager ? 'Your Departments' : 'Active Departments'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isManager 
                  ? departments.filter(dept => dept.manager_id === user?.id).length
                  : departments.filter(dept => dept.is_active).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;