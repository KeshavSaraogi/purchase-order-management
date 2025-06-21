import React, { useState } from 'react'
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Building,
  Database,
  Plug,
  Globe,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react'

interface SettingCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
}

const SettingsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    purchaseOrderUpdates: true,
    vendorAlerts: false,
    lowStockAlerts: true,
    systemUpdates: false,
    weeklyReports: true
  })
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'PurchaseMax Corp',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: 'April'
  })

  const settingCategories: SettingCategory[] = [
    {
      id: 'general',
      name: 'General',
      icon: SettingsIcon,
      description: 'Basic system preferences and company information'
    },
    {
      id: 'profile',
      name: 'User Profile',
      icon: User,
      description: 'Personal information and account settings'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Password, authentication and security settings'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Email alerts and notification preferences'
    },
    {
      id: 'company',
      name: 'Company',
      icon: Building,
      description: 'Organization details and business settings'
    },
    {
      id: 'data',
      name: 'Data Management',
      icon: Database,
      description: 'Backup, export and data retention settings'
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: Plug,
      description: 'Third-party connections and API settings'
    },
    {
      id: 'system',
      name: 'System',
      icon: Globe,
      description: 'Advanced system configuration and preferences'
    }
  ]

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleGeneralSettingChange = (key: string, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={generalSettings.companyName}
              onChange={(e) => handleGeneralSettingChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={generalSettings.currency}
              onChange={(e) => handleGeneralSettingChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => handleGeneralSettingChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={generalSettings.dateFormat}
              onChange={(e) => handleGeneralSettingChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={generalSettings.language}
              onChange={(e) => handleGeneralSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiscal Year Start
            </label>
            <select
              value={generalSettings.fiscalYearStart}
              onChange={(e) => handleGeneralSettingChange('fiscalYearStart', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="April">April</option>
              <option value="January">January</option>
              <option value="July">July</option>
              <option value="October">October</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Karan Sharma"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="karan.sharma@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Procurement</option>
              <option>Finance</option>
              <option>Admin</option>
              <option>IT</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Manager</option>
              <option>Purchaser</option>
              <option>Approver</option>
              <option>Viewer</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              defaultValue="EMP001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Authentication</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Security Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="btn btn-primary">Enable 2FA</button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Login Notifications</p>
              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'purchaseOrderUpdates', label: 'Purchase Order Updates', description: 'Get notified when PO status changes' },
            { key: 'vendorAlerts', label: 'Vendor Alerts', description: 'Notifications about vendor performance' },
            { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Alert when items are running low' },
            { key: 'systemUpdates', label: 'System Updates', description: 'Notifications about system maintenance' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <button className="btn btn-secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </button>
                <p className="text-sm text-gray-500 mt-1">Recommended: 200x200px, PNG or JPG</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Name
            </label>
            <input
              type="text"
              defaultValue="PurchaseMax Corporation Pvt Ltd"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID / GST Number
            </label>
            <input
              type="text"
              defaultValue="29ABCDE1234F1Z5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address
            </label>
            <textarea
              rows={3}
              defaultValue="123 Business Park, Sector 18, Gurugram, Haryana 122001, India"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Technology</option>
              <option>Manufacturing</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Retail</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>1-10 employees</option>
              <option>11-50 employees</option>
              <option>51-200 employees</option>
              <option>201-1000 employees</option>
              <option>1000+ employees</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Automatic Backups</h4>
                <p className="text-sm text-blue-700 mt-1">Your data is automatically backed up daily at 2:00 AM IST</p>
                <p className="text-xs text-blue-600 mt-1">Last backup: May 30, 2025 at 2:15 AM</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Export Data</h4>
              <div className="space-y-3">
                <button className="w-full btn btn-secondary justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Purchase Orders
                </button>
                <button className="w-full btn btn-secondary justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Vendor Data
                </button>
                <button className="w-full btn btn-secondary justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Inventory Report
                </button>
                <button className="w-full btn btn-secondary justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data (ZIP)
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Data Retention</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Purchase Order History</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Keep Forever</option>
                    <option>7 Years</option>
                    <option>5 Years</option>
                    <option>3 Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">System Logs</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>1 Year</option>
                    <option>6 Months</option>
                    <option>3 Months</option>
                    <option>1 Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Report Archives</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>2 Years</option>
                    <option>1 Year</option>
                    <option>6 Months</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900">Danger Zone</h4>
                  <p className="text-sm text-red-700 mt-1">These actions cannot be undone. Please proceed with caution.</p>
                  <div className="mt-4 flex space-x-3">
                    <button className="btn bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Data
                    </button>
                    <button className="btn border-red-300 text-red-700 hover:bg-red-50">
                      Reset to Factory Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Third-Party Integrations</h3>
        <div className="space-y-4">
          {[
            { name: 'SAP ERP', status: 'Connected', icon: '🔗', description: 'Sync with SAP for financial data' },
            { name: 'Slack', status: 'Available', icon: '💬', description: 'Get notifications in Slack channels' },
            { name: 'Microsoft Teams', status: 'Available', icon: '👥', description: 'Collaborate with your team' },
            { name: 'QuickBooks', status: 'Available', icon: '📊', description: 'Sync financial and accounting data' },
            { name: 'Zoho CRM', status: 'Available', icon: '🤝', description: 'Manage vendor relationships' }
          ].map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  integration.status === 'Connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status === 'Connected' && <Check className="w-3 h-3 mr-1" />}
                  {integration.status}
                </span>
                <button className={`btn btn-sm ${
                  integration.status === 'Connected' ? 'btn-secondary' : 'btn-primary'
                }`}>
                  {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">API Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              defaultValue="https://api.purchasemax.com/v1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                defaultValue="pm_1234567890abcdef"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <button className="btn btn-secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Approval Workflow
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>Manager → Finance → CEO</option>
                <option>Direct Manager Only</option>
                <option>Finance Department</option>
                <option>Custom Workflow</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-approval Limit
              </label>
              <input
                type="number"
                defaultValue="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Order Numbering
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>PO-YYYY-NNNN</option>
                <option>YYYY-MM-NNNN</option>
                <option>Sequential (1, 2, 3...)</option>
                <option>Custom Format</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Payment Terms
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>Net 30</option>
                <option>Net 15</option>
                <option>Net 45</option>
                <option>Immediate</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">System Maintenance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Database Size</p>
                <p className="text-sm text-gray-500">2.4 GB</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">System Status</p>
                <p className="text-sm text-green-600">All Systems Operational</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <RefreshCw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Last Update</p>
                <p className="text-sm text-gray-500">May 28, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return renderGeneralSettings()
      case 'profile':
        return renderProfileSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'company':
        return renderCompanySettings()
      case 'data':
        return renderDataSettings()
      case 'integrations':
        return renderIntegrationSettings()
      case 'system':
        return renderSystemSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your system preferences and configuration</p>
            </div>
            <div className="flex space-x-3">
              <button className="btn btn-secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </button>
              <button className="btn btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {settingCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {category.name}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                {settingCategories.find(cat => cat.id === activeCategory) && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {settingCategories.find(cat => cat.id === activeCategory)?.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {settingCategories.find(cat => cat.id === activeCategory)?.description}
                    </p>
                  </div>
                )}
              </div>
              
              {renderContent()}
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button className="btn btn-secondary">Cancel</button>
                <button className="btn btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage