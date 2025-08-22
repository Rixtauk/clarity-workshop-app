import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase, handleAuthError } from '../lib/supabase';
import { getUserOrders } from '../lib/stripe';
import { sendToWebhook } from '../lib/webhook';
import { Check, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

interface Order {
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_total: number;
  currency: string;
  order_date: string;
  price_id?: string;
}

export default function Success() {
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOrder, setHasOrder] = useState(false);
  const [webhookSent, setWebhookSent] = useState<boolean | null>(null);
  const [webhookSending, setWebhookSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webhookAttempts, setWebhookAttempts] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract session_id from URL if present
  const sessionId = new URLSearchParams(location.search).get('session_id');

  // This function handles sending the webhook notification
  const sendWebhookNotification = async (name: string, email: string, orderId?: string, paymentConfirmed: boolean = false) => {
    try {
      if (webhookSending) return; // Prevent multiple simultaneous calls
      
      setWebhookSending(true);
      setWebhookAttempts(prev => prev + 1);
      
      console.log(`Sending webhook notification with payment confirmed: ${paymentConfirmed}`);
      const result = await sendToWebhook(name, email, orderId, paymentConfirmed);
      
      // Only update state if we're still mounted and this is our latest attempt
      setWebhookSent(result.success);
      console.log('Webhook notification result:', result);
      
      if (!result.success && webhookAttempts > 0) {
        console.error('Failed to send webhook notification:', result.error);
      }
    } catch (error) {
      console.error('Error sending webhook notification:', error);
      // Only set webhook fail state after first attempt
      if (webhookAttempts > 0) {
        setWebhookSent(false);
      }
    } finally {
      setWebhookSending(false);
    }
  };

  useEffect(() => {
    async function checkUserAndOrders() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          const wasHandled = await handleAuthError(error);
          if (wasHandled) return;
          console.error('Error checking user status:', error);
        }
        
        if (user) {
          setEmail(user.email);
          
          // Get the user's name from metadata
          const userName = user.user_metadata?.full_name;
          if (userName) {
            setFullName(userName);
          }
          
          try {
            // Check if user has any orders
            const orders = await getUserOrders();
            const hasConfirmedOrder = orders && orders.length > 0;
            setHasOrder(hasConfirmedOrder);
            
            // Set webhook as successfully sent by default - server-side webhook is reliable
            setWebhookSent(true);
          } catch (orderError) {
            console.error('Error fetching orders:', orderError);
            // Continue even if orders fail to load
          }
        } else {
          // Try to get from localStorage (backup)
          const savedName = localStorage.getItem('checkout_name');
          const savedEmail = localStorage.getItem('checkout_email');
          
          if (savedName && savedEmail) {
            setFullName(savedName);
            setEmail(savedEmail);
            
            // Assume webhook was successfully sent by server
            setWebhookSent(true);
          } else {
            // No user or saved data
            setError('No user information found. Please contact support if you need assistance.');
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setError('Error retrieving your account information. Please contact support.');
      } finally {
        setLoading(false);
      }
    }
    
    checkUserAndOrders();
  }, [sessionId]); // Only run once on mount or when sessionId changes

  const handleManualWebhookSend = async () => {
    if (!fullName || !email) return;
    
    // When manually sending, we only confirm payment if we have a confirmed order
    await sendWebhookNotification(fullName, email, sessionId, hasOrder);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2f3857] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2f3857] font-medium">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white py-6 shadow-sm border-b">
        <div className="container mx-auto px-4">
          <Link to="/">
            <img
              src="https://www.dropbox.com/scl/fi/pyk18qtsbjf7ke5xn7rmi/Main-Logo-Black-V2.png?rlkey=ls326jwilxju7hy08xqnyxckf&st=snot4one&raw=1"
              alt="The Clarity Workshop"
              className="h-8 object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-[#2f3857] mb-6 tracking-tight font-['Helvetica Neue']">
                THANK YOU FOR YOUR PURCHASE!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {hasOrder 
                  ? "You now have access to the Clarity Workshop. Check your email for login details and next steps."
                  : "Your purchase is being processed. You'll receive access to the Clarity Workshop shortly."}
              </p>
              
              {error && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-[#2f3857] mb-4 font-['Helvetica Neue']">
                  WHAT HAPPENS NEXT?
                </h2>
                
                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2f3857] rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      {email ? `We've sent confirmation details to ${email}` : "You'll receive an email with your login details shortly"}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2f3857] rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      First, you'll receive an email to <span className="font-bold bg-yellow-100 px-2 py-0.5 rounded">set your password</span> for your Kajabi account (this step is required)
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2f3857] rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      Second, you'll receive a confirmation email with a login button to access the Clarity Workshop
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2f3857] rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      Start your journey to clarity at your own pace once you're logged in
                    </span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6 text-left">
                  <p className="text-yellow-800 text-sm font-medium">
                    If you already have a Kajabi account associated with this email address, you will not receive a password reset email. Simply log in to your existing account, and the course will be available.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6 text-left">
                  <p className="text-blue-700 text-sm">
                    <span className="font-semibold">Note:</span> Sometimes these emails can arrive in reverse order. Please make sure to set your password first before attempting to log in.
                  </p>
                </div>
                
                {/* Only show the webhook status in specific cases where manual intervention might be needed */}
                {fullName && email && webhookSent === false && (
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-amber-100 text-amber-800">
                      <button 
                        onClick={handleManualWebhookSend} 
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Retry registration</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <Link 
                  to="/"
                  className="inline-flex items-center gap-2 text-[#2f3857] hover:text-[#fd7f4f] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to homepage</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}