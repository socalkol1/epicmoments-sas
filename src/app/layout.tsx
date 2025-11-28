import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://epicmoments.photo';

export const metadata: Metadata = {
  title: {
    default: 'EpicMoments - Professional Sports Photography',
    template: '%s | EpicMoments',
  },
  description:
    'Professional sports photography capturing athletic excellence. Action shots, team photos, and event coverage.',
  keywords: [
    'sports photography',
    'action photography',
    'athletic photography',
    'team photos',
    'event photography',
    'sports photographer',
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'EpicMoments Sports Photography',
    title: 'EpicMoments - Professional Sports Photography',
    description:
      'Professional sports photography capturing athletic excellence. Action shots, team photos, and event coverage.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EpicMoments - Professional Sports Photography',
    description:
      'Professional sports photography capturing athletic excellence. Action shots, team photos, and event coverage.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': baseUrl,
  name: 'EpicMoments Sports Photography',
  url: baseUrl,
  description: 'Professional sports photography capturing athletic excellence since 2015.',
  email: 'info@epicmoments.photo',
  telephone: '+1-555-123-4567',
  priceRange: '$$',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
