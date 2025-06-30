import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AvatarDisplayProps {
  avatarId: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  userId?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  avatarId, 
  size = 'md', 
  className = '',
  animate = true,
  userId
}) => {
  const [currentAvatarId, setCurrentAvatarId] = useState(avatarId);

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      if (userId && event.detail.userId === userId) {
        setCurrentAvatarId(event.detail.newAvatarUrl);
      }
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate as EventListener);
    
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate as EventListener);
    };
  }, [userId]);

  // Update local state when prop changes
  useEffect(() => {
    setCurrentAvatarId(avatarId);
  }, [avatarId]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // If it's a URL (custom uploaded image), show the image
  if (currentAvatarId && (currentAvatarId.startsWith('http') || currentAvatarId.startsWith('blob:'))) {
    return (
      <motion.img
        key={currentAvatarId}
        src={currentAvatarId}
        alt="Avatar"
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary-500 ${className}`}
        animate={animate ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    );
  }

  // Default avatar components - render the actual SVG
  const renderAvatarComponent = () => {
    switch (currentAvatarId) {
      case 'quoll1':
        return <QuollAvatar1 />;
      case 'quoll2':
        return <QuollAvatar2 />;
      case 'quoll3':
        return <QuollAvatar3 />;
      case 'fox1':
        return <FoxAvatar1 />;
      case 'fox2':
        return <FoxAvatar2 />;
      case 'owl1':
        return <OwlAvatar1 />;
      case 'owl2':
        return <OwlAvatar2 />;
      case 'panda1':
        return <PandaAvatar1 />;
      case 'panda2':
        return <PandaAvatar2 />;
      case 'cat1':
        return <CatAvatar1 />;
      case 'cat2':
        return <CatAvatar2 />;
      case 'dragon1':
        return <DragonAvatar1 />;
      default:
        return <QuollAvatar1 />; // Default fallback
    }
  };

  return (
    <motion.div
      key={currentAvatarId}
      className={`${sizeClasses[size]} rounded-full border-2 border-primary-500 overflow-hidden bg-dark-surface/50 flex items-center justify-center ${className}`}
      animate={animate ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="w-full h-full">
        {renderAvatarComponent()}
      </div>
    </motion.div>
  );
};

// Complete Avatar Components with proper SVG implementations
const QuollAvatar1: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ 
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {/* Quoll body */}
    <circle cx="32" cy="36" r="18" fill="#8B4513" />
    {/* Spots */}
    <circle cx="26" cy="30" r="2" fill="#654321" />
    <circle cx="38" cy="32" r="2" fill="#654321" />
    <circle cx="30" cy="42" r="1.5" fill="#654321" />
    <circle cx="36" cy="40" r="1.5" fill="#654321" />
    {/* Head */}
    <circle cx="32" cy="22" r="12" fill="#A0522D" />
    {/* Ears */}
    <ellipse cx="26" cy="16" rx="4" ry="6" fill="#8B4513" />
    <ellipse cx="38" cy="16" rx="4" ry="6" fill="#8B4513" />
    <ellipse cx="26" cy="16" rx="2" ry="3" fill="#DEB887" />
    <ellipse cx="38" cy="16" rx="2" ry="3" fill="#DEB887" />
    {/* Eyes */}
    <motion.circle 
      cx="28" cy="20" r="3" fill="white"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.circle 
      cx="36" cy="20" r="3" fill="white"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <circle cx="28" cy="20" r="2" fill="black" />
    <circle cx="36" cy="20" r="2" fill="black" />
    <circle cx="29" cy="19" r="0.5" fill="white" />
    <circle cx="37" cy="19" r="0.5" fill="white" />
    {/* Nose */}
    <ellipse cx="32" cy="25" rx="1.5" ry="1" fill="black" />
    {/* Mouth */}
    <motion.path
      d="M 30 27 Q 32 29 34 27"
      stroke="black"
      strokeWidth="1"
      fill="none"
      animate={{ d: ["M 30 27 Q 32 29 34 27", "M 30 27 Q 32 30 34 27", "M 30 27 Q 32 29 34 27"] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Tail */}
    <motion.ellipse
      cx="48" cy="40" rx="8" ry="4" fill="#8B4513"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <circle cx="50" cy="38" r="1" fill="#654321" />
    <circle cx="46" cy="42" r="1" fill="#654321" />
  </motion.svg>
);

const QuollAvatar2: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ y: [0, -2, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    {/* Quoll body */}
    <ellipse cx="32" cy="38" rx="16" ry="14" fill="#696969" />
    {/* White spots */}
    <circle cx="28" cy="32" r="2" fill="white" />
    <circle cx="36" cy="34" r="2" fill="white" />
    <circle cx="32" cy="44" r="1.5" fill="white" />
    <circle cx="26" cy="40" r="1" fill="white" />
    <circle cx="38" cy="42" r="1" fill="white" />
    {/* Head */}
    <circle cx="32" cy="24" r="11" fill="#808080" />
    {/* Ears */}
    <ellipse cx="26" cy="18" rx="3" ry="5" fill="#696969" />
    <ellipse cx="38" cy="18" rx="3" ry="5" fill="#696969" />
    {/* Eyes with glasses effect */}
    <circle cx="28" cy="22" r="4" fill="white" stroke="#4169E1" strokeWidth="1" />
    <circle cx="36" cy="22" r="4" fill="white" stroke="#4169E1" strokeWidth="1" />
    <motion.circle 
      cx="28" cy="22" r="2.5" fill="black"
      animate={{ x: [0, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.circle 
      cx="36" cy="22" r="2.5" fill="black"
      animate={{ x: [0, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <circle cx="29" cy="21" r="0.5" fill="white" />
    <circle cx="37" cy="21" r="0.5" fill="white" />
    {/* Glasses bridge */}
    <line x1="32" y1="22" x2="32" y2="22" stroke="#4169E1" strokeWidth="1" />
    {/* Nose */}
    <ellipse cx="32" cy="26" rx="1" ry="0.8" fill="black" />
    {/* Mouth */}
    <path d="M 30 28 Q 32 29 34 28" stroke="black" strokeWidth="1" fill="none" />
    {/* Book in hands */}
    <rect x="20" y="45" width="8" height="6" fill="#8B4513" rx="1" />
    <rect x="21" y="46" width="6" height="4" fill="white" />
    <line x1="22" y1="47" x2="26" y2="47" stroke="black" strokeWidth="0.5" />
    <line x1="22" y1="48" x2="26" y2="48" stroke="black" strokeWidth="0.5" />
    <line x1="22" y1="49" x2="25" y2="49" stroke="black" strokeWidth="0.5" />
  </motion.svg>
);

const QuollAvatar3: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ rotate: [0, 2, -2, 0] }}
    transition={{ duration: 4, repeat: Infinity }}
  >
    {/* Quoll body */}
    <ellipse cx="32" cy="36" rx="15" ry="12" fill="#2F4F4F" />
    {/* Cool spots */}
    <circle cx="26" cy="30" r="1.5" fill="#00CED1" />
    <circle cx="38" cy="32" r="1.5" fill="#00CED1" />
    <circle cx="30" cy="42" r="1" fill="#00CED1" />
    <circle cx="36" cy="40" r="1" fill="#00CED1" />
    {/* Head */}
    <circle cx="32" cy="22" r="10" fill="#708090" />
    {/* Cool hat */}
    <ellipse cx="32" cy="16" rx="12" ry="3" fill="#000080" />
    <ellipse cx="32" cy="14" rx="8" ry="4" fill="#000080" />
    <circle cx="36" cy="12" r="1" fill="#FFD700" />
    {/* Ears under hat */}
    <ellipse cx="26" cy="18" rx="2" ry="3" fill="#2F4F4F" />
    <ellipse cx="38" cy="18" rx="2" ry="3" fill="#2F4F4F" />
    {/* Sunglasses */}
    <ellipse cx="28" cy="21" rx="4" ry="3" fill="#000000" />
    <ellipse cx="36" cy="21" rx="4" ry="3" fill="#000000" />
    <line x1="32" y1="21" x2="32" y2="21" stroke="#000000" strokeWidth="2" />
    <motion.circle 
      cx="28" cy="21" r="1" fill="#00BFFF"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle 
      cx="36" cy="21" r="1" fill="#00BFFF"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Nose */}
    <ellipse cx="32" cy="25" rx="1" ry="0.8" fill="black" />
    {/* Cool smile */}
    <path d="M 29 27 Q 32 29 35 27" stroke="black" strokeWidth="1.5" fill="none" />
  </motion.svg>
);

const FoxAvatar1: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ 
      rotate: [0, 3, -3, 0],
      scale: [1, 1.02, 1]
    }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {/* Fox body */}
    <ellipse cx="32" cy="40" rx="14" ry="12" fill="#FF6347" />
    {/* Chest */}
    <ellipse cx="32" cy="38" rx="8" ry="8" fill="#FFF8DC" />
    {/* Head */}
    <ellipse cx="32" cy="24" rx="10" ry="8" fill="#FF6347" />
    {/* Snout */}
    <ellipse cx="32" cy="28" rx="4" ry="3" fill="#FFF8DC" />
    {/* Ears */}
    <motion.ellipse
      cx="26" cy="18" rx="3" ry="6" fill="#FF6347"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.ellipse
      cx="38" cy="18" rx="3" ry="6" fill="#FF6347"
      animate={{ rotate: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <ellipse cx="26" cy="18" rx="1.5" ry="3" fill="#FFB6C1" />
    <ellipse cx="38" cy="18" rx="1.5" ry="3" fill="#FFB6C1" />
    {/* Eyes */}
    <motion.ellipse
      cx="28" cy="22" rx="2.5" ry="3" fill="white"
      animate={{ scaleY: [1, 0.2, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.ellipse
      cx="36" cy="22" rx="2.5" ry="3" fill="white"
      animate={{ scaleY: [1, 0.2, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <ellipse cx="28" cy="22" rx="1.5" ry="2" fill="#228B22" />
    <ellipse cx="36" cy="22" rx="1.5" ry="2" fill="#228B22" />
    <ellipse cx="28" cy="22" rx="0.8" ry="1.5" fill="black" />
    <ellipse cx="36" cy="22" rx="0.8" ry="1.5" fill="black" />
    <circle cx="28.5" cy="21.5" r="0.3" fill="white" />
    <circle cx="36.5" cy="21.5" r="0.3" fill="white" />
    {/* Nose */}
    <ellipse cx="32" cy="28" rx="1" ry="0.8" fill="black" />
    {/* Mouth */}
    <motion.path
      d="M 30 30 Q 32 32 34 30"
      stroke="black"
      strokeWidth="1"
      fill="none"
      animate={{ d: ["M 30 30 Q 32 32 34 30", "M 30 30 Q 32 33 34 30", "M 30 30 Q 32 32 34 30"] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Tail */}
    <motion.ellipse
      cx="46" cy="42" rx="10" ry="5" fill="#FF6347"
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <ellipse cx="50" cy="40" rx="6" ry="3" fill="#FFF8DC" />
  </motion.svg>
);

const FoxAvatar2: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ y: [0, -1, 0] }}
    transition={{ duration: 2.5, repeat: Infinity }}
  >
    {/* Mystic aura */}
    <motion.circle
      cx="32" cy="32" r="28" fill="none" stroke="#9370DB" strokeWidth="0.5" opacity="0.3"
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Fox body */}
    <ellipse cx="32" cy="40" rx="13" ry="11" fill="#4B0082" />
    {/* Mystic markings */}
    <path d="M 25 35 Q 32 30 39 35" stroke="#9370DB" strokeWidth="1" fill="none" />
    <circle cx="32" cy="38" r="2" fill="#9370DB" opacity="0.7" />
    {/* Head */}
    <ellipse cx="32" cy="24" rx="9" ry="7" fill="#6A5ACD" />
    {/* Mystic gem on forehead */}
    <motion.circle
      cx="32" cy="20" r="2" fill="#FF1493"
      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Ears */}
    <ellipse cx="26" cy="18" rx="2.5" ry="5" fill="#4B0082" />
    <ellipse cx="38" cy="18" rx="2.5" ry="5" fill="#4B0082" />
    {/* Eyes */}
    <motion.circle
      cx="28" cy="23" r="3" fill="#FF1493"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.circle
      cx="36" cy="23" r="3" fill="#FF1493"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <circle cx="28" cy="23" r="1.5" fill="white" />
    <circle cx="36" cy="23" r="1.5" fill="white" />
    {/* Nose */}
    <ellipse cx="32" cy="26" rx="1" ry="0.8" fill="black" />
    {/* Mystical whiskers */}
    <motion.line
      x1="24" y1="25" x2="20" y2="24" stroke="#9370DB" strokeWidth="0.5"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.line
      x1="40" y1="25" x2="44" y2="24" stroke="#9370DB" strokeWidth="0.5"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

const OwlAvatar1: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ rotate: [0, 2, -2, 0] }}
    transition={{ duration: 4, repeat: Infinity }}
  >
    {/* Owl body */}
    <ellipse cx="32" cy="42" rx="16" ry="14" fill="#8B4513" />
    {/* Wing patterns */}
    <ellipse cx="22" cy="38" rx="6" ry="10" fill="#A0522D" />
    <ellipse cx="42" cy="38" rx="6" ry="10" fill="#A0522D" />
    <ellipse cx="22" cy="38" rx="3" ry="6" fill="#DEB887" />
    <ellipse cx="42" cy="38" rx="3" ry="6" fill="#DEB887" />
    {/* Head */}
    <circle cx="32" cy="26" r="14" fill="#A0522D" />
    {/* Ear tufts */}
    <motion.ellipse
      cx="24" cy="14" rx="2" ry="6" fill="#8B4513"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.ellipse
      cx="40" cy="14" rx="2" ry="6" fill="#8B4513"
      animate={{ rotate: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Large eyes */}
    <circle cx="26" cy="24" r="6" fill="white" />
    <circle cx="38" cy="24" r="6" fill="white" />
    <circle cx="26" cy="24" r="5" fill="#FFD700" />
    <circle cx="38" cy="24" r="5" fill="#FFD700" />
    <motion.circle
      cx="26" cy="24" r="3" fill="black"
      animate={{ scale: [1, 0.8, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.circle
      cx="38" cy="24" r="3" fill="black"
      animate={{ scale: [1, 0.8, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <circle cx="27" cy="23" r="1" fill="white" />
    <circle cx="39" cy="23" r="1" fill="white" />
    {/* Beak */}
    <path d="M 32 28 L 30 32 L 34 32 Z" fill="#FFA500" />
    {/* Graduation cap */}
    <ellipse cx="32" cy="16" rx="10" ry="2" fill="#000080" />
    <rect x="27" y="12" width="10" height="6" fill="#000080" />
    <motion.rect
      x="35" y="10" width="8" height="1" fill="#FFD700"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Book */}
    <rect x="18" y="50" width="8" height="6" fill="#8B4513" />
    <rect x="19" y="51" width="6" height="4" fill="white" />
  </motion.svg>
);

const OwlAvatar2: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ y: [0, -1, 0] }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {/* Night sky background */}
    <circle cx="32" cy="32" r="30" fill="#191970" opacity="0.3" />
    <motion.circle
      cx="20" cy="20" r="1" fill="#FFD700"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="45" cy="18" r="0.8" fill="#FFD700"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.circle
      cx="50" cy="25" r="0.6" fill="#FFD700"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
    {/* Owl body */}
    <ellipse cx="32" cy="42" rx="15" ry="13" fill="#2F4F4F" />
    {/* Darker wing patterns */}
    <ellipse cx="22" cy="38" rx="5" ry="9" fill="#1C1C1C" />
    <ellipse cx="42" cy="38" rx="5" ry="9" fill="#1C1C1C" />
    {/* Head */}
    <circle cx="32" cy="26" r="13" fill="#696969" />
    {/* Glowing eyes */}
    <motion.circle
      cx="26" cy="24" r="5" fill="#00FFFF"
      animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="38" cy="24" r="5" fill="#00FFFF"
      animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <circle cx="26" cy="24" r="3" fill="white" />
    <circle cx="38" cy="24" r="3" fill="white" />
    <circle cx="26" cy="24" r="2" fill="black" />
    <circle cx="38" cy="24" r="2" fill="black" />
    {/* Beak */}
    <path d="M 32 28 L 30 31 L 34 31 Z" fill="#FFA500" />
    {/* Moon on head */}
    <motion.path
      d="M 30 16 Q 32 12 34 16 Q 32 18 30 16"
      fill="#FFD700"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </motion.svg>
);

const PandaAvatar1: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {/* Zen circle */}
    <motion.circle
      cx="32" cy="32" r="26" fill="none" stroke="#32CD32" strokeWidth="0.5" opacity="0.4"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    {/* Panda body */}
    <ellipse cx="32" cy="40" rx="14" ry="12" fill="white" />
    {/* Arms */}
    <ellipse cx="20" cy="36" rx="4" ry="8" fill="black" />
    <ellipse cx="44" cy="36" rx="4" ry="8" fill="black" />
    {/* Head */}
    <circle cx="32" cy="24" r="12" fill="white" />
    {/* Ear patches */}
    <circle cx="24" cy="18" r="5" fill="black" />
    <circle cx="40" cy="18" r="5" fill="black" />
    {/* Eyes */}
    <ellipse cx="28" cy="22" rx="4" ry="5" fill="black" />
    <ellipse cx="36" cy="22" rx="4" ry="5" fill="black" />
    <motion.circle
      cx="28" cy="22" r="2.5" fill="white"
      animate={{ y: [0, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.circle
      cx="36" cy="22" r="2.5" fill="white"
      animate={{ y: [0, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <circle cx="28" cy="22" r="1.5" fill="black" />
    <circle cx="36" cy="22" r="1.5" fill="black" />
    <circle cx="28.5" cy="21.5" r="0.5" fill="white" />
    <circle cx="36.5" cy="21.5" r="0.5" fill="white" />
    {/* Nose */}
    <ellipse cx="32" cy="26" rx="1" ry="0.8" fill="black" />
    {/* Peaceful smile */}
    <motion.path
      d="M 29 28 Q 32 30 35 28"
      stroke="black"
      strokeWidth="1"
      fill="none"
      animate={{ d: ["M 29 28 Q 32 30 35 28", "M 29 28 Q 32 31 35 28", "M 29 28 Q 32 30 35 28"] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    {/* Meditation pose hands */}
    <circle cx="20" cy="44" r="3" fill="black" />
    <circle cx="44" cy="44" r="3" fill="black" />
    {/* Lotus position indicator */}
    <ellipse cx="32" cy="52" rx="8" ry="3" fill="#32CD32" opacity="0.3" />
  </motion.svg>
);

const PandaAvatar2: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ 
      rotate: [0, 5, -5, 0],
      y: [0, -2, 0]
    }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    {/* Panda body */}
    <ellipse cx="32" cy="40" rx="15" ry="13" fill="white" />
    {/* Arms in playful position */}
    <motion.ellipse
      cx="18" cy="32" rx="4" ry="9" fill="black"
      animate={{ rotate: [0, 20, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.ellipse
      cx="46" cy="32" rx="4" ry="9" fill="black"
      animate={{ rotate: [0, -20, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    {/* Head */}
    <circle cx="32" cy="24" r="11" fill="white" />
    {/* Ear patches */}
    <circle cx="25" cy="18" r="4.5" fill="black" />
    <circle cx="39" cy="18" r="4.5" fill="black" />
    {/* Eyes */}
    <ellipse cx="28" cy="22" rx="3.5" ry="4" fill="black" />
    <ellipse cx="36" cy="22" rx="3.5" ry="4" fill="black" />
    <motion.circle
      cx="28" cy="22" r="2" fill="white"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <motion.circle
      cx="36" cy="22" r="2" fill="white"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <circle cx="28" cy="22" r="1" fill="black" />
    <circle cx="36" cy="22" r="1" fill="black" />
    {/* Excited expression */}
    <ellipse cx="32" cy="26" rx="1.5" ry="1" fill="black" />
    <motion.ellipse
      cx="32" cy="29" rx="3" ry="2" fill="black"
      animate={{ scaleY: [1, 1.3, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
    {/* Playful tongue */}
    <motion.ellipse
      cx="32" cy="30" rx="1" ry="2" fill="#FF69B4"
      animate={{ scaleY: [0.5, 1, 0.5] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
    {/* Ball toy */}
    <motion.circle
      cx="50" cy="45" r="4" fill="#FF6347"
      animate={{ 
        x: [0, -5, 0],
        y: [0, -3, 0]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <circle cx="50" cy="45" r="2" fill="#FFD700" />
  </motion.svg>
);

const CatAvatar1: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ 
      rotate: [0, 2, -2, 0],
      scale: [1, 1.03, 1]
    }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {/* Cat body */}
    <ellipse cx="32" cy="40" rx="13" ry="11" fill="#FFA500" />
    {/* Stripes */}
    <ellipse cx="32" cy="35" rx="8" ry="2" fill="#FF8C00" />
    <ellipse cx="32" cy="42" rx="9" ry="2" fill="#FF8C00" />
    <ellipse cx="32" cy="48" rx="7" ry="1.5" fill="#FF8C00" />
    {/* Head */}
    <circle cx="32" cy="24" r="10" fill="#FFA500" />
    {/* Head stripes */}
    <ellipse cx="32" cy="20" rx="6" ry="1.5" fill="#FF8C00" />
    <ellipse cx="32" cy="26" rx="5" ry="1" fill="#FF8C00" />
    {/* Ears */}
    <motion.path
      d="M 24 16 L 26 20 L 28 16 Z"
      fill="#FFA500"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.path
      d="M 36 16 L 38 20 L 40 16 Z"
      fill="#FFA500"
      animate={{ rotate: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <path d="M 25 17 L 26.5 19 L 27.5 17 Z" fill="#FFB6C1" />
    <path d="M 36.5 17 L 37.5 19 L 39 17 Z" fill="#FFB6C1" />
    {/* Eyes */}
    <motion.ellipse
      cx="28" cy="22" rx="2.5" ry="3" fill="#32CD32"
      animate={{ scaleY: [1, 0.3, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.ellipse
      cx="36" cy="22" rx="2.5" ry="3" fill="#32CD32"
      animate={{ scaleY: [1, 0.3, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <ellipse cx="28" cy="22" rx="1" ry="2" fill="black" />
    <ellipse cx="36" cy="22" rx="1" ry="2" fill="black" />
    <ellipse cx="28.3" cy="21" rx="0.3" ry="0.8" fill="white" />
    <ellipse cx="36.3" cy="21" rx="0.3" ry="0.8" fill="white" />
    {/* Nose */}
    <path d="M 32 25 L 31 26 L 33 26 Z" fill="#FF69B4" />
    {/* Mouth */}
    <path d="M 32 26 Q 30 28 28 27" stroke="black" strokeWidth="1" fill="none" />
    <path d="M 32 26 Q 34 28 36 27" stroke="black" strokeWidth="1" fill="none" />
    {/* Whiskers */}
    <motion.line
      x1="22" y1="24" x2="18" y2="23" stroke="black" strokeWidth="0.8"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.line
      x1="42" y1="24" x2="46" y2="23" stroke="black" strokeWidth="0.8"
      animate={{ rotate: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <line x1="22" y1="26" x2="18" y2="26" stroke="black" strokeWidth="0.8" />
    <line x1="42" y1="26" x2="46" y2="26" stroke="black" strokeWidth="0.8" />
    {/* Tail */}
    <motion.path
      d="M 45 42 Q 52 38 50 48 Q 48 52 45 48"
      fill="#FFA500"
      animate={{ d: ["M 45 42 Q 52 38 50 48 Q 48 52 45 48", "M 45 42 Q 54 35 52 45 Q 50 50 45 48", "M 45 42 Q 52 38 50 48 Q 48 52 45 48"] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <ellipse cx="48" cy="44" rx="1.5" ry="3" fill="#FF8C00" />
  </motion.svg>
);

const CatAvatar2: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ y: [0, -1, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    {/* Ninja smoke */}
    <motion.circle
      cx="20" cy="50" r="3" fill="#696969" opacity="0.3"
      animate={{ scale: [1, 1.5, 0], opacity: [0.3, 0.1, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="44" cy="52" r="2" fill="#696969" opacity="0.3"
      animate={{ scale: [1, 1.3, 0], opacity: [0.3, 0.1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
    />
    {/* Cat body */}
    <ellipse cx="32" cy="40" rx="12" ry="10" fill="#2F2F2F" />
    {/* Head */}
    <circle cx="32" cy="24" r="9" fill="#2F2F2F" />
    {/* Ninja mask */}
    <ellipse cx="32" cy="22" rx="8" ry="6" fill="#000000" />
    {/* Eyes showing through mask */}
    <motion.ellipse
      cx="28" cy="21" rx="2" ry="2.5" fill="#FF0000"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.ellipse
      cx="36" cy="21" rx="2" ry="2.5" fill="#FF0000"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <ellipse cx="28" cy="21" rx="0.8" ry="1.5" fill="white" />
    <ellipse cx="36" cy="21" rx="0.8" ry="1.5" fill="white" />
    {/* Ears */}
    <path d="M 25 16 L 27 19 L 29 16 Z" fill="#2F2F2F" />
    <path d="M 35 16 L 37 19 L 39 16 Z" fill="#2F2F2F" />
    {/* Ninja weapons */}
    <motion.line
      x1="15" y1="35" x2="20" y2="30" stroke="#C0C0C0" strokeWidth="2"
      animate={{ rotate: [0, 45, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <motion.line
      x1="49" y1="35" x2="44" y2="30" stroke="#C0C0C0" strokeWidth="2"
      animate={{ rotate: [0, -45, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    {/* Ninja star */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <path d="M 50 20 L 52 22 L 50 24 L 48 22 Z" fill="#C0C0C0" />
      <path d="M 48 20 L 50 18 L 52 20 L 50 22 Z" fill="#C0C0C0" />
    </motion.g>
  </motion.svg>
);

const DragonAvatar1: React.FC = () => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-full h-full"
    animate={{ 
      y: [0, -2, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    {/* Magic sparkles */}
    <motion.circle
      cx="15" cy="20" r="1" fill="#FFD700"
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="50" cy="25" r="0.8" fill="#FF69B4"
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
    />
    <motion.circle
      cx="18" cy="45" r="0.6" fill="#00FFFF"
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
    />
    {/* Dragon body */}
    <ellipse cx="32" cy="40" rx="14" ry="12" fill="#9370DB" />
    {/* Scales pattern */}
    <ellipse cx="28" cy="35" rx="2" ry="3" fill="#8A2BE2" />
    <ellipse cx="36" cy="37" rx="2" ry="3" fill="#8A2BE2" />
    <ellipse cx="32" cy="44" rx="2" ry="3" fill="#8A2BE2" />
    {/* Head */}
    <ellipse cx="32" cy="24" rx="10" ry="8" fill="#9370DB" />
    {/* Horns */}
    <motion.ellipse
      cx="26" cy="16" rx="1.5" ry="4" fill="#FFD700"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.ellipse
      cx="38" cy="16" rx="1.5" ry="4" fill="#FFD700"
      animate={{ rotate: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Eyes */}
    <motion.ellipse
      cx="28" cy="22" rx="3" ry="4" fill="#FFD700"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.ellipse
      cx="36" cy="22" rx="3" ry="4" fill="#FFD700"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <ellipse cx="28" cy="22" rx="1.5" ry="2.5" fill="black" />
    <ellipse cx="36" cy="22" rx="1.5" ry="2.5" fill="black" />
    <ellipse cx="28.5" cy="21" rx="0.5" ry="1" fill="white" />
    <ellipse cx="36.5" cy="21" rx="0.5" ry="1" fill="white" />
    {/* Snout */}
    <ellipse cx="32" cy="28" rx="3" ry="2" fill="#8A2BE2" />
    {/* Nostrils */}
    <ellipse cx="31" cy="28" rx="0.5" ry="0.3" fill="black" />
    <ellipse cx="33" cy="28" rx="0.5" ry="0.3" fill="black" />
    {/* Fire breath */}
    <motion.ellipse
      cx="32" cy="32" rx="2" ry="1" fill="#FF4500"
      animate={{ 
        scaleX: [1, 1.5, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <motion.ellipse
      cx="32" cy="34" rx="1.5" ry="0.8" fill="#FFD700"
      animate={{ 
        scaleX: [1, 1.3, 1],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
    />
    {/* Wings */}
    <motion.ellipse
      cx="20" cy="32" rx="8" ry="12" fill="#8A2BE2" opacity="0.8"
      animate={{ rotate: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.ellipse
      cx="44" cy="32" rx="8" ry="12" fill="#8A2BE2" opacity="0.8"
      animate={{ rotate: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <ellipse cx="20" cy="32" rx="4" ry="8" fill="#9370DB" />
    <ellipse cx="44" cy="32" rx="4" ry="8" fill="#9370DB" />
    {/* Tail */}
    <motion.path
      d="M 46 44 Q 54 40 52 50 Q 50 54 46 50"
      fill="#9370DB"
      animate={{ d: ["M 46 44 Q 54 40 52 50 Q 50 54 46 50", "M 46 44 Q 56 38 54 48 Q 52 52 46 50", "M 46 44 Q 54 40 52 50 Q 50 54 46 50"] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <ellipse cx="50" cy="46" rx="1" ry="2" fill="#8A2BE2" />
  </motion.svg>
);

export default AvatarDisplay;