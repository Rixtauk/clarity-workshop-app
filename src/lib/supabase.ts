import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    onAuthStateChange: (event, session) => {
      // If we detect an auth error related to an invalid user
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('Auth state changed:', event);
        // Clear any local storage data related to user
        localStorage.removeItem('checkout_name');
        localStorage.removeItem('checkout_email');
      }
    },
  }
});

// Add a global error handler for auth operations
export const handleAuthError = async (error: any) => {
  if (
    error?.message?.includes('User from sub claim in JWT does not exist') ||
    error?.error?.message?.includes('User from sub claim in JWT does not exist') ||
    error?.code === 'user_not_found'
  ) {
    console.log('Invalid user session detected, signing out');
    // Clear the invalid session
    await supabase.auth.signOut();
    // Remove any locally stored user data
    localStorage.removeItem('checkout_name');
    localStorage.removeItem('checkout_email');
    
    // Force reload the page to reset application state
    window.location.href = '/login?error=session_invalid';
    return true;
  }
  return false;
};