import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a success message in the location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Login successful:", data);
      navigate('/');
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
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
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h1 className="text-3xl font-bold text-[#2f3857] mb-6 tracking-tight font-['Helvetica Neue'] text-center">
              LOG IN
            </h1>

            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f3857] focus:border-[#2f3857] transition-colors"
                    placeholder="Your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#2f3857] text-white py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3b435d]'
                }`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#2f3857] font-semibold hover:text-[#fd7f4f] transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="text-center">
                <Link to="/" className="text-[#2f3857] hover:text-[#fd7f4f] transition-colors text-sm">
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}