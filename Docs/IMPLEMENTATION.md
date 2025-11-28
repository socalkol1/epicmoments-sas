# Implementation Phases

> 6-8 week roadmap. Follow phases in order. Each phase builds on the previous.

## Overview

| Phase | Focus | Timeline |
|-------|-------|----------|
| 1 | Foundation (Auth, DB, Routing) | Week 1 |
| 2 | Public Site (Portfolio, Shop) | Week 2 |
| 3 | E-Commerce (Stripe Checkout) | Week 3 |
| 4 | Client Portal (Albums, Downloads) | Week 4 |
| 5 | Admin Dashboard (CRM, Management) | Week 5 |
| 6 | Polish & Launch | Week 6 |
| 7 | Multi-Tenancy (Optional) | Week 7-8 |

---

## Phase 1: Foundation (Week 1)

**Goal:** Working authentication, database, and basic routing.

### Tasks

**1.1 Project Scaffolding**
```bash
npx create-next-app@latest photography-platform --typescript --tailwind --eslint --app --src-dir
cd photography-platform
npm install @supabase/supabase-js @supabase/ssr stripe @sendgrid/mail zod
npm install -D @types/node jest @testing-library/react playwright
npm install @upstash/ratelimit @upstash/redis  # Rate limiting
```

**1.2 Supabase Setup**
- Create project at supabase.com
- Run schema migration (see SCHEMA.md)
- Configure Auth providers (Email, Google)
- Set up RLS policies
- Generate types: `npx supabase gen types typescript`

**1.3 Environment Configuration**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**1.4 Auth Implementation**
- Supabase client setup (server + browser)
- Middleware for protected routes
- Login/logout pages
- Profile creation trigger

**1.5 Basic Layout**
- Root layout with providers
- Navigation component
- Footer component
- Loading/error boundaries

### Deliverables
- [ ] User can sign up with email magic link
- [ ] User can sign in with Google
- [ ] Protected routes redirect to login
- [ ] Admin vs client role works
- [ ] Database schema deployed

### Prompt for Task 1.4
```
Implement Supabase authentication for Next.js 15 App Router.

Requirements:
1. Create lib/supabase/client.ts (browser client)
2. Create lib/supabase/server.ts (server client with cookies)
3. Create middleware.ts that:
   - Refreshes session on each request
   - Protects /portal/* routes (require auth)
   - Protects /admin/* routes (require auth + admin role)
   - Redirects authenticated users from /login
4. Create app/(auth)/login/page.tsx with:
   - Email magic link form
   - Google OAuth button
   - Error handling
5. Create app/api/auth/callback/route.ts

Use @supabase/ssr package. TypeScript strict mode.
```

---

## Phase 2: Public Site (Week 2)

**Goal:** Portfolio gallery and shop that converts visitors.

### Tasks

**2.1 Portfolio Gallery**
- Masonry grid layout
- Lazy loading with blur placeholders
- Lightbox for full-size view
- Filter by sport/event

**2.2 Shop/Products Page**
- Product cards with pricing
- Package comparison
- Direct checkout for single items

**2.3 Static Pages**
- About page
- Pricing page
- Contact form

**2.4 SEO Foundation**
- sitemap.xml generation
- robots.txt
- JSON-LD structured data

### Deliverables
- [ ] Portfolio loads < 2s with 50 images
- [ ] All images have alt text
- [ ] Products display with prices
- [ ] Lighthouse SEO score > 90

### Prompt for Task 2.1
```
Build the portfolio gallery component.

Requirements:
1. Create components/features/PortfolioGallery.tsx:
   - Server component fetching images where is_portfolio=true
   - Masonry layout using CSS Grid
   - Responsive: 1 col mobile, 2 tablet, 3-4 desktop

2. Create components/features/GalleryImage.tsx:
   - Client component for individual images
   - next/image with blur placeholder
   - Click opens lightbox
   - Lazy loading

3. Create components/features/Lightbox.tsx:
   - Modal overlay with image
   - Keyboard navigation (arrows, escape)
   - Touch swipe on mobile

4. Create app/(public)/portfolio/page.tsx:
   - Static generation with revalidate: 3600
   - Filter UI by sport
   - OG meta tags

Performance: LCP < 2.0s, no layout shift.
```

