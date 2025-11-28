# Architecture Specification

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Browser (React 19 + Next.js 15)                                                │
│  ├── Public: Portfolio, Shop, Checkout                                          │
│  ├── Portal: Client albums, downloads, order history                            │
│  └── Admin: Dashboard, CRM, album management, analytics                         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Vercel Edge Network                                                            │
│  ├── Next.js App Router (RSC + Route Handlers)                                  │
│  ├── Middleware: Auth verification, role checks, tenant resolution              │
│  ├── Image Optimization: next/image with B2 loader                              │
│  └── Static Generation: Portfolio, pricing (revalidate: 3600)                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
┌────────────────────────┐ ┌────────────────────┐ ┌─────────────────────────────┐
│      DATA LAYER        │ │   STORAGE LAYER    │ │    INTEGRATION LAYER        │
├────────────────────────┤ ├────────────────────┤ ├─────────────────────────────┤
│  Supabase              │ │  Backblaze B2      │ │  Stripe Connect             │
│  ├── PostgreSQL        │ │  ├── /originals/   │ │  ├── Checkout Sessions      │
│  ├── Auth (JWT)        │ │  ├── /thumbnails/  │ │  ├── Webhooks               │
│  ├── RLS Policies      │ │  ├── /watermarked/ │ │  └── Connected Accounts     │
│  └── Realtime (v2)     │ │  └── /downloads/   │ │                             │
│                        │ │                    │ │  SendGrid                   │
│                        │ │  Cloudflare CDN    │ │  └── Transactional Email    │
│                        │ │  └── Cache + WAF   │ │                             │
└────────────────────────┘ └────────────────────┘ └─────────────────────────────┘
```

## Request Flow Examples

**Portfolio Page Load (Public):**
```
Browser → Vercel CDN (cache HIT) → Static HTML
         └── Images: B2 → Cloudflare CDN → Browser
```

**Album Download (Authenticated):**
```
Browser → Middleware (verify JWT + tenant) → API Route
         → Supabase (verify ownership via RLS)
         → B2 (generate signed URL, 1hr expiry)
         → Browser redirect to signed URL
```

**Checkout Flow:**
```
Browser → API Route (create Stripe session)
        → Stripe Checkout (hosted)
        → Stripe Webhook → API Route
        → Supabase (update order)
        → SendGrid (confirmation)
```

---

## Security Model

### Authentication
- Supabase Auth with magic links (primary)
- Google OAuth (secondary)
- Admin accounts require MFA
- Session duration: 7 days, refresh on activity

### Authorization (RLS Policies)

```sql
-- Clients see only their own data
CREATE POLICY "clients_own_data" ON albums
  FOR SELECT USING (
    auth.uid() = client_id OR
    is_tenant_admin()
  );

-- Tenant admins see all tenant data
CREATE POLICY "tenant_admin_access" ON albums
  FOR ALL USING (
    tenant_id = current_tenant_id() AND is_tenant_admin()
  );
```

### Data Protection
- All traffic over HTTPS (Vercel enforced)
- B2 objects private by default, signed URLs for access
- EXIF GPS data stripped from delivered images
- PII encrypted at rest (Supabase default)

---

## Rate Limiting

Protect API routes from abuse using Upstash Redis:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiters = {
  // General API: 100 requests per 10 seconds
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '10 s'),
    prefix: 'ratelimit:api',
  }),
  
  // Auth attempts: 5 per minute (prevent brute force)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'ratelimit:auth',
  }),
  
  // Downloads: 50 per hour per user
  downloads: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 h'),
    prefix: 'ratelimit:downloads',
  }),
  
  // Uploads: 100 per hour per user
  uploads: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    prefix: 'ratelimit:uploads',
  }),
};

export async function rateLimit(
  identifier: string, 
  type: keyof typeof rateLimiters = 'api'
) {
  const { success, limit, remaining, reset } = await rateLimiters[type].limit(identifier);
  
  if (!success) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }
  
  return null;
}
```

---

## Input Validation (Zod)

