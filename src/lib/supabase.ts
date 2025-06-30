import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced logging for debugging
console.log('🔍 Supabase Configuration Check:');
console.log('URL present:', !!supabaseUrl);
console.log('Key present:', !!supabaseAnonKey);
console.log('URL value:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Not found');
console.log('Key value:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not found');

let supabase: any;

// Enhanced placeholder detection
const isPlaceholderUrl = !supabaseUrl || 
  supabaseUrl === 'your-project-id.supabase.co' || 
  supabaseUrl === 'https://your-project-id.supabase.co' ||
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseUrl.includes('your-project-id') ||
  supabaseUrl.includes('placeholder') ||
  supabaseUrl === 'undefined' ||
  supabaseUrl === 'null';

const isPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey === 'your-anon-key-here' || 
  supabaseAnonKey === 'placeholder-anon-key-here' ||
  supabaseAnonKey.includes('your-anon-key') ||
  supabaseAnonKey.includes('placeholder') ||
  supabaseAnonKey === 'undefined' ||
  supabaseAnonKey === 'null' ||
  supabaseAnonKey.length < 50; // Supabase keys are typically much longer

// Check if we're in development and should show setup instructions
const isDevelopment = import.meta.env.DEV;
const shouldShowSetupInstructions = isDevelopment && (isPlaceholderUrl || isPlaceholderKey);

if (shouldShowSetupInstructions) {
  console.warn('⚠️ Supabase is not configured properly.');
  console.warn('🔧 To enable connection:');
  console.warn('1. Create a project at https://supabase.com');
  console.warn('2. Copy URL and anon key to .env file');
  console.warn('3. Restart development server');
  
  // Create enhanced dummy client with better error messages
  const dummyClient = {
    auth: {
      getSession: () => Promise.resolve({ 
        data: { session: null }, 
        error: new Error('🔌 Supabase not connected. Please setup Supabase credentials in .env file') 
      }),
      onAuthStateChange: () => ({ 
        data: { 
          subscription: { 
            unsubscribe: () => console.log('🔌 Dummy auth subscription unsubscribed') 
          } 
        } 
      }),
      signUp: () => Promise.resolve({ 
        data: null, 
        error: new Error('🔌 Please setup Supabase first in .env file') 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: new Error('🔌 Please setup Supabase first in .env file') 
      }),
      signInWithOAuth: () => Promise.resolve({ 
        data: null, 
        error: new Error('🔌 Please setup Supabase first in .env file') 
      }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ 
            data: null, 
            error: new Error(`🔌 Cannot access table '${table}'. Supabase not connected.`) 
          }),
          order: () => ({ 
            limit: () => Promise.resolve({ 
              data: [], 
              error: new Error(`🔌 Cannot access table '${table}'. Supabase not connected.`) 
            }) 
          })
        }),
        order: () => ({ 
          limit: () => Promise.resolve({ 
            data: [], 
            error: new Error(`🔌 Cannot access table '${table}'. Supabase not connected.`) 
          }) 
        }),
        or: () => ({
          order: () => ({ 
            limit: () => Promise.resolve({ 
              data: [], 
              error: new Error(`🔌 Cannot access table '${table}'. Supabase not connected.`) 
            }) 
          })
        })
      }),
      insert: (data: any) => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ 
            data: null, 
            error: new Error(`🔌 Cannot save to table '${table}'. Supabase not connected.`) 
          }) 
        }) 
      }),
      update: (data: any) => ({ 
        eq: () => Promise.resolve({ 
          data: null, 
          error: new Error(`🔌 Cannot update table '${table}'. Supabase not connected.`) 
        }) 
      }),
      delete: () => ({ 
        eq: () => Promise.resolve({ 
          data: null, 
          error: new Error(`🔌 Cannot delete from table '${table}'. Supabase not connected.`) 
        }) 
      }),
    }),
    rpc: (functionName: string, params?: any) => Promise.resolve({ 
      data: null, 
      error: new Error(`🔌 Cannot call function '${functionName}'. Supabase not connected.`) 
    }),
    channel: (name: string) => ({
      on: () => ({ 
        subscribe: () => ({ 
          unsubscribe: () => console.log(`🔌 Dummy channel '${name}' unsubscribed`) 
        }) 
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ 
          data: null, 
          error: new Error(`🔌 Cannot upload to bucket '${bucket}'. Supabase not connected.`) 
        }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
  
  supabase = dummyClient;
} else {
  // Validate URL format only if it's not a placeholder
  try {
    if (supabaseUrl) {
      new URL(supabaseUrl);
      console.log('✅ Supabase URL format is valid');
    }
  } catch (error) {
    console.error('❌ Invalid Supabase URL format:', supabaseUrl);
    console.error('URL should be like: https://your-project-id.supabase.co');
    
    // Use dummy client for invalid URL
    const dummyClient = {
      auth: {
        getSession: () => Promise.resolve({ 
          data: { session: null }, 
          error: new Error('❌ Invalid Supabase URL. Please check your URL format.') 
        }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }),
            order: () => ({ limit: () => Promise.resolve({ data: [], error: new Error('❌ Invalid Supabase URL') }) })
          }),
          order: () => ({ limit: () => Promise.resolve({ data: [], error: new Error('❌ Invalid Supabase URL') }) })
        }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }) }) }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }) }),
      }),
      rpc: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }),
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: new Error('❌ Invalid Supabase URL') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
    
    supabase = dummyClient;
  }

  // Only create the real Supabase client if we haven't already assigned a dummy client
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    try {
      console.log('🚀 Initializing Supabase client...');
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: window.localStorage,
          storageKey: 'quollquest-auth-token',
        },
        global: {
          headers: {
            'X-Client-Info': 'quollquest-web',
          },
        },
      });
      
      console.log('✅ Supabase client initialized successfully');
      
      // Test connection
      supabase.auth.getSession().then(({ data, error }: any) => {
        if (error) {
          console.warn('⚠️ Supabase connection warning:', error.message);
        } else {
          console.log('🎉 Supabase connection successful!');
        }
      }).catch((err: any) => {
        console.error('❌ Failed to test Supabase connection:', err);
      });
      
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
    }
  }
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          exp: number;
          level: number;
          login_streak: number;
          longest_streak: number;
          total_logins: number;
          last_login_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      topics: {
        Row: {
          id: string;
          name: string;
          description: string;
          user_id: string;
          is_popular: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['topics']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['topics']['Insert']>;
      };
      quests: {
        Row: {
          id: string;
          topic_id: string;
          level: number;
          is_unlocked: boolean;
          is_completed: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['quests']['Insert']>;
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quest_id: string;
          score: number;
          answers: any[];
          completed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quiz_attempts']['Row'], 'id' | 'completed_at'>;
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Insert']>;
      };
      user_quest_progress: {
        Row: {
          id: string;
          user_id: string;
          quest_id: string;
          status: 'locked' | 'unlocked' | 'completed';
          score: number | null;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['user_quest_progress']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['user_quest_progress']['Insert']>;
      };
      quoll_shouts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          achievement_type: string | null;
          likes_count: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quoll_shouts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['quoll_shouts']['Insert']>;
      };
      user_login_history: {
        Row: {
          id: string;
          user_id: string;
          login_date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_login_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_login_history']['Insert']>;
      };
      leaderboard_cache: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          avatar_url: string | null;
          level: number;
          exp: number;
          login_streak: number;
          completed_quests: number;
          total_score: number;
          rank_position: number;
          category: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leaderboard_cache']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leaderboard_cache']['Insert']>;
      };
    };
  };
};