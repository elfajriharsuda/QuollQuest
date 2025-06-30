import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key are required. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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