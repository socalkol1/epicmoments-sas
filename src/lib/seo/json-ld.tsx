// JSON-LD structured data helpers for SEO

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  sameAs?: string[]; // Social media URLs
}

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url?: string;
}

export interface ImageGallerySchema {
  name: string;
  description?: string;
  images: Array<{
    url: string;
    name?: string;
    description?: string;
  }>;
}

export function generateOrganizationSchema(org: OrganizationSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': org.url,
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.description && { description: org.description }),
    ...(org.email && { email: org.email }),
    ...(org.phone && { telephone: org.phone }),
    ...(org.address && {
      address: {
        '@type': 'PostalAddress',
        ...org.address,
      },
    }),
    ...(org.sameAs && { sameAs: org.sameAs }),
    priceRange: '$$',
    image: org.logo,
  };
}

export function generateProductSchema(product: ProductSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      ...(product.url && { url: product.url }),
    },
  };
}

export function generateImageGallerySchema(gallery: ImageGallerySchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: gallery.name,
    ...(gallery.description && { description: gallery.description }),
    image: gallery.images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url,
      ...(img.name && { name: img.name }),
      ...(img.description && { description: img.description }),
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper component to render JSON-LD in pages
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
