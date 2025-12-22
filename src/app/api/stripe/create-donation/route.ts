
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

/**
 * Handles POST requests to create a new Stripe Checkout Session for a one-time donation.
 * @param req The Next.js request object containing the price ID and amount.
 */
export async function POST(req: NextRequest) {
  try {
    const { priceId, userEmail, amount } = await req.json();

    if (!priceId || !amount) {
      return NextResponse.json({ error: 'Price ID and amount are required.' }, { status: 400 });
    }

    // 1. Create the Checkout Session for a one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // Set mode to 'payment' for one-time charges
      success_url: process.env.STRIPE_SUCCESS_URL!, // You might want a dedicated donation success page
      cancel_url: process.env.STRIPE_CANCEL_URL!,
      customer_email: userEmail, // Pre-fill the user's email
      submit_type: 'donate',
    });

    // 2. Return the session URL to the frontend for redirection
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe Donation Error:', error);
    // Return a generic error message to the client
    return NextResponse.json({ error: 'Failed to create Stripe Checkout session for donation.' }, { status: 500 });
  }
}
