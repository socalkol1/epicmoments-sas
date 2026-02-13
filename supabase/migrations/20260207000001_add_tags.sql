-- Tags system for albums and clients
-- Supports free-form tags with autocomplete, scoped per tenant

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

-- Junction table: albums <-> tags
CREATE TABLE album_tags (
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (album_id, tag_id)
);

-- Junction table: profiles <-> tags
CREATE TABLE profile_tags (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_id, tag_id)
);

-- Indexes
CREATE INDEX idx_tags_tenant ON tags(tenant_id);
CREATE INDEX idx_tags_tenant_name ON tags(tenant_id, name);
CREATE INDEX idx_album_tags_album ON album_tags(album_id);
CREATE INDEX idx_album_tags_tag ON album_tags(tag_id);
CREATE INDEX idx_album_tags_tenant ON album_tags(tenant_id);
CREATE INDEX idx_profile_tags_profile ON profile_tags(profile_id);
CREATE INDEX idx_profile_tags_tag ON profile_tags(tag_id);
CREATE INDEX idx_profile_tags_tenant ON profile_tags(tenant_id);

-- RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_tags ENABLE ROW LEVEL SECURITY;

-- Tags policies
CREATE POLICY "Platform admins full access to tags"
  ON tags FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage tags"
  ON tags FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Tenant members can view tags"
  ON tags FOR SELECT
  USING (tenant_id = current_tenant_id());

-- Album tags policies
CREATE POLICY "Platform admins full access to album_tags"
  ON album_tags FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage album_tags"
  ON album_tags FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Clients can view tags on their albums"
  ON album_tags FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = album_tags.album_id
      AND albums.client_id = auth.uid()
    )
  );

-- Profile tags policies
CREATE POLICY "Platform admins full access to profile_tags"
  ON profile_tags FOR ALL
  USING (is_platform_admin());

CREATE POLICY "Tenant admins can manage profile_tags"
  ON profile_tags FOR ALL
  USING (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Users can view their own tags"
  ON profile_tags FOR SELECT
  USING (profile_id = auth.uid());
