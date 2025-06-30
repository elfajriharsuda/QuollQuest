import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { supabase } from '../lib/supabase';
import AvatarDisplay from '../components/AvatarDisplay';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Crown, 
  Zap,
  Plus,
  Send,
  Star,
  Target,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QuollShout {
  id: string;
  user_id: string;
  content: string;
  achievement_type: string | null;
  likes_count: number;
  created_at: string;
  users: {
    username: string;
    avatar_url: string | null;
    level: number;
  };
}

interface CommunityStats {
  activeUsers: number;
  totalQuests: number;
  totalAchievements: number;
}

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [shouts, setShouts] = useState<QuollShout[]>([]);
  const [newShout, setNewShout] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [stats, setStats] = useState<CommunityStats>({
    activeUsers: 0,
    totalQuests: 0,
    totalAchievements: 0
  });

  useEffect(() => {
    fetchShouts();
    fetchCommunityStats();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('quoll_shouts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quoll_shouts' },
        () => {
          fetchShouts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchShouts = async () => {
    try {
      const { data, error } = await supabase
        .from('quoll_shouts')
        .select(`
          *,
          users (
            username,
            avatar_url,
            level
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setShouts(data || []);
    } catch (error) {
      console.error('Error fetching shouts:', error);
      toast.error('Error loading community feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch completed quests count
      const { count: questCount } = await supabase
        .from('user_quest_progress')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      setStats({
        activeUsers: userCount || 0,
        totalQuests: questCount || 0,
        totalAchievements: Math.floor((questCount || 0) / 2) // Rough calculation
      });
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  const postShout = async () => {
    if (!newShout.trim() || !user || posting) return;

    setPosting(true);
    try {
      const { error } = await supabase
        .from('quoll_shouts')
        .insert({
          user_id: user.id,
          content: newShout,
          achievement_type: null,
          likes_count: 0,
        });

      if (error) throw error;

      setNewShout('');
      toast.success('Shout posted!');
      fetchShouts();
    } catch (error) {
      console.error('Error posting shout:', error);
      toast.error('Error posting shout');
    } finally {
      setPosting(false);
    }
  };

  const likeShout = async (shoutId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('quoll_shouts')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', shoutId);

      if (error) throw error;
      
      // Update local state
      setShouts(prev => prev.map(shout => 
        shout.id === shoutId 
          ? { ...shout, likes_count: shout.likes_count + 1 }
          : shout
      ));
    } catch (error) {
      console.error('Error liking shout:', error);
      toast.error('Error liking post');
    }
  };

  const getAchievementIcon = (type: string | null) => {
    switch (type) {
      case 'quest_completed':
        return <Trophy className="w-4 h-4 text-fantasy-gold" />;
      case 'level_up':
        return <Crown className="w-4 h-4 text-fantasy-purple" />;
      case 'streak':
        return <Zap className="w-4 h-4 text-fantasy-rose" />;
      default:
        return <MessageCircle className="w-4 h-4 text-primary-400" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fantasy-bg text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-fantasy-purple bg-clip-text text-transparent">
            Quoll's Den
          </h1>
          <p className="text-xl text-gray-300">
            Connect with fellow adventurers and share your learning journey
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Users className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
            <div className="text-sm text-gray-400">Active Adventurers</div>
          </div>
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Target className="w-8 h-8 text-fantasy-emerald mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalQuests}</div>
            <div className="text-sm text-gray-400">Quests Completed</div>
          </div>
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Star className="w-8 h-8 text-fantasy-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalAchievements}</div>
            <div className="text-sm text-gray-400">Achievements Earned</div>
          </div>
        </motion.div>

        {/* Post Creation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30"
        >
          <div className="flex items-start space-x-4">
            <AvatarDisplay
              avatarId={profile?.avatar_url}
              size="md"
              userId={user?.id}
              animate={false}
            />
            <div className="flex-1">
              <textarea
                value={newShout}
                onChange={(e) => setNewShout(e.target.value)}
                placeholder="Share your learning journey with the community..."
                className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-400">
                  {newShout.length}/280 characters
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={postShout}
                  disabled={!newShout.trim() || posting}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {posting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{posting ? 'Posting...' : 'Shout'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Community Feed</h2>
          
          {shouts.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No shouts yet</h3>
              <p className="text-gray-500">Be the first to share your learning journey!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {shouts.map((shout, index) => (
                <motion.div
                  key={shout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-primary-600/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <AvatarDisplay
                      avatarId={shout.users.avatar_url}
                      size="md"
                      userId={shout.user_id}
                      animate={false}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-white">{shout.users.username}</span>
                        <div className="flex items-center space-x-1 bg-primary-600/20 px-2 py-1 rounded-lg">
                          <Crown className="w-3 h-3 text-primary-400" />
                          <span className="text-xs text-primary-400 font-medium">Lv.{shout.users.level}</span>
                        </div>
                        {getAchievementIcon(shout.achievement_type)}
                        <span className="text-sm text-gray-400">{formatTimeAgo(shout.created_at)}</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">{shout.content}</p>
                      
                      <div className="flex items-center space-x-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => likeShout(shout.id, shout.likes_count)}
                          className="flex items-center space-x-2 text-gray-400 hover:text-fantasy-rose transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{shout.likes_count}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">Reply</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-fantasy-emerald transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">Share</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage;