import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { supabase } from '../lib/supabase';
import AvatarSelector from '../components/AvatarSelector';
import AvatarDisplay from '../components/AvatarDisplay';
import { 
  Crown, 
  Trophy, 
  Zap, 
  Target, 
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  Star,
  Award,
  TrendingUp,
  Flame,
  Users,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, stats, loading, updateProfile, refreshProfile } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) return;

    setSaving(true);
    try {
      const result = await updateProfile({ username: newUsername.trim() });
      if (result?.success) {
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result?.error || 'Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (avatarId: string | null) => {
    try {
      const result = await updateProfile({ avatar_url: avatarId });
      if (result?.success) {
        toast.success('Avatar updated successfully!');
        setShowAvatarSelector(false);
        // Refresh profile to get the latest data
        await refreshProfile();
      } else {
        toast.error('Error updating avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Error updating avatar');
    }
  };

  const uploadCustomAvatar = async (file: File) => {
    if (!user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const result = await updateProfile({ avatar_url: data.publicUrl });
      if (result?.success) {
        toast.success('Custom avatar uploaded successfully!');
        setShowAvatarSelector(false);
        // Refresh profile to get the latest data
        await refreshProfile();
      } else {
        toast.error('Error updating avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error uploading avatar');
    }
  };

  const expToNextLevel = profile ? profile.level * 100 : 100;
  const expProgress = profile ? (profile.exp / expToNextLevel) * 100 : 0;

  const achievements = [
    { 
      name: 'First Quest', 
      description: 'Complete your first quest', 
      icon: Target, 
      earned: stats.completedQuests >= 1 
    },
    { 
      name: 'Level Up', 
      description: 'Reach level 5', 
      icon: Crown, 
      earned: (profile?.level || 0) >= 5 
    },
    { 
      name: 'Streak Master', 
      description: '7-day login streak', 
      icon: Flame, 
      earned: (profile?.login_streak || 0) >= 7 
    },
    { 
      name: 'Knowledge Seeker', 
      description: 'Complete 10 quests', 
      icon: Trophy, 
      earned: stats.completedQuests >= 10 
    },
    { 
      name: 'Rising Star', 
      description: 'Earn 1000 EXP', 
      icon: Star, 
      earned: (profile?.exp || 0) >= 1000 
    },
    { 
      name: 'Dedicated Learner', 
      description: '30-day login streak', 
      icon: Award, 
      earned: (profile?.login_streak || 0) >= 30 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fantasy-bg text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-8 border border-primary-800/30"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <AvatarDisplay 
                avatarId={profile.avatar_url} 
                size="xl" 
                className="shadow-2xl"
                userId={user?.id}
                animate={true}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 p-2 rounded-full cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                {editing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-dark-surface/50 border border-primary-800/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="bg-fantasy-emerald hover:bg-fantasy-emerald/80 p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4 text-white" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditing(false);
                        setNewUsername(profile.username);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditing(true)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 bg-primary-600/20 px-3 py-1 rounded-lg">
                  <Crown className="w-5 h-5 text-primary-400" />
                  <span className="text-primary-400 font-semibold">Level {profile.level}</span>
                </div>
              </div>

              <p className="text-gray-400 mb-4">
                Adventurer since {new Date(profile.created_at).toLocaleDateString()}
              </p>

              {/* EXP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-gray-400">{profile.exp} / {expToNextLevel} EXP</span>
                </div>
                <div className="w-full bg-dark-surface rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-primary-500 to-fantasy-purple h-3 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {expToNextLevel - profile.exp} EXP to next level
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6"
        >
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Trophy className="w-8 h-8 text-fantasy-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.completedQuests}</div>
            <div className="text-sm text-gray-400">Quests Completed</div>
          </div>
          
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Flame className="w-8 h-8 text-fantasy-rose mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.login_streak}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
          
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <TrendingUp className="w-8 h-8 text-fantasy-emerald mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.exp}</div>
            <div className="text-sm text-gray-400">Total EXP</div>
          </div>
          
          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Award className="w-8 h-8 text-fantasy-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.longest_streak}</div>
            <div className="text-sm text-gray-400">Best Streak</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 text-center">
            <Clock className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.total_logins}</div>
            <div className="text-sm text-gray-400">Total Logins</div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className={`bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 ${
                    achievement.earned
                      ? 'border-fantasy-gold/50 hover:border-fantasy-gold'
                      : 'border-gray-600/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.earned
                        ? 'bg-gradient-to-r from-fantasy-gold to-fantasy-emerald'
                        : 'bg-gray-600'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <div className="text-fantasy-gold">
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-dark-card/60 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <Calendar className="w-6 h-6 text-gray-400" />
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
        </motion.div>

        {/* Avatar Selector Modal */}
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-card/90 backdrop-blur-lg rounded-2xl p-6 border border-primary-800/30 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Select Avatar</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAvatarSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <AvatarSelector
                currentAvatar={profile.avatar_url}
                onAvatarSelect={handleAvatarSelect}
                onFileUpload={uploadCustomAvatar}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;