-- Add category column to images for portfolio filtering
ALTER TABLE images ADD COLUMN category TEXT;

-- Add features column to products for displaying package features
ALTER TABLE products ADD COLUMN features TEXT[];

-- Add image_url column to products for display
ALTER TABLE products ADD COLUMN image_url TEXT;

-- Add popular flag to products
ALTER TABLE products ADD COLUMN is_popular BOOLEAN DEFAULT FALSE;

-- Create index for category filtering
CREATE INDEX idx_images_category ON images(category) WHERE category IS NOT NULL;
