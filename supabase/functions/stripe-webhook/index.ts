import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2023-10-16',
  typescript: true
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

// The direct webhook URL that's working in tests - CRITICAL TARGET
const WEBHOOK_URL = 'https://hook.eu2.make.com/9mlnjz7fu9sq8ecwhk5abgxxm8j2qfl6';

console.log('Stripe webhook function initialized with URL:', WEBHOOK_URL);

// Generate a unique external_user_id with random numbers
function generateExternalUserId(name: string): string {
  // Remove any non-alphanumeric characters and convert to lowercase
  const nameParts = name.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
  // Generate 5 random numbers between 0-9
  const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  
  // Combine firstName + lastName + randomNumbers
  return `${firstName}${lastName}${randomNumbers}`;
}

Deno.serve(async (req) => {
  try {
    console.log(`Received ${req.method} request to stripe-webhook function`);
    
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      console.log('Handling OPTIONS preflight request');
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      console.log(`Rejecting non-POST request: ${req.method}`);
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the raw body
    const body = await req.text();
    console.log('Webhook payload received, length:', body.length);
    
    let event: Stripe.Event;
    
    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');

    // Try to verify the webhook signature if a secret is configured
    if (signature && stripeWebhookSecret) {
      try {
        console.log('Verifying Stripe webhook signature...');
        event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
        console.log('Webhook signature verified successfully. Event type:', event.type);
      } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`, error);
        // Continue anyway to parse the event without verification
        try {
          event = JSON.parse(body);
          console.log('Parsed event without signature verification. Event type:', event.type);
        } catch (parseError) {
          console.error('Failed to parse webhook payload:', parseError);
          return new Response('Invalid JSON payload', { status: 400 });
        }
      }
    } else {
      // No signature or secret, just parse the JSON
      try {
        event = JSON.parse(body);
        console.log('Parsed event without signature verification. Event type:', event.type);
      } catch (parseError) {
        console.error('Failed to parse webhook payload:', parseError);
        return new Response('Invalid JSON payload', { status: 400 });
      }
    }
    
    // If it's a checkout.session.completed event with payment_status=paid,
    // process it immediately and send to webhook
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Processing checkout.session.completed - ID: ${session.id}, Payment Status: ${session.payment_status}`);
      
      if (session.payment_status === 'paid') {
        console.log('⚠️ CRITICAL EVENT WITH PAYMENT CONFIRMED - Processing immediately');
        
        try {
          // Process the order in our database
          await processOneTimePayment(session);
          
          // Send webhook notification DIRECTLY to Make.com
          // This is the most critical part - we need to ensure this happens
          await sendDirectWebhookForSession(session);
        } catch (error) {
          console.error('Error processing paid checkout session:', error);
        }
      }
    }
    
    // Also handle payment_intent.succeeded as it might be a different trigger point
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Processing payment_intent.succeeded - ID: ${paymentIntent.id}`);
      
      try {
        await sendDirectWebhookForPaymentIntent(paymentIntent);
      } catch (error) {
        console.error('Error processing payment intent:', error);
      }
    }
    
    // Process any other events in the background
    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Unhandled error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Send webhook notification DIRECTLY to Make.com for a checkout session
async function sendDirectWebhookForSession(session: Stripe.Checkout.Session) {
  try {
    console.log('🚀 SENDING DIRECT WEBHOOK FOR SESSION:', session.id);
    
    if (!session.customer) {
      console.error('No customer in session, cannot send webhook');
      return;
    }
    
    // Get customer information
    let customerName = '';
    let customerEmail = session.customer_email || '';
    const customerId = typeof session.customer === 'string' ? session.customer : '';
    
    // CRITICAL: First check for name in session metadata - this is from the checkout form
    // This should have the highest priority as it's directly from the form
    if (session.metadata?.full_name) {
      customerName = session.metadata.full_name;
      console.log(`Found name in session metadata (from checkout form): ${customerName}`);
    } 
    // Only if metadata doesn't have the name, try to get it from the customer
    else if (customerId) {
      // Try to get customer details from Stripe
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (customer && !customer.deleted) {
          customerEmail = customer.email || '';
          
          // CRITICAL: Use the full_name from customer metadata instead of the customer name field
          if (customer.metadata?.full_name) {
            customerName = customer.metadata.full_name;
            console.log(`Using full_name from customer metadata: ${customerName}`);
          } else {
            customerName = customer.name || '';
            console.log(`Using name from customer object: ${customerName}`);
          }
        }
      } catch (err) {
        console.error('Error retrieving customer from Stripe:', err);
      }
      
      // If still no name found, try to get from Supabase
      if (!customerName) {
        try {
          const { data: customerData } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('customer_id', customerId)
            .single();
            
          if (customerData?.user_id) {
            const { data: userData } = await supabase.auth.admin.getUserById(customerData.user_id);
            if (userData?.user && userData.user.user_metadata?.full_name) {
              customerName = userData.user.user_metadata.full_name;
              console.log(`Using full_name from Supabase user metadata: ${customerName}`);
            }
          }
        } catch (error) {
          console.error('Error getting user metadata from Supabase:', error);
        }
      }
    }
    
    // IMPORTANT: NEVER use email as fallback for the name - if no name is found, we return early
    if (!customerName) {
      console.error('No name found for customer, cannot format a proper name for webhook');
      return;
    }
    
    if (!customerEmail) {
      console.error('No email found for customer, cannot send webhook');
      return;
    }
    
    // Generate unique ID
    const externalUserId = generateExternalUserId(customerName);
    
    // Prepare webhook payload
    const webhookPayload = {
      name: customerName, // This will be the full name from checkout, not derived from email
      email: customerEmail,
      external_user_id: externalUserId,
      amount: session.amount_total ? (session.amount_total / 100).toString() : undefined,
      currency: session.currency,
      purchase_id: session.id,
      transaction_id: session.payment_intent || session.id,
      payment_confirmed: true
    };
    
    console.log('Sending payload directly to webhook:', JSON.stringify(webhookPayload, null, 2));
    
    // Try multiple times with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'StripeWebhook/DirectSend',
            'X-Source': 'stripe-webhook-direct',
            'X-Attempt': attempt.toString(),
            'X-Session-ID': session.id
          },
          body: JSON.stringify(webhookPayload)
        });
        
        if (response.ok) {
          console.log(`✅ Successfully sent webhook on attempt ${attempt}`);
          return;
        }
        
        console.error(`Webhook failed on attempt ${attempt}: ${response.status}`);
        
        // Wait before retrying
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Network error on attempt ${attempt}:`, error);
        
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error('❌ All webhook attempts failed');
  } catch (error) {
    console.error('Error in sendDirectWebhookForSession:', error);
    throw error;
  }
}

