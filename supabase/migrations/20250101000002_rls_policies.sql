-- Enable Row Level Security on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- TENANTS policies
CREATE POLICY "Platform admins can manage all tenants"
  ON tenants FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant owners can view their tenant"
  ON tenants FOR SELECT
  USING (id = current_tenant_id());

CREATE POLICY "Tenant owners can update their tenant"
  ON tenants FOR UPDATE
  USING (is_tenant_owner(id));

-- PROFILES policies
CREATE POLICY "Platform admins can manage all profiles"
  ON profiles FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Tenant admins can view tenant profiles"
  ON profiles FOR SELECT
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Tenant admins can manage tenant profiles"
  ON profiles FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

-- EVENTS policies
CREATE POLICY "Platform admins full access to events"
  ON events FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage events"
  ON events FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Clients can view their tenant's events"
  ON events FOR SELECT
  USING (tenant_id = current_tenant_id());

-- ALBUMS policies
CREATE POLICY "Platform admins full access to albums"
  ON albums FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage albums"
  ON albums FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Clients can view their own albums"
  ON albums FOR SELECT
  USING (tenant_id = current_tenant_id() AND client_id = auth.uid());

-- IMAGES policies
CREATE POLICY "Platform admins full access to images"
  ON images FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage images"
  ON images FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Clients can view images in their albums"
  ON images FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = images.album_id
      AND albums.client_id = auth.uid()
    )
  );

CREATE POLICY "Public can view portfolio images"
  ON images FOR SELECT
  USING (is_portfolio = TRUE);

-- PRODUCTS policies
CREATE POLICY "Platform admins full access to products"
  ON products FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage products"
  ON products FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- ORDERS policies
CREATE POLICY "Platform admins full access to orders"
  ON orders FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage orders"
  ON orders FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Clients can view their own orders"
  ON orders FOR SELECT
  USING (tenant_id = current_tenant_id() AND client_id = auth.uid());

CREATE POLICY "Clients can create orders"
  ON orders FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id() AND client_id = auth.uid());

-- ACTIVITY_LOG policies
CREATE POLICY "Platform admins full access to activity log"
  ON activity_log FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can view tenant activity"
  ON activity_log FOR SELECT
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Users can view their own activity"
  ON activity_log FOR SELECT
  USING (user_id = auth.uid());
