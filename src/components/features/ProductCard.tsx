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
      className={`relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        product.popular ? 'border-2 border-blue-600' : 'border border-slate-200'
      }`}
    >
      {/* Popular badge */}
      {product.popular && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Popular
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[16/10] w-full bg-slate-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          {product.name}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <ul className="mb-5 space-y-2">
            {product.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Price and CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-slate-900">
            {formatPrice(product.price_cents)}
          </span>
          <Link
            href={`/checkout?product=${product.id}`}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
