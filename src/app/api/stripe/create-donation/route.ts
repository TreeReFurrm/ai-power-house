
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

/**
 * Handles POST requests to create a new Stripe Checkout Session for a one-time donation.
 * Can handle both fixed-price items and custom amounts.
 * @param req The Next.js request object containing the price ID and amount.
 */
export async function POST(req: NextRequest) {
  try {
    const { priceId, userEmail, amount, isCustom } = await req.json();

    if (!userEmail) {
         return NextResponse.json({ error: 'User email is required.' }, { status: 400 });
    }

    let line_items;

    if (isCustom) {
        // For custom amounts, we use a price ID that has adjustable quantities or is set up for one-time payments.
        // Or, more robustly, we create a price on the fly. Here, we'll assume a priceId for a custom donation product exists.
        if (!process.env.NEXT_PUBLIC_STRIPE_CUSTOM_DONATION_PRICE_ID) {
             return NextResponse.json({ error: 'Custom donation Price ID is not configured.' }, { status: 500 });
        }
        line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Custom Donation to L.E.A.N. Foundation',
                    },
                    unit_amount: amount * 100, // Amount in cents
                },
                quantity: 1,
            },
        ];

    } else {
        // For fixed amounts, use the provided priceId
        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required for fixed donations.' }, { status: 400 });
        }
        line_items = [{
            price: priceId,
            quantity: 1,
        }];
    }

    // 1. Create the Checkout Session for a one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment', // Set mode to 'payment' for one-time charges
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
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
