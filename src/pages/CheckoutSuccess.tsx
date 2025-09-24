import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function CheckoutSuccess() {
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
                You now have access to the Clarity Workshop. Check your email for login details and next steps.
              </p>
              
              <div className="border-t border-gray-100 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-[#2f3857] mb-4 font-['Helvetica Neue']">
                  WHAT HAPPENS NEXT?
                </h2>
                
                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-navy rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      You'll receive an email with your login details shortly
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-navy rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      Log in to access your workshop materials
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-navy rounded-full p-1 text-white flex-shrink-0 mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">
                      Start your journey to clarity at your own pace
                    </span>
                  </div>
                </div>
                
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