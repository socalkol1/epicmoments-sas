import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://epicmoments.photo';

  // Static pages
  const staticPages = [
    '',
    '/portfolio',
    '/shop',
    '/pricing',
    '/about',
    '/contact',
    '/login',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route === '/portfolio' ? 0.9 : 0.8,
  }));

  // In production, you would also add dynamic pages here:
  // - Individual portfolio images
  // - Product pages
  // - Blog posts if applicable

  return staticEntries;
}
