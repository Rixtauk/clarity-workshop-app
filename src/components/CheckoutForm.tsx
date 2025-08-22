import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../lib/stripe';
import { supabase, handleAuthError } from '../lib/supabase';
import { products } from '../stripe-config';
import { Mail, User, AlertCircle } from 'lucide-react';

export default function CheckoutForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!fullName || !email) {
      setError('Please provide both your name and email');
      setLoading(false);
      return;
    }
    
    try {
      // Check if user is logged in
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        const wasHandled = await handleAuthError(sessionError);
        if (wasHandled) {
          setLoading(false);
          return;
        }
      }
      
      if (!session) {
        // Generate a secure random password
        const generateSecurePassword = () => {
          const length = 12;
          const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
          let password = "";
          
          // Ensure password contains at least one number and one special character
          password += "A"; // Capital letter
          password += "a"; // Lowercase letter
          password += "1"; // Number
          password += "!"; // Special character
          
          // Add random characters for the rest
          for (let i = 4; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
          }
          
          // Shuffle the password
          return password.split('').sort(() => 0.5 - Math.random()).join('');
        };
        
        const securePassword = generateSecurePassword();
        
        try {
          // Directly attempt to sign up the user
          console.log("Creating new user account with full name:", fullName);
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password: securePassword,
            options: {
              data: {
                full_name: fullName // CRITICAL: Store the full name in user metadata
              }
            },
          });
          
          if (signUpError) {
            // Check if the error indicates user already exists
            if (signUpError.message && (
              signUpError.message.includes('already registered') || 
              signUpError.message.includes('already exists') ||
              signUpError.message.includes('User already registered') ||
              signUpError.message.includes('already been registered')
            )) {
              setError('This email is already registered. Please log in first or use a different email address.');
              setLoading(false);
              return;
            }
            
            const wasHandled = await handleAuthError(signUpError);
            if (!wasHandled) {
              throw signUpError;
            }
          }
        } catch (err: any) {
          if (err.message && (
            err.message.includes('already registered') || 
            err.message.includes('already exists') ||
            err.message.includes('User already registered') ||
            err.message.includes('already been registered')
          )) {
            setError('This email is already registered. Please log in first or use a different email address.');
            setLoading(false);
            return;
          }
          throw err;
        }
      } else {
        // If logged in, update the user metadata to ensure name is stored
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: fullName }
        });
        
        if (updateError) {
          const wasHandled = await handleAuthError(updateError);
          if (!wasHandled) {
            console.error("Could not update user metadata:", updateError);
          }
        }
      }
      
      console.log("Using price ID:", products.clarityWorkshop.priceId);
      console.log("User information for checkout:", { fullName, email });
      
      // Create checkout session - CRITICAL: Pass the full name to be included in the session metadata
      const checkoutUrl = await createCheckoutSession(
        products.clarityWorkshop.priceId,
        products.clarityWorkshop.mode,
        fullName // Pass the full name exactly as entered
      );
      
      // Store information in localStorage as a backup for success page
      localStorage.setItem('checkout_name', fullName);
      localStorage.setItem('checkout_email', email);
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleCheckout} className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
            Your Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f3857] focus:border-[#2f3857] transition-colors"
              placeholder="Your full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f3857] focus:border-[#2f3857] transition-colors"
              placeholder="Your email address"
              required
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white py-4 px-6 rounded-xl font-bold text-xl ${
              loading ? 'opacity-70 cursor-not-allowed bg-[#fd7f4f]' : 'vibrant-cta gentle-bounce'
            }`}
          >
            {loading ? 'Processing...' : 'Start your clarity journey today'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Secure checkout. No extras. 14-day refund.
          </p>
        </div>
      </form>
    </div>
  );
}