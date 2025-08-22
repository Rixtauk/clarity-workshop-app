# The Clarity Workshop

This is the landing page and e-commerce platform for The Clarity Workshop.

🚀 **Live Site**: https://clarity-workshop-landing.vercel.app/

## Auto-Deployment

This project is automatically deployed to Vercel on every push to the `main` branch.

## Stripe Test Mode Setup

This project uses Stripe for payment processing. To properly test the payment flow:

1. Use Stripe in **TEST MODE** with these test cards:
   - Successful payment: `4242 4242 4242 4242`
   - Requires authentication: `4000 0025 0000 3155`
   - Declined payment: `4000 0000 0000 0002`

2. For test cards:
   - Any future expiration date (MM/YY)
   - Any 3-digit CVC
   - Any name
   - Any postal code

3. Checkout will redirect to a Stripe-hosted page where you can enter these test credentials.

## Environment Variables

The following Stripe environment variables need to be configured in both `.env` and Supabase:

```
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret
```

Make sure you're using the test mode versions of these keys (prefixed with `sk_test_`).

## Important Note

The price ID in `src/stripe-config.ts` must be a valid test mode price ID from your Stripe dashboard.