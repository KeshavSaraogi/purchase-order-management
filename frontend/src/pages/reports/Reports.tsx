import React, { useState } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter,
  FileText,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react'

interface ReportMetric {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
}

interface ChartData {
  name: string
  value: number
  color?: string
}

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_30_days')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - in real app this would come from API
  const overviewMetrics: ReportMetric[] = [
    {
      title: 'Total Purchases',
      value: '₹12,45,680',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Purchase Orders',
      value: 247,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Active Vendors',
      value: 35,
      change: '+3 new',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Items Ordered',
      value: '1,234',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'orange'
    },
    {
      title: 'Avg. Order Value',
      value: '₹5,042',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'indigo'
    },
    {
      title: 'On-Time Delivery',
      value: '92.4%',
      change: '+2.1%',
      trend: 'up',
      icon: Clock,
      color: 'green'
    }
  ]

  const purchaseOrderData: ChartData[] = [
    { name: 'Pending', value: 23, color: '#f59e0b' },
    { name: 'Approved', value: 45, color: '#10b981' },
    { name: 'Sent', value: 67, color: '#3b82f6' },
    { name: 'Received', value: 89, color: '#8b5cf6' },
    { name: 'Rejected', value: 12, color: '#ef4444' }
  ]

  const monthlySpendData: ChartData[] = [
    { name: 'Jan', value: 65000 },
    { name: 'Feb', value: 59000 },
    { name: 'Mar', value: 80000 },
    { name: 'Apr', value: 81000 },
    { name: 'May', value: 124568 },
    { name: 'Jun', value: 0 }
  ]

  const topVendorData: ChartData[] = [
    { name: 'TechSupply Corp', value: 452300 },
    { name: 'Office Essentials', value: 321500 },
    { name: 'Industrial Solutions', value: 289750 },
    { name: 'Quality Furniture', value: 225000 },
    { name: 'Green Energy', value: 185000 }
  ]

  const categorySpendData: ChartData[] = [
    { name: 'Electronics & IT', value: 35, color: '#3b82f6' },
    { name: 'Office Supplies', value: 25, color: '#10b981' },
    { name: 'Furniture', value: 20, color: '#f59e0b' },
    { name: 'Safety Equipment', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#6b7280' }
  ]

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'purchase_orders', name: 'Purchase Orders', icon: ShoppingCart },
    { id: 'vendors', name: 'Vendor Performance', icon: Users },
    { id: 'inventory', name: 'Inventory Reports', icon: Package },
    { id: 'financial', name: 'Financial Analysis', icon: DollarSign },
    { id: 'compliance', name: 'Compliance', icon: CheckCircle }
  ]

  const getMetricIcon = (metric: ReportMetric) => {
    const IconComponent = metric.icon
    return <IconComponent className="w-6 h-6" />
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const SimpleBarChart: React.FC<{ data: ChartData[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 truncate">{item.name}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">
                {typeof item.value === 'number' && item.value > 1000 
                  ? `₹${(item.value / 1000).toFixed(0)}k`
                  : item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const SimplePieChart: React.FC<{ data: ChartData[], title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {((item.value / total) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const QuickInsights: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
        <Zap className="w-5 h-5 text-yellow-500" />
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Spending Trend</p>
            <p className="text-sm text-gray-600">Monthly spending increased by 12.5% compared to last month</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Vendor Alert</p>
            <p className="text-sm text-gray-600">3 vendors have delivery delays this month</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Cost Savings</p>
            <p className="text-sm text-gray-600">Negotiated 8% better rates with top 3 vendors</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Inventory Status</p>
            <p className="text-sm text-gray-600">15 items are below reorder points</p>
          </div>
        </div>
      </div>
    </div>
  )

  const RecentReports: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        <RefreshCw className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {[
          { name: 'Monthly Purchase Summary - May 2025', date: '2025-05-30', size: '2.4 MB' },
          { name: 'Vendor Performance Report - Q1 2025', date: '2025-05-28', size: '1.8 MB' },
          { name: 'Inventory Valuation Report', date: '2025-05-25', size: '956 KB' },
          { name: 'Cost Analysis - Electronics Category', date: '2025-05-22', size: '1.2 MB' }
        ].map((report, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{report.name}</p>
                <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Eye className="w-4 h-4" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">Comprehensive insights into your purchase operations</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_90_days">Last 90 Days</option>
                <option value="last_6_months">Last 6 Months</option>
                <option value="last_year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Report Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedReport === type.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {type.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
          {overviewMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ml-1 ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  metric.color === 'orange' ? 'bg-orange-100' :
                  metric.color === 'indigo' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <div className={`${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    metric.color === 'orange' ? 'text-orange-600' :
                    metric.color === 'indigo' ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    {getMetricIcon(metric)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Spending Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <SimpleBarChart data={monthlySpendData} title="Amount Spent (₹)" />
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <SimplePieChart data={categorySpendData} title="Category Distribution" />
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Vendors by Value</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <SimpleBarChart data={topVendorData} title="Total Purchase Value" />
          </div>

          {/* Purchase Order Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Purchase Order Status</h3>
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
            <SimplePieChart data={purchaseOrderData} title="Order Status Distribution" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickInsights />
          <RecentReports />
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    name: 'Monthly Purchase Summary',
                    type: 'Financial',
                    frequency: 'Monthly',
                    lastGenerated: '2025-05-30',
                    nextRun: '2025-06-30'
                  },
                  {
                    name: 'Vendor Performance Report',
                    type: 'Performance',
                    frequency: 'Weekly',
                    lastGenerated: '2025-05-28',
                    nextRun: '2025-06-04'
                  },
                  {
                    name: 'Inventory Valuation',
                    type: 'Inventory',
                    frequency: 'Daily',
                    lastGenerated: '2025-05-30',
                    nextRun: '2025-05-31'
                  },
                  {
                    name: 'Compliance Report',
                    type: 'Compliance',
                    frequency: 'Quarterly',
                    lastGenerated: '2025-03-31',
                    nextRun: '2025-06-30'
                  }
                ].map((report, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.lastGenerated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.nextRun).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
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

export default ReportsPage