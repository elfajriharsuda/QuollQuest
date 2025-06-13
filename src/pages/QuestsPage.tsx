import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Plus, 
  Search, 
  Crown, 
  Lock, 
  CheckCircle,
  Star,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Topic {
  id: string;
  name: string;
  description: string;
  is_popular: boolean;
  progress: number;
  totalLevels: number;
  completedLevels: number;
}

const QuestsPage: React.FC = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const popularTopics = [
    'JavaScript',
    'Python',
    'React',
    'Machine Learning',
    'Data Science',
    'Web Development',
    'DevOps',
    'Blockchain',
  ];

  useEffect(() => {
    fetchTopics();
  }, [user]);

  const fetchTopics = async () => {
    if (!user) return;

    try {
      const { data: topicsData, error } = await supabase
        .from('topics')
        .select('*')
        .or(`user_id.eq.${user.id},is_popular.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add mock progress data
      const topicsWithProgress = topicsData?.map(topic => ({
        ...topic,
        progress: Math.floor(Math.random() * 100),
        totalLevels: 6,
        completedLevels: Math.floor(Math.random() * 6),
      })) || [];

      setTopics(topicsWithProgress);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Error loading topics');
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicName.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          name: newTopicName,
          description: `Learn ${newTopicName} through interactive quests`,
          user_id: user.id,
          is_popular: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Create 6 quests for this topic (levels 0-5)
      const quests = [];
      for (let i = 0; i < 6; i++) {
        quests.push({
          topic_id: data.id,
          level: i,
          is_unlocked: i === 0, // Only level 0 is unlocked initially
          is_completed: false,
        });
      }

      await supabase.from('quests').insert(quests);

      toast.success('Topic created successfully!');
      setNewTopicName('');
      setShowCreateForm(false);
      fetchTopics();
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Error creating topic');
    }
  };

  const createPopularTopic = async (topicName: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          name: topicName,
          description: `Master ${topicName} through gamified learning`,
          user_id: user.id,
          is_popular: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Create 6 quests for this topic
      const quests = [];
      for (let i = 0; i < 6; i++) {
        quests.push({
          topic_id: data.id,
          level: i,
          is_unlocked: i === 0,
          is_completed: false,
        });
      }

      await supabase.from('quests').insert(quests);

      toast.success(`${topicName} quest created!`);
      fetchTopics();
    } catch (error) {
      console.error('Error creating popular topic:', error);
      toast.error('Error creating topic');
    }
  };

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Quest Map
          </h1>
          <p className="text-xl text-gray-300">
            Choose your learning adventure and embark on epic quests
          </p>
        </motion.div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-card/60 border border-primary-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            />
          </div>

          {/* Create Topic Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-primary-600 to-fantasy-purple px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Quest</span>
          </motion.button>
        </div>

        {/* Create Topic Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Quest Topic</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter topic name (e.g., Python, React, AI)"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="flex-1 px-4 py-3 bg-dark-surface/50 border border-primary-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && createTopic()}
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createTopic}
                  disabled={!newTopicName.trim()}
                  className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white">Popular Quests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {popularTopics.map((topic, index) => (
              <motion.button
                key={topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => createPopularTopic(topic)}
                className="bg-gradient-to-r from-dark-card/60 to-dark-surface/60 backdrop-blur-sm p-4 rounded-xl border border-primary-800/30 hover:border-primary-600/50 transition-all duration-300 text-sm font-medium text-center group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-fantasy-purple rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="group-hover:text-primary-300 transition-colors">{topic}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quest Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Your Quests</h2>
          
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No quests yet</h3>
              <p className="text-gray-500 mb-6">Create your first quest topic to begin your learning adventure!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-primary-600 to-fantasy-purple px-8 py-3 rounded-xl font-semibold"
              >
                Start Your First Quest
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 hover:border-primary-600/50 transition-all duration-300 group cursor-pointer"
                >
                  <Link to={`/quests/${topic.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                          {topic.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {topic.description}
                        </p>
                      </div>
                      {topic.is_popular && (
                        <div className="flex items-center space-x-1 bg-fantasy-gold/20 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 text-fantasy-gold" />
                          <span className="text-xs text-fantasy-gold font-medium">Popular</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">{topic.completedLevels}/{topic.totalLevels} levels</span>
                      </div>
                      <div className="w-full bg-dark-surface rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-fantasy-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(topic.completedLevels / topic.totalLevels) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Level Indicators */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                              i < topic.completedLevels
                                ? 'bg-gradient-to-r from-fantasy-emerald to-fantasy-gold text-white'
                                : i === topic.completedLevels
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-pulse'
                                : 'bg-dark-surface text-gray-500'
                            }`}
                          >
                            {i < topic.completedLevels ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : i === topic.completedLevels ? (
                              <Zap className="w-3 h-3" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        {topic.completedLevels === 0 ? 'Start Quest' : 
                         topic.completedLevels === topic.totalLevels ? 'Completed!' : 
                         `Continue Level ${topic.completedLevels}`}
                      </div>
                      <div className="flex items-center text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                        <span>Enter</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestsPage;