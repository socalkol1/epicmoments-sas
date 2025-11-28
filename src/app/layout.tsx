import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'PhotoStudio - Professional Photography Platform',
    template: '%s | PhotoStudio',
  },
  description:
    'Professional photography platform for sports photographers. Manage clients, deliver albums, and sell packages.',
  keywords: ['photography', 'sports photography', 'photo albums', 'photographer platform'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
