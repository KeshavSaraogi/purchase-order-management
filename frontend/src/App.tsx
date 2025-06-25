import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStore } from '@store/authStore'
import { LoginPage, RegistrationPage } from '@pages/auth'
import { DashboardPage } from '@pages/dashboard'
import { DepartmentsPage } from '@pages/departments'
import { PurchaseOrdersPage } from '@pages/purchase-orders'
import { VendorsPage } from '@pages/vendors'
import { ItemsPage } from '@pages/items'
import { ReportsPage } from '@pages/reports'
import { SettingsPage } from '@pages/settings'
import Layout from '@components/layout/Layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegistrationPage />
                </PublicRoute>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/departments" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DepartmentsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/purchase-orders" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PurchaseOrdersPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/vendors" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <VendorsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/items" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ItemsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

        {import.meta.env.DEV && (
          <ReactQueryDevtools 
            initialIsOpen={false} 
            position="bottom"
          />
        )}
      </Router>
    </QueryClientProvider>
  ) 
}

export default App