All API inputs must be validated:

```typescript
// lib/validations/index.ts
import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email().max(255);

export const createAlbumSchema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  description: z.string().max(500).optional(),
  client_id: uuidSchema,
  event_id: uuidSchema.optional(),
});

export const createOrderSchema = z.object({
  product_id: uuidSchema,
  notes: z.string().max(1000).optional(),
});

// Usage helper
export function validateBody<T>(schema: z.Schema<T>, body: unknown): 
  { success: true; data: T } | { success: false; error: Response } {
  const result = schema.safeParse(body);
  
  if (!result.success) {
    return {
      success: false,
      error: new Response(
        JSON.stringify({ error: 'Validation failed', details: result.error.flatten() }),
        { status: 400 }
      ),
    };
  }
  
  return { success: true, data: result.data };
}
```

---

## Content Security Policy

```typescript
// middleware.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.backblazeb2.com https://*.cloudflare.com;
  connect-src 'self' https://*.supabase.co https://api.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  frame-ancestors 'none';
`.replace(/\n/g, '');

response.headers.set('Content-Security-Policy', cspHeader);
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
```

---

## Multi-Tenancy Architecture

### Tenancy Model
**Shared database, shared schema** with `tenant_id` column on every table.

| Model | Isolation | Cost | Our Choice |
|-------|-----------|------|------------|
| Separate databases | Highest | Highest | ❌ |
| Separate schemas | High | Medium | ❌ |
| **Shared schema + tenant_id** | Medium | Lowest | ✅ |

### Tenant Resolution

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  let tenantSlug: string | null = null;
  
  if (host.endsWith('.photostudio.app')) {
    // Subdomain: smith.photostudio.app → tenant: smith
    tenantSlug = host.split('.')[0];
  } else {
    // Custom domain lookup
    tenantSlug = await getTenantByDomain(host);
  }
  
  if (!tenantSlug) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  
  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', tenantSlug);
  return response;
}
```

### URL Structure

| URL Pattern | Purpose |
|-------------|---------|
| `app.photostudio.app` | Platform marketing |
| `app.photostudio.app/platform` | Platform admin |
| `{tenant}.photostudio.app` | Tenant public site |
| `{tenant}.photostudio.app/admin` | Studio admin |
| `{tenant}.photostudio.app/portal` | Client portal |

### Subscription Tiers

| Tier | Price | Storage | Albums/mo | Platform Fee |
|------|-------|---------|-----------|--------------|
| Free | $0 | 5GB | 10 | 8% |
| Pro | $29 | 100GB | 100 | 5% |
| Studio | $79 | 500GB | ∞ | 3% |
| Enterprise | $199 | 2TB | ∞ | 2% |

### Stripe Connect Flow

```typescript
// Payment flow:
// 1. Platform creates connected account for tenant on signup
// 2. Client pays via platform's Stripe
// 3. Platform takes fee, remainder transferred to tenant

export async function createTenantCheckout(tenantId: string, productId: string) {
  const tenant = await getTenant(tenantId);
  const plan = SUBSCRIPTION_PLANS[tenant.subscription_plan];
  const product = await getProduct(productId);
  
  const platformFee = Math.round(
    product.price_cents * (plan.limits.platform_fee_percent / 100)
  );
  
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: product.stripe_price_id, quantity: 1 }],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: tenant.stripe_account_id,
      },
    },
    success_url: `${tenant.domain}/checkout/success`,
    cancel_url: `${tenant.domain}/checkout/cancel`,
  });
}
```

---

## Caching Strategy

### Static Generation (ISR)
```typescript
// Public pages - cache for 1 hour
export const revalidate = 3600;

// Dynamic pages - no caching
export const dynamic = 'force-dynamic';
```

### Edge Caching (Cloudflare)
- Thumbnails: Cache Everything, 1 month TTL
- Display images: Cache Everything, 1 week TTL
- Signed URLs: Respect cache-control headers

### DO NOT CACHE
- Order status
- Album delivery status
- User session data
- Anything with RLS-dependent data
