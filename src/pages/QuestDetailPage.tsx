import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { supabase } from '../lib/supabase';
import { aiService, Question } from '../services/aiService';
import { 
  Crown, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Zap,
  Target,
  RotateCcw,
  Sparkles,
  Brain,
  Clock,
  Star,
  PartyPopper,
  Rocket,
  Award,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  Download,
  Timer,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Topic {
  id: string;
  name: string;
  description: string;
  user_id: string;
  is_popular: boolean;
  created_at: string;
}

interface QuizState {
  currentQuestion: number;
  answers: number[];
  showResult: boolean;
  showFeedback: boolean;
  isCorrect: boolean;
  completed: boolean;
  score: number;
  timeLeft: number;
  isTimerActive: boolean;
  autoAnswered: boolean;
}

const QuestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { profile, addExperience } = useUserProfile();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [nextLevelUnlocked, setNextLevelUnlocked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResult: false,
    showFeedback: false,
    isCorrect: false,
    completed: false,
    score: 0,
    timeLeft: 20,
    isTimerActive: false,
    autoAnswered: false,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizState.isTimerActive && quizState.timeLeft > 0 && !quizState.showFeedback) {
      interval = setInterval(() => {
        setQuizState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          
          // Time's up - auto answer as wrong
          if (newTimeLeft <= 0) {
            const currentQuestion = questions[prev.currentQuestion];
            const newAnswers = [...prev.answers];
            newAnswers[prev.currentQuestion] = -1; // -1 indicates no answer/timeout
            
            return {
              ...prev,
              timeLeft: 0,
              isTimerActive: false,
              showFeedback: true,
              isCorrect: false,
              autoAnswered: true,
              answers: newAnswers,
            };
          }
          
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState.isTimerActive, quizState.timeLeft, quizState.showFeedback, questions, quizState.currentQuestion]);

  // Auto-progression effect (5 seconds after showing feedback)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (quizState.showFeedback) {
      timeout = setTimeout(() => {
        handleNextQuestion();
      }, 5000); // 5 seconds delay
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [quizState.showFeedback]);

  // Start timer when question changes
  useEffect(() => {
    if (questions.length > 0 && !quizState.showResult && !quizState.showFeedback) {
      setQuizState(prev => ({
        ...prev,
        timeLeft: 20,
        isTimerActive: true,
        autoAnswered: false,
      }));
    }
  }, [quizState.currentQuestion, questions.length, quizState.showResult]);

  useEffect(() => {
    if (id) {
      fetchTopicAndQuests();
    }
  }, [id, user]);

  const fetchTopicAndQuests = async () => {
    if (!id || !user) return;

    try {
      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', id)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // Fetch user's progress for this topic to determine current level
      const { data: progressData } = await supabase
        .from('user_quest_progress')
        .select(`
          status, 
          quest_id, 
          quests!inner(level, topic_id)
        `)
        .eq('user_id', user.id)
        .eq('quests.topic_id', id);

      // Determine current level based on progress
      let level = 0;
      if (progressData && progressData.length > 0) {
        const completedLevels = progressData
          .filter(p => p.status === 'completed')
          .map(p => (p.quests as any)?.level || 0);
        
        if (completedLevels.length > 0) {
          level = Math.max(...completedLevels) + 1;
        }
      }
      
      // Ensure level doesn't exceed maximum (5)
      level = Math.min(level, 5);
      setCurrentLevel(level);
      
      // Generate AI questions for this topic and level
      await generateQuestionsForTopic(topicData.name, level);
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast.error('Error loading quest');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestionsForTopic = async (topicName: string, level: number) => {
    setGenerating(true);
    
    try {
      console.log(`Generating questions for topic: ${topicName}, level: ${level}`);
      
      // Use the AI service to generate 10 topic-specific questions for the exact level
      const generatedQuestions = await aiService.generateQuestionsForTopic(topicName, level);
      
      console.log(`Generated ${generatedQuestions.length} questions:`, generatedQuestions);
      
      if (generatedQuestions.length === 0) {
        throw new Error('No questions generated');
      }
      
      setQuestions(generatedQuestions);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Error generating questions. Please try again.');
      
      // Navigate back to quests page if question generation fails
      navigate('/quests');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showFeedback || !quizState.isTimerActive) return;

    const currentQuestion = questions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correct_answer;
    
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answerIndex;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showFeedback: true,
      isCorrect,
      isTimerActive: false,
      autoAnswered: false,
    }));
  };

  const handleNextQuestion = async () => {
    const nextQuestion = quizState.currentQuestion + 1;
    
    if (nextQuestion >= questions.length) {
      // Quiz completed
      const correctAnswers = quizState.answers.filter((answer, index) => 
        answer === questions[index].correct_answer
      ).length;
      
      const score = Math.round((correctAnswers / questions.length) * 100);
      const passed = score >= 70;

      setQuizState(prev => ({
        ...prev,
        completed: true,
        score,
        showResult: true,
        isTimerActive: false,
      }));

      // Save quiz attempt to database
      await saveQuizAttempt(score, passed);

      if (passed) {
        toast.success(`🎉 Quest Level ${currentLevel} Completed! Score: ${score}%`, {
          duration: 5000,
          icon: '🏆'
        });
        
        // Award experience points based on level and performance
        const baseExp = 50; // Base EXP for completing a quest
        const levelMultiplier = currentLevel + 1; // Higher levels give more EXP
        const performanceBonus = Math.floor((score - 70) / 10) * 10; // Bonus for high performance
        const expGained = baseExp * levelMultiplier + performanceBonus;
        
        if (profile && addExperience) {
          const result = await addExperience(expGained);
          if (result?.leveledUp) {
            toast.success(`👑 Level up! You are now level ${result.newLevel}!`, {
              duration: 5000,
              icon: '🎊'
            });
          }
        }

        // Check if next level was unlocked
        if (currentLevel < 5) {
          setNextLevelUnlocked(true);
        }
      } else {
        toast.error(`💪 Quest failed. Score: ${score}%. You need 70% to pass.`);
      }
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        showFeedback: false,
        isCorrect: false,
        timeLeft: 20,
        isTimerActive: true,
        autoAnswered: false,
      }));
    }
  };

  const saveQuizAttempt = async (score: number, passed: boolean) => {
    if (!user || !topic) return;

    try {
      // Find or create quest for this topic and level
      let { data: quest } = await supabase
        .from('quests')
        .select('id')
        .eq('topic_id', topic.id)
        .eq('level', currentLevel)
        .single();

      if (!quest) {
        // Create quest if it doesn't exist
        const { data: newQuest, error: questError } = await supabase
          .from('quests')
          .insert({
            topic_id: topic.id,
            level: currentLevel,
            is_unlocked: true,
            is_completed: false
          })
          .select('id')
          .single();

        if (questError) throw questError;
        quest = newQuest;
      }

      // Save quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quest_id: quest.id,
          score,
          answers: quizState.answers
        });

      if (attemptError) throw attemptError;

      // Update or create user quest progress
      const { data: existingProgress } = await supabase
        .from('user_quest_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('quest_id', quest.id)
        .single();

      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('user_quest_progress')
          .update({
            status: passed ? 'completed' : 'unlocked',
            score,
            completed_at: passed ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress record
        await supabase
          .from('user_quest_progress')
          .insert({
            user_id: user.id,
            quest_id: quest.id,
            status: passed ? 'completed' : 'unlocked',
            score,
            completed_at: passed ? new Date().toISOString() : null
          });
      }

      // If passed, unlock next level
      if (passed && currentLevel < 5) {
        // Create next level quest if it doesn't exist
        const { data: nextQuest } = await supabase
          .from('quests')
          .select('id')
          .eq('topic_id', topic.id)
          .eq('level', currentLevel + 1)
          .single();

        let nextQuestId = nextQuest?.id;

        if (!nextQuest) {
          // Create next level quest
          const { data: newNextQuest, error: nextQuestError } = await supabase
            .from('quests')
            .insert({
              topic_id: topic.id,
              level: currentLevel + 1,
              is_unlocked: false,
              is_completed: false
            })
            .select('id')
            .single();

          if (!nextQuestError) {
            nextQuestId = newNextQuest.id;
          }
        }

        if (nextQuestId) {
          // Check if progress exists for next level
          const { data: nextProgress } = await supabase
            .from('user_quest_progress')
            .select('id')
            .eq('user_id', user.id)
            .eq('quest_id', nextQuestId)
            .single();

          if (!nextProgress) {
            // Unlock next level
            await supabase
              .from('user_quest_progress')
              .insert({
                user_id: user.id,
                quest_id: nextQuestId,
                status: 'unlocked',
                score: null,
                completed_at: null
              });
          }
        }
      }

    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: [],
      showResult: false,
      showFeedback: false,
      isCorrect: false,
      completed: false,
      score: 0,
      timeLeft: 20,
      isTimerActive: false,
      autoAnswered: false,
    });
    setNextLevelUnlocked(false);
    generateQuestionsForTopic(topic!.name, currentLevel);
  };

  const goToNextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      setQuizState({
        currentQuestion: 0,
        answers: [],
        showResult: false,
        showFeedback: false,
        isCorrect: false,
        completed: false,
        score: 0,
        timeLeft: 20,
        isTimerActive: false,
        autoAnswered: false,
      });
      setNextLevelUnlocked(false);
      generateQuestionsForTopic(topic!.name, currentLevel + 1);
    }
  };

  const getDifficultyInfo = (level: number) => {
    if (level <= 1) return { name: 'Beginner', color: 'text-green-400', bgColor: 'bg-green-400/20', icon: '🌱' };
    if (level <= 3) return { name: 'Intermediate', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', icon: '⚡' };
    return { name: 'Advanced', color: 'text-red-400', bgColor: 'bg-red-400/20', icon: '🔥' };
  };

  const generateShareText = () => {
    const difficultyInfo = getDifficultyInfo(currentLevel);
    const isTopicMastered = currentLevel === 5 && quizState.score >= 70;
    
    if (isTopicMastered) {
      return `🎉 I just mastered ${topic?.name} on QuollQuest! Completed all 6 levels with ${quizState.score}% on the final challenge! 🏆 #QuollQuest #Learning #${topic?.name?.replace(/\s+/g, '')} #TechSkills`;
    } else {
      return `🚀 Just completed ${topic?.name} Level ${currentLevel} (${difficultyInfo.name}) on QuollQuest with ${quizState.score}%! 🎯 #QuollQuest #Learning #${topic?.name?.replace(/\s+/g, '')} #TechSkills`;
    }
  };

  const shareToSocialMedia = (platform: string) => {
    const shareText = generateShareText();
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so copy to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('📋 Share text copied! Paste it in your Instagram story or post.');
        return;
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n\n${url}`);
        toast.success('📋 Share text and link copied to clipboard!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const downloadCertificate = () => {
    // Create a simple certificate image using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 560);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', 400, 120);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('QuollQuest Learning Platform', 400, 160);
    
    // User name
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(profile?.username || 'Adventurer', 400, 240);
    
    // Achievement text
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    const isTopicMastered = currentLevel === 5 && quizState.score >= 70;
    const achievementText = isTopicMastered 
      ? `has mastered ${topic?.name} by completing all 6 levels`
      : `has completed ${topic?.name} Level ${currentLevel}`;
    ctx.fillText(achievementText, 400, 300);
    
    // Score
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Score: ${quizState.score}%`, 400, 360);
    
    // Date
    ctx.font = '16px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(`Completed on ${new Date().toLocaleDateString()}`, 400, 420);
    
    // Crown emoji (simplified)
    ctx.font = '60px Arial';
    ctx.fillText('👑', 400, 500);
    
    // Download
    const link = document.createElement('a');
    link.download = `QuollQuest-${topic?.name}-Level${currentLevel}-Certificate.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('🎓 Certificate downloaded!');
  };

  const getTimerColor = () => {
    if (quizState.timeLeft > 10) return 'text-green-400';
    if (quizState.timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTimerBgColor = () => {
    if (quizState.timeLeft > 10) return 'bg-green-400/20';
    if (quizState.timeLeft > 5) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Loading quest...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    const difficultyInfo = getDifficultyInfo(currentLevel);
    
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-primary-500 to-fantasy-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            🤖 AI Crafting Your Quest
          </h2>
          
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-fantasy-gold" />
              <span className="text-white font-semibold">{topic?.name}</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Target className="w-4 h-4 text-primary-400" />
              <span className="text-gray-300">Level {currentLevel}</span>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyInfo.bgColor} ${difficultyInfo.color}`}>
                {difficultyInfo.icon} {difficultyInfo.name}
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Generating 10 questions...</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Our AI is creating personalized questions tailored to your learning level and the {topic?.name} topic.
          </p>
          
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-3 h-3 bg-primary-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topic || questions.length === 0) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Quest not found or failed to generate questions</p>
          <button
            onClick={() => navigate('/quests')}
            className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-lg text-white transition-colors"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  if (quizState.showResult) {
    const passed = quizState.score >= 70;
    const difficultyInfo = getDifficultyInfo(currentLevel);
    const isTopicMastered = currentLevel === 5 && passed;
    
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-card/80 backdrop-blur-lg rounded-2xl p-8 max-w-4xl w-full border border-primary-800/30 relative"
        >
          {/* Celebration Animation */}
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    y: 0, 
                    x: Math.random() * window.innerWidth,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    opacity: 0, 
                    y: window.innerHeight,
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2
                  }}
                  className="absolute text-2xl"
                >
                  {['🎉', '🎊', '⭐', '🏆', '👑'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed
                  ? 'bg-gradient-to-r from-fantasy-emerald to-fantasy-gold'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
            >
              {passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              {passed ? (isTopicMastered ? '👑 Topic Mastered!' : '🎉 Quest Completed!') : '💪 Quest Failed'}
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`px-3 py-1 rounded-lg ${difficultyInfo.bgColor}`}>
                <span className={`text-sm font-medium ${difficultyInfo.color}`}>
                  {difficultyInfo.icon} {difficultyInfo.name} Level
                </span>
              </div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-300">{topic.name}</div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-300">Level {currentLevel}</div>
            </div>
            
            <div className="text-6xl font-bold mb-4">
              <span className={passed ? 'text-fantasy-emerald' : 'text-red-500'}>
                {quizState.score}%
              </span>
            </div>
            
            <p className="text-gray-300 text-lg mb-4">
              {passed 
                ? (isTopicMastered 
                  ? `🎯 Incredible! You've mastered all ${topic.name} levels! You earned ${50 * (currentLevel + 1) + Math.floor((quizState.score - 70) / 10) * 10} EXP!`
                  : `🎯 Excellent work! You earned ${50 * (currentLevel + 1) + Math.floor((quizState.score - 70) / 10) * 10} EXP!`)
                : '📚 You need 70% to pass. Review the explanations and try again!'
              }
            </p>

            {passed && (
              <div className="space-y-4 mb-6">
                <div className="bg-fantasy-emerald/20 border border-fantasy-emerald/30 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="w-5 h-5 text-fantasy-emerald" />
                    <span className="text-fantasy-emerald font-semibold">
                      🏆 Quest Level {currentLevel} Mastered!
                    </span>
                  </div>
                </div>

                {nextLevelUnlocked && currentLevel < 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-600/20 border border-primary-600/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Rocket className="w-5 h-5 text-primary-400" />
                      <span className="text-primary-400 font-semibold">
                        🚀 Next Level Unlocked!
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Level {currentLevel + 1} is now available. Ready for the next challenge?
                    </p>
                  </motion.div>
                )}

                {isTopicMastered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-fantasy-gold/20 border border-fantasy-gold/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5 text-fantasy-gold" />
                      <span className="text-fantasy-gold font-semibold">
                        👑 Topic Mastered! You've completed all levels!
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Share Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Share2 className="w-5 h-5 text-primary-400" />
                    <span className="text-primary-400 font-semibold">
                      🎊 Share Your Achievement!
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => shareToSocialMedia('twitter')}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Twitter</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => shareToSocialMedia('facebook')}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => shareToSocialMedia('instagram')}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => shareToSocialMedia('copy')}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadCertificate}
                      className="flex items-center space-x-2 bg-fantasy-gold hover:bg-fantasy-gold/80 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Certificate</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-fantasy-gold" />
              <span>📝 Question Review</span>
            </h3>
            {questions.map((question, index) => {
              const userAnswer = quizState.answers[index];
              const isCorrect = userAnswer === question.correct_answer;
              const wasTimeout = userAnswer === -1;
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? 'bg-fantasy-emerald/10 border-fantasy-emerald/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-fantasy-emerald' : 'bg-red-500'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm mb-2 font-medium">
                        Question {index + 1}: {question.question_text}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs">
                          <span className="text-gray-400">Your answer: </span>
                          <span className={isCorrect ? 'text-fantasy-emerald' : 'text-red-400'}>
                            {wasTimeout ? '⏰ Time expired - No answer' : question.options[userAnswer]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-xs">
                            <span className="text-gray-400">Correct answer: </span>
                            <span className="text-fantasy-emerald">
                              {question.options[question.correct_answer]}
                            </span>
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-xs text-gray-300 mt-2 italic bg-dark-surface/30 p-2 rounded">
                            💡 {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {passed && nextLevelUnlocked && currentLevel < 5 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextLevel}
                className="flex-1 bg-gradient-to-r from-fantasy-emerald to-fantasy-gold hover:from-fantasy-emerald/90 hover:to-fantasy-gold/90 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Next Level ({currentLevel + 1})</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartQuiz}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/quests')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Quests</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / questions.length) * 100;
  const difficultyInfo = getDifficultyInfo(currentLevel);

  return (
    <div className="min-h-screen bg-fantasy-bg text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/quests')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Quests</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary-400" />
                <span className="text-sm text-gray-300">
                  {quizState.currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-lg ${difficultyInfo.bgColor}`}>
                <span className={`text-sm font-medium ${difficultyInfo.color}`}>
                  {difficultyInfo.icon} {difficultyInfo.name}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {topic.name} Quest - Level {currentLevel}
          </h1>
          
          <p className="text-gray-400 mb-4">
            AI-generated questions tailored for {difficultyInfo.name.toLowerCase()} level
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-dark-surface rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary-500 to-fantasy-purple h-3 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quizState.currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-dark-card/80 backdrop-blur-lg rounded-2xl p-8 border border-primary-800/30"
          >
            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-fantasy-gold" />
                <span className="text-sm text-fantasy-gold font-medium">AI Generated Question</span>
              </div>
              
              <motion.div
                animate={quizState.timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: quizState.timeLeft <= 5 ? Infinity : 0 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getTimerBgColor()}`}
              >
                <Timer className={`w-4 h-4 ${getTimerColor()}`} />
                <span className={`text-sm font-bold ${getTimerColor()}`}>
                  {quizState.timeLeft}s
                </span>
                {quizState.timeLeft <= 5 && (
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </motion.div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed whitespace-pre-line">
                {currentQuestion.question_text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = quizState.answers[quizState.currentQuestion] === index;
                const isCorrect = index === currentQuestion.correct_answer;
                const showCorrectAnswer = quizState.showFeedback && isCorrect;
                const showWrongAnswer = quizState.showFeedback && isSelected && !isCorrect;
                const isDisabled = quizState.showFeedback || !quizState.isTimerActive;
                
                return (
                  <motion.button
                    key={index}
                    whileHover={!isDisabled ? { scale: 1.02, x: 10 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isDisabled}
                    className={`w-full p-6 rounded-xl text-left transition-all duration-300 border-2 ${
                      showCorrectAnswer
                        ? 'bg-fantasy-emerald/20 border-fantasy-emerald text-white'
                        : showWrongAnswer
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : isSelected
                        ? 'bg-primary-600/30 border-primary-500 text-white'
                        : isDisabled
                        ? 'bg-dark-surface/30 border-gray-600/30 text-gray-500 cursor-not-allowed'
                        : 'bg-dark-surface/50 border-primary-800/30 text-gray-300 hover:border-primary-600/50 hover:bg-dark-surface/70 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showCorrectAnswer
                          ? 'bg-fantasy-emerald text-white'
                          : showWrongAnswer
                          ? 'bg-red-500 text-white'
                          : isSelected
                          ? 'bg-primary-500 text-white'
                          : isDisabled
                          ? 'bg-gray-600 text-gray-400'
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg flex-1">{option}</span>
                      {showCorrectAnswer && (
                        <CheckCircle className="w-6 h-6 text-fantasy-emerald" />
                      )}
                      {showWrongAnswer && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            {quizState.showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className={`mb-4 p-4 rounded-lg ${
                  quizState.isCorrect
                    ? 'bg-fantasy-emerald/20 border border-fantasy-emerald/30'
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {quizState.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-fantasy-emerald" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <span className={`font-semibold text-lg ${
                      quizState.isCorrect ? 'text-fantasy-emerald' : 'text-red-500'
                    }`}>
                      {quizState.autoAnswered 
                        ? '⏰ Time\'s Up!' 
                        : quizState.isCorrect 
                        ? '✅ Correct!' 
                        : '❌ Incorrect'
                      }
                    </span>
                  </div>
                  {currentQuestion.explanation && (
                    <div className="bg-dark-surface/30 p-3 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        <strong className="text-white">💡 Explanation:</strong> {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Auto-advancing in 5 seconds...</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestDetailPage;