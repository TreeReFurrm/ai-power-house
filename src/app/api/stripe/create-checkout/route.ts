
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

/**
 * Handles POST requests to create a new Stripe Checkout Session for a subscription.
 * @param req The Next.js request object containing the price ID.
 */
export async function POST(req: NextRequest) {
  try {
    const { priceId, userEmail } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required.' }, { status: 400 });
    }

    // 1. Create the Checkout Session for a subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Set mode to 'subscription'
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
      customer_email: userEmail, // Pre-fill the user's email
    });

    // 2. Return the session URL to the frontend for redirection
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    // Return a generic error message to the client
    return NextResponse.json({ error: 'Failed to create Stripe Checkout session.' }, { status: 500 });
  }
}
