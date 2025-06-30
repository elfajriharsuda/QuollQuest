import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<any>;
  supabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const mounted = useRef(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mounted.current = true;

    // Check if Supabase is properly configured
    const checkSupabaseConfig = () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        console.warn('Supabase environment variables not found. Please configure Supabase integration.');
        setSupabaseConfigured(false);
        setLoading(false);
        return false;
      }
      
      try {
        new URL(url);
        setSupabaseConfigured(true);
        return true;
      } catch (error) {
        console.error('Invalid Supabase URL:', url);
        setSupabaseConfigured(false);
        setLoading(false);
        return false;
      }
    };

    if (!checkSupabaseConfig()) {
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (error.message.includes('not configured')) {
            setSupabaseConfigured(false);
          }
        }
        
        if (mounted.current) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted.current) {
          setSupabaseConfigured(false);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted.current) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          // Clear any cached data
          if (mounted.current) {
            setUser(null);
            setSession(null);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in');
        }
      }
    );

    // Periodic session refresh to prevent logout
    const startPeriodicRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted.current && session) {
            setSession(session);
            setUser(session.user);
          }
          startPeriodicRefresh(); // Schedule next refresh
        } catch (error) {
          console.error('Error refreshing session:', error);
        }
      }, 30000); // Refresh every 30 seconds
    };

    startPeriodicRefresh();

    // Handle page visibility changes to prevent logout on tab switch
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // When tab becomes visible again, refresh the session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted.current && session) {
            setSession(session);
            setUser(session.user);
          }
        } catch (error) {
          console.error('Error refreshing session on visibility change:', error);
        }
      }
    };

    // Handle page focus to refresh session
    const handleFocus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted.current && session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error refreshing session on focus:', error);
      }
    };

    // Handle before unload to persist session
    const handleBeforeUnload = () => {
      // Don't clear session on page unload
      // This prevents logout when switching tabs or refreshing
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      mounted.current = false;
      subscription.unsubscribe();
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    if (!supabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured. Please set up your Supabase integration.') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (data.user && !error) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        username,
        exp: 0,
        level: 1,
        avatar_url: 'quoll1',
        login_streak: 0,
        longest_streak: 0,
        total_logins: 0,
      });
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured. Please set up your Supabase integration.') };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!supabaseConfigured) {
      return;
    }
    
    // Clear the refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    await supabase.auth.signOut();
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    if (!supabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured. Please set up your Supabase integration.') };
    }
    
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    supabaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};