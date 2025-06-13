import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService';
import { 
  Plus, 
  Search, 
  Crown, 
  Lock, 
  CheckCircle,
  Star,
  Zap,
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Trophy,
  AlertCircle,
  TrendingUp,
  Users,
  Award
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
  currentLevel: number;
  user_id: string;
}

interface PopularTopicData {
  name: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
}

const QuestsPage: React.FC = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Enhanced popular topics with more details
  const popularTopicsData: PopularTopicData[] = [
    {
      name: 'JavaScript',
      description: 'Master modern JavaScript fundamentals and advanced concepts',
      icon: '⚡',
      category: 'Programming',
      difficulty: 'Beginner',
      popularity: 95
    },
    {
      name: 'Python',
      description: 'Learn Python programming from basics to advanced topics',
      icon: '🐍',
      category: 'Programming',
      difficulty: 'Beginner',
      popularity: 92
    },
    {
      name: 'React',
      description: 'Build modern web applications with React framework',
      icon: '⚛️',
      category: 'Frontend',
      difficulty: 'Intermediate',
      popularity: 88
    },
    {
      name: 'Machine Learning',
      description: 'Explore AI and machine learning algorithms',
      icon: '🤖',
      category: 'AI/ML',
      difficulty: 'Advanced',
      popularity: 85
    },
    {
      name: 'Data Science',
      description: 'Analyze data and extract meaningful insights',
      icon: '📊',
      category: 'Data',
      difficulty: 'Intermediate',
      popularity: 82
    },
    {
      name: 'Web Development',
      description: 'Full-stack web development skills',
      icon: '🌐',
      category: 'Web',
      difficulty: 'Beginner',
      popularity: 90
    }
  ];

  // Get available topics from AI service
  const availableTopics = aiService.getAvailableTopics();

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

      // Fetch user progress for each topic
      const topicsWithProgress = await Promise.all(
        (topicsData || []).map(async (topic) => {
          const { data: progressData } = await supabase
            .from('user_quest_progress')
            .select(`
              status, 
              quest_id, 
              quests!inner(level, topic_id)
            `)
            .eq('user_id', user.id)
            .eq('quests.topic_id', topic.id);

          // Calculate progress
          const completedLevels = progressData?.filter(p => p.status === 'completed').length || 0;
          const totalLevels = 6; // Each topic has 6 levels (0-5)
          const progress = (completedLevels / totalLevels) * 100;
          
          // Determine current level
          let currentLevel = 0;
          if (progressData && progressData.length > 0) {
            const completed = progressData
              .filter(p => p.status === 'completed')
              .map(p => (p.quests as any)?.level || 0);
            
            if (completed.length > 0) {
              currentLevel = Math.max(...completed) + 1;
            }
          }

          return {
            ...topic,
            progress,
            totalLevels,
            completedLevels,
            currentLevel: Math.min(currentLevel, totalLevels - 1)
          };
        })
      );

      setTopics(topicsWithProgress);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Error loading topics');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingTopic = (topicName: string) => {
    return topics.find(topic => 
      topic.name.toLowerCase() === topicName.toLowerCase() && 
      topic.user_id === user?.id
    );
  };

  const createTopic = async () => {
    if (!newTopicName.trim() || !user) return;

    // Check if topic is supported by AI service
    const isSupported = availableTopics.some(
      topic => topic.toLowerCase() === newTopicName.toLowerCase()
    );

    if (!isSupported) {
      toast.error(`Topic "${newTopicName}" is not supported yet. Please choose from: ${availableTopics.join(', ')}`);
      return;
    }

    // Check if user already has this topic
    const existingTopic = checkExistingTopic(newTopicName);
    if (existingTopic) {
      const completionPercentage = Math.round(existingTopic.progress);
      
      toast.error(
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="font-semibold">Topic Already Exists!</span>
          </div>
          <div className="text-sm">
            You already have a {newTopicName} quest ({completionPercentage}% complete).
          </div>
          <div className="text-sm text-gray-300">
            {completionPercentage === 100 
              ? "🎉 You've mastered this topic! Try a new one." 
              : `📚 Continue your current quest to reach 100% completion.`
            }
          </div>
        </div>,
        {
          duration: 6000,
          style: {
            background: '#16213e',
            color: '#ffffff',
            border: '1px solid rgba(251, 191, 36, 0.3)',
          },
        }
      );
      
      // Clear the input
      setNewTopicName('');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          name: newTopicName,
          description: `Master ${newTopicName} through AI-generated quests with progressive difficulty levels`,
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

      toast.success(`${newTopicName} quest created with 6 progressive levels!`);
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

    // Check if user already has this topic
    const existingTopic = checkExistingTopic(topicName);
    if (existingTopic) {
      const completionPercentage = Math.round(existingTopic.progress);
      
      toast.error(
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="font-semibold">Quest Already Active!</span>
          </div>
          <div className="text-sm">
            You already have a {topicName} quest ({completionPercentage}% complete).
          </div>
          <div className="text-sm text-gray-300">
            {completionPercentage === 100 
              ? "🏆 You've mastered this topic! Choose a different one." 
              : `🎯 Continue your current ${topicName} quest to unlock new topics.`
            }
          </div>
        </div>,
        {
          duration: 6000,
          style: {
            background: '#16213e',
            color: '#ffffff',
            border: '1px solid rgba(251, 191, 36, 0.3)',
          },
        }
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert({
          name: topicName,
          description: `Master ${topicName} through AI-generated quests with progressive difficulty levels`,
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

      toast.success(`${topicName} quest created! Start with beginner level.`);
      fetchTopics();
    } catch (error) {
      console.error('Error creating popular topic:', error);
      toast.error('Error creating topic');
    }
  };

  const getDifficultyInfo = (level: number) => {
    if (level <= 1) return { name: 'Beginner', color: 'text-green-400', bgColor: 'bg-green-400/20' };
    if (level <= 3) return { name: 'Intermediate', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    return { name: 'Advanced', color: 'text-red-400', bgColor: 'bg-red-400/20' };
  };

  const getTopicStatus = (topic: Topic) => {
    if (topic.completedLevels === topic.totalLevels) {
      return { 
        text: 'Mastered!', 
        icon: Trophy, 
        color: 'text-fantasy-gold',
        bgColor: 'bg-fantasy-gold/20'
      };
    } else if (topic.completedLevels > 0) {
      return { 
        text: `${topic.completedLevels}/${topic.totalLevels} Complete`, 
        icon: Target, 
        color: 'text-primary-400',
        bgColor: 'bg-primary-400/20'
      };
    } else {
      return { 
        text: 'Not Started', 
        icon: Sparkles, 
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/20'
      };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
            🗺️ Quest Map
          </h1>
          <p className="text-xl text-gray-300">
            Choose your learning adventure with AI-generated questions
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
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-fantasy-gold" />
              <span>Create AI-Powered Quest</span>
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">
                Supported topics: {availableTopics.join(', ')}
              </p>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-300 font-medium">Note:</span>
                </div>
                <p className="text-sm text-orange-200 mt-1">
                  You can only have one quest per topic. Complete your existing quests before creating new ones on the same topic.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter topic name (e.g., JavaScript, Python, React)"
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
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Star className="w-6 h-6 text-fantasy-gold" />
            <span>Popular AI-Generated Quests</span>
            <div className="bg-fantasy-gold/20 px-2 py-1 rounded-lg">
              <span className="text-xs text-fantasy-gold font-medium">TRENDING</span>
            </div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTopicsData.map((topicData, index) => {
              const existingTopic = checkExistingTopic(topicData.name);
              const isDisabled = !!existingTopic;
              
              return (
                <motion.button
                  key={topicData.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  onClick={() => !isDisabled && createPopularTopic(topicData.name)}
                  disabled={isDisabled}
                  className={`backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 text-left group relative ${
                    isDisabled 
                      ? 'bg-gray-600/30 border-gray-600/30 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-dark-card/60 to-dark-surface/60 border-primary-800/30 hover:border-primary-600/50'
                  }`}
                >
                  {/* Popular Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-fantasy-gold/20 px-2 py-1 rounded-lg">
                      <span className="text-xs text-fantasy-gold font-medium">POPULAR</span>
                    </div>
                  </div>

                  {isDisabled && (
                    <div className="absolute top-3 left-3">
                      <CheckCircle className="w-5 h-5 text-fantasy-emerald" />
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isDisabled 
                        ? 'bg-gray-600'
                        : 'bg-gradient-to-r from-primary-500 to-fantasy-purple group-hover:animate-pulse'
                    }`}>
                      {topicData.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-2 transition-colors ${
                        isDisabled 
                          ? 'text-gray-400'
                          : 'group-hover:text-primary-300'
                      }`}>
                        {topicData.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {topicData.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(topicData.difficulty)}`}>
                            {topicData.difficulty}
                          </div>
                          <div className="text-xs text-gray-500">
                            {topicData.category}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-fantasy-gold" />
                          <span className="text-xs text-fantasy-gold font-medium">
                            {topicData.popularity}%
                          </span>
                        </div>
                      </div>
                      
                      <div className={`text-xs mt-2 ${
                        isDisabled ? 'text-fantasy-emerald' : 'text-gray-400'
                      }`}>
                        {isDisabled ? '✅ Active Quest' : '🤖 AI Generated'}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Quest Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Target className="w-6 h-6 text-primary-400" />
            <span>Your Learning Quests</span>
          </h2>
          
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No quests yet</h3>
              <p className="text-gray-500 mb-6">Create your first AI-powered quest to begin your learning adventure!</p>
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
              {filteredTopics.map((topic, index) => {
                const difficultyInfo = getDifficultyInfo(topic.currentLevel);
                const statusInfo = getTopicStatus(topic);
                const StatusIcon = statusInfo.icon;
                
                return (
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
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                              {topic.name}
                            </h3>
                            <Brain className="w-4 h-4 text-fantasy-gold" />
                          </div>
                          <p className="text-gray-400 text-sm mb-3">
                            {topic.description}
                          </p>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-lg ${statusInfo.bgColor}`}>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                            <span className={`text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Current Level & Difficulty */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-gray-300">Level {topic.currentLevel}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-lg ${difficultyInfo.bgColor}`}>
                          <span className={`text-xs font-medium ${difficultyInfo.color}`}>
                            {difficultyInfo.name}
                          </span>
                        </div>
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
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Level Indicators */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-1">
                          {Array.from({ length: 6 }, (_, i) => {
                            const isCompleted = i < topic.completedLevels;
                            const isCurrent = i === topic.currentLevel;
                            const isLocked = i > topic.currentLevel;
                            
                            return (
                              <div
                                key={i}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-gradient-to-r from-fantasy-emerald to-fantasy-gold text-white'
                                    : isCurrent
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-pulse'
                                    : 'bg-dark-surface text-gray-500'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : isCurrent ? (
                                  <Zap className="w-3 h-3" />
                                ) : (
                                  <Lock className="w-3 h-3" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          {topic.completedLevels === 0 ? (
                            <span className="flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Start AI Quest</span>
                            </span>
                          ) : topic.completedLevels === topic.totalLevels ? (
                            <span className="flex items-center space-x-1 text-fantasy-gold">
                              <Trophy className="w-3 h-3" />
                              <span>Mastered!</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1">
                              <Brain className="w-3 h-3" />
                              <span>Continue Level {topic.currentLevel}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                          <span>Enter</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestsPage;