import Link from 'next/link';
import { Camera, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Professional Photography
            <br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            The all-in-one platform for sports photographers. Manage clients, deliver stunning
            albums, and sell packages — all from one beautiful dashboard.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-8 pb-20 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Client Management</h3>
            <p className="mt-2 text-slate-600">
              Keep track of all your clients, their events, and order history in one place.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Album Delivery</h3>
            <p className="mt-2 text-slate-600">
              Upload, organize, and deliver high-quality photo albums with watermarked previews.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">E-Commerce</h3>
            <p className="mt-2 text-slate-600">
              Sell packages, prints, and digital downloads with integrated Stripe payments.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
