import type { TenantConfig } from '../../src/tenant.types'
import GlobexLoginPage from './LoginPage'

const config: TenantConfig = {
  tenantId: 'globex',
  theme: {
    primaryColor: '#0ea5e9',      // Globex blue
    primaryLight: '#f0f9ff',
    logoText: '🌐 Globex Desk',
    companyName: 'Globex Help Desk',
  },
  features: {
    analyticsPanel: true,
    exportToCsv: true,
    advancedFilters: true,
    billingSection: false,        // Globex has their own billing system
    teamManagement: false,        // Not needed — single team setup
  },
  // Globex has their own isolated deployment environment
  apiBaseUrl: 'https://support-api.globex.com',
  overrides: {
    LoginPage: GlobexLoginPage,
  },
}

export default config
