import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Trophy, 
  Crown, 
  Zap, 
  Target, 
  Medal,
  Star,
  TrendingUp,
  Users,
  Award,
  Flame,
  Brain,
  RefreshCw,
  Calendar,
  BarChart3
} from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  exp: number;
  login_streak: number;
  completed_quests: number;
  total_score: number;
  rank_position: number;
  total_logins: number;
  longest_streak: number;
}

interface LeaderboardStats {
  totalUsers: number;
  highestExp: number;
  longestStreak: number;
  mostQuests: number;
  totalQuests: number;
  totalLogins: number;
  averageLevel: number;
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overall');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalUsers: 0,
    highestExp: 0,
    longestStreak: 0,
    mostQuests: 0,
    totalQuests: 0,
    totalLogins: 0,
    averageLevel: 1
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

  const tabs = [
    { id: 'overall', label: 'Overall', icon: Crown, color: 'text-fantasy-gold', description: 'Combined ranking' },
    { id: 'exp', label: 'Experience', icon: Star, color: 'text-primary-400', description: 'Total EXP earned' },
    { id: 'streak', label: 'Streak', icon: Flame, color: 'text-fantasy-rose', description: 'Login streaks' },
    { id: 'quests', label: 'Quests', icon: Target, color: 'text-fantasy-emerald', description: 'Completed quests' },
  ];

  useEffect(() => {
    fetchLeaderboard();
    fetchLeaderboardStats();
  }, [activeTab]);

