import { supabase } from './supabase';

/**
 * Send data directly to the webhook
 * This is a direct method to ensure webhook notification happens
 */
export async function sendToWebhook(name: string, email: string, orderId?: string, paymentConfirmed: boolean = false) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const authToken = sessionData?.session?.access_token;
    
    console.log(`Sending direct webhook notification for ${name}, ${email}, payment confirmed: ${paymentConfirmed}`);
    
    // Generate external_user_id in a unique format with random numbers
    const generateUniqueId = () => {
      // Remove special characters and convert to lowercase
      const nameParts = name.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      
      // Generate 5 random numbers between 0-9
      const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
      
      return `${firstName}${lastName}${randomNumbers}`;
    };
    
    const external_user_id = generateUniqueId();
    
    // Using the webhook URL directly for more reliable delivery
    const webhookUrl = 'https://hook.eu2.make.com/9mlnjz7fu9sq8ecwhk5abgxxm8j2qfl6';
    
    // Prepare payload
    const webhookData = {
      name,
      email,
      external_user_id,
      purchase_id: orderId || `manual_${Date.now()}`,
      transaction_id: orderId || `txn_${Date.now()}`,
      payment_confirmed: paymentConfirmed
    };
    
    console.log("Sending webhook data directly:", webhookData);
    
    // Try multiple times with a back-off strategy
    const MAX_RETRIES = 3;
    let lastError = null;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ClarityWorkshopClient/1.0',
            'X-Retry-Attempt': `${attempt + 1}`,
            'X-Client-Type': 'browser-direct'
          },
          body: JSON.stringify(webhookData)
        });
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error(`Webhook notification failed (attempt ${attempt + 1}):`, responseText);
          lastError = `Failed to send webhook notification: ${response.status} ${responseText}`;
          
          // Wait before retrying (exponential backoff)
          if (attempt < MAX_RETRIES - 1) {
            const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        } else {
          const responseText = await response.text();
          console.log('Webhook response:', responseText);
          
          return { 
            success: true, 
            result: webhookData
          };
        }
      } catch (err) {
        console.error(`Network error during webhook attempt ${attempt + 1}:`, err);
        lastError = err instanceof Error ? err.message : 'Unknown network error';
        
        // Wait before retrying
        if (attempt < MAX_RETRIES - 1) {
          const waitTime = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    // If we get here, all attempts failed
    return { success: false, error: lastError || 'All webhook attempts failed' };
  } catch (error) {
    console.error('Error sending webhook notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}