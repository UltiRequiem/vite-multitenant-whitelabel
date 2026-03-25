import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TenantProvider, useTenant } from './tenant.context'
import DefaultLoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

// ─── Inner component so it can consume TenantProvider ────────────────────────
function AppRoutes() {
  const tenant = useTenant()

  // Use the tenant's LoginPage override if provided,
  // otherwise fall back to the shared default implementation.
  // The logic, routing, and auth are always the same underneath.
  const LoginPage = tenant.overrides?.LoginPage ?? DefaultLoginPage

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  const tenantId = (import.meta.env.VITE_TENANT as string) || 'default'

  return (
    <TenantProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {/* Debug badge — shows which tenant is active. Remove in production. */}
      <div className="tenant-badge">tenant: {tenantId}</div>
    </TenantProvider>
  )
}
