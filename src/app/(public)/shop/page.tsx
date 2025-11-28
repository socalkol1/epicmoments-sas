import { Metadata } from 'next';
import Link from 'next/link';
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
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            Photography Packages
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-500">
            Choose the perfect package for your needs. All packages include professional
            editing and color correction.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Custom Package CTA */}
        <div className="mt-16 rounded-2xl bg-slate-900 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Need a Custom Package?
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-slate-400">
            Contact us for team packages, event coverage, or any special requirements.
            We&apos;ll create a package that fits your needs.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-8 py-4 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          >
            Get in Touch
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
