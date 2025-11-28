import { Metadata } from 'next';
import { PortfolioGallery, PortfolioImage } from '@/components/features';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Portfolio | EpicMoments Sports Photography',
  description:
    'Browse our portfolio of professional sports photography. Capturing the passion, intensity, and emotion of athletes in action.',
  openGraph: {
    title: 'Portfolio | EpicMoments Sports Photography',
    description:
      'Browse our portfolio of professional sports photography. Capturing the passion, intensity, and emotion of athletes in action.',
    type: 'website',
  },
};

// Sample images using picsum.photos for development
// In production, these would come from the database (images where is_portfolio=true)
const sampleImages: PortfolioImage[] = [
  {
    id: '1',
    src: 'https://picsum.photos/seed/sport1/800/1200',
    alt: 'Basketball player in action',
    width: 800,
    height: 1200,
    category: 'Basketball',
  },
  {
    id: '2',
    src: 'https://picsum.photos/seed/sport2/1200/800',
    alt: 'Soccer match moment',
    width: 1200,
    height: 800,
    category: 'Soccer',
  },
  {
    id: '3',
    src: 'https://picsum.photos/seed/sport3/800/800',
    alt: 'Football touchdown celebration',
    width: 800,
    height: 800,
    category: 'Football',
  },
  {
    id: '4',
    src: 'https://picsum.photos/seed/sport4/800/1000',
    alt: 'Track and field athlete',
    width: 800,
    height: 1000,
    category: 'Track & Field',
  },
  {
    id: '5',
    src: 'https://picsum.photos/seed/sport5/1000/800',
    alt: 'Swimming competition',
    width: 1000,
    height: 800,
    category: 'Swimming',
  },
  {
    id: '6',
    src: 'https://picsum.photos/seed/sport6/800/1100',
    alt: 'Basketball dunk',
    width: 800,
    height: 1100,
    category: 'Basketball',
  },
  {
    id: '7',
    src: 'https://picsum.photos/seed/sport7/1100/800',
    alt: 'Soccer goal celebration',
    width: 1100,
    height: 800,
    category: 'Soccer',
  },
  {
    id: '8',
    src: 'https://picsum.photos/seed/sport8/800/900',
    alt: 'Football quarterback throw',
    width: 800,
    height: 900,
    category: 'Football',
  },
  {
    id: '9',
    src: 'https://picsum.photos/seed/sport9/900/800',
    alt: 'Tennis serve',
    width: 900,
    height: 800,
    category: 'Tennis',
  },
  {
    id: '10',
    src: 'https://picsum.photos/seed/sport10/800/1200',
    alt: 'Baseball pitch',
    width: 800,
    height: 1200,
    category: 'Baseball',
  },
  {
    id: '11',
    src: 'https://picsum.photos/seed/sport11/1200/800',
    alt: 'Hockey game action',
    width: 1200,
    height: 800,
    category: 'Hockey',
  },
  {
    id: '12',
    src: 'https://picsum.photos/seed/sport12/800/950',
    alt: 'Volleyball spike',
    width: 800,
    height: 950,
    category: 'Volleyball',
  },
];

const categories = [
  'Basketball',
  'Soccer',
  'Football',
  'Track & Field',
  'Swimming',
  'Tennis',
  'Baseball',
  'Hockey',
  'Volleyball',
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Our Portfolio</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Capturing the passion, intensity, and emotion of athletes in action. Browse
            our collection of professional sports photography.
          </p>
        </div>

        {/* Gallery */}
        <PortfolioGallery images={sampleImages} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
