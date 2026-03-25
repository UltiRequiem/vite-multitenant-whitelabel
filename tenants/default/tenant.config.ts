import type { TenantConfig } from '../../src/tenant.types'

const config: TenantConfig = {
  tenantId: 'default',
  theme: {
    primaryColor: '#6366f1',
    primaryLight: '#eef2ff',
    logoText: '🎫 TicketFlow',
    companyName: 'TicketFlow',
  },
  features: {
    analyticsPanel: true,
    exportToCsv: true,
    advancedFilters: true,
    billingSection: true,
    teamManagement: true,
  },
  apiBaseUrl: 'https://api.ticketflow.com',
}

export default config
