import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, handleAuthError } from '../lib/supabase';
import { User, LogOut, LogIn, UserPlus, Package, Menu } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          // If the error is about a missing session, this is not a critical error
          // for a user menu - it just means no one is logged in
          if (error.message.includes('session missing')) {
            setUser(null);
            setLoading(false);
            return;
          }
          
          const wasHandled = await handleAuthError(error);
          if (wasHandled) {
            setUser(null);
            setLoading(false);
            return;
          }
          console.error('Error fetching user:', error);
          setUser(null);
        } else if (data && data.user) {
          setUser(data.user);
        } else {
          // Handle case where data exists but user is null/undefined
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        // Safely set user to null if session is null or undefined
        setUser(session?.user || null);
      } catch (error: any) {
        const wasHandled = await handleAuthError(error);
        if (!wasHandled) {
          console.error('Auth state change error:', error);
        }
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2f3857] text-white hover:bg-[#3b435d] transition-colors"
        aria-label={user ? "Account menu" : "Login/Signup menu"}
      >
        {user ? (
          <User className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-900 truncate mb-1">Account</p>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
              <Link
                to="/account"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                <Package className="w-4 h-4" />
                My Purchases
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Log Out</span>
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-900">Account Options</p>
              </div>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Log In</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">Create Account</span>
              </Link>
            </>
          )}
        </div>
      )}
      
      {/* Status indicator - visible when menu is closed */}
      {!isOpen && user && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" 
             title="Logged in"></div>
      )}
    </div>
  );
}