import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { supabase } from '../lib/supabase';
import AvatarDisplay from '../components/AvatarDisplay';
import { 
  Crown, 
  Trophy, 
  Zap, 
  Target, 
  TrendingUp,
  Star,
  Play,
  ChevronRight,
  Calendar,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentShout {
  id: string;
  content: string;
  created_at: string;
  users: {
    username: string;
    level: number;
    avatar_url: string | null;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile, stats, loading } = useUserProfile();
  const [recentShouts, setRecentShouts] = useState<RecentShout[]>([]);

  useEffect(() => {
    fetchRecentShouts();
  }, []);

  const fetchRecentShouts = async () => {
    try {
      const { data } = await supabase
        .from('quoll_shouts')
        .select(`
          id,
          content,
          created_at,
          users (
            username,
            level,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentShouts(data || []);
    } catch (error) {
      console.error('Error fetching recent shouts:', error);
    }
  };

  const expToNextLevel = profile ? profile.level * 100 : 100;
  const expProgress = profile ? (profile.exp / expToNextLevel) * 100 : 0;

  const quickActions = [
    {
      title: 'Continue Quest',
      description: 'Resume your learning adventure',
      icon: Play,
      color: 'from-primary-500 to-primary-600',
      link: '/quests',
    },
    {
      title: 'Explore Topics',
      description: 'Discover new learning paths',
      icon: Target,
      color: 'from-fantasy-purple to-fantasy-rose',
      link: '/quests',
    },
    {
      title: 'Community Feed',
      description: 'See what others are learning',
      icon: Users,
      color: 'from-fantasy-emerald to-fantasy-gold',
      link: '/community',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fantasy-bg text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-fantasy-purple bg-clip-text text-transparent">
            Welcome back, {profile?.username || 'Adventurer'}!
          </h1>
          <p className="text-xl text-gray-300">
            Ready to continue your learning quest?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Level & EXP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-primary-600/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-fantasy-gold" />
                <span className="text-lg font-semibold">Level {profile?.level || 1}</span>
              </div>
              <span className="text-sm text-gray-400">{profile?.exp || 0} EXP</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(expProgress)}%</span>
              </div>
              <div className="w-full bg-dark-surface rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${expProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-primary-500 to-fantasy-purple h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500">
                {expToNextLevel - (profile?.exp || 0)} EXP to next level
              </p>
            </div>
          </motion.div>

          {/* Completed Quests */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-fantasy-emerald/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-6 h-6 text-fantasy-emerald" />
              <span className="text-2xl font-bold text-fantasy-emerald">
                {stats.completedQuests}
              </span>
            </div>
            <p className="text-sm text-gray-400">Quests Completed</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalQuests} total available
            </p>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-fantasy-rose/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-6 h-6 text-fantasy-rose" />
              <span className="text-2xl font-bold text-fantasy-rose">
                {stats.currentStreak}
              </span>
            </div>
            <p className="text-sm text-gray-400">Day Streak</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.currentStreak > 0 ? 'Keep it going!' : 'Start your streak!'}
            </p>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-fantasy-gold/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-6 h-6 text-fantasy-gold" />
              <span className="text-2xl font-bold text-fantasy-gold">{stats.achievements}</span>
            </div>
            <p className="text-sm text-gray-400">Achievements</p>
            <p className="text-xs text-gray-500 mt-1">Unlock more by completing quests!</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-primary-600/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse-glow`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary-400 text-sm font-medium">
                      <span>Get started</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity & Community Feed Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 4).map((activity, index) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-dark-surface/30 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-fantasy-purple rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-fantasy-gold text-sm font-medium">
                      +{activity.exp_gained} EXP
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">No recent activity</p>
                  <p className="text-sm text-gray-500">Complete a quest to see your progress!</p>
                </div>
              )}
            </div>
            
            <Link to="/profile" className="block mt-4 text-center text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              View all activity
            </Link>
          </motion.div>

          {/* Community Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Quoll's Den</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentShouts.length > 0 ? (
                recentShouts.map((shout, index) => (
                  <div key={shout.id} className="flex items-start space-x-3 p-3 bg-dark-surface/30 rounded-lg">
                    <AvatarDisplay
                      avatarId={shout.users.avatar_url}
                      size="sm"
                      userId={shout.users.username} // Use username as fallback ID
                      animate={false}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-medium text-primary-400">{shout.users.username}</span> {shout.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(shout.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">No recent shouts</p>
                  <p className="text-sm text-gray-500">Be the first to share your progress!</p>
                </div>
              )}
            </div>
            
            <Link to="/community" className="block mt-4 text-center text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              Join the conversation
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;