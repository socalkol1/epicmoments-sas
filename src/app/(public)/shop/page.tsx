import { Metadata } from 'next';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ProductCard, Product } from '@/components/features/ProductCard';

export const metadata: Metadata = {
  title: 'Shop | EpicMoments Sports Photography',
  description:
    'Purchase professional sports photography packages. Digital downloads, prints, and custom packages available.',
  openGraph: {
    title: 'Shop | EpicMoments Sports Photography',
    description:
      'Purchase professional sports photography packages. Digital downloads, prints, and custom packages available.',
    type: 'website',
  },
};

// Sample products - in production these come from the database
const products: Product[] = [
  {
    id: 'digital-basic',
    name: 'Digital Basic',
    description: 'Perfect for sharing on social media and keeping digital memories.',
    price_cents: 4999,
    image_url: 'https://picsum.photos/seed/product1/800/500',
    features: [
      '10 high-resolution digital images',
      'Web-optimized versions included',
      'Personal use license',
      'Download within 24 hours',
    ],
  },
  {
    id: 'digital-pro',
    name: 'Digital Pro',
    description: 'Our most popular package with all your event photos.',
    price_cents: 9999,
    image_url: 'https://picsum.photos/seed/product2/800/500',
    features: [
      'All event photos (50+ images)',
      'High-resolution downloads',
      'Web-optimized versions',
      'Commercial use license',
      'Online gallery for 1 year',
    ],
    popular: true,
  },
  {
    id: 'print-package',
    name: 'Print Package',
    description: 'Beautiful prints delivered to your door.',
    price_cents: 14999,
    image_url: 'https://picsum.photos/seed/product3/800/500',
    features: [
      '20 premium prints (8x10)',
      'Archival quality paper',
      'Free shipping included',
      'Digital copies included',
      'Custom framing available',
    ],
  },
  {
    id: 'ultimate-bundle',
    name: 'Ultimate Bundle',
    description: 'Everything you need - digital, prints, and exclusive extras.',
    price_cents: 24999,
    image_url: 'https://picsum.photos/seed/product4/800/500',
    features: [
      'All event photos (digital)',
      '30 premium prints',
      'Custom photo album',
      'Behind-the-scenes shots',
      'Priority delivery',
      'Lifetime storage',
    ],
  },
];

export default function ShopPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '16px',
            }}
          >
            Photography Packages
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Choose the perfect package for your needs. All packages include professional
            editing and color correction.
          </p>
        </div>

        {/* Products Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Custom Package CTA */}
        <div
          style={{
            marginTop: '64px',
            padding: '48px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Need a Custom Package?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#94a3b8',
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px',
            }}
          >
            Contact us for team packages, event coverage, or any special requirements.
            We&apos;ll create a package that fits your needs.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              backgroundColor: 'white',
              color: '#0f172a',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Get in Touch
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
