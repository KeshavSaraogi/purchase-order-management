import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Tag,
  DollarSign,
  Building,
  Hash,
  Info
} from 'lucide-react'

interface Item {
  id: string
  sku: string
  name: string
  description: string
  category: string
  subcategory: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  unit: string
  unitPrice: number
  totalValue: number
  currency: string
  supplier: string
  alternativeSupplier?: string
  location: string
  status: 'active' | 'inactive' | 'discontinued' | 'pending'
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
  lastOrderDate: string
  lastUsedDate: string
  createdDate: string
  tags: string[]
  notes?: string
}

const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const items: Item[] = [
    {
      id: 'ITM-001',
      sku: 'LT-DEL-001',
      name: 'Dell Latitude 7420 Laptop',
      description: 'Business laptop with Intel i7 processor, 16GB RAM, 512GB SSD',
      category: 'Electronics & IT',
      subcategory: 'Laptops & Computers',
      currentStock: 15,
      minStock: 5,
      maxStock: 30,
      reorderPoint: 8,
      unit: 'piece',
      unitPrice: 85000,
      totalValue: 1275000,
      currency: '₹',
      supplier: 'TechSupply Corp',
      alternativeSupplier: 'Digital Solutions Ltd',
      location: 'Warehouse A - Section 1',
      status: 'active',
      stockStatus: 'in_stock',
      lastOrderDate: '2025-05-15',
      lastUsedDate: '2025-05-28',
      createdDate: '2023-03-10',
      tags: ['laptop', 'business', 'dell'],
      notes: 'Popular model for office use'
    },
    {
      id: 'ITM-002',
      sku: 'PEN-PIL-001',
      name: 'Pilot G2 Gel Pen Blue',
      description: 'Premium gel ink pen with smooth writing experience',
      category: 'Office Supplies',
      subcategory: 'Stationery',
      currentStock: 120,
      minStock: 50,
      maxStock: 500,
      reorderPoint: 75,
      unit: 'piece',
      unitPrice: 45,
      totalValue: 5400,
      currency: '₹',
      supplier: 'Office Essentials Ltd',
      location: 'Storage Room B - Shelf 3',
      status: 'active',
      stockStatus: 'in_stock',
      lastOrderDate: '2025-05-20',
      lastUsedDate: '2025-05-29',
      createdDate: '2023-01-15',
      tags: ['pen', 'stationery', 'consumable']
    },
    {
      id: 'ITM-003',
      sku: 'SF-HLM-001',
      name: 'Safety Helmet - Yellow',
      description: 'Industrial safety helmet with adjustable strap, ISI certified',
      category: 'Safety Equipment',
      subcategory: 'Personal Protection',
      currentStock: 3,
      minStock: 10,
      maxStock: 50,
      reorderPoint: 15,
      unit: 'piece',
      unitPrice: 850,
      totalValue: 2550,
      currency: '₹',
      supplier: 'Industrial Solutions',
      location: 'Safety Equipment Store',
      status: 'active',
      stockStatus: 'low_stock',
      lastOrderDate: '2025-04-10',
      lastUsedDate: '2025-05-25',
      createdDate: '2023-06-20',
      tags: ['safety', 'helmet', 'ppe'],
      notes: 'Urgent reorder required'
    },
    {
      id: 'ITM-004',
      sku: 'CHR-ERG-001',
      name: 'Ergonomic Office Chair',
      description: 'Adjustable height office chair with lumbar support and armrests',
      category: 'Furniture & Fixtures',
      subcategory: 'Office Furniture',
      currentStock: 8,
      minStock: 5,
      maxStock: 25,
      reorderPoint: 7,
      unit: 'piece',
      unitPrice: 12500,
      totalValue: 100000,
      currency: '₹',
      supplier: 'Quality Furniture Co',
      location: 'Furniture Warehouse',
      status: 'active',
      stockStatus: 'in_stock',
      lastOrderDate: '2025-05-01',
      lastUsedDate: '2025-05-20',
      createdDate: '2023-04-05',
      tags: ['chair', 'furniture', 'ergonomic']
    },
    {
      id: 'ITM-005',
      sku: 'CBL-ETH-001',
      name: 'Ethernet Cable Cat6 - 3m',
      description: 'High-speed ethernet cable for network connections',
      category: 'Electronics & IT',
      subcategory: 'Networking',
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      reorderPoint: 30,
      unit: 'piece',
      unitPrice: 350,
      totalValue: 0,
      currency: '₹',
      supplier: 'TechSupply Corp',
      location: 'Warehouse A - Section 2',
      status: 'active',
      stockStatus: 'out_of_stock',
      lastOrderDate: '2025-03-15',
      lastUsedDate: '2025-05-15',
      createdDate: '2023-02-12',
      tags: ['cable', 'networking', 'ethernet'],
      notes: 'Critical stock - immediate reorder needed'
    },
    {
      id: 'ITM-006',
      sku: 'PPR-A4-001',
      name: 'A4 Printing Paper - 500 sheets',
      description: 'Premium quality white printing paper 80GSM',
      category: 'Office Supplies',
      subcategory: 'Paper Products',
      currentStock: 85,
      minStock: 20,
      maxStock: 200,
      reorderPoint: 40,
      unit: 'ream',
      unitPrice: 320,
      totalValue: 27200,
      currency: '₹',
      supplier: 'Office Essentials Ltd',
      location: 'Storage Room B - Shelf 1',
      status: 'active',
      stockStatus: 'in_stock',
      lastOrderDate: '2025-05-22',
      lastUsedDate: '2025-05-29',
      createdDate: '2023-01-08',
      tags: ['paper', 'printing', 'consumable']
    },
    {
      id: 'ITM-007',
      sku: 'TBL-WRK-001',
      name: 'Workstation Table - L-Shape',
      description: 'Modern L-shaped workstation table with cable management',
      category: 'Furniture & Fixtures',
      subcategory: 'Office Furniture',
      currentStock: 2,
      minStock: 3,
      maxStock: 15,
      reorderPoint: 5,
      unit: 'piece',
      unitPrice: 18000,
      totalValue: 36000,
      currency: '₹',
      supplier: 'Quality Furniture Co',
      location: 'Furniture Warehouse',
      status: 'active',
      stockStatus: 'low_stock',
      lastOrderDate: '2025-04-28',
      lastUsedDate: '2025-05-18',
      createdDate: '2023-03-25',
      tags: ['table', 'workstation', 'furniture']
    },
    {
      id: 'ITM-008',
      sku: 'MON-LED-001',
      name: 'LED Monitor 24 inch',
      description: 'Full HD LED monitor with HDMI and VGA ports',
      category: 'Electronics & IT',
      subcategory: 'Displays',
      currentStock: 12,
      minStock: 8,
      maxStock: 40,
      reorderPoint: 10,
      unit: 'piece',
      unitPrice: 15500,
      totalValue: 186000,
      currency: '₹',
      supplier: 'TechSupply Corp',
      location: 'Warehouse A - Section 1',
      status: 'active',
      stockStatus: 'in_stock',
      lastOrderDate: '2025-05-10',
      lastUsedDate: '2025-05-26',
      createdDate: '2023-02-28',
      tags: ['monitor', 'display', 'led']
    }
  ]

  const categories = [
    'Electronics & IT',
    'Office Supplies',
    'Safety Equipment',
    'Furniture & Fixtures',
    'Raw Materials',
    'Maintenance & Repair',
    'Cleaning Supplies',
    'Packaging Materials'
  ]

  const suppliers = [
    'TechSupply Corp',
    'Office Essentials Ltd',
    'Industrial Solutions',
    'Quality Furniture Co',
    'Green Energy Solutions'
  ]

  const getStockStatusIcon = (stockStatus: string) => {
    switch (stockStatus) {
      case 'in_stock':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'out_of_stock':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'overstock':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const getStockStatusBadge = (stockStatus: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-800 border-green-200',
      low_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200',
      overstock: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return styles[stockStatus as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      discontinued: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStockLevel = (item: Item) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    let color = 'bg-green-500'
    
    if (item.currentStock <= item.reorderPoint) {
      color = 'bg-red-500'
    } else if (item.currentStock <= item.minStock) {
      color = 'bg-yellow-500'
    }
    
    return { percentage: Math.min(percentage, 100), color }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesStock = stockFilter === 'all' || item.stockStatus === stockFilter
    const matchesSupplier = supplierFilter === 'all' || item.supplier === supplierFilter
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStock && matchesSupplier
  })

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredItems.length 
        ? [] 
        : filteredItems.map(item => item.id)
    )
  }

  const getStats = () => {
    const total = items.length
    const inStock = items.filter(item => item.stockStatus === 'in_stock').length
    const lowStock = items.filter(item => item.stockStatus === 'low_stock').length
    const outOfStock = items.filter(item => item.stockStatus === 'out_of_stock').length
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0)
    
    return { total, inStock, lowStock, outOfStock, totalValue }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Items & Inventory</h1>
              <p className="text-gray-600">Manage your item catalog and inventory levels</p>
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
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
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
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
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
                  placeholder="Search items by name, SKU, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-4">
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="overstock">Overstock</option>
                  </select>
                  
                  <select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Suppliers</option>
                    {suppliers.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
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
                Items ({filteredItems.length})
              </h2>
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} selected
                  </span>
                  <button className="btn btn-sm btn-secondary">
                    Bulk Update Stock
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    Update Status
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
                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing & Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier & Location
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
                  {filteredItems.map((item) => {
                    const stockLevel = getStockLevel(item)
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <Hash className="w-3 h-3 mr-1" />
                              SKU: {item.sku}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">
                                {item.currentStock} {item.unit}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                / {item.maxStock}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${stockLevel.color}`}
                                style={{ width: `${stockLevel.percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Min: {item.minStock} | Reorder: {item.reorderPoint}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.currency}{item.unitPrice.toLocaleString()} / {item.unit}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total: {item.currency}{item.totalValue.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900 flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {item.supplier}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                              <span className="capitalize">{item.status}</span>
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStockStatusBadge(item.stockStatus)}`}>
                              {getStockStatusIcon(item.stockStatus)}
                              <span className="ml-1 capitalize">{item.stockStatus.replace('_', ' ')}</span>
                            </span>
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
                            {item.status === 'inactive' && (
                              <button className="text-red-600 hover:text-red-900 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const stockLevel = getStockLevel(item)
                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                            <span className="capitalize">{item.status}</span>
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStockStatusBadge(item.stockStatus)}`}>
                            {getStockStatusIcon(item.stockStatus)}
                            <span className="ml-1 capitalize">{item.stockStatus.replace('_', ' ')}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Stock Level:</span>
                            <span className="font-medium">{item.currentStock} / {item.maxStock} {item.unit}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${stockLevel.color}`}
                              style={{ width: `${stockLevel.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Unit Price:</span>
                          <span className="font-medium">{item.currency}{item.unitPrice.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Value:</span>
                          <span className="font-medium">{item.currency}{item.totalValue.toLocaleString()}</span>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-gray-500">Supplier:</div>
                          <div className="font-medium">{item.supplier}</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </span>
                          ))}
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
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || stockFilter !== 'all' || supplierFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding a new item.'}
              </p>
              {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && stockFilter === 'all' && supplierFilter === 'all' && (
                <div className="mt-6">
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
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
              <h3 className="text-lg font-medium text-gray-900">Add New Item</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Add Item form will be implemented here.
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

export default ItemsPage