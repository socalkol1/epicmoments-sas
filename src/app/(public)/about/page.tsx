import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'About | EpicMoments Sports Photography',
  description:
    'Learn about EpicMoments Sports Photography. Professional action photography capturing the spirit of competition.',
  openGraph: {
    title: 'About | EpicMoments Sports Photography',
    description:
      'Learn about EpicMoments Sports Photography. Professional action photography capturing the spirit of competition.',
    type: 'website',
  },
};

const stats = [
  { number: '500+', label: 'Events Covered' },
  { number: '50K+', label: 'Photos Delivered' },
  { number: '10K+', label: 'Happy Athletes' },
  { number: '8', label: 'Years Experience' },
];

const approaches = [
  {
    title: 'Professional Equipment',
    description:
      'We use top-of-the-line cameras and lenses designed for fast action capture, ensuring crisp images in any conditions.',
    icon: '📷',
  },
  {
    title: 'Quick Turnaround',
    description:
      "Photos are edited and delivered within 48 hours, so you can relive the excitement while it's still fresh.",
    icon: '⚡',
  },
  {
    title: 'Athlete-Focused',
    description:
      'We understand sports. Our photographers know when and where to be to capture the decisive moments.',
    icon: '🎯',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Capturing Athletic Excellence Since 2015
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-slate-500">
              EpicMoments was founded with a simple mission: to freeze those split-second
              moments of athletic triumph that define careers and inspire generations.
            </p>
            <p className="text-lg leading-relaxed text-slate-500">
              From youth leagues to professional championships, we bring the same passion
              and expertise to every event we cover.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://picsum.photos/seed/about1/800/600"
              alt="Photographer at work"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-8 text-center shadow-sm"
            >
              <div className="mb-2 text-4xl font-bold text-blue-600">
                {stat.number}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Approach */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Our Approach
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {approaches.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-slate-900 p-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Capture Your Next Event?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-lg text-slate-400">
            Let&apos;s discuss how we can help preserve your team&apos;s greatest moments.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get in Touch
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
