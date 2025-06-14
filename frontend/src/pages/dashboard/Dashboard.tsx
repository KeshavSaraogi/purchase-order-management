import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Clock, 
  Plus, 
  Download, 
  Bell,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

const DashboardPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')

  // Mock data
  const stats = [
    {
      title: 'Total Spending',
      value: '₹12,45,680',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Purchase Orders',
      value: '342',
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Active Vendors',
      value: '98',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Avg. Processing Time',
      value: '5.8 days',
      change: '-2.1 days',
      trend: 'down',
      icon: Clock,
      color: 'orange'
    }
  ]

  const recentOrders = [
    {
      id: 'PO-2025-0143',
      vendor: 'TechSupply Corp',
      department: 'IT Department',
      amount: '₹15,400',
      status: 'pending',
      date: 'May 28, 2025'
    },
    {
      id: 'PO-2025-0142',
      vendor: 'Office Essentials Ltd',
      department: 'Admin',
      amount: '₹8,750',
      status: 'approved',
      date: 'May 27, 2025'
    },
    {
      id: 'PO-2025-0141',
      vendor: 'Industrial Solutions',
      department: 'Production',
      amount: '₹28,900',
      status: 'sent',
      date: 'May 26, 2025'
    },
    {
      id: 'PO-2025-0140',
      vendor: 'Quality Furniture Co',
      department: 'Admin',
      amount: '₹12,200',
      status: 'approved',
      date: 'May 25, 2025'
    }
  ]

  const topVendors = [
    { name: 'TechSupply Corp', amount: '₹4,52,300', rating: 4.9, category: 'Electronics & IT' },
    { name: 'Office Essentials Ltd', amount: '₹3,21,500', rating: 4.6, category: 'Office Supplies' },
    { name: 'Industrial Solutions', amount: '₹2,89,750', rating: 4.2, category: 'Industrial' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      received: 'bg-purple-100 text-purple-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Karan! Here's your purchase overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search orders, vendors, items..."
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Purchase Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                    }`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Chart */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spending Trends</h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                <p className="text-primary-600 font-medium">Interactive Spending Chart</p>
                <p className="text-sm text-primary-500">Monthly spending patterns with trend analysis</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Vendors</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <p className="font-semibold text-gray-900">{vendor.amount}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">{vendor.category}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Purchase Orders</h3>
            <div className="flex items-center space-x-2">
              <button className="btn btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.vendor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage