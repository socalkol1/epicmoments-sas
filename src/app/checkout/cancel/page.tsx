import { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Payment Cancelled | EpicMoments',
  description: 'Your payment was cancelled. No charges were made.',
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <XCircle className="h-16 w-16 text-slate-400" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Payment Cancelled
          </h1>

          <p className="mb-8 text-lg text-slate-600">
            Your payment was cancelled and no charges were made.
            Feel free to try again when you&apos;re ready.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Return to Shop
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
