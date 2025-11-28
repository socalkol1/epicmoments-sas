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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '16px',
            }}
          >
            Simple, Transparent Pricing
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Choose the package that fits your needs. All packages include professional
            editing and a dedicated online gallery.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: 'relative',
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: plan.popular
                  ? '0 20px 40px rgba(37, 99, 235, 0.2)'
                  : '0 1px 3px rgba(0,0,0,0.1)',
                border: plan.popular ? '2px solid #2563eb' : '1px solid #e2e8f0',
                transform: plan.popular ? 'scale(1.05)' : 'none',
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '8px',
                }}
              >
                {plan.name}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '24px',
                }}
              >
                {plan.description}
              </p>
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  ${plan.price}
                </span>
              </div>
              <ul style={{ marginBottom: '32px' }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#475569',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: plan.popular ? '#2563eb' : 'white',
                  color: plan.popular ? 'white' : '#2563eb',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: plan.popular ? 'none' : '2px solid #2563eb',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div style={{ marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            Optional Add-ons
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            {addons.map((addon) => (
              <div
                key={addon.name}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                }}
              >
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '4px',
                  }}
                >
                  {addon.name}
                </h4>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '12px',
                  }}
                >
                  {addon.description}
                </p>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#2563eb',
                  }}
                >
                  +${addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Teaser */}
        <div
          style={{
            backgroundColor: '#f1f5f9',
            padding: '48px',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '16px',
            }}
          >
            Have Questions?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#64748b',
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px',
            }}
          >
            Not sure which package is right for you? We&apos;re happy to help you find
            the perfect fit for your team or event.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              backgroundColor: '#0f172a',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Contact Us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
