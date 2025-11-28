# Integration Guides

## Supabase

### Client Setup

```typescript
// lib/supabase/client.ts (Browser)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts (Server Components, Route Handlers)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// lib/supabase/admin.ts (Webhooks, Background Jobs - bypasses RLS)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
```

### Usage Patterns

```typescript
// Server Component
const supabase = await createClient();
const { data, error } = await supabase
  .from('albums')
  .select('*')
  .eq('tenant_id', tenantId);

// Client Component
'use client';
const supabase = createClient();
const { data } = await supabase.from('products').select('*');
```

---

## Backblaze B2 Storage

**Why B2:** $6/TB storage (vs R2 $15/TB), free egress via Cloudflare.

### Client Setup

```typescript
// lib/b2/client.ts
import { S3Client } from '@aws-sdk/client-s3';

export const b2Client = new S3Client({
  region: process.env.B2_REGION || 'us-west-004',
  endpoint: process.env.B2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export const B2_BUCKET = process.env.B2_BUCKET_NAME!;
```

### Operations

```typescript
// lib/b2/operations.ts
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Upload
export async function uploadToB2(key: string, body: Buffer, contentType: string) {
  await b2Client.send(new PutObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
}

// Signed download URL (1 hour)
export async function getSignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: B2_BUCKET, Key: key });
  return getSignedUrl(b2Client, command, { expiresIn: 3600 });
}

// Signed upload URL
export async function getSignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(b2Client, command, { expiresIn: 3600 });
}

// Delete
export async function deleteFromB2(key: string): Promise<void> {
  await b2Client.send(new DeleteObjectCommand({ Bucket: B2_BUCKET, Key: key }));
}
```

### Path Convention
```
/{tenant_id}/originals/{album_id}/{image_id}.jpg
/{tenant_id}/thumbnails/{album_id}/{image_id}.jpg
/{tenant_id}/watermarked/{album_id}/{image_id}.jpg
```

### CDN Setup (Cloudflare)
1. Add CNAME in Cloudflare pointing to B2 bucket
2. Configure cache rules for images
3. B2 is Bandwidth Alliance partner = free egress

---

## Image Processing

```typescript
// lib/images/process.ts
import sharp from 'sharp';

interface ProcessedImages {
  original: Buffer;
  thumbnail: Buffer;   // 300x300
  display: Buffer;     // 1200px max
  watermarked: Buffer;
}

export async function processImage(input: Buffer): Promise<ProcessedImages> {
  const image = sharp(input).rotate(); // Auto-orient from EXIF

  // Original (EXIF stripped)
  const original = await image.clone()
    .withMetadata({ exif: { IFD0: { Copyright: 'Photo Studio' } } })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Thumbnail
  const thumbnail = await image.clone()
    .resize(300, 300, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80 })
    .toBuffer();

  // Display size
  const display = await image.clone()
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  // Watermarked (add your watermark overlay)
  const watermarked = display; // Add watermark logic

  return { original, thumbnail, display, watermarked };
}
```

---

## Stripe

### Client Setup

```typescript
// lib/stripe/client.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

### Checkout Session

```typescript
// lib/stripe/checkout.ts
export async function createCheckoutSession(params: {
  productId: string;
  clientId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const product = await getProduct(params.productId);
  const client = await getClient(params.clientId);

  // Create pending order
  const order = await createOrder({
    client_id: params.clientId,
    product_id: params.productId,
    amount_cents: product.price_cents,
    status: 'pending',
  });

  const session = await stripe.checkout.sessions.create({
    customer_email: client.email,
    mode: 'payment',
    line_items: [{ price: product.stripe_price_id, quantity: 1 }],
    success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: params.cancelUrl,
    metadata: { order_id: order.id },
  });

  return { sessionId: session.id, url: session.url! };
}
```

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session.metadata.order_id);
      break;
    case 'payment_intent.payment_failed':
      // Handle failure
      break;
  }

  return Response.json({ received: true });
}
```

### Stripe Connect (Multi-Tenant)

```typescript
// lib/stripe/connect.ts

// Create connected account for tenant
export async function createConnectedAccount(tenantId: string, email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: { tenant_id: tenantId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  return account;
}

// Checkout with platform fee
export async function createTenantCheckout(tenantId: string, productId: string) {
  const tenant = await getTenant(tenantId);
  const product = await getProduct(productId);
  const feePercent = PLANS[tenant.subscription_plan].platform_fee_percent;
  const platformFee = Math.round(product.price_cents * (feePercent / 100));

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: product.stripe_price_id, quantity: 1 }],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: { destination: tenant.stripe_account_id },
    },
    success_url: `${tenant.domain}/checkout/success`,
    cancel_url: `${tenant.domain}/checkout/cancel`,
  });
}
```

---

## SendGrid Email

```typescript
// lib/email/sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  await sgMail.send({
    to: params.to,
    from: { email: 'photos@yourdomain.com', name: 'Photo Studio' },
    subject: params.subject,
    html: params.html,
  });
}

// lib/email/templates.ts
export const templates = {
  albumReady: (data: { clientName: string; albumTitle: string; portalUrl: string }) => ({
    subject: `Your photos are ready: ${data.albumTitle}`,
    html: `
      <h1>Hi ${data.clientName}!</h1>
      <p>Your photos from <strong>${data.albumTitle}</strong> are ready to view.</p>
      <a href="${data.portalUrl}">View Your Photos</a>
    `,
  }),

  orderConfirmation: (data: { clientName: string; productName: string; amount: string }) => ({
    subject: `Order confirmed: ${data.productName}`,
    html: `
      <h1>Thank you, ${data.clientName}!</h1>
      <p>Your order for <strong>${data.productName}</strong> is confirmed.</p>
      <p>Amount: ${data.amount}</p>
    `,
  }),
};
```

---

## Rate Limiting (Upstash)

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiters = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '10 s'),
    prefix: 'ratelimit:api',
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'ratelimit:auth',
  }),
  downloads: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 h'),
    prefix: 'ratelimit:downloads',
  }),
};

export async function rateLimit(identifier: string, type: keyof typeof rateLimiters = 'api') {
  const { success } = await rateLimiters[type].limit(identifier);
  if (!success) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
  }
  return null;
}
```

---

## Pagination Helper

```typescript
// lib/supabase/pagination.ts
export async function paginatedQuery<T>(
  supabase: SupabaseClient,
  table: string,
  { page, pageSize }: { page: number; pageSize: number },
  filters?: (query: any) => any
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(table)
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (filters) query = filters(query);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as T[],
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
      hasNext: page < Math.ceil((count || 0) / pageSize),
      hasPrev: page > 1,
    },
  };
}
```
