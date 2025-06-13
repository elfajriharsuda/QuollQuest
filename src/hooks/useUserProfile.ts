import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
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
}

interface UserStats {
  totalQuests: number;
  completedQuests: number;
  currentStreak: number;
  totalExp: number;
  achievements: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'quest_completed' | 'level_up' | 'achievement_earned' | 'login_streak';
  description: string;
  exp_gained: number;
  created_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuests: 0,
    completedQuests: 0,
    currentStreak: 0,
    totalExp: 0,
    achievements: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserStats();
      updateLoginStreak();
    }
  }, [user]);

  const updateLoginStreak = async () => {
    if (!user) return;

    try {
      // Call the database function to update login streak
      const { error } = await supabase.rpc('update_login_streak', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error updating login streak:', error);
      }
    } catch (err) {
      console.error('Error calling update_login_streak:', err);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User doesn't exist, create profile
          await createUserProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    }
  };

  const createUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'Adventurer',
          exp: 0,
          level: 1,
          login_streak: 0,
          longest_streak: 0,
          total_logins: 0,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      
      // Update login streak for new user
      await updateLoginStreak();
    } catch (err) {
      console.error('Error creating user profile:', err);
      setError('Failed to create user profile');
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch quest progress
      const { data: questProgress } = await supabase
        .from('user_quest_progress')
        .select('status, score, completed_at, quest_id, quests(topic_id, topics(name))')
        .eq('user_id', user.id);

      // Fetch quiz attempts for recent activity
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('score, completed_at, quest_id, quests(level, topic_id, topics(name))')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (questProgress) {
        const completed = questProgress.filter(q => q.status === 'completed');
        const totalExp = completed.reduce((sum, quest) => sum + (quest.score || 0), 0);
        
        // Generate recent activity from quiz attempts
        const recentActivity: ActivityItem[] = (quizAttempts || []).map((attempt, index) => ({
          id: `activity_${index}`,
          type: 'quest_completed' as const,
          description: `Completed ${attempt.quests?.topics?.name || 'Unknown'} Quest Level ${attempt.quests?.level || 0}`,
          exp_gained: Math.floor((attempt.score / 100) * 50), // Convert score to EXP
          created_at: attempt.completed_at
        }));

        setStats({
          totalQuests: questProgress.length,
          completedQuests: completed.length,
          currentStreak: profile?.login_streak || 0, // Use login streak instead of quest streak
          totalExp,
          achievements: Math.floor(completed.length / 2), // 1 achievement per 2 completed quests
          recentActivity
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const addExperience = async (expGained: number) => {
    if (!profile) return;

    const newExp = profile.exp + expGained;
    const newLevel = Math.floor(newExp / 100) + 1; // 100 EXP per level
    
    await updateProfile({ 
      exp: newExp, 
      level: Math.max(newLevel, profile.level) 
    });
    
    // Refresh stats
    await fetchUserStats();
    
    return { leveledUp: newLevel > profile.level, newLevel };
  };

  return {
    profile,
    stats,
    loading,
    error,
    updateProfile,
    addExperience,
    refreshProfile: fetchUserProfile,
    refreshStats: fetchUserStats
  };
};