import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Updated webhook URL for Make.com
const WEBHOOK_URL = 'https://hook.eu2.make.com/fxnebe9cswkml1kkaah990iuulc9kbsr';

// Generate a unique external_user_id with random numbers
function generateExternalUserId(name: string): string {
  // Remove any non-alphanumeric characters and convert to lowercase
  const nameParts = name.trim().toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
  // Generate 5 random numbers between 0-9
  const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  
  // Combine firstName + lastName + randomNumbers
  return `${firstName}${lastName}${randomNumbers}`;
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify Stripe webhook signature
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing Stripe signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the raw body for signature verification
    const body = await req.text();
    
    // Verify the webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Only process successful payments
      if (session.payment_status === 'paid') {
        await handleSuccessfulPayment(session);
      }
    } else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleSuccessfulPaymentIntent(paymentIntent);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Handle successful checkout session
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing successful payment:', session.id);

    // Get customer details from Stripe
    if (!session.customer) {
      console.error('No customer attached to session:', session.id);
      return;
    }

    // Get customer email from session or fetch from Stripe
    let email = session.customer_email;
    let customerName = '';

    // If email not in session, fetch from customer object
    if (!email || typeof session.customer === 'string') {
      const customer = await stripe.customers.retrieve(session.customer as string);
      if (customer && !customer.deleted) {
        email = customer.email || '';
        customerName = customer.name || '';
      }
    }

    if (!email) {
      console.error('Could not find customer email for session:', session.id);
      return;
    }

    // Try to get user info from Supabase too
    try {
      const { data: customerData } = await supabase
        .from('stripe_customers')
        .select('user_id')
        .eq('customer_id', session.customer as string)
        .single();

      if (customerData?.user_id) {
        const { data: userData } = await supabase.auth.admin.getUserById(customerData.user_id);
        if (userData?.user) {
          // Use user metadata if available
          customerName = userData.user.user_metadata?.full_name || customerName;
        }
      }
    } catch (error) {
      console.error('Error fetching customer data from Supabase:', error);
      // Continue with Stripe data if Supabase lookup fails
    }

    // If we still don't have a name, use email as fallback
    if (!customerName) {
      customerName = email.split('@')[0];
    }

    // Generate unique external_user_id with random numbers
    const uniqueExternalId = generateExternalUserId(customerName);

    // Send to webhook
    await notifyWebhook({
      name: customerName,
      email: email,
      external_user_id: uniqueExternalId,
      amount: session.amount_total ? (session.amount_total / 100).toString() : undefined,
      currency: session.currency,
      purchase_id: session.id,
      transaction_id: session.payment_intent as string
    });

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle successful payment intent
async function handleSuccessfulPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Skip if this PaymentIntent doesn't have a customer
    if (!paymentIntent.customer) {
      return;
    }

    // Get customer details from Stripe
    const customerId = paymentIntent.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.error('Customer has been deleted:', customerId);
      return;
    }

    const email = customer.email;
    if (!email) {
      console.error('Customer has no email:', customerId);
      return;
    }

    let customerName = customer.name || '';

    // Try to get user info from Supabase
    try {
      const { data: customerData } = await supabase
        .from('stripe_customers')
        .select('user_id')
        .eq('customer_id', customerId)
        .single();

      if (customerData?.user_id) {
        const { data: userData } = await supabase.auth.admin.getUserById(customerData.user_id);
        if (userData?.user) {
          // Use user metadata if available
          customerName = userData.user.user_metadata?.full_name || customerName;
        }
      }
    } catch (error) {
      console.error('Error fetching customer data from Supabase:', error);
      // Continue with Stripe data if Supabase lookup fails
    }

    // If we still don't have a name, use email as fallback
    if (!customerName) {
      customerName = email.split('@')[0];
    }

    // Generate unique external_user_id with random numbers
    const uniqueExternalId = generateExternalUserId(customerName);

    // Send to webhook
    await notifyWebhook({
      name: customerName,
      email: email,
      external_user_id: uniqueExternalId,
      amount: paymentIntent.amount ? (paymentIntent.amount / 100).toString() : undefined,
      currency: paymentIntent.currency,
      purchase_id: paymentIntent.id,
      transaction_id: paymentIntent.id
    });

  } catch (error) {
    console.error('Error handling successful payment intent:', error);
  }
}

// Send webhook
async function notifyWebhook(data: {
  name: string;
  email: string;
  external_user_id: string;
  amount?: string;
  currency?: string;
  purchase_id?: string;
  transaction_id?: string;
}) {
  try {
    console.log('Sending data to webhook:', data);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error from webhook:', response.status, responseText);
      throw new Error(`Webhook returned ${response.status}: ${responseText}`);
    }

    console.log('Successfully notified webhook');
    return await response.json();
  } catch (error) {
    console.error('Error notifying webhook:', error);
    throw error;
  }
}