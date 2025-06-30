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
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  reconnect: () => Promise<void>;
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('connecting');
  const mounted = useRef(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mounted.current = true;
    checkSupabaseConnection();

    return () => {
      mounted.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, []);

  const checkSupabaseConnection = async () => {
    console.log('🔍 Checking Supabase connection...');
    setConnectionStatus('connecting');

    try {
      // Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('Environment check:', {
        urlPresent: !!url,
        keyPresent: !!key,
        urlValid: url && !url.includes('placeholder') && !url.includes('your-project-id'),
        keyValid: key && !key.includes('placeholder') && !key.includes('your-anon-key') && key.length > 50
      });
      
      if (!url || !key) {
        console.warn('❌ Environment variables not found');
        setSupabaseConfigured(false);
        setConnectionStatus('disconnected');
        setLoading(false);
        return;
      }

      // Check for placeholder values
      const isPlaceholderUrl = url.includes('placeholder') || 
        url.includes('your-project-id') || 
        url === 'undefined' || 
        url === 'null';

      const isPlaceholderKey = key.includes('placeholder') || 
        key.includes('your-anon-key') || 
        key === 'undefined' || 
        key === 'null' ||
        key.length < 50;

      if (isPlaceholderUrl || isPlaceholderKey) {
        console.warn('❌ Environment variables using placeholder values');
        setSupabaseConfigured(false);
        setConnectionStatus('disconnected');
        setLoading(false);
        return;
      }
      
      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        console.error('❌ Invalid Supabase URL format:', url);
        setSupabaseConfigured(false);
        setConnectionStatus('error');
        setLoading(false);
        return;
      }

      // Test actual connection
      console.log('🔌 Testing connection to Supabase...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error && error.message.includes('not configured')) {
        console.error('❌ Supabase not configured properly:', error);
        setSupabaseConfigured(false);
        setConnectionStatus('error');
        setLoading(false);
        return;
      }
      
      // Connection successful
      console.log('✅ Supabase connection successful!');
      setSupabaseConfigured(true);
      setConnectionStatus('connected');
      
      if (mounted.current) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      }

      // Set up auth state listener
      setupAuthListener();
      
      // Start periodic connection monitoring
      startConnectionMonitoring();

    } catch (error) {
      console.error('❌ Error checking Supabase connection:', error);
      if (mounted.current) {
        setSupabaseConfigured(false);
        setConnectionStatus('error');
        setLoading(false);
      }
    }
  };

  const setupAuthListener = () => {
    console.log('👂 Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (mounted.current) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_OUT':
            console.log('👋 User signed out');
            if (mounted.current) {
              setUser(null);
              setSession(null);
            }
            break;
          case 'TOKEN_REFRESHED':
            console.log('🔄 Token refreshed successfully');
            break;
          case 'SIGNED_IN':
            console.log('👋 User signed in');
            break;
          case 'INITIAL_SESSION':
            console.log('🎯 Initial session loaded');
            break;
        }
      }
    );

    // Store subscription for cleanup
    return subscription;
  };

  const startConnectionMonitoring = () => {
    // Monitor connection every 30 seconds
    connectionCheckRef.current = setInterval(async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error && mounted.current) {
          console.warn('⚠️ Supabase connection issue:', error.message);
          setConnectionStatus('error');
        } else if (mounted.current && connectionStatus !== 'connected') {
          console.log('✅ Supabase connection recovered');
          setConnectionStatus('connected');
        }
      } catch (error) {
        if (mounted.current) {
          console.error('❌ Error monitoring connection:', error);
          setConnectionStatus('error');
        }
      }
    }, 30000);
  };

  const reconnect = async () => {
    console.log('🔄 Attempting to reconnect to Supabase...');
    setConnectionStatus('connecting');
    await checkSupabaseConnection();
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (!supabaseConfigured) {
      return { 
        data: null, 
        error: new Error('🔌 Supabase not connected. Please setup credentials in .env file') 
      };
    }

    console.log('📝 Registering new user:', email);
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
      console.log('👤 Creating user profile...');
      try {
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
        console.log('✅ User profile created successfully');
      } catch (profileError) {
        console.error('❌ Error creating user profile:', profileError);
      }
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      return { 
        data: null, 
        error: new Error('🔌 Supabase not connected. Please setup credentials in .env file') 
      };
    }
    
    console.log('🔐 Signing in:', email);
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!supabaseConfigured) {
      return;
    }
    
    console.log('👋 Signing out...');
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    await supabase.auth.signOut();
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    if (!supabaseConfigured) {
      return { 
        data: null, 
        error: new Error('🔌 Supabase not connected. Please setup credentials in .env file') 
      };
    }
    
    console.log('🔐 Sign in with provider:', provider);
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
    connectionStatus,
    reconnect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};