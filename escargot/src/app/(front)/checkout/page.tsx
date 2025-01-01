'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialisation Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async (checkoutData: any) => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    return response.json();
  };

  const handleCheckout = async () => {
    setLoading(true);

    const checkoutData = {
      items: [
        {
          name: 'Example Product',
          image: 'https://example.com/image.jpg',
          price: 2000,
          quantity: 1,
        },
      ],
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/cancel',
    };

    try {
      const { sessionId } = await createCheckoutSession(checkoutData);

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
      alert('Checkout initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default CheckoutPage;