  const fetchLeaderboardStats = async () => {
    try {
      // Get overall user statistics
      const { data: userStats, error: userError } = await supabase
        .from('users')
        .select('exp, level, login_streak, longest_streak, total_logins');

      if (userError) throw userError;

      // Get quest statistics
      const { data: questStats, error: questError } = await supabase
        .from('user_quest_progress')
        .select('status, score')
        .eq('status', 'completed');

      if (questError) throw questError;

      // Calculate statistics
      const totalUsers = userStats?.length || 0;
      const highestExp = Math.max(...(userStats?.map(u => u.exp) || [0]));
      const longestStreak = Math.max(...(userStats?.map(u => u.longest_streak || 0) || [0]));
      const totalLogins = userStats?.reduce((sum, u) => sum + (u.total_logins || 0), 0) || 0;
      const averageLevel = totalUsers > 0 
        ? Math.round((userStats?.reduce((sum, u) => sum + u.level, 0) || 0) / totalUsers)
        : 1;

      // Count completed quests per user
      const questCounts: Record<string, number> = {};
      questStats?.forEach(quest => {
        // This is a simplified count since we don't have user_id in the select
        // In a real scenario, you'd include user_id in the select
      });

      setStats({
        totalUsers,
        highestExp,
        longestStreak,
        mostQuests: questStats?.length || 0,
        totalQuests: questStats?.length || 0,
        totalLogins,
        averageLevel
      });

    } catch (error) {
      console.error('Error fetching leaderboard stats:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // First, refresh the leaderboard cache to ensure we have latest data
      await refreshLeaderboardCache();

      // Then fetch the leaderboard data
      const { data, error } = await supabase
        .from('leaderboard_cache')
        .select('*')
        .eq('category', activeTab)
        .order('rank_position', { ascending: true })
        .limit(100);

      if (error) throw error;

      // If no cached data, fetch directly from users table
      if (!data || data.length === 0) {
        await fetchDirectLeaderboard();
        return;
      }

      setLeaderboard(data || []);

      // Find user's rank
      if (user) {
        const userEntry = data?.find(entry => entry.user_id === user.id);
        setUserRank(userEntry?.rank_position || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to direct fetch
      await fetchDirectLeaderboard();
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectLeaderboard = async () => {
    try {
      // Fetch users with quest progress
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          username,
          avatar_url,
          level,
          exp,
          login_streak,
          longest_streak,
          total_logins
        `)
        .order('exp', { ascending: false });

      if (usersError) throw usersError;

      // Fetch quest progress for each user
      const { data: questProgress, error: questError } = await supabase
        .from('user_quest_progress')
        .select('user_id, status, score')
        .eq('status', 'completed');

      if (questError) throw questError;

      // Calculate completed quests and total score for each user
      const questStats: Record<string, { completed: number; totalScore: number }> = {};
      
      questProgress?.forEach(quest => {
        if (!questStats[quest.user_id]) {
          questStats[quest.user_id] = { completed: 0, totalScore: 0 };
        }
        questStats[quest.user_id].completed++;
        questStats[quest.user_id].totalScore += quest.score || 0;
      });

      // Create leaderboard entries
      let leaderboardData = users?.map((user, index) => ({
        user_id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        level: user.level,
        exp: user.exp,
        login_streak: user.login_streak || 0,
        completed_quests: questStats[user.id]?.completed || 0,
        total_score: questStats[user.id]?.totalScore || 0,
        rank_position: index + 1,
        total_logins: user.total_logins || 0,
        longest_streak: user.longest_streak || 0
      })) || [];

      // Sort based on active tab
      switch (activeTab) {
        case 'exp':
          leaderboardData.sort((a, b) => b.exp - a.exp);
          break;
        case 'streak':
          leaderboardData.sort((a, b) => {
            if (b.login_streak !== a.login_streak) {
              return b.login_streak - a.login_streak;
            }
            return b.longest_streak - a.longest_streak;
          });
          break;
        case 'quests':
          leaderboardData.sort((a, b) => {
            if (b.completed_quests !== a.completed_quests) {
              return b.completed_quests - a.completed_quests;
            }
            return b.total_score - a.total_score;
          });
          break;
        case 'overall':
        default:
          leaderboardData.sort((a, b) => {
            const scoreA = a.exp * 0.4 + a.login_streak * 100 * 0.3 + a.completed_quests * 50 * 0.3;
            const scoreB = b.exp * 0.4 + b.login_streak * 100 * 0.3 + b.completed_quests * 50 * 0.3;
            return scoreB - scoreA;
          });
          break;
      }

      // Update rank positions
      leaderboardData = leaderboardData.map((entry, index) => ({
        ...entry,
        rank_position: index + 1
      }));

      setLeaderboard(leaderboardData);

      // Find user's rank
      if (user) {
        const userEntry = leaderboardData.find(entry => entry.user_id === user.id);
        setUserRank(userEntry?.rank_position || null);
      }

    } catch (error) {
      console.error('Error fetching direct leaderboard:', error);
    }
  };

  const refreshLeaderboardCache = async () => {
    try {
      const { error } = await supabase.rpc('refresh_leaderboard_cache');
      if (error) {
        console.error('Error refreshing leaderboard cache:', error);
        // Don't throw error, just log it
      }
    } catch (error) {
      console.error('Error calling refresh_leaderboard_cache:', error);
      // Don't throw error, continue with direct fetch
    }
  };

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    try {
      await fetchLeaderboard();
      await fetchLeaderboardStats();
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-fantasy-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-gradient-to-r from-fantasy-gold to-yellow-400',
        2: 'bg-gradient-to-r from-gray-400 to-gray-500',
        3: 'bg-gradient-to-r from-orange-400 to-orange-500'
      };
      return colors[rank as keyof typeof colors];
    }
    return 'bg-dark-surface';
  };

  const getStatValue = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'exp':
        return `${entry.exp.toLocaleString()} EXP`;
      case 'streak':
        return `${entry.login_streak} days`;
      case 'quests':
        return `${entry.completed_quests} completed`;
      case 'overall':
        return `Level ${entry.level}`;
      default:
        return '';
    }
  };

  const getStatIcon = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.icon : Star;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fantasy-bg text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold to-primary-400 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-gray-300">
            Compete with fellow adventurers and climb the ranks
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-4 border border-primary-800/30 text-center">
            <Users className="w-6 h-6 text-primary-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-xs text-gray-400">Total Adventurers</div>
          </div>
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-4 border border-primary-800/30 text-center">
            <Star className="w-6 h-6 text-fantasy-gold mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{stats.highestExp.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Highest EXP</div>
          </div>
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-4 border border-primary-800/30 text-center">
            <Flame className="w-6 h-6 text-fantasy-rose mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{stats.longestStreak}</div>
            <div className="text-xs text-gray-400">Best Streak</div>
          </div>
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-4 border border-primary-800/30 text-center">
            <Target className="w-6 h-6 text-fantasy-emerald mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{stats.totalQuests}</div>
            <div className="text-xs text-gray-400">Total Completions</div>
          </div>
        </motion.div>

        {/* User Rank Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-primary-600/20 border border-primary-600/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Your Rank</h3>
                  <p className="text-primary-300">#{userRank} in {tabs.find(t => t.id === activeTab)?.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-400">#{userRank}</p>
                <p className="text-sm text-gray-400">Keep climbing!</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 bg-dark-card/60 backdrop-blur-lg rounded-2xl p-2 border border-primary-800/30"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-surface/50'
                }`}
                title={tab.description}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshLeaderboard}
            disabled={refreshing}
            className="ml-auto flex items-center space-x-2 px-4 py-2 bg-fantasy-emerald/20 text-fantasy-emerald hover:bg-fantasy-emerald/30 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {refreshing ? 'Updating...' : 'Refresh'}
            </span>
          </motion.button>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No rankings yet</h3>
              <p className="text-gray-500">Be the first to complete quests and climb the leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => {
                const StatIcon = getStatIcon();
                const isCurrentUser = entry.user_id === user?.id;
                
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 ${
                      isCurrentUser 
                        ? 'border-primary-500/50 bg-primary-500/10' 
                        : 'border-primary-800/30 hover:border-primary-600/50'
                    } ${entry.rank_position <= 3 ? 'shadow-lg' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRankBadge(entry.rank_position)}`}>
                        {getRankIcon(entry.rank_position)}
                      </div>

                      {/* Avatar */}
                      <img
                        src={entry.avatar_url || `https://images.pexels.com/photos/${2379004 + (index % 10)}/pexels-photo-${2379004 + (index % 10)}.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop`}
                        alt={entry.username}
                        className="w-12 h-12 rounded-full border-2 border-primary-500 object-cover"
                      />

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-bold text-lg ${isCurrentUser ? 'text-primary-300' : 'text-white'}`}>
                            {entry.username}
                          </h3>
                          {isCurrentUser && (
                            <span className="bg-primary-600/20 text-primary-400 px-2 py-1 rounded-lg text-xs font-medium">
                              You
                            </span>
                          )}
                          {entry.rank_position <= 3 && (
                            <span className="bg-fantasy-gold/20 text-fantasy-gold px-2 py-1 rounded-lg text-xs font-medium">
                              TOP 3
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Crown className="w-3 h-3" />
                            <span>Level {entry.level}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{entry.exp.toLocaleString()} EXP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame className="w-3 h-3" />
                            <span>{entry.login_streak} streak</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span>{entry.completed_quests} quests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{entry.total_logins} logins</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Stat */}
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <StatIcon className={`w-5 h-5 ${tabs.find(t => t.id === activeTab)?.color}`} />
                          <span className="text-xl font-bold text-white">
                            {getStatValue(entry)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Rank #{entry.rank_position}
                        </p>
                      </div>
                    </div>

                    {/* Top 3 Special Effects */}
                    {entry.rank_position <= 3 && (
                      <div className="mt-4 pt-4 border-t border-primary-800/30">
                        <div className="flex items-center justify-center space-x-2">
                          {entry.rank_position === 1 && (
                            <>
                              <Crown className="w-4 h-4 text-fantasy-gold" />
                              <span className="text-fantasy-gold text-sm font-medium">🏆 Champion</span>
                              <Crown className="w-4 h-4 text-fantasy-gold" />
                            </>
                          )}
                          {entry.rank_position === 2 && (
                            <>
                              <Medal className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400 text-sm font-medium">🥈 Runner-up</span>
                              <Medal className="w-4 h-4 text-gray-400" />
                            </>
                          )}
                          {entry.rank_position === 3 && (
                            <>
                              <Award className="w-4 h-4 text-orange-400" />
                              <span className="text-orange-400 text-sm font-medium">🥉 Third Place</span>
                              <Award className="w-4 h-4 text-orange-400" />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Detailed Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-fantasy-emerald" />
            <span>Community Statistics</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-fantasy-gold">{stats.totalUsers}</div>
              <div className="text-sm text-gray-400">Total Adventurers</div>
              <div className="text-xs text-gray-500 mt-1">Registered users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">
                {stats.highestExp.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Highest EXP</div>
              <div className="text-xs text-gray-500 mt-1">Single user record</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fantasy-rose">
                {stats.longestStreak}
              </div>
              <div className="text-sm text-gray-400">Best Streak</div>
              <div className="text-xs text-gray-500 mt-1">Consecutive days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fantasy-emerald">
                {stats.totalQuests}
              </div>
              <div className="text-sm text-gray-400">Quest Completions</div>
              <div className="text-xs text-gray-500 mt-1">Community total</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-primary-800/30">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.totalLogins.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Logins</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.averageLevel}</div>
                <div className="text-sm text-gray-400">Average Level</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {leaderboard.length > 0 ? Math.round((stats.totalQuests / stats.totalUsers) * 10) / 10 : 0}
                </div>
                <div className="text-sm text-gray-400">Avg Quests/User</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;