// Send webhook notification for a payment intent
async function sendDirectWebhookForPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('🚀 SENDING DIRECT WEBHOOK FOR PAYMENT INTENT:', paymentIntent.id);
    
    if (!paymentIntent.customer) {
      console.error('No customer in payment intent, cannot send webhook');
      return;
    }
    
    // Get customer information
    const customerId = typeof paymentIntent.customer === 'string' ? paymentIntent.customer : '';
    
    // Try to get customer details from Stripe
    let customerName = '';
    let customerEmail = '';
    
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer && !customer.deleted) {
        customerEmail = customer.email || '';
        
        // CRITICAL: First check for full_name in customer metadata
        if (customer.metadata?.full_name) {
          customerName = customer.metadata.full_name;
          console.log(`Using full_name from customer metadata: ${customerName}`);
        } else {
          customerName = customer.name || '';
          console.log(`Using name from customer object: ${customerName}`);
        }
        
        // If still no name found, try to get from Supabase
        if (!customerName) {
          try {
            const { data: customerData } = await supabase
              .from('stripe_customers')
              .select('user_id')
              .eq('customer_id', customerId)
              .single();
              
            if (customerData?.user_id) {
              const { data: userData } = await supabase.auth.admin.getUserById(customerData.user_id);
              if (userData?.user && userData.user.user_metadata?.full_name) {
                customerName = userData.user.user_metadata.full_name;
                console.log(`Using full_name from Supabase user metadata: ${customerName}`);
              }
            }
          } catch (error) {
            console.error('Error getting user metadata from Supabase:', error);
          }
        }
      }
    } catch (err) {
      console.error('Error retrieving customer from Stripe:', err);
      return;
    }
    
    // IMPORTANT: NEVER use email as fallback for the name - if no name is found, we return early
    if (!customerName) {
      console.error('No name found for customer, cannot format a proper name for webhook');
      return;
    }
    
    if (!customerEmail) {
      console.error('No email found for customer, cannot send webhook');
      return;
    }
    
    // Generate unique ID
    const externalUserId = generateExternalUserId(customerName);
    
    // Prepare webhook payload
    const webhookPayload = {
      name: customerName,
      email: customerEmail,
      external_user_id: externalUserId,
      amount: paymentIntent.amount ? (paymentIntent.amount / 100).toString() : undefined,
      currency: paymentIntent.currency,
      purchase_id: paymentIntent.id,
      transaction_id: paymentIntent.id,
      payment_confirmed: true
    };
    
    console.log('Sending payload directly to webhook:', JSON.stringify(webhookPayload, null, 2));
    
    // Try multiple times with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'StripeWebhook/DirectSend',
            'X-Source': 'stripe-webhook-direct',
            'X-Attempt': attempt.toString(),
            'X-Payment-Intent-ID': paymentIntent.id
          },
          body: JSON.stringify(webhookPayload)
        });
        
        if (response.ok) {
          console.log(`✅ Successfully sent webhook on attempt ${attempt}`);
          return;
        }
        
        console.error(`Webhook failed on attempt ${attempt}: ${response.status}`);
        
        // Wait before retrying
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Network error on attempt ${attempt}:`, error);
        
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error('❌ All webhook attempts failed');
  } catch (error) {
    console.error('Error in sendDirectWebhookForPaymentIntent:', error);
    throw error;
  }
}

// Process one-time payment/order
async function processOneTimePayment(session: Stripe.Checkout.Session) {
  try {
    if (!session.customer || typeof session.customer !== 'string') {
      console.error('No valid customer ID in session:', session.id);
      return;
    }
    
    const customerId = session.customer;
    console.log(`Processing one-time payment for customer: ${customerId}, payment status: ${session.payment_status}`);
    
    // Extract the necessary information from the session
    const {
      id: checkout_session_id,
      payment_intent,
      amount_subtotal,
      amount_total,
      currency,
      payment_status
    } = session;

    // Check if we already have a record for this order to avoid duplicates
    const { data: existingOrder } = await supabase
      .from('stripe_orders')
      .select('id')
      .eq('checkout_session_id', checkout_session_id)
      .maybeSingle();
      
    if (existingOrder) {
      console.log(`Order already exists for session ${checkout_session_id}, skipping insertion`);
      return;
    }

    console.log(`Inserting order record - Session ID: ${checkout_session_id}, Payment Intent: ${payment_intent}`);
    
    // Insert the order into the stripe_orders table
    const { error: orderError } = await supabase.from('stripe_orders').insert({
      checkout_session_id,
      payment_intent_id: payment_intent as string,
      customer_id: customerId,
      amount_subtotal: amount_subtotal || 0,
      amount_total: amount_total || 0,
      currency: currency || 'usd',
      payment_status: payment_status || 'unknown',
      status: 'completed', // assuming we want to mark it as completed since payment is successful
    });

    if (orderError) {
      console.error('Error inserting order into database:', orderError);
      return;
    }
    console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
  } catch (error) {
    console.error('Error processing one-time payment:', error);
    throw error;
  }
}

async function handleEvent(event: Stripe.Event) {
  console.log(`Background processing of event: ${event.type}`);
  
  // This function handles any additional event processing that doesn't need to be done immediately
  
  // Example: update subscription data if it's a subscription-related event
  if (event.type.startsWith('customer.subscription.')) {
    const subscription = event.data.object as Stripe.Subscription;
    if (subscription.customer) {
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : '';
      if (customerId) {
        try {
          await syncCustomerFromStripe(customerId);
        } catch (error) {
          console.error(`Error syncing customer subscription: ${error}`);
        }
      }
    }
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    console.log(`Fetching subscription data from Stripe for customer: ${customerId}`);
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    console.log(`Found ${subscriptions.data.length} subscriptions for customer: ${customerId}`);

    // TODO verify if needed
    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];
    console.log(`Processing subscription: ${subscription.id}, status: ${subscription.status}`);

    // store subscription state
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription to database:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription ${subscription.id} for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}