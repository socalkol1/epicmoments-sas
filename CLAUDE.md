# Photography Platform - Claude Code Instructions

## Project Overview
Multi-tenant SaaS platform for sports photographers. Photographers sign up as tenants, manage clients, deliver photo albums, and sell packages.

**Stack:** Next.js 15 (App Router), TypeScript (strict), Tailwind CSS, Supabase (Auth + DB + RLS), Backblaze B2 (storage), Stripe Connect (payments), SendGrid (email), Sentry (error tracking), React Query (caching), next-intl (i18n optional)

## Critical Rules

### Always Do
- Plan before coding (see docs/METHODOLOGY.md)
- Test after EVERY step before proceeding
- Validate all inputs with Zod schemas (`lib/validations/`)
- Include `tenant_id` in all business table queries
- Use Server Components by default; extract interactive elements (e.g., photo zoom) to Client Components with `'use client'`
- Check RLS policies exist for new tables
- Implement audit logs for tenant actions (e.g., uploads, sales) using Supabase triggers in `lib/supabase/audit.ts`
- Enforce CSP headers in `next.config.js` and validate file uploads in `lib/b2/` with mime-type checks
- Use `unstable_cache` in Server Components for tenant-specific queries; integrate React Query for client-side caching
- Wrap all images in Next.js `<Image>` component; configure B2 transforms via `lib/b2/image.ts`
- Integrate Sentry in `lib/sentry.ts`; log errors with tenant_id context in all async ops
- Run accessibility checks with axe-core in CI (`npm run test:a11y`)
- Generate Supabase types after schema changes: `supabase gen types typescript --local > types/supabase.ts`
- Use `z.infer` for all API responses; aim for exhaustive type checks

### Never Do
- Use `any` type - use `unknown` with type guards
- Bypass RLS with service role in client code
- Skip error handling in async operations: Wrap Server Actions in try/catch; use `<ErrorBoundary>` in layouts; return `Result<T, Error>` from `lib/utils/result.ts`
- Commit without `npm run typecheck && npm run lint && npm run format && npm run test -- --coverage`
- Store secrets in code - use environment variables
- Apply global rate limits only; use tenant-specific limits in `lib/rate-limit.ts` with Upstash keys prefixed by `tenant_id`
- Ignore SEO: Implement `generateMetadata` in marketing layouts with OpenGraph for photo previews

### Multi-Tenant Context
```typescript
// Every request has tenant context via middleware
const tenantId = request.headers.get('x-tenant-id');
const tenantSlug = request.headers.get('x-tenant-slug');

// All queries MUST filter by tenant
const { data } = await supabase
  .from('albums')
  .select('*')
  .eq('tenant_id', tenantId);  // REQUIRED
```

## Quick Commands
```bash
npm run dev          # Start dev server (localhost:3000)
npm run typecheck    # TypeScript check (must pass)
npm run lint         # ESLint (must pass)
npm run format       # Prettier format (auto-fix)
npm run test         # Jest unit tests (80% coverage)
npm run test:e2e     # Playwright E2E tests (with tenant isolation mocks)
npm run test:a11y    # Accessibility tests with axe-core
npm run storybook    # Component isolation dev
npm run build        # Production build (with bundle analyzer)

supabase start       # Start local Supabase (Docker)
supabase db reset    # Reset DB with migrations + seed
supabase db diff     # Generate migration from changes
docker build -t photostudio .  # Build app container
docker-compose up    # Full stack (app + Supabase)
```

## File Organization
```
src/
├── app/                 # Next.js routes
│   ├── (marketing)/     # Platform site (photostudio.app) - use generateMetadata for SEO
│   ├── (tenant)/        # Tenant routes ({slug}.photostudio.app)
│   │   ├── (public)/    # Portfolio, shop
│   │   ├── portal/      # Client portal
│   │   ├── admin/       # Studio admin
│   │   └── checkout/    # Checkout flow (with idempotency in Stripe)
│   ├── platform/        # Platform admin (SaaS management)
│   └── api/             # API routes
├── components/          # React components (with Storybook stories)
├── lib/                 # Utilities & integrations
│   ├── supabase/        # DB clients + audit.ts
│   ├── stripe/          # Payment helpers + webhooks.ts (idempotency)
│   ├── b2/              # Storage helpers + image.ts (transforms) + backup.ts
│   ├── sentry/          # Error tracking
│   ├── validations/     # Zod schemas (with snapshot tests)
│   ├── rate-limit.ts    # Rate limiting (tenant-prefixed)
│   ├── tenants/         # Tenant utilities
│   ├── utils/           # Helpers like result.ts
│   └── adapters/        # Swappable integrations (e.g., Stripe adapter)
├── hooks/               # Custom React hooks (e.g., useQuery for caching)
└── types/               # TypeScript definitions (supabase.ts generated)
```

