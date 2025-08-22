import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Check, AlertCircle, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

export default function WebhookTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<string>('{\n  "name": "Test User",\n  "email": "test@example.com",\n  "purchase_id": "test_123",\n  "transaction_id": "txn_test_123",\n  "payment_confirmed": true\n}');
  const [testType, setTestType] = useState<'auto' | 'custom' | 'stripe-debug'>('auto');
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu2.make.com/9mlnjz7fu9sq8ecwhk5abgxxm8j2qfl6');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Check if URL has a debug parameter
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    
    if (debug === 'stripe') {
      setTestType('stripe-debug');
      fetchDebugInfo();
    }
  }, []);

  const fetchDebugInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch debug info from Supabase function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-test?debug=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch debug info: ${response.status}`);
      }
      
      const data = await response.json();
      setDebugInfo(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error fetching debug info:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runAutoTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setTestStatus('idle');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      });
      
      const data = await response.json();
      setResult(data);
      
      if (!response.ok) {
        setError(`Request failed with status ${response.status}: ${data.error || 'Unknown error'}`);
        setTestStatus('failed');
      } else {
        setTestStatus('success');
      }
    } catch (err) {
      console.error('Error running test:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTestStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const runCustomTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setTestStatus('idle');
    
    try {
      // Parse the payload
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${parseError.message}`);
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedPayload)
      });
      
      const data = await response.json();
      setResult(data);
      
      if (!response.ok) {
        setError(`Request failed with status ${response.status}: ${data.error || 'Unknown error'}`);
        setTestStatus('failed');
      } else {
        setTestStatus('success');
      }
    } catch (err) {
      console.error('Error running test:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTestStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const runDirectTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setTestStatus('idle');
    
    try {
      // Parse the payload
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${parseError.message}`);
      }
      
      // Add timestamp and source to help identify this request
      parsedPayload.test_timestamp = new Date().toISOString();
      parsedPayload.test_source = 'direct-browser-test';
      
      // Attempt to send directly to the webhook URL
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WebhookTest/BrowserDirect'
        },
        body: JSON.stringify(parsedPayload)
      });
      
      let responseText;
      try {
        responseText = await response.text();
      } catch (e) {
        responseText = 'Could not read response text';
      }
      
      setResult({
        success: response.ok,
        status: response.status,
        response: responseText,
        sent_payload: parsedPayload,
        timestamp: new Date().toISOString(),
        direct_test: true
      });
      
      if (!response.ok) {
        setError(`Direct request failed with status ${response.status}`);
        setTestStatus('failed');
      } else {
        setTestStatus('success');
      }
    } catch (err) {
      console.error('Error running direct test:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTestStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const formatJson = (json: any) => {
    return JSON.stringify(json, null, 2);
  };
  
  const isSuccess = result && (result.success || result.status >= 200 && result.status < 300);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Webhook Testing Tool</h1>
            
            {testStatus === 'success' && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                Test Successful
              </span>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Test Webhook Connectivity</h2>
            <p className="text-sm text-gray-600">
              This tool helps you test if your webhook endpoint is receiving data correctly
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setTestType('auto')}
              className={`px-4 py-2 rounded-md ${
                testType === 'auto' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Auto Test
            </button>
            <button
              onClick={() => setTestType('custom')}
              className={`px-4 py-2 rounded-md ${
                testType === 'custom' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom Payload
            </button>
            <button
              onClick={() => {
                setTestType('stripe-debug');
                fetchDebugInfo();
              }}
              className={`px-4 py-2 rounded-md ${
                testType === 'stripe-debug' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Stripe Debug
            </button>
          </div>
          
          {testType === 'stripe-debug' ? (
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">Stripe Webhook Debug Info</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This information will help diagnose issues with Stripe webhook processing.
                </p>
                
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <pre className="bg-gray-800 text-green-400 p-4 rounded-md text-sm font-mono overflow-x-auto">
                    {debugInfo || 'No debug information available'}
                  </pre>
                )}
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={fetchDebugInfo}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Refresh Debug Info
                </button>
              </div>
            </div>
          ) : testType === 'custom' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payload (JSON)
              </label>
              <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="w-full h-48 p-2 font-mono text-sm border border-gray-300 rounded-md"
                spellCheck="false"
              />
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Auto Test Explanation</h3>
              <p className="text-sm text-gray-600">
                This test will send a pre-configured payload to the webhook endpoint via the Supabase Edge Function.
                It's the most reliable way to test if your webhook setup is working correctly.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {testType === 'auto' ? (
              <button
                onClick={runAutoTest}
                disabled={loading}
                className={`flex items-center justify-center gap-2 py-2 px-6 bg-blue-600 text-white rounded-md font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Run Auto Test
                  </>
                )}
              </button>
            ) : testType === 'custom' ? (
              <>
                <button
                  onClick={runCustomTest}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 py-2 px-6 bg-blue-600 text-white rounded-md font-medium ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Test via Edge Function
                    </>
                  )}
                </button>
                
                <button
                  onClick={runDirectTest}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 py-2 px-6 bg-purple-600 text-white rounded-md font-medium ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Test Direct From Browser
                    </>
                  )}
                </button>
              </>
            ) : null}
          </div>
        </div>
        
        {result && (
          <div className="max-w-4xl mx-auto">
            <div className={`p-4 rounded-t-lg ${isSuccess ? 'bg-green-100' : 'bg-red-100'} flex items-center gap-2`}>
              {isSuccess ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium">
                    Request Successful (Status: {result.status})
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium">
                    Request Failed (Status: {result.status})
                  </span>
                </>
              )}
            </div>
            <div className="bg-gray-800 rounded-b-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono">
                {formatJson(result)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}