import Link from 'next/link';
import { Camera, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <Camera className="h-12 w-12 text-slate-300" />
        </div>
        <h1 className="mb-2 text-6xl font-bold text-slate-900">404</h1>
        <h2 className="mb-2 text-xl font-semibold text-slate-700">Page not found</h2>
        <p className="mb-6 text-slate-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
