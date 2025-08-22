import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

// The webhook URL that's not receiving data
const TARGET_WEBHOOK_URL = 'https://hook.eu2.make.com/9mlnjz7fu9sq8ecwhk5abgxxm8j2qfl6';

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Generate a unique external_user_id
function generateExternalUserId(name: string): string {
  const nameParts = name.trim().toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
  // Generate 5 random numbers
  const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  
  return `${firstName}${lastName}${randomNumbers}`;
}

Deno.serve(async (req) => {
  console.log(`Received ${req.method} request to webhook-test`);
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    // For debug requests, return information about the environment
    const url = new URL(req.url);
    if (url.searchParams.get('debug') === 'true') {
      console.log("Received debug request, returning environment info");
      
      // Get webhook URL configuration
      const webhookUrl = Deno.env.get('STRIPE_WEBHOOK_URL') || TARGET_WEBHOOK_URL;
      
      // Get stripe variables (safely)
      const stripeSecretKeyMasked = Deno.env.get('STRIPE_SECRET_KEY')
        ? `${Deno.env.get('STRIPE_SECRET_KEY')?.substring(0, 7)}...`
        : 'Not set';
      
      const stripeWebhookSecretMasked = Deno.env.get('STRIPE_WEBHOOK_SECRET')
        ? `${Deno.env.get('STRIPE_WEBHOOK_SECRET')?.substring(0, 7)}...` 
        : 'Not set';
      
      const debugInfo = {
        timestamp: new Date().toISOString(),
        environment: {
          webhook_url: webhookUrl,
          stripe_key_available: !!Deno.env.get('STRIPE_SECRET_KEY'),
          stripe_key_preview: stripeSecretKeyMasked,
          webhook_secret_available: !!Deno.env.get('STRIPE_WEBHOOK_SECRET'),
          webhook_secret_preview: stripeWebhookSecretMasked,
          supabase_url_available: !!Deno.env.get('SUPABASE_URL'),
          runtime: 'Deno Edge Function',
        },
        request: {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries([...req.headers.entries()]),
        }
      };
      
      return new Response(JSON.stringify(debugInfo, null, 2), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // For GET requests, send a test payload
    if (req.method === "GET") {
      console.log("Received GET request, sending test payload to webhook");
      
      const testName = "Test User";
      const testEmail = "test@example.com";
      const external_user_id = generateExternalUserId(testName);
      
      const testPayload = {
        name: testName,
        email: testEmail,
        external_user_id: external_user_id,
        purchase_id: `test_${Date.now()}`,
        transaction_id: `txn_test_${Date.now()}`,
        payment_confirmed: true,
        test_timestamp: new Date().toISOString(),
        test_source: "webhook-test-function"
      };
      
      console.log("Sending test payload:", JSON.stringify(testPayload, null, 2));
      
      // Send with multiple headers to debug potential header issues
      const webhookResponse = await fetch(TARGET_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WebhookTest/1.0",
          "X-Test-Source": "SupabaseEdgeFunction",
          "X-Payment-Confirmed": "true"
        },
        body: JSON.stringify(testPayload)
      });
      
      const responseStatus = webhookResponse.status;
      let responseText: string;
      
      try {
        responseText = await webhookResponse.text();
      } catch (error) {
        responseText = `Error reading response: ${error.message}`;
      }
      
      console.log(`Webhook response status: ${responseStatus}`);
      console.log(`Webhook response body: ${responseText}`);
      
      return new Response(JSON.stringify({
        success: responseStatus >= 200 && responseStatus < 300,
        status: responseStatus,
        response: responseText,
        sent_payload: testPayload,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // For POST requests, forward the payload with detailed logging
    if (req.method === "POST") {
      let payload;
      
      try {
        payload = await req.json();
        console.log("Received custom payload:", JSON.stringify(payload, null, 2));
      } catch (error) {
        console.error("Error parsing request JSON:", error);
        return new Response(JSON.stringify({
          error: "Invalid JSON payload",
          details: error.message
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }
      
      // Ensure external_user_id exists
      if (!payload.external_user_id && payload.name) {
        payload.external_user_id = generateExternalUserId(payload.name);
        console.log(`Generated external_user_id: ${payload.external_user_id}`);
      }
      
      // Add test metadata
      payload.test_timestamp = new Date().toISOString();
      payload.test_source = "webhook-test-function-post";
      
      console.log("Sending custom payload to webhook:", JSON.stringify(payload, null, 2));
      
      try {
        const webhookResponse = await fetch(TARGET_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "WebhookTest/1.0",
            "X-Test-Source": "SupabaseEdgeFunction",
            "X-Payment-Confirmed": payload.payment_confirmed ? "true" : "false"
          },
          body: JSON.stringify(payload)
        });
        
        const responseStatus = webhookResponse.status;
        let responseText: string;
        
        try {
          responseText = await webhookResponse.text();
        } catch (error) {
          responseText = `Error reading response: ${error.message}`;
        }
        
        console.log(`Webhook response status: ${responseStatus}`);
        console.log(`Webhook response body: ${responseText}`);
        
        return new Response(JSON.stringify({
          success: responseStatus >= 200 && responseStatus < 300,
          status: responseStatus,
          response: responseText,
          sent_payload: payload,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error("Error sending to webhook:", error);
        return new Response(JSON.stringify({
          error: "Failed to send to webhook",
          details: error.message
        }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }
    }
    
    // If not GET or POST
    return new Response(JSON.stringify({
      error: "Method not allowed",
      allowed_methods: ["GET", "POST"]
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
    
  } catch (error) {
    console.error("Unhandled error in webhook test:", error);
    
    return new Response(JSON.stringify({
      error: "Unhandled error",
      details: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});