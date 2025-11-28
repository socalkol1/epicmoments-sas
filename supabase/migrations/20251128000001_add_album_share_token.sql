-- Add share_token to albums for secure public sharing
-- The share_token is a random string used in URLs instead of the album ID
-- This provides security through obscurity - only people with the link can access

-- Enable pgcrypto for gen_random_bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE albums ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
ALTER TABLE albums ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE albums ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE albums ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Generate share tokens for existing albums using gen_random_uuid as fallback
UPDATE albums SET share_token = replace(gen_random_uuid()::text, '-', '') WHERE share_token IS NULL;

-- Make share_token NOT NULL after populating existing rows
ALTER TABLE albums ALTER COLUMN share_token SET NOT NULL;
ALTER TABLE albums ALTER COLUMN share_token SET DEFAULT replace(gen_random_uuid()::text, '-', '');

-- Create index for fast lookups by share_token
CREATE INDEX IF NOT EXISTS idx_albums_share_token ON albums(share_token);

-- Allow public access to albums via share_token (no auth required)
-- This policy allows anyone to read an album if they know the share_token
CREATE POLICY "Public can view albums via share_token" ON albums
  FOR SELECT
  USING (
    is_public = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND status IN ('ready', 'delivered')
  );

-- Also allow public to view images from public albums
CREATE POLICY "Public can view images from public albums" ON images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = images.album_id
      AND albums.is_public = true
      AND (albums.expires_at IS NULL OR albums.expires_at > NOW())
      AND albums.status IN ('ready', 'delivered')
    )
  );

COMMENT ON COLUMN albums.share_token IS 'Random token used in public share URLs instead of exposing the album ID';
COMMENT ON COLUMN albums.is_public IS 'Whether the album can be accessed via public share link';
COMMENT ON COLUMN albums.password_hash IS 'Optional password protection for the album (bcrypt hash)';
COMMENT ON COLUMN albums.expires_at IS 'Optional expiration date for the share link';
