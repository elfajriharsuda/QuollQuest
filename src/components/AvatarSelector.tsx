import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, Upload, User } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: string | null;
  onAvatarSelect: (avatarUrl: string | null) => void;
  onFileUpload: (file: File) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarSelect,
  onFileUpload
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);

  // Default avatar options
  const defaultAvatars = [
    {
      id: 'avatar1',
      url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Professional'
    },
    {
      id: 'avatar2', 
      url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Friendly'
    },
    {
      id: 'avatar3',
      url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Creative'
    },
    {
      id: 'avatar4',
      url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Confident'
    },
    {
      id: 'avatar5',
      url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Casual'
    },
    {
      id: 'avatar6',
      url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Stylish'
    },
    {
      id: 'avatar7',
      url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Adventurous'
    },
    {
      id: 'avatar8',
      url: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Thoughtful'
    }
  ];

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    onAvatarSelect(avatarUrl);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <User className="w-5 h-5 text-primary-400" />
          <span>Choose Your Avatar</span>
        </h3>
        
        {/* Default Avatars Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {defaultAvatars.map((avatar) => (
            <motion.button
              key={avatar.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAvatarSelect(avatar.url)}
              className={`relative group ${
                selectedAvatar === avatar.url
                  ? 'ring-4 ring-primary-500'
                  : 'ring-2 ring-transparent hover:ring-primary-400'
              } rounded-full transition-all duration-300`}
            >
              <img
                src={avatar.url}
                alt={avatar.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              
              {selectedAvatar === avatar.url && (
                <div className="absolute inset-0 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary-400" />
                </div>
              )}
              
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400 whitespace-nowrap">{avatar.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upload Custom Avatar */}
      <div className="border-t border-primary-800/30 pt-6">
        <h4 className="text-md font-medium text-white mb-3 flex items-center space-x-2">
          <Camera className="w-4 h-4 text-fantasy-emerald" />
          <span>Upload Custom Avatar</span>
        </h4>
        
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-fantasy-emerald/20 hover:bg-fantasy-emerald/30 text-fantasy-emerald px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Image</span>
            </motion.div>
          </label>
          
          <div className="text-xs text-gray-400">
            Max 5MB • JPG, PNG, GIF
          </div>
        </div>
      </div>

      {/* Current Selection Preview */}
      {selectedAvatar && (
        <div className="border-t border-primary-800/30 pt-6">
          <h4 className="text-md font-medium text-white mb-3">Preview</h4>
          <div className="flex items-center space-x-4">
            <img
              src={selectedAvatar}
              alt="Selected avatar"
              className="w-20 h-20 rounded-full border-4 border-primary-500 object-cover"
            />
            <div>
              <p className="text-white font-medium">Selected Avatar</p>
              <p className="text-sm text-gray-400">This will be your new profile picture</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;