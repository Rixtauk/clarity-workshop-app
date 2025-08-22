import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Check, AlertCircle } from 'lucide-react';
import { sendToWebhook } from '../lib/webhook';

export default function DirectWebhook() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      setError('Please provide both name and email.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setResponse(null);
    
    try {
      const result = await sendToWebhook(name, email, orderId || undefined);
      
      setSuccess(result.success);
      setResponse(result);
      
      if (!result.success) {
        setError(result.error || 'Failed to send notification to webhook.');
      }
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Direct Webhook Tool</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Send Data Directly to Webhook</h2>
            <p className="text-sm text-gray-600">
              Use this tool to manually send customer data to the Make.com webhook
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {success === true && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Successfully sent data to webhook!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer's full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer's email address"
                required
              />
            </div>
            
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID (Optional)
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter order ID if available"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send to Webhook
                </>
              )}
            </button>
          </form>
          
          {response && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Response:</h3>
              <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}