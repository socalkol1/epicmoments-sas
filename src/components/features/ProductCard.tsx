'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string;
  features?: string[];
  popular?: boolean;
}

interface ProductCardProps {
  product: Product;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: product.popular ? '2px solid #2563eb' : '1px solid #e2e8f0',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Popular badge */}
      {product.popular && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#2563eb',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '20px',
            zIndex: 10,
          }}
        >
          Popular
        </div>
      )}

      {/* Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          backgroundColor: '#f1f5f9',
        }}
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '8px',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '16px',
            lineHeight: 1.5,
          }}
        >
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <ul style={{ marginBottom: '20px' }}>
            {product.features.map((feature, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#475569',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: '#22c55e' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Price and CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {formatPrice(product.price_cents)}
          </span>
          <Link
            href={`/checkout?product=${product.id}`}
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