---

## Phase 3: E-Commerce (Week 3)

**Goal:** Complete purchase flow with Stripe.

### Tasks

**3.1 Stripe Integration**
- Products synced to Stripe
- Checkout session creation
- Webhook handler
- Customer portal

**3.2 Checkout Flow**
- Product → Stripe Checkout
- Success/cancel pages
- Order creation
- Confirmation email

**3.3 Order Management (Admin)**
- Orders list with filters
- Order detail view
- Status updates

### Deliverables
- [ ] Complete purchase flow works
- [ ] Webhook processes payments
- [ ] Order appears in admin
- [ ] Client receives email

### Prompt for Task 3.2
```
Implement Stripe checkout flow.

Requirements:
1. Create app/api/checkout/route.ts:
   - POST creates Stripe Checkout Session
   - Validates product_id
   - Creates pending order in database
   - Attaches order_id to session metadata
   - Returns checkout URL

2. Create app/api/webhooks/stripe/route.ts:
   - Verifies Stripe signature
   - Handles checkout.session.completed:
     - Updates order to 'paid'
     - Triggers confirmation email
   - Handles payment_failed:
     - Updates order to 'cancelled'

3. Create checkout/success/page.tsx:
   - Retrieves session_id from URL
   - Displays confirmation

4. Create checkout/cancel/page.tsx:
   - Cancellation message
   - Link back to shop

Include idempotency keys. Webhook must respond < 5s.
```

---

## Phase 4: Client Portal (Week 4)

**Goal:** Clients can view and download their albums.

### Tasks

**4.1 Portal Dashboard**
- List of client's albums
- Order history
- Profile settings

**4.2 Album Viewer**
- Grid of album images
- Download buttons (individual/all)
- Watermarked preview vs full download

**4.3 Secure Downloads**
- Signed URLs from B2
- Download tracking
- Rate limiting

### Deliverables
- [ ] Client sees only their albums
- [ ] Downloads use signed URLs
- [ ] Download count tracked
- [ ] ZIP download for full album

### Prompt for Task 4.2
```
Build the album viewer for client portal.

Requirements:
1. Create app/portal/albums/[id]/page.tsx:
   - Server component
   - Verify client owns album (RLS handles this)
   - Display album info (title, date, image count)
   - Grid of watermarked thumbnails

2. Create components/features/AlbumGrid.tsx:
   - Responsive grid of images
   - Click to view larger (still watermarked)
   - Download button per image (gets full-res)

3. Create lib/b2/download.ts:
   - getSignedDownloadUrl(imageKey, expiresIn)
   - Creates 1-hour signed URL
   - Logs download to activity_log

4. Create app/api/albums/[id]/download-all/route.ts:
   - Creates ZIP of all album images
   - Streams to client
   - Or: generates ZIP in background, emails link

RLS must prevent access to other clients' albums.
```

---

## Phase 5: Admin Dashboard (Week 5)

**Goal:** Manage clients, albums, orders, and events.

### Tasks

**5.1 Dashboard Overview**
- Key metrics (revenue, orders, clients)
- Recent activity feed
- Quick actions

**5.2 Client Management**
- Client list with search/filter
- Client detail (albums, orders)
- Add/edit client

**5.3 Album Management**
- Album list
- Create album + assign to client
- Upload images (bulk)
- Set album status

**5.4 Order Fulfillment**
- Pending orders queue
- Mark as fulfilled
- Link album to order

### Deliverables
- [ ] Admin can CRUD clients
- [ ] Admin can create albums
- [ ] Bulk image upload works
- [ ] Order workflow complete

