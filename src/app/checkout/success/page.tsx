import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { getCheckoutSession } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Payment Successful | EpicMoments',
  description: 'Your payment was successful. Thank you for your purchase!',
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let customerEmail: string | null = null;
  let amountTotal: number | null = null;

  if (sessionId) {
    try {
      const session = await getCheckoutSession(sessionId);
      customerEmail = session.customer_details?.email ?? null;
      amountTotal = session.amount_total;
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Payment Successful!
          </h1>

          <p className="mb-6 text-lg text-slate-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {amountTotal && (
            <p className="mb-2 text-slate-600">
              <span className="font-semibold">Amount paid:</span>{' '}
              ${(amountTotal / 100).toFixed(2)}
            </p>
          )}

          {customerEmail && (
            <p className="mb-8 text-slate-600">
              A confirmation email will be sent to{' '}
              <span className="font-semibold">{customerEmail}</span>
            </p>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
            <Link
              href="/portal"
              className="rounded-lg border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
