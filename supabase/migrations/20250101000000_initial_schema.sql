-- Enums
CREATE TYPE user_role AS ENUM ('platform_admin', 'tenant_owner', 'tenant_admin', 'tenant_staff', 'client');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'studio', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'suspended');
CREATE TYPE album_status AS ENUM ('draft', 'processing', 'proofing', 'ready', 'delivered');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'fulfilled', 'refunded', 'cancelled');
CREATE TYPE product_type AS ENUM ('package', 'template', 'print', 'addon');

-- Tenants table (SaaS customers - photographers/studios)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  custom_domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  subscription_plan subscription_plan NOT NULL DEFAULT 'free',
  subscription_status subscription_status NOT NULL DEFAULT 'active',
  stripe_account_id TEXT,
  stripe_subscription_id TEXT,
  storage_used_bytes BIGINT NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  owner_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- Add foreign key from tenants to profiles for owner
ALTER TABLE tenants ADD CONSTRAINT fk_tenants_owner FOREIGN KEY (owner_id) REFERENCES profiles(id);

-- Events table (photo shoots)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE,
  location TEXT,
  sport TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Albums table (photo collections)
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  client_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status album_status NOT NULL DEFAULT 'draft',
  cover_image_key TEXT,
  image_count INT NOT NULL DEFAULT 0,
  total_size_bytes BIGINT NOT NULL DEFAULT 0,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Images table (individual photos)
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
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

-- Products table (packages, prints, etc.)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  product_type product_type NOT NULL,
  image_count INT,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table (purchases)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),
  album_id UUID REFERENCES albums(id),
  status order_status NOT NULL DEFAULT 'pending',
  amount_cents INT NOT NULL,
  platform_fee_cents INT DEFAULT 0,
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity log for audit trail
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_tenant ON profiles(tenant_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_events_tenant ON events(tenant_id);
CREATE INDEX idx_albums_tenant ON albums(tenant_id);
CREATE INDEX idx_albums_client ON albums(tenant_id, client_id);
CREATE INDEX idx_albums_status ON albums(tenant_id, status);
CREATE INDEX idx_images_tenant ON images(tenant_id);
CREATE INDEX idx_images_album ON images(album_id);
CREATE INDEX idx_images_portfolio ON images(tenant_id, is_portfolio) WHERE is_portfolio = TRUE;
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_active ON products(tenant_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_client ON orders(tenant_id, client_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_activity_tenant ON activity_log(tenant_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
