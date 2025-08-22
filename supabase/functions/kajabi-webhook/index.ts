import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Updated webhook URL
const EXTERNAL_WEBHOOK_URL = 'https://hook.eu2.make.com/fxnebe9cswkml1kkaah990iuulc9kbsr';

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

// Verify required fields in webhook payload
function validateKajabiPayload(payload: any): boolean {
  const requiredFields = ['name', 'email', 'external_user_id'];
  return requiredFields.every(field => !!payload[field]);
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Parse the webhook payload
    let payload;
    try {
      payload = await req.json();
      console.log('Received Kajabi webhook:', JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error('Failed to parse webhook payload:', error);
      return corsResponse({ error: 'Invalid JSON payload' }, 400);
    }

    // Validate the webhook payload
    if (!validateKajabiPayload(payload)) {
      console.error('Missing required fields in webhook payload');
      return corsResponse(
        { error: 'Missing required fields: name, email, or external_user_id' },
        400
      );
    }

    // Extract customer information
    const { name, email, external_user_id } = payload;

    // Check if user exists in auth
    const { data: authUser, error: userError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    });
    
    let userId;
    
    if (userError) {
      console.error('Error checking user existence:', userError);
    } else if (authUser && authUser.users && authUser.users.length > 0) {
      // User already exists
      userId = authUser.users[0].id;
      console.log(`Found existing user with ID: ${userId}`);
    } else {
      // Create a new user with a random password
      const randomPassword = Math.random().toString(36).slice(-10) + 
                            Math.random().toString(36).toUpperCase().slice(-2) + 
                            '!1';
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: randomPassword,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: name,
          kajabi_user_id: external_user_id
        }
      });
      
      if (createError) {
        console.error('Error creating user:', createError);
        return corsResponse({ error: 'Failed to create user' }, 500);
      }
      
      userId = newUser.user.id;
      console.log(`Created new user with ID: ${userId}`);
    }

    // Get or create customer record
    const { data: existingCustomer, error: customerQueryError } = await supabase
      .from('stripe_customers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (customerQueryError) {
      console.error('Error querying customer record:', customerQueryError);
      return corsResponse({ error: 'Failed to query customer record' }, 500);
    }
    
    if (!existingCustomer) {
      // Create a fake customer record for Kajabi purchases
      const { error: customerInsertError } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: userId,
          customer_id: `kajabi_${external_user_id}`,
        });
        
      if (customerInsertError) {
        console.error('Error creating customer record:', customerInsertError);
        return corsResponse({ error: 'Failed to create customer record' }, 500);
      }
    }

    // Record the purchase/order
    const { error: orderError } = await supabase
      .from('stripe_orders')
      .insert({
        checkout_session_id: `kajabi_${payload.purchase_id || external_user_id}_${Date.now()}`,
        payment_intent_id: `kajabi_${payload.transaction_id || external_user_id}_${Date.now()}`,
        customer_id: `kajabi_${external_user_id}`,
        amount_subtotal: payload.amount ? parseInt((parseFloat(payload.amount) * 100).toString()) : 19700, // Default to $197 if no amount
        amount_total: payload.amount ? parseInt((parseFloat(payload.amount) * 100).toString()) : 19700,
        currency: payload.currency || 'usd',
        payment_status: 'paid',
        status: 'completed'
      });

    if (orderError) {
      console.error('Error recording purchase:', orderError);
      return corsResponse({ error: 'Failed to record purchase' }, 500);
    }

    // Forward the webhook payload to the new Make.com webhook
    try {
      console.log('Forwarding data to Make.com webhook:', payload);
      
      const webhookResponse = await fetch(EXTERNAL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log(`Webhook forwarding response status: ${webhookResponse.status}`);
      if (!webhookResponse.ok) {
        console.error('Error forwarding to webhook:', await webhookResponse.text());
      }
    } catch (webhookError) {
      console.error('Error forwarding to Make.com webhook:', webhookError);
      // Continue processing even if webhook forwarding fails
    }

    // Return success response
    return corsResponse({
      success: true,
      message: 'Purchase processed successfully',
      user_id: userId
    });

  } catch (error) {
    console.error('Unhandled error in Kajabi webhook:', error);
    return corsResponse({ error: 'Internal server error' }, 500);
  }
});