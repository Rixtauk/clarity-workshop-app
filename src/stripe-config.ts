export interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Record<string, Product> = {
  clarityWorkshop: {
    // IMPORTANT: Replace this with your LIVE mode price ID from Stripe Dashboard
    // It should start with 'price_' (not 'price_test_')
    priceId: 'price_1RCjB4P0hpyYbntJlB97aYtK',
    name: 'The Clarity Workshop',
    description: 'A self-paced online workshop to help you find purpose and direction, break through limiting beliefs, and design a life that truly matters.',
    mode: 'payment'
  }
};