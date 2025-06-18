import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  FileText,
  DollarSign,
  Building,
  User,
  Package
} from 'lucide-react'

interface PurchaseOrder {
  id: string
  vendor: string
  department: string
  requestedBy: string
  amount: number
  currency: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'sent' | 'received' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dateCreated: string
  dateRequired: string
  items: number
  description: string
  approver?: string
  notes?: string
}

const PurchaseOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO-2025-0143',
      vendor: 'TechSupply Corp',
      department: 'IT Department',
      requestedBy: 'Karan Sharma',
      amount: 15400,
      currency: '₹',
      status: 'pending',
      priority: 'high',
      dateCreated: '2025-05-28',
      dateRequired: '2025-06-15',
      items: 5,
      description: 'Server hardware and networking equipment',
      notes: 'Urgent requirement for data center upgrade'
    },
    {
      id: 'PO-2025-0142',
      vendor: 'Office Essentials Ltd',
      department: 'Admin',
      requestedBy: 'Priya Singh',
      amount: 8750,
      currency: '₹',
      status: 'approved',
      priority: 'medium',
      dateCreated: '2025-05-27',
      dateRequired: '2025-06-10',
      items: 12,
      description: 'Office supplies and stationery',
      approver: 'Raj Kumar'
    },
    {
      id: 'PO-2025-0141',
      vendor: 'Industrial Solutions',
      department: 'Production',
      requestedBy: 'Amit Patel',
      amount: 28900,
      currency: '₹',
      status: 'sent',
      priority: 'urgent',
      dateCreated: '2025-05-26',
      dateRequired: '2025-06-05',
      items: 3,
      description: 'Manufacturing equipment parts',
      approver: 'Suresh Gupta'
    },
    {
      id: 'PO-2025-0140',
      vendor: 'Quality Furniture Co',
      department: 'Admin',
      requestedBy: 'Neha Agarwal',
      amount: 12200,
      currency: '₹',
      status: 'received',
      priority: 'low',
      dateCreated: '2025-05-25',
      dateRequired: '2025-06-01',
      items: 8,
      description: 'Office furniture and fixtures',
      approver: 'Raj Kumar'
    },
    {
      id: 'PO-2025-0139',
      vendor: 'SafeTech Security',
      department: 'Security',
      requestedBy: 'Rohit Verma',
      amount: 45000,
      currency: '₹',
      status: 'draft',
      priority: 'medium',
      dateCreated: '2025-05-24',
      dateRequired: '2025-06-20',
      items: 15,
      description: 'Security cameras and access control system'
    },
    {
      id: 'PO-2025-0138',
      vendor: 'Green Energy Solutions',
      department: 'Facilities',
      requestedBy: 'Anita Reddy',
      amount: 85000,
      currency: '₹',
      status: 'rejected',
      priority: 'medium',
      dateCreated: '2025-05-23',
      dateRequired: '2025-07-01',
      items: 6,
      description: 'Solar panel installation',
      notes: 'Budget constraints - defer to next quarter'
    }
  ]

  const departments = ['IT Department', 'Admin', 'Production', 'Security', 'Facilities', 'Finance', 'HR']
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'received':
        return <CheckCircle className="w-4 h-4 text-purple-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      received: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      urgent: 'bg-red-50 text-red-700 border-red-200'
    }
    return styles[priority as keyof typeof styles] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
    const matchesDepartment = departmentFilter === 'all' || order.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(order => order.id)
    )
  }

  const getStats = () => {
    const total = purchaseOrders.length
    const pending = purchaseOrders.filter(po => po.status === 'pending').length
    const approved = purchaseOrders.filter(po => po.status === 'approved').length
    const totalValue = purchaseOrders.reduce((sum, po) => sum + po.amount, 0)
    
    return { total, pending, approved, totalValue }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
              <p className="text-gray-600">Manage and track all purchase orders</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Purchase Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="sent">Sent</option>
                    <option value="received">Received</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Purchase Orders ({filteredOrders.length})
              </h2>
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <button className="btn btn-sm btn-secondary">
                    Bulk Approve
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    Bulk Reject
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-primary-600">{order.id}</div>
                        <div className="text-sm text-gray-900 font-medium">{order.description}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          Requested by {order.requestedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.vendor}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {order.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.currency}{order.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Package className="w-3 h-3 mr-1" />
                          {order.items} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(order.priority)}`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          Created: {new Date(order.dateCreated).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Required: {new Date(order.dateRequired).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        {order.status === 'draft' && (
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new purchase order.'}
              </p>
              {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && departmentFilter === 'all' && (
                <div className="mt-6">
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Purchase Order
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Create New Purchase Order</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Create Purchase Order form will be implemented here.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrdersPage