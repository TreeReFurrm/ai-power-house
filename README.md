# ReFurrm SmartScan

**The AI-Powered Toolkit for Ethical Resale, Donations, and Profit.**

ReFurrm SmartScan is a Next.js web application designed to bring ethical practices and powerful AI tools to the world of second-hand goods. It helps users identify, appraise, and sell items, while also facilitating donations and supporting the L.E.A.N. (Legacy & Ethics Action Network) Foundation to prevent hardship related to storage unit loss.

---

## ✨ Key Features

- **Instant Listing Generator**: Upload a photo of an item and let our AI generate an SEO-friendly title, a compelling description, and a fair market price in seconds.
- **AI Pricing & Verification Tool**: Quickly appraise an item's resale value based on its condition and the context of where you found it. Perfect for making smart decisions at yard sales or flea markets.
- **UPC Barcode Scanner**: Scan an item's barcode to instantly check its resale value and potential profit margin.
- **Ambassador Services**: Request a certified, trained Ambassador for hands-on help with home clean-outs, organization, or large-scale donations.
- **Marketplace**: A place for the community to buy and sell unique second-hand items.
- **Ethical Donations**: Donate items directly through the app to support the L.E.A.N. Foundation's mission.
- **Secure Payments**: Integrated with Stripe for secure subscription management and donations.

---

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (via Google AI)
- **Payments**: [Stripe](https://stripe.com/)

---

## 🚀 Getting Started

### 1. Set Up Environment Variables

Before running the application, you need to configure your environment variables. Copy the contents of `.env.example` into a new file named `.env` and fill in the required values.

```bash
# .env

# Firebase Configuration (replace with your project's config)
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="12345..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:12345...:web:..."

# Stripe Configuration (replace with your Stripe keys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Price IDs (from your Stripe Dashboard)
NEXT_PUBLIC_STRIPE_SCANNER_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_ETHICAL_REVIEW_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_LEGACY_OUTREACH_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_AUCTION_RELIEF_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_CUSTOM_DONATION_PRICE_ID="price_..." # For custom donation amounts

# Stripe Checkout Redirect URLs
STRIPE_SUCCESS_URL=http://localhost:3000/account
STRIPE_CANCEL_URL=http://localhost:3000/subscription
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

A brief overview of the key directories in this project:

- `/src/app`: Contains all the pages and routes for the application, following the Next.js App Router structure.
- `/src/components`: Home to reusable UI components, including custom components and those built with ShadCN UI.
- `/src/ai`: All Genkit-related code, including AI flows, prompts, and schemas.
- `/src/firebase`: Configuration and hooks for interacting with Firebase services (Authentication, Firestore).
- `/src/lib`: Utility functions and shared libraries.
- `/public`: Static assets like images and the web app manifest.

