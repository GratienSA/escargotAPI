import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Instance Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Gestion des erreurs
const handleError = (error: any) => {
  console.error('Stripe error:', error);

  if (error instanceof Stripe.errors.StripeError) {
    return {
      message: error.message,
      type: error.type,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unknown error occurred.' };
};

const getBaseUrl = (headers: Headers) => {
  const origin = headers.get('origin');
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (origin) return origin;
  if (envUrl) return envUrl;
  return 'http://localhost:3000';
};

// Validation des données d'entrée
const itemsSchema = z.array(
  z.object({
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string().optional(),
  })
);

const bodySchema = z.object({
  items: itemsSchema,
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// POST Handler
export async function POST(request: Request) {
  try {
    // Validation du corps de la requête
    const { items, successUrl, cancelUrl } = bodySchema.parse(await request.json());

    const baseUrl = getBaseUrl(request.headers);

    // Validation stricte des URLs
    const successUrlFinal = successUrl || `${baseUrl}/success`;
    const cancelUrlFinal = cancelUrl || `${baseUrl}/cart`;

    if (!successUrlFinal.startsWith('http://') && !successUrlFinal.startsWith('https://')) {
      throw new Error('Invalid success URL');
    }

    if (!cancelUrlFinal.startsWith('http://') && !cancelUrlFinal.startsWith('https://')) {
      throw new Error('Invalid cancel URL');
    }

    // Transformation des articles
    const line_items = items.map((item) => {
      const product_data: any = { name: item.name };
      if (item.image) {
        product_data.images = [item.image];
      }

      return {
        price_data: {
          currency: 'eur',
          product_data,
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    if (line_items.length === 0) {
      throw new Error('No items provided for the Stripe session.');
    }

    // Logs pour déboguer
    console.log('Base URL:', baseUrl);
    console.log('Success URL:', successUrlFinal);
    console.log('Cancel URL:', cancelUrlFinal);
    console.log('Line Items:', JSON.stringify(line_items, null, 2));

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrlFinal,
      cancel_url: cancelUrlFinal,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    const errorDetails = handleError(error);
    return NextResponse.json({ error: errorDetails.message }, { status: 500 });
  }
}
