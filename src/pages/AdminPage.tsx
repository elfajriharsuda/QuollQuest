import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Target, 
  Trophy, 
  Settings,
  Plus,
  Edit3,
  Trash2,
  Eye,
  BarChart3,
  Crown,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalQuests: number;
  totalCompletions: number;
  activeUsers: number;
}

interface User {
  id: string;
  username: string;
  level: number;
  exp: number;
  created_at: string;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  is_popular: boolean;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalQuests: 0,
    totalCompletions: 0,
    activeUsers: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch topics
      const { data: topicsData } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch quest completions
      const { data: completionsData } = await supabase
        .from('user_quest_progress')
        .select('*')
        .eq('status', 'completed');

      setUsers(usersData || []);
      setTopics(topicsData || []);
      
      setStats({
        totalUsers: usersData?.length || 0,
        totalQuests: topicsData?.length || 0,
        totalCompletions: completionsData?.length || 0,
        activeUsers: Math.floor((usersData?.length || 0) * 0.7), // Mock active users
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const toggleTopicPopularity = async (topicId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('topics')
        .update({ is_popular: !currentStatus })
        .eq('id', topicId);

      if (error) throw error;

      setTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, is_popular: !currentStatus }
          : topic
      ));

      toast.success(`Topic ${!currentStatus ? 'marked as popular' : 'removed from popular'}`);
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Error updating topic');
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (error) throw error;

      setTopics(prev => prev.filter(topic => topic.id !== topicId));
      toast.success('Topic deleted successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Error deleting topic');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'topics', label: 'Topics', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-fantasy-purple bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Manage your QuollQuest platform
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-primary-400" />
                    <span className="text-2xl font-bold text-white">{stats.totalUsers}</span>
                  </div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-xs text-fantasy-emerald mt-1">+12% this month</p>
                </div>

                <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-fantasy-purple" />
                    <span className="text-2xl font-bold text-white">{stats.totalQuests}</span>
                  </div>
                  <p className="text-sm text-gray-400">Total Quests</p>
                  <p className="text-xs text-fantasy-emerald mt-1">+5 this week</p>
                </div>

                <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8 text-fantasy-gold" />
                    <span className="text-2xl font-bold text-white">{stats.totalCompletions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Quest Completions</p>
                  <p className="text-xs text-fantasy-emerald mt-1">+23% this week</p>
                </div>

                <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-fantasy-rose" />
                    <span className="text-2xl font-bold text-white">{stats.activeUsers}</span>
                  </div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-xs text-fantasy-emerald mt-1">70% of total</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-dark-surface/30 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-fantasy-purple rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">New user registered: User{index + 100}</p>
                        <p className="text-sm text-gray-400">{index + 1} hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">User Management</h3>
                <div className="text-sm text-gray-400">
                  Total: {users.length} users
                </div>
              </div>

              <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl border border-primary-800/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-dark-surface/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Level</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">EXP</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-800/30">
                      {users.map((user, index) => (
                        <tr key={user.id} className="hover:bg-dark-surface/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={`https://images.pexels.com/photos/${2379004 + index}/pexels-photo-${2379004 + index}.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop`}
                                alt={user.username}
                                className="w-8 h-8 rounded-full border border-primary-500"
                              />
                              <span className="text-white font-medium">{user.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Crown className="w-4 h-4 text-primary-400" />
                              <span className="text-white">{user.level}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white">{user.exp}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-primary-400 hover:text-primary-300 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-fantasy-emerald hover:text-fantasy-emerald/80 transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Topic Management</h3>
                <button className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 rounded-xl font-semibold text-white transition-all duration-300 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Topic</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-primary-600/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-white">{topic.name}</h4>
                      {topic.is_popular && (
                        <div className="bg-fantasy-gold/20 px-2 py-1 rounded-lg">
                          <span className="text-xs text-fantasy-gold font-medium">Popular</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{topic.description}</p>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      Created: {new Date(topic.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleTopicPopularity(topic.id, topic.is_popular)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          topic.is_popular
                            ? 'bg-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold/30'
                            : 'bg-primary-600/20 text-primary-400 hover:bg-primary-600/30'
                        }`}
                      >
                        {topic.is_popular ? 'Remove Popular' : 'Make Popular'}
                      </button>
                      
                      <button className="px-3 py-2 bg-fantasy-emerald/20 text-fantasy-emerald hover:bg-fantasy-emerald/30 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteTopic(topic.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Platform Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                  <h4 className="text-lg font-bold text-white mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        defaultValue="QuollQuest"
                        className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Questions per Quest
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        defaultValue="70"
                        className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30">
                  <h4 className="text-lg font-bold text-white mb-4">EXP & Leveling</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        EXP per Completed Quest
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        EXP per Level Multiplier
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Level
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-gradient-to-r from-fantasy-emerald to-fantasy-gold px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;