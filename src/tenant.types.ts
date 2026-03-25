import type { ComponentType } from 'react'

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface TenantTheme {
  /** Primary brand color — injected as CSS var(--primary) */
  primaryColor: string
  /** Lighter tint used for hover states — injected as CSS var(--primary-light) */
  primaryLight: string
  /** Company logo URL shown in the sidebar and login page */
  logoText: string
  /** Display name shown throughout the UI */
  companyName: string
}

// ─── Features ─────────────────────────────────────────────────────────────────

export interface TenantFeatures {
  /** Analytics panel on the dashboard */
  analyticsPanel: boolean
  /** Export to CSV button on ticket lists */
  exportToCsv: boolean
  /** Advanced filter sidebar */
  advancedFilters: boolean
  /** Billing & subscription section */
  billingSection: boolean
  /** Team management page */
  teamManagement: boolean
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface TenantNavItem {
  label: string
  path: string
  /** Hides this item unless the matching feature flag is enabled */
  requiresFeature?: keyof TenantFeatures
}

// ─── Component overrides ──────────────────────────────────────────────────────

export interface TenantOverrides {
  /** Replaces the entire login page */
  LoginPage?: ComponentType
  /** Replaces the dashboard header */
  DashboardHeader?: ComponentType
}

// ─── Root config ──────────────────────────────────────────────────────────────

export interface TenantConfig {
  tenantId: string
  theme: TenantTheme
  features: TenantFeatures
  /** Base URL of the backend API for this tenant */
  apiBaseUrl: string
  /** Custom nav items — merged with defaults if provided */
  navItems?: TenantNavItem[]
  /** Component-level overrides for this tenant */
  overrides?: TenantOverrides
}
