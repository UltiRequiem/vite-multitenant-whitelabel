# TicketFlow — White-Label Multi-Tenant Starter

A production-ready reference implementation of a white-label React application.
One codebase. Unlimited tenants. Zero branch divergence.

---

## The problem this solves

A common (bad) approach to white-labeling is maintaining a separate Git branch per client:

```
main          ← your product
feature/x     ← your new work
client/acme   ← acme's fork (diverging)
client/globex ← globex's fork (diverging)
```

This feels simple at first. It becomes a maintenance trap fast:

- Bug fixes have to be manually back-merged to every client branch
- Clients fall behind on features because merges are painful
- You end up with N codebases disguised as branches
- Onboarding a new client means forking again

**This project replaces all of that with a single `VITE_TENANT` environment variable.**

---

## How it works

### The core idea

Every client-specific difference lives in `/tenants/<name>/`. Your application in `/src/` never imports from `/tenants/` directly — a resolver in `tenant.context.tsx` bridges them at build time.

```
/src                        ← your app, never changes per-client
  tenant.context.tsx        ← THE bridge: reads VITE_TENANT, loads config
  tenant.types.ts           ← TypeScript contract for all customisation
  pages/
    LoginPage.tsx           ← default implementation
    Dashboard.tsx
  components/
    Sidebar.tsx             ← nav items driven by feature flags
    ...

/tenants
  /default                  ← your main brand (VITE_TENANT not set)
    tenant.config.ts
  /acme                     ← Acme's white label
    tenant.config.ts        ← their colors, features, API url
    LoginPage.tsx           ← completely replaces the default login page
  /globex
    tenant.config.ts
    LoginPage.tsx
```

### What a tenant config controls

```typescript
interface TenantConfig {
  tenantId: string

  theme: {
    primaryColor: string    // injected as CSS var(--primary)
    primaryLight: string    // injected as CSS var(--primary-light)
    logoText: string
    companyName: string
  }

  features: {
    analyticsPanel: boolean    // stats card on dashboard
    exportToCsv: boolean       // export button on ticket table
    advancedFilters: boolean   // filter sidebar + nav item
    billingSection: boolean    // billing panel + nav item
    teamManagement: boolean    // team page + nav item
  }

  apiBaseUrl: string           // can point to a different backend per tenant

  overrides?: {
    LoginPage?: ComponentType  // swap the entire login page
    DashboardHeader?: ComponentType
  }
}
```

### The rule: custom UI, shared logic

A tenant can override the entire `LoginPage` UI. But the override still calls
`useNavigate()`, reads from `useTenantTheme()`, and submits to the same auth
endpoint. **The business logic never forks. Only the presentation layer can.**

```tsx
// tenants/acme/LoginPage.tsx
export default function AcmeLoginPage() {
  const theme = useTenantTheme()       // same hook
  const navigate = useNavigate()       // same router
  // ... completely different JSX
}
```

### How the resolver works

`tenant.context.tsx` uses Vite's `import.meta.glob` with `eager: true`:

```typescript
const TENANT_ID = import.meta.env.VITE_TENANT || 'default'

const tenantModules = import.meta.glob('../tenants/*/tenant.config.ts', {
  eager: true,
})

const tenantConfig = tenantModules[`../tenants/${TENANT_ID}/tenant.config.ts`]?.default
```

Because `VITE_TENANT` is a **compile-time constant**, Vite's dead-code elimination
removes every tenant branch that doesn't match. The `dist/acme/` bundle contains
**zero bytes** of Globex's config or login page.

---

## Getting started

```bash
# Install dependencies
npm install

# Run the default app (your main brand)
npm run dev

# Run a specific tenant in dev mode
npm run dev:acme
npm run dev:globex
```

Each tenant runs on a different port so you can have multiple open at once:

| Tenant  | Dev URL                    |
|---------|---------------------------|
| default | http://localhost:5173      |
| acme    | http://localhost:5174      |
| globex  | http://localhost:5175      |

---

## Building

