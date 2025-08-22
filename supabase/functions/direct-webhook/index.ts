import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Direct webhook URL for Make.com
const WEBHOOK_URL = 'https://hook.eu2.make.com/9mlnjz7fu9sq8ecwhk5abgxxm8j2qfl6';

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

// Generate a unique external_user_id with random numbers
function generateExternalUserId(name: string, email: string): string {
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
  console.log('Received request to direct-webhook function');
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log('Handling OPTIONS request');
      return corsResponse(null, 204);
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log(`Rejecting ${req.method} request`);
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    const { name, email, orderId, authToken, payment_confirmed } = await req.json();
    
    console.log('Webhook notification request data:', { 
      name, 
      email, 
      orderId, 
      payment_confirmed: payment_confirmed || false,
      authToken: authToken ? 'Provided' : 'Not provided' 
    });
    
    if (!name || !email) {
      console.error('Missing required fields: name or email');
      return corsResponse({ error: 'Missing required fields: name and email are required' }, 400);
    }

    let userId = null;
    
    // Authenticate and get user information if token provided
    if (authToken) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(authToken);
        
        if (error) {
          console.error('Auth error:', error);
        } else if (user) {
          userId = user.id;
          console.log(`Authenticated user: ${userId}`);
        }
      } catch (authError) {
        console.error('Error during authentication:', authError);
        // Continue without authentication
      }
    }

    // Generate the external_user_id with random numbers to ensure uniqueness
    const external_user_id = generateExternalUserId(name, email);
    console.log(`Generated external_user_id: ${external_user_id}`);

    // Prepare data for webhook
    const webhookData = {
      name,
      email,
      external_user_id,
      purchase_id: orderId || `manual_${Date.now()}`,
      transaction_id: orderId || `txn_${Date.now()}`,
      payment_confirmed: !!payment_confirmed // Convert to boolean and ensure it's included
    };

    console.log('Sending data to webhook:', JSON.stringify(webhookData, null, 2));

    // Send to Make.com webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DirectWebhook/1.0'
      },
      body: JSON.stringify(webhookData)
    });

    const responseStatus = response.status;
    const responseBody = await response.text();
    
    console.log(`Webhook response status: ${responseStatus}`);
    console.log(`Webhook response body: ${responseBody}`);

    if (!response.ok) {
      console.error(`Error from webhook: ${responseStatus}`);
      return corsResponse({ 
        success: false,
        status: responseStatus,
        message: `Webhook request failed with status ${responseStatus}`
      }, 500);
    }

    // Success - data was sent to webhook
    console.log('Successfully sent data to webhook');
    return corsResponse({ 
      success: true,
      message: 'Data successfully sent to webhook',
      external_user_id,
      payment_confirmed: !!payment_confirmed
    });

  } catch (error) {
    console.error('Error processing webhook notification:', error);
    return corsResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});