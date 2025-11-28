import { Metadata } from 'next';
import Image from 'next/image';
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

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        {/* Hero Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '64px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '24px',
                lineHeight: 1.2,
              }}
            >
              Capturing Athletic Excellence Since 2015
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: '#64748b',
                lineHeight: 1.7,
                marginBottom: '16px',
              }}
            >
              EpicMoments was founded with a simple mission: to freeze those split-second
              moments of athletic triumph that define careers and inspire generations.
            </p>
            <p
              style={{
                fontSize: '18px',
                color: '#64748b',
                lineHeight: 1.7,
              }}
            >
              From youth leagues to professional championships, we bring the same passion
              and expertise to every event we cover.
            </p>
          </div>
          <div
            style={{
              position: 'relative',
              aspectRatio: '4 / 3',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Image
              src="https://picsum.photos/seed/about1/800/600"
              alt="Photographer at work"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {[
            { number: '500+', label: 'Events Covered' },
            { number: '50K+', label: 'Photos Delivered' },
            { number: '10K+', label: 'Happy Athletes' },
            { number: '8', label: 'Years Experience' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#2563eb',
                  marginBottom: '8px',
                }}
              >
                {stat.number}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Approach */}
        <div style={{ marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            Our Approach
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}
          >
            {[
              {
                title: 'Professional Equipment',
                description:
                  'We use top-of-the-line cameras and lenses designed for fast action capture, ensuring crisp images in any conditions.',
                icon: '📷',
              },
              {
                title: 'Quick Turnaround',
                description:
                  'Photos are edited and delivered within 48 hours, so you can relive the excitement while it\'s still fresh.',
                icon: '⚡',
              },
              {
                title: 'Athlete-Focused',
                description:
                  'We understand sports. Our photographers know when and where to be to capture the decisive moments.',
                icon: '🎯',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: 'white',
                  padding: '32px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '12px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '64px',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Ready to Capture Your Next Event?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px',
            }}
          >
            Let&apos;s discuss how we can help preserve your team&apos;s greatest moments.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '16px 32px',
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
