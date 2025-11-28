# EpicMoments

A multi-tenant SaaS platform for sports photographers to manage clients, deliver photo albums, and sell packages.

## Features

- **Multi-Tenant Architecture** - Each photographer/studio operates as an isolated tenant with their own branding
- **Client Portal** - Clients can view and download their photo albums
- **E-Commerce** - Sell photo packages with Stripe Connect payments
- **Portfolio Gallery** - Showcase work with a responsive masonry gallery
- **Magic Link Auth** - Passwordless authentication for clients
- **Google OAuth** - Quick sign-in for photographers

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Magic Links, Google OAuth) |
| Payments | Stripe Connect |
| Storage | Backblaze B2 |
| Email | SendGrid |
| Caching | React Query, Upstash Redis |
| Monitoring | Sentry |

## Prerequisites

- Node.js 18+
- npm or pnpm
- Docker (for local Supabase)
- Supabase account
- Stripe account (for payments)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/socalkol1/epicmoments-sas.git
cd epicmoments-sas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

**Option A: Use Supabase Cloud**
1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in `supabase/migrations/` via the SQL editor

**Option B: Run Supabase locally**
```bash
supabase start
supabase db reset
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run Jest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:a11y` | Run accessibility tests |
| `npm run analyze` | Analyze bundle size |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication pages (login, signup)
│   ├── (public)/           # Public pages (portfolio, shop, about)
│   ├── (tenant)/           # Tenant-specific routes
│   │   ├── admin/          # Admin dashboard
│   │   └── portal/         # Client portal
│   └── api/                # API routes
├── components/
│   ├── features/           # Feature-specific components
│   └── ui/                 # Shared UI components
├── lib/
│   ├── supabase/           # Database clients
│   ├── validations/        # Zod schemas
│   └── utils/              # Helper functions
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript definitions
```

## Documentation

Detailed documentation is available in the `Docs/` directory:

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](Docs/ARCHITECTURE.md) | System architecture and security |
| [SCHEMA.md](Docs/SCHEMA.md) | Database schema and types |
| [IMPLEMENTATION.md](Docs/IMPLEMENTATION.md) | Implementation phases and tasks |
| [INTEGRATIONS.md](Docs/INTEGRATIONS.md) | Third-party service integrations |
| [TESTING.md](Docs/TESTING.md) | Testing strategies |
| [DEPLOYMENT.md](Docs/DEPLOYMENT.md) | Deployment procedures |
| [RUNBOOK.md](Docs/RUNBOOK.md) | Operations runbook |

## Development Workflow

### Before committing

Run all checks:

```bash
npm run typecheck && npm run lint && npm run format && npm run test
```

### Commit messages

Use conventional commits:

```
feat: Add user authentication flow
fix: Resolve null pointer in profile page
refactor: Extract validation logic
```

### Database changes

After modifying the schema:

```bash
# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts

# Create a migration
supabase db diff -f migration_name
```

## Multi-Tenancy

Every business table includes a `tenant_id` column with Row Level Security (RLS) policies:

```typescript
// All queries must filter by tenant
const { data } = await supabase
  .from('albums')
  .select('*')
  .eq('tenant_id', tenantId);  // Required
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy

### Docker

```bash
docker build -t epicmoments .
docker run -p 3000:3000 epicmoments
```

## License

Private - All rights reserved.

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/socalkol1/epicmoments-sas/issues) page.
