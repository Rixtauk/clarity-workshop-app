import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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

// Configure webhook URLs
const TARGET_WEBHOOK_URL = 'https://hook.eu2.make.com/fxnebe9cswkml1kkaah990iuulc9kbsr';
const FALLBACK_URLS = [
  'https://webhook.site/#!/e7dfa35e-e44c-4b62-94b1-e00e8ea5b81d',
  'https://enva14whshj5v.x.pipedream.net'
];

console.log(`Webhook proxy initialized for: ${TARGET_WEBHOOK_URL}`);

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    // Get the request body as text
    const requestBody = await req.text();
    console.log('Received webhook payload, size:', requestBody.length);

    // Parse the payload to add metadata and for debugging
    let payload;
    try {
      payload = JSON.parse(requestBody);
      console.log('Parsed webhook payload:', JSON.stringify(payload, null, 2));
      
      // If the payload contains name but doesn't have a unique external_user_id, generate one
      if (payload.name && !payload.external_user_id) {
        payload.external_user_id = generateExternalUserId(payload.name);
        console.log(`Generated new external_user_id: ${payload.external_user_id}`);
      }
      
    } catch (parseError) {
      console.error('Failed to parse payload as JSON:', parseError);
      payload = { rawData: requestBody };
    }

    // Add metadata to show this came through the proxy
    const enrichedPayload = {
      ...payload,
      _meta: {
        proxied: true,
        timestamp: new Date().toISOString(),
        source: 'webhook-proxy'
      }
    };

    console.log('Sending to primary webhook:', TARGET_WEBHOOK_URL);
    
    // Send to the primary webhook
    const primaryResponse = await fetch(TARGET_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WebhookProxy/1.0'
      },
      body: JSON.stringify(enrichedPayload)
    });

    const primaryStatus = primaryResponse.status;
    const primaryText = await primaryResponse.text();
    
    console.log(`Primary webhook response: ${primaryStatus}`);
    console.log(`Primary webhook response body: ${primaryText}`);

    // Attempt to send to fallback webhooks for redundancy
    for (const fallbackUrl of FALLBACK_URLS) {
      try {
        console.log(`Sending to fallback webhook: ${fallbackUrl}`);
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'WebhookProxy/1.0'
          },
          body: JSON.stringify({
            ...enrichedPayload,
            _meta: {
              ...enrichedPayload._meta,
              fallback: true,
              primaryStatus
            }
          })
        });
        
        console.log(`Fallback response: ${fallbackResponse.status}`);
      } catch (fallbackError) {
        console.error(`Error sending to fallback webhook ${fallbackUrl}:`, fallbackError);
      }
    }

    // Return the primary response status and body
    return new Response(
      JSON.stringify({
        success: primaryStatus >= 200 && primaryStatus < 300,
        status: primaryStatus,
        proxied: true,
        message: primaryText || `Webhook received status ${primaryStatus}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error processing webhook proxy request:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});