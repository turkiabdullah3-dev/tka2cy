import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import DashboardLayout from './components/layout/DashboardLayout'
import LoadingSpinner from './components/ui/LoadingSpinner'

import LoginPage from './pages/LoginPage'
import DashboardOverview from './pages/DashboardOverview'
import SiemEventsPage from './pages/SiemEventsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TasksPage from './pages/TasksPage'
import SettingsPage from './pages/SettingsPage'
import NotFound from './pages/NotFound'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#070709' }}
      >
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/security/login" replace />
  }

  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/security/dashboard" replace />} />

      {/* Public login */}
      <Route path="/security/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/security/dashboard" element={<DashboardOverview />} />
          <Route path="/security/siem" element={<SiemEventsPage />} />
          <Route path="/security/analytics" element={<AnalyticsPage />} />
          <Route path="/security/tasks" element={<TasksPage />} />
          <Route path="/security/settings" element={<SettingsPage />} />
          <Route path="/security/*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/security/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
