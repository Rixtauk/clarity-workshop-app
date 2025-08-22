import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, handleAuthError } from '../lib/supabase';
import { getUserOrders, getProductByPriceId } from '../lib/stripe';
import { Calendar, Package, ArrowLeft } from 'lucide-react';
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

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserAndOrders() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          const wasHandled = await handleAuthError(error);
          if (wasHandled) return;
          console.error('Error fetching user data:', error);
          navigate('/login');
          return;
        }
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUser(user);
        
        try {
          const userOrders = await getUserOrders();
          setOrders(userOrders || []);
        } catch (orderError) {
          console.error('Error fetching orders:', orderError);
          // Continue even if orders fail to load
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserAndOrders();
  }, [navigate]);

  const formatCurrency = (amount: number, currency: string | null | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency ? currency.toUpperCase() : 'USD', // Default to USD if currency is null/undefined
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2f3857] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2f3857] font-medium">Loading your account...</p>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link 
                to="/"
                className="flex items-center gap-2 text-[#2f3857] hover:text-[#fd7f4f] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-[#2f3857] mb-8 tracking-tight font-['Helvetica Neue']">
              MY ACCOUNT
            </h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#2f3857] mb-4">Account Information</h2>
              <div className="flex flex-col gap-2">
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Member since:</span> {formatDate(user?.created_at || new Date().toISOString())}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#2f3857] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                My Purchases
              </h2>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.order_id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-lg text-[#2f3857]">
                            The Clarity Workshop
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>Purchased on {formatDate(order.order_date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(order.amount_total, order.currency)}</div>
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't made any purchases yet.</p>
                  <Link
                    to="/checkout"
                    className="inline-flex items-center gap-2 dark-cta text-white px-6 py-2 rounded-lg font-semibold gentle-bounce"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}