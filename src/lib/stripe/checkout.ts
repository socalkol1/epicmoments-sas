import { stripe } from './client';

interface CreateCheckoutParams {
  productName: string;
  productDescription: string;
  priceInCents: number;
  productId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: params.productName,
            description: params.productDescription,
          },
          unit_amount: params.priceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      product_id: params.productId,
      ...params.metadata,
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId);
}
