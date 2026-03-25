import type { TenantConfig } from '../../src/tenant.types'
import AcmeLoginPage from './LoginPage'

const config: TenantConfig = {
  tenantId: 'acme',
  theme: {
    primaryColor: '#dc2626',      // Acme red
    primaryLight: '#fef2f2',
    logoText: '⚡ Acme Support',
    companyName: 'Acme Corp Support Portal',
  },
  features: {
    analyticsPanel: false,        // Not part of their contract
    exportToCsv: true,
    advancedFilters: false,       // Simplified UI requested
    billingSection: false,        // Acme handles billing on their side
    teamManagement: true,
  },
  apiBaseUrl: 'https://api.ticketflow.com', // Still your shared backend
  overrides: {
    LoginPage: AcmeLoginPage,     // Fully custom login experience
  },
}

export default config
