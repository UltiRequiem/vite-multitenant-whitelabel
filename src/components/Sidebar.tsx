import { NavLink } from 'react-router-dom'
import { useTenant, useTenantFeatures } from '../tenant.context'
import type { TenantNavItem } from '../tenant.types'

const DEFAULT_NAV: TenantNavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Tickets', path: '/tickets' },
  { label: 'Advanced Filters', path: '/filters', requiresFeature: 'advancedFilters' },
  { label: 'Analytics', path: '/analytics', requiresFeature: 'analyticsPanel' },
  { label: 'Team', path: '/team', requiresFeature: 'teamManagement' },
  { label: 'Billing', path: '/billing', requiresFeature: 'billingSection' },
]

export default function Sidebar() {
  const { theme, navItems } = useTenant()
  const features = useTenantFeatures()

  // Use tenant's custom nav if provided, otherwise use defaults
  const nav = navItems ?? DEFAULT_NAV

  // Filter out nav items whose required feature is disabled
  const visibleNav = nav.filter(item => {
    if (!item.requiresFeature) return true
    return features[item.requiresFeature] === true
  })

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">{theme.logoText}</div>
      <nav className="sidebar__nav">
        {visibleNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' active' : '')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '12px 20px', fontSize: 11, color: '#94a3b8' }}>
        {theme.companyName}
      </div>
    </aside>
  )
}