```bash
# Build your main app
npm run build

# Build a specific tenant
npm run build:acme
npm run build:globex

# Build all tenants at once
npm run build:all
```

Output is written to separate folders:

```
dist/
  default/    ← deploy to app.yoursystem.com
  acme/       ← deploy to acme.yoursystem.com or their own domain
  globex/     ← deploy to support.globex.com
```

---

## Adding a new tenant

1. Create the tenant folder:

```bash
mkdir tenants/newclient
```

2. Create `tenants/newclient/tenant.config.ts`:

```typescript
import type { TenantConfig } from '../../src/tenant.types'

const config: TenantConfig = {
  tenantId: 'newclient',
  theme: {
    primaryColor: '#7c3aed',
    primaryLight: '#f5f3ff',
    logoText: '✦ NewClient',
    companyName: 'NewClient Portal',
  },
  features: {
    analyticsPanel: true,
    exportToCsv: true,
    advancedFilters: false,
    billingSection: false,
    teamManagement: true,
  },
  apiBaseUrl: 'https://api.ticketflow.com',
  // No overrides needed — uses all default components
}

export default config
```

3. Add them to the CI/CD matrix in `.github/workflows/deploy.yml`:

```yaml
- tenant: newclient
  environment: production
  deploy_target: NEWCLIENT
```

4. Add the deploy secret `DEPLOY_URL_NEWCLIENT` in GitHub → Settings → Secrets.

That's it. No code changes anywhere in `/src/`. The new client gets the full app
with their branding and feature set.

---

## Overriding a component

If a tenant needs a completely different login page:

1. Create `tenants/newclient/LoginPage.tsx` with any UI you want
2. Import it in their config and register it:

```typescript
import CustomLogin from './LoginPage'

const config: TenantConfig = {
  // ...
  overrides: {
    LoginPage: CustomLogin,
  },
}
```

The override is automatically picked up by `App.tsx`:

```tsx
const LoginPage = tenant.overrides?.LoginPage ?? DefaultLoginPage
```

### What you can override

| Override key       | What it replaces              |
|--------------------|-------------------------------|
| `LoginPage`        | The entire `/login` route     |
| `DashboardHeader`  | The top header bar            |

To add more override slots, extend `TenantOverrides` in `src/tenant.types.ts`
and add the swap in the relevant component.

---

## Feature flags

Features are on/off per tenant. They drive two things simultaneously:

**1. UI visibility** — components check flags before rendering:

```tsx
{features.analyticsPanel && <AnalyticsPanel />}
{features.billingSection && <BillingSection />}
```

**2. Navigation** — the sidebar filters nav items by their `requiresFeature`:

```typescript
const DEFAULT_NAV: TenantNavItem[] = [
  { label: 'Analytics', path: '/analytics', requiresFeature: 'analyticsPanel' },
  { label: 'Billing',   path: '/billing',   requiresFeature: 'billingSection' },
]
// If analyticsPanel is false, the Analytics link never renders
```

This means you never have "ghost" nav items pointing to blank pages.

---

## CI/CD pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs:

1. **Quality gate** — type-check + lint, once, shared across all tenants
2. **Build matrix** — all tenants built in parallel, each with their own `VITE_TENANT`
3. **Deploy** — each artifact deployed to its own target (only on push to `main`)
4. **Summary** — a single status check usable in branch protection rules

```
push to main
    │
    ▼
┌─────────────────────┐
│  quality (lint + ts) │
└──────────┬──────────┘
           │
    ┌──────┴───────┐
    ▼              ▼              ▼
build:default  build:acme   build:globex   (parallel)
    │              │              │
    ▼              ▼              ▼
deploy:default deploy:acme  deploy:globex
```

### Deploying to your infrastructure

The deploy step in the workflow is intentionally left as a placeholder with
comments for the most common targets. Replace the deploy step with whichever
fits your setup:

**AWS S3 + CloudFront:**
```yaml
- name: Deploy to S3
  run: aws s3 sync dist/${{ matrix.tenant }}/ s3://your-bucket-${{ matrix.tenant }}/ --delete
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Cloudflare Pages:**
```yaml
- uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: ticketflow-${{ matrix.tenant }}
    directory: dist/${{ matrix.tenant }}