### Prompt for Task 5.3
```
Build album management for admin dashboard.

Requirements:
1. Create app/admin/albums/page.tsx:
   - Server component
   - Table with columns: Title, Client, Status, Images, Created
   - Filter by status
   - Search by title
   - Pagination (20 per page)

2. Create app/admin/albums/new/page.tsx:
   - Form: title, description, client (select), event (select)
   - Validation with Zod
   - Creates album, redirects to upload

3. Create app/admin/albums/[id]/upload/page.tsx:
   - Drag-and-drop zone
   - Multi-file selection
   - Progress indicator per file
   - Automatic thumbnail generation
   - Upload to B2 with tenant path prefix

4. Create lib/images/upload.ts:
   - processAndUpload(file, albumId)
   - Generates thumbnail, watermarked versions
   - Uploads all to B2
   - Creates image record

Use react-dropzone. Show upload progress.
Max 50 images per batch.
```

---

## Phase 6: Polish & Launch (Week 6)

**Goal:** Production-ready with monitoring.

### Tasks

**6.1 Error Handling**
- Global error boundary
- Sentry integration
- User-friendly error pages

**6.2 Performance**
- Lighthouse audit
- Image optimization review
- Bundle size analysis

**6.3 Testing**
- E2E tests for critical paths
- Load testing key endpoints
- Accessibility audit

**6.4 Documentation**
- README with setup
- Operations runbook
- API documentation

**6.5 Launch Prep**
- Custom domain setup
- SSL verification
- Stripe production keys
- Monitoring alerts

### Deliverables
- [ ] Sentry capturing errors
- [ ] Lighthouse scores > 90
- [ ] E2E tests passing
- [ ] Runbook complete
- [ ] Production deployed

---

## Phase 7: Multi-Tenancy (Week 7-8)

**Goal:** Enable SaaS mode with multiple photographer tenants.

> Only implement this phase if you plan to sell the platform as SaaS.

### Tasks

**7.1 Tenant Management**
- Signup flow with slug validation
- Subdomain provisioning
- Stripe Connect onboarding
- Tenant settings (branding, domain)

**7.2 Platform Admin Dashboard**
- Tenant list with metrics
- Subscription management
- Usage monitoring
- Support impersonation

**7.3 Multi-Tenant Middleware**
- Tenant resolution from domain/subdomain
- Tenant context injection
- Cross-tenant security

**7.4 Subscription & Billing**
- Plan selection/upgrade
- Usage limits enforcement
- Platform fee collection

**7.5 White-Label Features**
- Custom domain configuration
- Brand customization
- Email template customization

### Prompt for Task 7.1
```
Implement tenant creation flow.

Requirements:
1. Create app/signup/page.tsx:
   - Studio name input
   - Slug input (auto-generated, editable)
   - Slug availability check (debounced)
   - Email + password
   - Terms acceptance

2. Create app/api/tenants/route.ts (POST):
   - Validate slug format and uniqueness
   - Create tenant record
   - Create Stripe Connect account (Express)
   - Create owner profile with tenant_owner role
   - Send welcome email

3. Create app/onboarding/stripe/page.tsx:
   - Stripe Connect onboarding flow
   - Account link generation
   - Return URL handling
   - Completion verification

4. Create lib/tenants/create.ts:
   - createTenant(data): Creates tenant + user
   - Validates all inputs
   - Handles partial failure (cleanup)

Slugs: lowercase, alphanumeric + hyphen, 3-30 chars.
Reserved: www, app, api, admin, support, help.
```

---

## Implementation Tips

### When Starting Each Phase
1. Read the relevant section in full docs
2. Review types in SCHEMA.md
3. Check existing code patterns
4. Create plan before coding

### When Something Doesn't Work
1. Check the METHODOLOGY.md stuck recovery section
2. Verify types match schema
3. Check RLS policies
4. Look at Supabase logs

### Testing Each Phase
Run before moving to next phase:
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
