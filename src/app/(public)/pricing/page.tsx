import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Pricing | EpicMoments Sports Photography',
  description:
    'View our sports photography pricing packages. From single events to full season coverage.',
  openGraph: {
    title: 'Pricing | EpicMoments Sports Photography',
    description:
      'View our sports photography pricing packages. From single events to full season coverage.',
    type: 'website',
  },
};

const plans = [
  {
    name: 'Single Event',
    price: 299,
    description: 'Perfect for one-time events or trying our services',
    features: [
      'Up to 3 hours of coverage',
      '100+ edited photos',
      'Online gallery',
      '48-hour delivery',
      'Digital downloads',
      'Print ordering available',
    ],
    cta: 'Book Event',
    popular: false,
  },
  {
    name: 'Season Pass',
    price: 999,
    description: 'Best value for teams with multiple events',
    features: [
      'Up to 10 events',
      '500+ edited photos',
      'Dedicated online gallery',
      '24-hour priority delivery',
      'Digital downloads for all',
      'Team discount on prints',
      'Action highlight reel',
    ],
    cta: 'Get Season Pass',
    popular: true,
  },
  {
    name: 'Tournament',
    price: 1499,
    description: 'Complete coverage for multi-day tournaments',
    features: [
      'Full tournament coverage',
      '1000+ edited photos',
      'Multiple photographers',
      'Same-day previews',
      'Priority digital delivery',
      'Bulk print discounts',
      'Championship ceremony shots',
      'Video highlights optional',
    ],
    cta: 'Book Tournament',
    popular: false,
  },
];

const addons = [
  { name: 'Extra Hour', price: 75, description: 'Additional coverage time' },
  { name: 'Rush Delivery', price: 50, description: '12-hour turnaround' },
  { name: 'Photo Album', price: 150, description: '20-page custom album' },
  { name: 'Video Highlights', price: 200, description: '2-3 minute highlight reel' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-500">
            Choose the package that fits your needs. All packages include professional
            editing and a dedicated online gallery.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 ${
                plan.popular
                  ? 'scale-105 border-2 border-blue-600 shadow-xl shadow-blue-600/20'
                  : 'border border-slate-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="mb-2 text-2xl font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-slate-900">
                  ${plan.price}
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <span className="font-bold text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block rounded-lg py-3.5 text-center text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
            Optional Add-ons
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="rounded-xl bg-white p-6 text-center shadow-sm"
              >
                <h4 className="mb-1 text-base font-semibold text-slate-900">
                  {addon.name}
                </h4>
                <p className="mb-3 text-xs text-slate-500">
                  {addon.description}
                </p>
                <span className="text-2xl font-bold text-blue-600">
                  +${addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="rounded-2xl bg-slate-100 p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Have Questions?
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-slate-500">
            Not sure which package is right for you? We&apos;re happy to help you find
            the perfect fit for your team or event.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-slate-900 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Contact Us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
