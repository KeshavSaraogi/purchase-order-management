import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Star,
  MapPin,
  Phone,
  Mail,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Award,
  DollarSign
} from 'lucide-react'

interface Vendor {
  id: string
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  rating: number
  totalOrders: number
  totalValue: number
  currency: string
  onTimeDelivery: number
  qualityScore: number
  paymentTerms: string
  lastOrderDate: string
  joinedDate: string
  tags: string[]
  notes?: string
}

const VendorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const vendors: Vendor[] = [
    {
      id: 'VEN-001',
      name: 'TechSupply Corp',
      category: 'Electronics & IT',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh@techsupply.com',
      phone: '+91 98765 43210',
      address: '123 Tech Park, Sector 18',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      status: 'active',
      rating: 4.9,
      totalOrders: 145,
      totalValue: 452300,
      currency: '₹',
      onTimeDelivery: 96,
      qualityScore: 98,
      paymentTerms: 'Net 30',
      lastOrderDate: '2025-05-28',
      joinedDate: '2023-03-15',
      tags: ['electronics', 'computers', 'networking'],
      notes: 'Preferred vendor for IT equipment'
    },
    {
      id: 'VEN-002',
      name: 'Office Essentials Ltd',
      category: 'Office Supplies',
      contactPerson: 'Priya Sharma',
      email: 'priya@officeessentials.com',
      phone: '+91 98765 43211',
      address: '456 Business Center, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      status: 'active',
      rating: 4.6,
      totalOrders: 98,
      totalValue: 321500,
      currency: '₹',
      onTimeDelivery: 92,
      qualityScore: 94,
      paymentTerms: 'Net 15',
      lastOrderDate: '2025-05-27',
      joinedDate: '2023-07-22',
      tags: ['stationery', 'furniture', 'supplies']
    },
    {
      id: 'VEN-003',
      name: 'Industrial Solutions',
      category: 'Industrial Equipment',
      contactPerson: 'Amit Patel',
      email: 'amit@industrialsolutions.com',
      phone: '+91 98765 43212',
      address: '789 Industrial Estate, Phase II',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      status: 'active',
      rating: 4.2,
      totalOrders: 67,
      totalValue: 289750,
      currency: '₹',
      onTimeDelivery: 88,
      qualityScore: 91,
      paymentTerms: 'Net 45',
      lastOrderDate: '2025-05-26',
      joinedDate: '2022-11-08',
      tags: ['machinery', 'tools', 'safety']
    },
    {
      id: 'VEN-004',
      name: 'Green Energy Solutions',
      category: 'Energy & Environment',
      contactPerson: 'Anita Reddy',
      email: 'anita@greenenergy.com',
      phone: '+91 98765 43213',
      address: '321 Green Complex, Hitech City',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      status: 'pending',
      rating: 4.0,
      totalOrders: 23,
      totalValue: 185000,
      currency: '₹',
      onTimeDelivery: 85,
      qualityScore: 87,
      paymentTerms: 'Net 30',
      lastOrderDate: '2025-05-15',
      joinedDate: '2024-12-01',
      tags: ['solar', 'renewable', 'eco-friendly']
    },
    {
      id: 'VEN-005',
      name: 'SafeTech Security',
      category: 'Security Systems',
      contactPerson: 'Rohit Verma',
      email: 'rohit@safetech.com',
      phone: '+91 98765 43214',
      address: '654 Security Plaza, Cyber City',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      status: 'inactive',
      rating: 3.8,
      totalOrders: 34,
      totalValue: 145000,
      currency: '₹',
      onTimeDelivery: 82,
      qualityScore: 85,
      paymentTerms: 'Net 30',
      lastOrderDate: '2025-04-10',
      joinedDate: '2023-09-12',
      tags: ['cameras', 'access-control', 'surveillance']
    },
    {
      id: 'VEN-006',
      name: 'Quality Furniture Co',
      category: 'Furniture & Fixtures',
      contactPerson: 'Neha Agarwal',
      email: 'neha@qualityfurniture.com',
      phone: '+91 98765 43215',
      address: '987 Furniture Market, Sector 15',
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
      status: 'active',
      rating: 4.4,
      totalOrders: 56,
      totalValue: 225000,
      currency: '₹',
      onTimeDelivery: 90,
      qualityScore: 93,
      paymentTerms: 'Net 20',
      lastOrderDate: '2025-05-25',
      joinedDate: '2023-05-18',
      tags: ['office-furniture', 'ergonomic', 'workspace']
    }
  ]

  const categories = [
    'Electronics & IT',
    'Office Supplies', 
    'Industrial Equipment',
    'Energy & Environment',
    'Security Systems',
    'Furniture & Fixtures',
    'Raw Materials',
    'Maintenance & Repair'
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 text-yellow-400 fill-current opacity-50" />}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    )
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter
    const matchesRating = 
        ratingFilter === 'all' || 
        (ratingFilter === '4+' && vendor.rating >= 4) ||
        (ratingFilter === '3+' && vendor.rating >= 3) ||
        (ratingFilter === 'below3' && vendor.rating < 3)
    
    return matchesSearch && matchesStatus && matchesCategory && matchesRating
  })

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  const handleSelectAll = () => {
    setSelectedVendors(
      selectedVendors.length === filteredVendors.length 
        ? [] 
        : filteredVendors.map(vendor => vendor.id)
    )
  }

  const getStats = () => {
    const total = vendors.length
    const active = vendors.filter(v => v.status === 'active').length
    const pending = vendors.filter(v => v.status === 'pending').length
    const totalValue = vendors.reduce((sum, v) => sum + v.totalValue, 0)
    const avgRating = vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
    
    return { total, active, pending, totalValue, avgRating }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
              <p className="text-gray-600">Manage and track all your vendors and suppliers</p>
            </div>
            <div className="flex space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    viewMode === 'table' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Grid
                </button>
              </div>
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
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search vendors..."
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
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                    <option value="below3">Below 3 Stars</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vendors Table/Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Vendors ({filteredVendors.length})
              </h2>
              {selectedVendors.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedVendors.length} selected
                  </span>
                  <button className="btn btn-sm btn-secondary">
                    Bulk Activate
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    Bulk Deactivate
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Value
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
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedVendors.includes(vendor.id)}
                          onChange={() => handleSelectVendor(vendor.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.category}</div>
                          <div className="text-xs text-gray-400">ID: {vendor.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {vendor.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {vendor.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {vendor.city}, {vendor.state}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {getRatingStars(vendor.rating)}
                          <div className="text-xs text-gray-500 mt-1">
                            On-time: {vendor.onTimeDelivery}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Quality: {vendor.qualityScore}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.currency}{vendor.totalValue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vendor.totalOrders} orders
                          </div>
                          <div className="text-xs text-gray-400">
                            {vendor.paymentTerms}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(vendor.status)}`}>
                          {getStatusIcon(vendor.status)}
                          <span className="ml-1 capitalize">{vendor.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-primary-600 hover:text-primary-900 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                        <p className="text-sm text-gray-500">{vendor.category}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(vendor.status)}`}>
                        {getStatusIcon(vendor.status)}
                        <span className="ml-1 capitalize">{vendor.status}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        {getRatingStars(vendor.rating)}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {vendor.phone}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {vendor.city}, {vendor.state}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Value:</span>
                        <span className="font-medium">{vendor.currency}{vendor.totalValue.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Orders:</span>
                        <span className="font-medium">{vendor.totalOrders}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">On-time:</span>
                        <span className="font-medium">{vendor.onTimeDelivery}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || ratingFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding a new vendor.'}
              </p>
              {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && ratingFilter === 'all' && (
                <div className="mt-6">
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Add New Vendor</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Add Vendor form will be implemented here.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowAddModal(false)}
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

export default VendorsPage