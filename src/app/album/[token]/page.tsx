import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Images, Download, Calendar, Lock } from 'lucide-react';
import type { Album, Image as ImageType, Tenant } from '@/types/supabase';
import { AlbumGallery } from '@/components/features/AlbumGallery';

interface AlbumPageProps {
  params: Promise<{ token: string }>;
}

export default async function PublicAlbumPage({ params }: AlbumPageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch album by share_token (using service role to bypass RLS for public access)
  const { data: album, error: albumError } = await supabase
    .from('albums')
    .select('*')
    .eq('share_token', token)
    .eq('is_public', true)
    .in('status', ['ready', 'delivered'])
    .single() as { data: Album | null; error: unknown };

  if (albumError || !album) {
    notFound();
  }

  // Check if album has expired
  if (album.expires_at && new Date(album.expires_at) < new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <Lock className="h-16 w-16 text-slate-300" />
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Album Expired</h1>
        <p className="mt-2 text-slate-600">
          This album link has expired. Please contact the photographer for a new link.
        </p>
      </div>
    );
  }

  // Fetch tenant info for branding
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, logo_url, primary_color')
    .eq('id', album.tenant_id)
    .single() as { data: Pick<Tenant, 'name' | 'logo_url' | 'primary_color'> | null };

  // Fetch images for this album
  const { data: images } = await supabase
    .from('images')
    .select('*')
    .eq('album_id', album.id)
    .order('sort_order', { ascending: true }) as { data: ImageType[] | null };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {tenant?.logo_url ? (
              <Image
                src={tenant.logo_url}
                alt={tenant.name}
                width={32}
                height={32}
                className="rounded"
              />
            ) : (
              <Camera className="h-8 w-8 text-blue-600" />
            )}
            <span className="text-xl font-bold">{tenant?.name || 'EpicMoments'}</span>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Powered by EpicMoments
          </Link>
        </div>
      </header>

      {/* Album Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{album.title}</h1>
              {album.description && (
                <p className="mt-2 text-lg text-slate-600">{album.description}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Images className="h-4 w-4" />
                  {album.image_count} photos
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(album.created_at)}
                </span>
              </div>
            </div>
            {/* Download all button - will be functional when downloads are implemented */}
            <button
              disabled
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white opacity-50 cursor-not-allowed"
              title="Downloads coming soon"
            >
              <Download className="h-5 w-5" />
              Download All
            </button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {images && images.length > 0 ? (
          <AlbumGallery images={images} albumTitle={album.title} albumToken={token} />
        ) : (
          <div className="rounded-xl border bg-white p-12 text-center">
            <Images className="mx-auto h-16 w-16 text-slate-300" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">No photos yet</h2>
            <p className="mt-2 text-slate-600">
              Photos are being uploaded. Check back soon!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {tenant?.name || 'EpicMoments'}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