## Current Status
See `PROGRESS.md` for current phase and task status.

## Documentation Index
For detailed guidance, read the relevant doc before starting work:

| Topic | Document |
|-------|----------|
| Methodology & workflow | `docs/METHODOLOGY.md` |
| Architecture & security | `docs/ARCHITECTURE.md` |
| Database schema & types | `docs/SCHEMA.md` |
| Implementation phases | `docs/IMPLEMENTATION.md` |
| External integrations | `docs/INTEGRATIONS.md` |
| Testing strategies | `docs/TESTING.md` |
| Deployment & ops | `docs/DEPLOYMENT.md` |
| Prompt templates | `docs/PROMPTS.md` |
| Operations runbook | `docs/RUNBOOK.md` |
| Scalability & performance | `docs/SCALABILITY.md` (new: caching, sharding) |
| Compliance & retention | `docs/COMPLIANCE.md` (new: GDPR, backups) |

## Environment Variables
Required in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# B2 Storage
B2_APPLICATION_KEY_ID=
B2_APPLICATION_KEY=
B2_BUCKET_NAME=
B2_ENDPOINT=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email
SENDGRID_API_KEY=

# Monitoring
SENTRY_DSN=

# Caching (if using external)
REACT_QUERY_CACHE=

# App
NEXT_PUBLIC_APP_URL=
```

## Additional Instructions

### Workflow Enhancements
- **Phased Prompts**: Use templates in `docs/PROMPTS.md` for "multi-tenant migration" or "performance audit" to guide iterative coding.
- **Code Review Simulation**: After each phase, run all checks, diff against `docs/SCHEMA.md`, and self-audit for RLS/tenant_id.
- **Version Control**: Use feature branches (`feat/album-delivery`); enforce semantic versioning; run `npm run changelog` pre-commit.

### Scalability Guidance
- For high-traffic tenants, use Supabase Edge Functions for heavy computations (e.g., photo resizing); monitor query perf with Supabase dashboard.
- Implement horizontal scaling: Shard albums by `tenant_id` if >10k records; use Backblaze lifecycle rules for old photos in `lib/b2/backup.ts`.

### Compliance & Ops
- **Data Retention**: Define policies in `docs/RUNBOOK.md` (e.g., delete client data after 2 years via cron jobs).
- **Backup Strategy**: Schedule Supabase point-in-time recovery; back up B2 buckets daily via API.
- **Incident Response**: Outline on-call rotations and rollback procedures in `docs/RUNBOOK.md` (e.g., `supabase db reset --no-seed`).
- **CI/CD**: Automate with GitHub Actions in `docs/DEPLOYMENT.md` (lint/test/build/deploy to Vercel with Supabase migrations).
- **Containerization**: Use `Dockerfile` and `docker-compose.yml` for full-stack dev/prod; support K8s for scaling.

### Tooling Upgrades
- **Bundle Analysis**: Enable `@next/bundle-analyzer` in `npm run build` for prod size optimization.
- **Storybook**: Document components in `components/` READMEs; use for UI dev and a11y testing.
- **Cost Management**: Track Supabase/Stripe/B2 usage in `docs/RUNBOOK.md`; alert on thresholds via webhooks.

### Enterprise Mindset
- **Modularity**: Design integrations in `lib/adapters/` for easy swaps (e.g., migrate from Stripe).
- **Documentation Hygiene**: Update `PROGRESS.md` and docs after commits; use JSDoc for all exports.
- **Internationalization**: For global support, integrate `next-intl`; localize SendGrid templates.
