/* eslint-disable react-refresh/only-export-components -- context files intentionally mix a provider component with hooks */
import React, { createContext, useContext } from 'react'
import type { TenantConfig } from './tenant.types'

// ─── Tenant resolution ────────────────────────────────────────────────────────
//
// VITE_TENANT is a compile-time constant set by the build environment.
// When not set, it defaults to 'default' (your main production app).
//
// import.meta.glob with { eager: true } tells Vite to:
//   1. Find all matching files at build time
//   2. Include them in the bundle as static imports
//   3. Let the dead-code eliminator remove all non-matching tenants
//
// Result: dist/acme/ contains ONLY acme's config. Zero bytes from globex.

const TENANT_ID = (import.meta.env.VITE_TENANT as string) || 'default'

const tenantModules = import.meta.glob('../tenants/*/tenant.config.ts', {
  eager: true,
}) as Record<string, { default: TenantConfig }>

const configKey = `../tenants/${TENANT_ID}/tenant.config.ts`
const tenantConfig = tenantModules[configKey]?.default

if (!tenantConfig) {
  throw new Error(
    `[TicketFlow] No tenant config found for "${TENANT_ID}".\n` +
    `Create a file at: tenants/${TENANT_ID}/tenant.config.ts`
  )
}

// ─── CSS custom properties injection ─────────────────────────────────────────
//
// Inject theme values as CSS variables so every component can use
// var(--primary) without importing the tenant config directly.

const root = document.documentElement
root.style.setProperty('--primary', tenantConfig.theme.primaryColor)
root.style.setProperty('--primary-light', tenantConfig.theme.primaryLight)

// ─── Context ──────────────────────────────────────────────────────────────────

const TenantContext = createContext<TenantConfig>(tenantConfig)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  return (
    <TenantContext.Provider value={tenantConfig}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant(): TenantConfig {
  return useContext(TenantContext)
}

// Convenience hook — avoids destructuring in every component
export function useTenantFeatures() {
  return useContext(TenantContext).features
}

export function useTenantTheme() {
  return useContext(TenantContext).theme
}