```

**Docker (for self-hosted / data governance):**
```dockerfile
FROM nginx:alpine
ARG TENANT=default
COPY dist/${TENANT} /usr/share/nginx/html
```
```yaml
- name: Build and push image
  run: |
    docker build --build-arg TENANT=${{ matrix.tenant }} \
      -t your-registry/ticketflow-${{ matrix.tenant }}:${{ github.sha }} .
    docker push your-registry/ticketflow-${{ matrix.tenant }}:${{ github.sha }}
```

---

## Two deployment models

This codebase supports both patterns simultaneously.

### Model A — shared infrastructure

Multiple clients, one running deployment. The client is identified by subdomain
or path, and branding/features adjust accordingly. Good for clients who are fine
sharing your infrastructure.

```
app.yoursystem.com         ← default tenant
acme.yoursystem.com        ← acme build, your servers, your DB
```

### Model B — isolated deployment

The client gets a completely independent deployment: their own server, their own
database, their own URL. Required for data governance, compliance, or enterprise
contracts. Same code, different environment.

```
support.globex.com         ← globex build, THEIR server, THEIR DB
```

The only difference is the `apiBaseUrl` in their config and where you point
the deploy step. The codebase is identical.

---

## Project structure

```
ticketflow-whitelabel/
├── src/
│   ├── main.tsx               Entry point
│   ├── App.tsx                Root router — applies tenant overrides
│   ├── index.css              Global styles + CSS custom properties
│   ├── tenant.types.ts        TypeScript contract for TenantConfig
│   ├── tenant.context.tsx     Resolver — the only bridge to /tenants
│   ├── pages/
│   │   ├── LoginPage.tsx      Default login (your brand)
│   │   └── Dashboard.tsx      Dashboard with feature-flagged sections
│   └── components/
│       ├── Sidebar.tsx        Nav filtered by feature flags
│       ├── Header.tsx         Top bar with tenant badge
│       └── TicketTable.tsx    Table with conditional export button
├── tenants/
│   ├── default/
│   │   └── tenant.config.ts   Your main brand config
│   ├── acme/
│   │   ├── tenant.config.ts   Acme: red brand, no analytics/billing
│   │   └── LoginPage.tsx      Acme: two-column login with SSO link
│   └── globex/
│       ├── tenant.config.ts   Globex: blue brand, own API base URL
│       └── LoginPage.tsx      Globex: adds a department field
├── .github/
│   └── workflows/
│       └── deploy.yml         Matrix build + deploy, one job per tenant
├── vite.config.ts             Reads VITE_TENANT, sets outDir, aliases
├── tsconfig.json
└── package.json
```

---

## Key design decisions

**Why Vite and not Next.js?**
This is a dashboard behind a login — SSR and SEO are not needed. Vite produces
clean static artifacts that deploy anywhere (S3, Nginx, Docker, Cloudflare Pages).
Next.js's build output is coupled to its own server model, which fights the
"one artifact per tenant" pattern. If you need SSR, the same tenant config
pattern applies — but the resolver needs to move to a server-side context.

**Why `import.meta.glob` with `eager: true` and not a dynamic `import()`?**
Dynamic `import()` works at runtime — you can't tree-shake it. `import.meta.glob`
with `eager: true` is resolved at build time, which means Rollup sees all the
branches statically and can eliminate the ones that don't match `VITE_TENANT`.
The result is a genuinely smaller bundle per tenant, not just lazy-loaded extras.

**Why does `/src` never import from `/tenants`?**
Keeping the app code unaware of the tenant folder means you can add, remove, or
rename tenants without touching any shared code. The resolver in
`tenant.context.tsx` is the only coupling point — one file to audit, one file
to test.

**Why CSS custom properties instead of passing theme values as props?**
Prop-drilling the primary color through every component is verbose and fragile.
CSS custom properties let any component use `var(--primary)` without importing
anything. The values are injected once at startup by `tenant.context.tsx` and
never need to be passed around.
