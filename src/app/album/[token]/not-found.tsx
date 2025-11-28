import Link from 'next/link';
import { Camera, ImageOff } from 'lucide-react';

export default function AlbumNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">EpicMoments</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <ImageOff className="h-24 w-24 text-slate-300" />
        <h1 className="mt-6 text-3xl font-bold text-slate-900">Album Not Found</h1>
        <p className="mt-3 max-w-md text-center text-slate-600">
          This album doesn&apos;t exist or is no longer available.
          The link may be incorrect or the album may have been removed.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
