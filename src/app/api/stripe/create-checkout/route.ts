
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// Note: The API version is important for type safety
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

/**
 * Handles POST requests to create a new Stripe Checkout Session for a donation.
 * @param req The Next.js request object containing the donation details.
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, donorEmail, donorName } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount.' }, { status: 400 });
    }

    // Stripe processes amounts in cents, so convert USD to cents
    const amountInCents = Math.round(amount * 100);

    // Metadata is critical for tracking and linking the donation back to the user/mission
    const metadata: { [key: string]: string } = {
        donation_type: 'LEAN_Foundation_Monetary',
        // We ensure a default if the name is not provided
        donor_name: donorName || 'Anonymous Donor', 
    };

    if (donorEmail) {
        // Only add email to metadata if provided
        metadata.donor_email = donorEmail;
    }
    
    // 1. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Donation to LEAN Foundation - ReFurrm`,
              description: `Dedicated support for Legacy, Ethics, and Advocacy Needs.`,
              // Replace with your LEAN Foundation logo/image URL
              images: [''], 
            },
            unit_amount: amountInCents, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
      // Optional: Pre-fill email and capture it for receipts
      customer_email: donorEmail || undefined,
      metadata: metadata,
      // Optional: Add a fee (e.g., if covering Stripe fees yourself)
      // application_fee_amount: feeInCents, 
    });

    // 2. Return the session URL to the frontend for redirection
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    // Return a generic error message to the client
    return NextResponse.json({ error: 'Failed to create Stripe Checkout session.' }, { status: 500 });
  }
}
