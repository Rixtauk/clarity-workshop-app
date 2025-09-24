import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Lock, CreditCard, Mail, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { products } from '../stripe-config';
import CheckoutForm from '../components/CheckoutForm';
import { supabase, handleAuthError } from '../lib/supabase';
import { getUserOrders } from '../lib/stripe';

export default function Checkout() {
  const [user, setUser] = useState<any>(null);
  const [hasOrder, setHasOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Preload the coach image
  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = "https://www.dropbox.com/scl/fi/p4sgu9b3297vwc9jpofdk/clarity-workshop-alex-image.jpeg?rlkey=othimuetwdgglltkqeyu0zp5e&st=ffbdeyvh&raw=1";
  }, []);

  useEffect(() => {
    async function checkUserAndOrders() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          const wasHandled = await handleAuthError(error);
          if (wasHandled) return;
          console.error('Error checking user status:', error);
        }
        
        setUser(user);
        
        if (user) {
          try {
            // Check if user already has the product
            const orders = await getUserOrders();
            if (orders && orders.length > 0) {
              setHasOrder(true);
            }
          } catch (orderError) {
            console.error('Error fetching orders:', orderError);
            // Continue even if orders fail to load
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkUserAndOrders();
  }, [navigate]);

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6 text-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold text-[#2f3857] mb-3">Checkout temporarily unavailable</h2>
          <p className="text-gray-600">
            Supabase credentials are not configured in this environment, so authentication and checkout are disabled. 
            Please provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values in your `.env` file and rebuild the container to enable purchase flows.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2f3857] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2f3857] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user already has the product, redirect to success page
  if (hasOrder) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#2f3857] mb-4">You already own this product!</h2>
          <p className="text-gray-600 mb-6">You've already purchased The Clarity Workshop. You can access it from your account.</p>
          <div className="flex flex-col gap-4">
            <Link
              to="/account"
              className="dark-cta text-white px-6 py-3 rounded-lg font-semibold gentle-bounce"
            >
              Go to My Account
            </Link>
            <Link
              to="/"
              className="text-[#2f3857] hover:text-[#fd7f4f] transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white py-6 shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img
                src="https://www.dropbox.com/scl/fi/pyk18qtsbjf7ke5xn7rmi/Main-Logo-Black-V2.png?rlkey=ls326jwilxju7hy08xqnyxckf&st=snot4one&raw=1"
                alt="The Clarity Workshop"
                className="h-8 object-contain"
              />
            </Link>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#2f3857]" />
              <span className="text-sm font-medium text-[#2f3857]">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Alex's image - Mobile (visible only on small screens) */}
            <div className="flex justify-center md:hidden mb-8">
              <img
                src="https://www.dropbox.com/scl/fi/p4sgu9b3297vwc9jpofdk/clarity-workshop-alex-image.jpeg?rlkey=othimuetwdgglltkqeyu0zp5e&st=ffbdeyvh&raw=1"
                alt="Alex Kergall"
                className="w-full max-w-md rounded-xl shadow-lg"
                loading="eager"
                fetchpriority="high"
              />
            </div>

            {/* Headline - Centered on all screen sizes */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#2f3857] mb-3 tracking-tight font-['Helvetica Neue']">
                YOU'RE ONE STEP AWAY FROM <span className="bg-[#fd7f4f] text-black px-4 py-1 rounded-lg inline-block transform -rotate-2">CLARITY</span>
              </h1>
              <p className="text-xl text-gray-600 text-center">
                Begin your self-paced journey in minutes.
              </p>
            </div>

            {/* Upper section - Product info and Alex image */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Left Column - Product Information */}
              <div>
                {/* What You'll Get */}
                <div>
                  <h2 className="text-2xl font-bold text-[#2f3857] mb-6 tracking-tight font-['Helvetica Neue']">
                    The Clarity Workshop includes: 
                  </h2>
                  <div className="space-y-4">
                    {[
                      "A step-by-step framework used by top performers.",
                      "One of the fastest, most trusted clarity tools online.",
                      "28 short, actionable videos to shift your mindset.",
                      "Proven strategies to create a clear path forward in your life.",
                      "Real coaching exercises used by Alex with CEOs and high achievers.",
                      "The best from thousands of hours of coaching — distilled into one course.",
                      "14-day money-back guarantee — no questions asked."
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="rounded-full flex-shrink-0 mt-1">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Alex's image (desktop only) & Media Logos */}
              <div className="space-y-8">
                {/* Alex's image - Desktop (hidden on mobile) */}
                <div className="hidden md:block">
                  <img
                    src="https://www.dropbox.com/scl/fi/p4sgu9b3297vwc9jpofdk/clarity-workshop-alex-image.jpeg?rlkey=othimuetwdgglltkqeyu0zp5e&st=ffbdeyvh&raw=1"
                    alt="Alex Kergall"
                    className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

                {/* Media Logos */}
                <div className="md:mt-8 mt-2">
                  <h2 className="text-lg font-medium text-gray-500 mb-2 md:mb-4 text-center">
                    AS FEATURED IN:
                  </h2>
                  <div className="flex items-center justify-center gap-3 md:gap-8">
                    <img
                      src="https://www.dropbox.com/scl/fi/sppy32sqxqslfyfdjyj9a/forbes-logo-black-transparentwhite.png?rlkey=11fftvux8oi2hlp2y7e2t02qi&st=rzto2shi&raw=1"
                      alt="Forbes"
                      className="h-6 md:h-8 object-contain grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                      loading="eager"
                    />
                    <img
                      src="https://www.dropbox.com/scl/fi/phai5shn6c9cj69fm5vik/The_Times_masthead_white.png?rlkey=qbgyfxzc0synzi4ol5so6ggr5&st=2ignuwty&raw=1"
                      alt="The Times"
                      className="h-6 md:h-8 object-contain grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                      loading="eager"
                    />
                    <img
                      src="https://www.dropbox.com/scl/fi/sx9xtbj9adpodwfpbperd/CEOToday-Masthead-Whitee.png?rlkey=x5imjhh6d494knl0rgvjv9iuy&st=gk1xenp0&raw=1"
                      alt="CEO Today"
                      className="h-6 md:h-8 object-contain grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials - Side by side across the screen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  quote: "Before joining, I felt lost and overwhelmed. Within two weeks, I gained incredible clarity about what I really wanted — and realised I'd been stuck without even noticing.",
                  author: "Jermaine",
                  image: "https://www.dropbox.com/scl/fi/8h0j6k7zwk3hs4bey5ahq/Jermaine.jpeg?rlkey=hfvo2w1k5eiqtyadnv21ggkef&st=vwoabzd0&raw=1"
                },
                {
                  quote: "Now, I have a clearer direction and a solid plan to make my goals a reality.",
                  author: "Ilona",
                  image: "https://www.dropbox.com/scl/fi/jw5bvv6wnxc26t9em2mtv/Ilona.jpeg?rlkey=yi88s56e9tyxqdd2wcloxc1bj&st=wwoi02i9&raw=1"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex gap-3">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#2f3857] flex-shrink-0"
                    />
                    <div>
                      <p className="text-gray-600 italic mb-1">"{testimonial.quote}"</p>
                      <p className="font-semibold text-[#2f3857]">– {testimonial.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section - Payment form (full width) */}
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
              {/* Price Block */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-[#2f3857] mb-4 font-['Helvetica Neue']">
                  GET INSTANT ACCESS NOW:
                </h2>
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-[#2f3857]">$197</span>
                  </div>
                  <div className="text-gray-600 text-sm mb-2 max-w-lg">
                    (Content valued at $3,000 in 1:1 sessions with Alex)
                  </div>
                  <div className="text-gray-600 text-sm mb-2 max-w-lg">
                    One-time payment. Unlimited access. No hidden fees.
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    Price may increase as new features are added.
                  </div>
                  <div className="flex items-center gap-2 bg-[#f8f4f0] px-4 py-2 rounded-full">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Your purchase is protected by our 14-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Trust Icons */}
              <div className="flex justify-center items-center gap-6 mb-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#2f3857]" />
                  <span className="text-base text-gray-600 font-medium">SSL Secure Connection</span>
                </div>
                <div className="flex items-center gap-4">
                  <img 
                    src="https://www.dropbox.com/scl/fi/znhptckiprfwyxeg16su2/visa.png?rlkey=fo70wq024rjhifwsi4bcf5hjj&st=w25id6mx&raw=1" 
                    alt="Visa" 
                    className="h-7 object-contain"
                    loading="eager"
                  />
                  <img 
                    src="https://www.dropbox.com/scl/fi/a4g9qusoe22npx9er8cs5/mastercard.png?rlkey=74sbp5k872zi1e0xec7lfsq63&st=7q14tv0s&raw=1" 
                    alt="Mastercard" 
                    className="h-7 object-contain"
                    loading="eager"
                  />
                  <img 
                    src="https://www.dropbox.com/scl/fi/vn0fvaj9930mkatyiqqt9/stripe.png?rlkey=glufc75d20q7r6ua9nn4st2n8&st=359xo1r6&raw=1" 
                    alt="Stripe" 
                    className="h-7 object-contain"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Payment Form */}
              <CheckoutForm />
            </div>

            {/* FAQ Section */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#2f3857] mb-8 tracking-tight text-center font-['Helvetica Neue']">
                FREQUENTLY ASKED QUESTIONS:
              </h2>
              
              <div className="grid gap-6">
                {[
                  {
                    question: "Is this workshop live?",
                    answer: "No, it's self-paced. Start anytime."
                  },
                  {
                    question: "How long does it take?",
                    answer: "3–5 hours, at your own pace."
                  },
                  {
                    question: "What if it's not for me?",
                    answer: "You're covered by a 14-day full refund."
                  },
                  {
                    question: "What happens after purchase?",
                    answer: "You'll receive an email with instant access."
                  },
                  {
                    question: "Are there additional fees?",
                    answer: "No, $197 covers everything. No hidden costs."
                  }
                ].map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-[#fd7f4f] flex-shrink-0" />
                        <h3 className="font-bold text-[#2f3857] text-lg">{faq.question}</h3>
                      </div>
                      <div className="ml-8 border-l-2 border-[#fd7f4f] pl-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <a 
                  href="mailto:alex@theclarityworkshop.co.uk"
                  className="inline-flex items-center gap-2 text-[#2f3857] hover:text-[#fd7f4f] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Still have questions? Email me directly at alex@theclarityworkshop.co.uk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
