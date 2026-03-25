import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TicketTable from '../components/TicketTable'
import { useTenant, useTenantFeatures } from '../tenant.context'

const MOCK_TICKETS = [
  { id: 'TF-001', title: 'Login button unresponsive on mobile', status: 'open' as const, assignee: 'Ana García', priority: 'High' },
  { id: 'TF-002', title: 'CSV export missing last column', status: 'pending' as const, assignee: 'John Smith', priority: 'Medium' },
  { id: 'TF-003', title: 'Dashboard loads slowly on first visit', status: 'closed' as const, assignee: 'Mei Chen', priority: 'Low' },
  { id: 'TF-004', title: 'Email notifications not sending', status: 'open' as const, assignee: 'Carlos Ruiz', priority: 'High' },
  { id: 'TF-005', title: 'Filter state lost on page refresh', status: 'pending' as const, assignee: 'Ana García', priority: 'Medium' },
]

function StatPanel({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="panel">
      <div className="panel__title">{label}</div>
      <div className="panel__value">{value}</div>
      <div className="panel__sub">{sub}</div>
    </div>
  )
}

export default function Dashboard() {
  const { theme } = useTenant()
  const features = useTenantFeatures()

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Header title={`${theme.companyName} — Support Dashboard`} />
        <div className="page-content">

          {/* Stats — always visible */}
          <div className="panel-grid">
            <StatPanel label="Open tickets" value="24" sub="+3 since yesterday" />
            <StatPanel label="Avg. response time" value="1.8h" sub="↓ 12% this week" />
            <StatPanel label="Resolved today" value="11" sub="Goal: 15" />

            {/* Only rendered when the tenant enables it */}
            {features.analyticsPanel && (
              <StatPanel label="Customer satisfaction" value="94%" sub="Based on 38 ratings" />
            )}
          </div>

          {/* Advanced filters banner — shown when feature is OFF */}
          {!features.advancedFilters && (
            <div className="feature-disabled">
              ⚙ Advanced filters are not enabled for your plan.
            </div>
          )}

          {/* Ticket table */}
          <TicketTable
            tickets={MOCK_TICKETS}
            showExport={features.exportToCsv}
          />

          {/* Billing section — only for tenants that manage billing here */}
          {features.billingSection && (
            <div className="panel" style={{ marginTop: 16 }}>
              <div className="panel__title">Billing</div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                Pro plan · Renews Jan 1, 2026 ·{' '}
                <a href="#" style={{ color: 'var(--primary)' }}>Manage subscription</a>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
