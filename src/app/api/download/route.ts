import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const downloadSchema = z.object({
  albumToken: z.string().min(1),
  imageId: z.string().uuid().optional(),
  type: z.enum(['single', 'all']).default('single'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = downloadSchema.parse(body);

    const supabase = await createClient();

    // Verify album access via share_token
    const { data: album, error: albumError } = await supabase
      .from('albums')
      .select('id, tenant_id, title, is_public, status, expires_at')
      .eq('share_token', validated.albumToken)
      .eq('is_public', true)
      .in('status', ['ready', 'delivered'])
      .single();

    if (albumError || !album) {
      return NextResponse.json(
        { error: 'Album not found or access denied' },
        { status: 404 }
      );
    }

    // Check expiration
    if (album.expires_at && new Date(album.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Album link has expired' },
        { status: 403 }
      );
    }

    if (validated.type === 'single' && validated.imageId) {
      // Download single image
      const { data: image, error: imageError } = await supabase
        .from('images')
        .select('id, storage_key, original_filename')
        .eq('id', validated.imageId)
        .eq('album_id', album.id)
        .single();

      if (imageError || !image) {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }

      // TODO: Generate signed URL from B2 storage
      // For now, return the storage key (in production, this would be a signed URL)
      return NextResponse.json({
        success: true,
        downloadUrl: image.storage_key,
        filename: image.original_filename || `photo-${image.id}.jpg`,
      });
    } else {
      // Download all images (zip)
      const { data: images, error: imagesError } = await supabase
        .from('images')
        .select('id, storage_key, original_filename')
        .eq('album_id', album.id)
        .order('sort_order', { ascending: true });

      if (imagesError || !images || images.length === 0) {
        return NextResponse.json(
          { error: 'No images found in album' },
          { status: 404 }
        );
      }

      // TODO: Generate zip file with all images
      // For now, return the list of images that would be included
      return NextResponse.json({
        success: true,
        message: 'Bulk download coming soon',
        imageCount: images.length,
        albumTitle: album.title,
      });
    }
  } catch (error) {
    console.error('Download error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}
