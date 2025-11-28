# Database Schema

> Complete schema with multi-tenancy. Every business table has `tenant_id`.

## Entity Relationship

```
tenants (SaaS customers)
  └─► profiles (users - tenant-scoped)
  └─► events (photo shoots)
  └─► albums (photo collections)
       └─► images
  └─► products (packages, prints)
  └─► orders (purchases)
  └─► notifications (emails sent)
  └─► activity_log (audit trail)
```

## Key Tables

### tenants
Core SaaS table - each photographer/studio is a tenant.

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,           -- subdomain: {slug}.photostudio.app
  name TEXT NOT NULL,                  -- "Smith Photography"
  custom_domain TEXT UNIQUE,           -- photos.smithphotography.com
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  
  -- Subscription
  subscription_plan TEXT NOT NULL DEFAULT 'free' 
    CHECK (subscription_plan IN ('free', 'pro', 'studio', 'enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'past_due', 'cancelled', 'suspended')),
  stripe_account_id TEXT,              -- Stripe Connect account
  stripe_subscription_id TEXT,         -- Platform subscription
  
  -- Usage
  storage_used_bytes BIGINT NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  
  owner_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### profiles
Users - extends Supabase auth.users, tenant-scoped.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' 
    CHECK (role IN ('platform_admin', 'tenant_owner', 'tenant_admin', 'tenant_staff', 'client')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, email)  -- Same person can be client of multiple studios
);
```

### albums
Photo collections for clients.

```sql
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  client_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'processing', 'proofing', 'ready', 'delivered')),
  cover_image_key TEXT,
  image_count INT NOT NULL DEFAULT 0,
  total_size_bytes BIGINT NOT NULL DEFAULT 0,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### images
Individual photos in albums.

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  album_id UUID NOT NULL REFERENCES albums(id),
  storage_key TEXT NOT NULL,      -- {tenant_id}/originals/{album_id}/{uuid}.jpg
  thumbnail_key TEXT,
  watermarked_key TEXT,
  original_filename TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  is_portfolio BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### orders
Purchases by clients.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),
  album_id UUID REFERENCES albums(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'fulfilled', 'refunded', 'cancelled')),
  amount_cents INT NOT NULL,
  platform_fee_cents INT DEFAULT 0,  -- Fee taken by platform
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Helper Functions

```sql
-- Check if current user is platform admin
CREATE FUNCTION is_platform_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'platform_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Get current user's tenant_id
CREATE FUNCTION current_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is admin of their tenant
CREATE FUNCTION is_tenant_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('tenant_owner', 'tenant_admin', 'platform_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## RLS Policies Pattern

Every table follows this pattern:

```sql
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;

-- Platform admins see everything
CREATE POLICY "Platform admins full access"
  ON [table] FOR ALL
  USING (is_platform_admin());

-- Tenant admins manage their tenant's data
CREATE POLICY "Tenant admins manage tenant data"
  ON [table] FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

-- Clients see only their own data
CREATE POLICY "Clients see own data"
  ON [table] FOR SELECT
  USING (tenant_id = current_tenant_id() AND client_id = auth.uid());
```

---

## TypeScript Types

```typescript
// src/types/database.ts

// Enums
export type UserRole = 'platform_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff' | 'client';
export type SubscriptionPlan = 'free' | 'pro' | 'studio' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'suspended';
export type AlbumStatus = 'draft' | 'processing' | 'proofing' | 'ready' | 'delivered';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'fulfilled' | 'refunded' | 'cancelled';
export type ProductType = 'package' | 'template' | 'print' | 'addon';

// Tenant
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  custom_domain: string | null;
  logo_url: string | null;
  primary_color: string;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  stripe_account_id: string | null;
  storage_used_bytes: number;
  settings: TenantSettings;
  features: TenantFeatures;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  email_from_name?: string;
  timezone?: string;
  currency?: string;
}

export interface TenantFeatures {
  custom_domain_enabled?: boolean;
  white_label_enabled?: boolean;
}

// Profile
export interface Profile {
  id: string;
  tenant_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

// Album
export interface Album {
  id: string;
  tenant_id: string;
  event_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
  status: AlbumStatus;
  cover_image_key: string | null;
  image_count: number;
  total_size_bytes: number;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

// Image
export interface Image {
  id: string;
  tenant_id: string;
  album_id: string;
  storage_key: string;
  thumbnail_key: string | null;
  watermarked_key: string | null;
  original_filename: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  is_portfolio: boolean;
  sort_order: number;
  created_at: string;
}

// Order
export interface Order {
  id: string;
  tenant_id: string;
  client_id: string;
  product_id: string;
  album_id: string | null;
  status: OrderStatus;
  amount_cents: number;
  platform_fee_cents: number;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
}

// Product
export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  product_type: ProductType;
  image_count: number | null;
  stripe_price_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// With relations
export interface AlbumWithImages extends Album {
  images: Image[];
}

export interface AlbumWithClient extends Album {
  client: Profile | null;
}

export interface OrderWithDetails extends Order {
  client: Profile;
  product: Product;
  album: Album | null;
}
```

---

## Indexes

All tables have indexes on:
- `tenant_id` (partition queries by tenant)
- Foreign keys
- Common query patterns (status, date, etc.)

```sql
-- Example indexes
CREATE INDEX idx_albums_tenant ON albums(tenant_id);
CREATE INDEX idx_albums_client ON albums(tenant_id, client_id);
CREATE INDEX idx_albums_status ON albums(tenant_id, status);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
```

---

## Migrations

Store in `supabase/migrations/`:

```
supabase/migrations/
├── 20250101000000_initial_schema.sql
├── 20250101000001_rls_policies.sql
├── 20250101000002_functions.sql
├── 20250101000003_triggers.sql
└── 20250102000000_add_platform_billing.sql
```

Commands:
```bash
supabase db reset          # Reset and reapply all migrations
supabase db diff -f name   # Generate migration from changes
supabase migration new x   # Create empty migration file
```
