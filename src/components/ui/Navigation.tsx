import Link from 'next/link';
import { Camera } from 'lucide-react';

interface NavigationProps {
  showAuthButtons?: boolean;
}

export function Navigation({ showAuthButtons = true }: NavigationProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">PhotoStudio</span>
        </Link>

        {showAuthButtons && (
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
