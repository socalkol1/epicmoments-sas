# Deployment & Operations

## Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    }
  ]
}
```

---

## Environment Variables

### Required (Production)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Backblaze B2
B2_APPLICATION_KEY_ID=xxx
B2_APPLICATION_KEY=xxx
B2_BUCKET_NAME=photography-prod
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
B2_REGION=us-west-004
B2_CDN_DOMAIN=cdn.yourdomain.com

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Email
SENDGRID_API_KEY=SG.xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Git Workflow

```
main     → Production (auto-deploys)
develop  → Staging
feature/* → Feature branches
fix/*    → Bug fixes
```

**Commit Convention:**
```
type(scope): description

feat(albums): add bulk delete
fix(checkout): handle timeout
docs(readme): update setup
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Monitoring & Alerting

### Sentry Error Tracking

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### Health Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = { database: false, timestamp: new Date().toISOString() };
  
  try {
    const { error } = await supabase.from('tenants').select('id').limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }
  
  return Response.json(checks, { status: checks.database ? 200 : 503 });
}
```

### Uptime Monitoring

Use BetterUptime or UptimeRobot (free):
- Monitor: `https://your-site.com/api/health`
- Alert: Slack + Email

---

## Disaster Recovery

### Database Backup

- Supabase: Daily automated backups (7 days retention)
- Point-in-time recovery on Pro plan

**Restore Procedure:**
1. Supabase Dashboard → Project Settings → Database → Backups
2. Select restore point
3. Creates NEW project
4. Update environment variables
5. Test thoroughly before switching

### Storage Backup

- B2 versioning enabled
- List versions: `b2 ls --versions bucket`
- Restore: `b2 copy-file-by-id <version-id> bucket/path`

### Recovery Time Objectives

| System | RTO |
|--------|-----|
| Database | < 1 hour |
| Storage | < 4 hours |
| Full system | < 6 hours |

---

## Pre-Deploy Checklist

- [ ] All CI checks pass
- [ ] Preview deployment tested
- [ ] Database migrations applied
- [ ] Environment variables correct
- [ ] Stripe webhook endpoint updated
- [ ] Sentry release created

---

## Rollback Procedure

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. If DB migration involved:
   - Create reverse migration
   - Apply via Supabase

---

## Cost Estimation

### Self-Use Mode (Single Tenant)

| Service | Monthly Cost |
|---------|--------------|
| Vercel Free | $0 |
| Supabase Pro | $25 |
| B2 (500GB) | ~$3 |
| Cloudflare | $0 |
| SendGrid Free | $0 |
| **Total** | **~$30 + Stripe fees** |

### SaaS Mode (100 Tenants)

| Service | Monthly Cost |
|---------|--------------|
| Vercel Pro | $20 |
| Supabase Pro | $75 |
| B2 (10TB) | ~$60 |
| SendGrid | $15 |
| **Total** | **~$190** |

**Revenue (100 tenants):**
- 40% Free: $0
- 35% Pro ($29): $1,015
- 20% Studio ($79): $1,580
- 5% Enterprise ($199): $995
- **MRR: $3,590**
