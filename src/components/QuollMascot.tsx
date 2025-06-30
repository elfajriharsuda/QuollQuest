import React from 'react';
import { motion } from 'framer-motion';

interface QuollMascotProps {
  className?: string;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const QuollMascot: React.FC<QuollMascotProps> = ({ 
  className = '', 
  animate = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.svg
      viewBox="0 0 32 32"
      className={`${sizeClasses[size]} ${className}`}
      animate={animate ? { 
        rotate: [0, 3, -3, 0],
        scale: [1, 1.05, 1]
      } : {}}
      transition={animate ? { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      {/* Quoll body */}
      <ellipse cx="16" cy="20" rx="9" ry="7" fill="#8B4513" />
      
      {/* Spots */}
      <circle cx="13" cy="17" r="1" fill="#654321" />
      <circle cx="19" cy="18" r="1" fill="#654321" />
      <circle cx="15" cy="22" r="0.8" fill="#654321" />
      <circle cx="18" cy="21" r="0.8" fill="#654321" />
      
      {/* Head */}
      <circle cx="16" cy="12" r="6.5" fill="#A0522D" />
      
      {/* Ears */}
      <ellipse cx="13" cy="8" rx="2" ry="3" fill="#8B4513" />
      <ellipse cx="19" cy="8" rx="2" ry="3" fill="#8B4513" />
      <ellipse cx="13" cy="8" rx="1" ry="1.5" fill="#DEB887" />
      <ellipse cx="19" cy="8" rx="1" ry="1.5" fill="#DEB887" />
      
      {/* Eyes */}
      <motion.circle 
        cx="14" cy="11" r="1.5" fill="white"
        animate={animate ? { scaleY: [1, 0.1, 1] } : {}}
        transition={animate ? { duration: 3, repeat: Infinity } : {}}
      />
      <motion.circle 
        cx="18" cy="11" r="1.5" fill="white"
        animate={animate ? { scaleY: [1, 0.1, 1] } : {}}
        transition={animate ? { duration: 3, repeat: Infinity } : {}}
      />
      <circle cx="14" cy="11" r="1" fill="black" />
      <circle cx="18" cy="11" r="1" fill="black" />
      <circle cx="14.3" cy="10.7" r="0.3" fill="white" />
      <circle cx="18.3" cy="10.7" r="0.3" fill="white" />
      
      {/* Nose */}
      <ellipse cx="16" cy="13.5" rx="0.8" ry="0.5" fill="black" />
      
      {/* Mouth */}
      <motion.path
        d="M 15 14.5 Q 16 15.5 17 14.5"
        stroke="black"
        strokeWidth="0.5"
        fill="none"
        animate={animate ? { 
          d: ["M 15 14.5 Q 16 15.5 17 14.5", "M 15 14.5 Q 16 16 17 14.5", "M 15 14.5 Q 16 15.5 17 14.5"] 
        } : {}}
        transition={animate ? { duration: 2, repeat: Infinity } : {}}
      />
      
      {/* Tail */}
      <motion.ellipse
        cx="24" cy="21" rx="4" ry="2" fill="#8B4513"
        animate={animate ? { rotate: [0, 8, -8, 0] } : {}}
        transition={animate ? { duration: 2, repeat: Infinity } : {}}
      />
      <circle cx="25" cy="20" r="0.5" fill="#654321" />
      <circle cx="23" cy="22" r="0.5" fill="#654321" />
      
      {/* Crown on head (to show it's the mascot/logo) */}
      <motion.g
        animate={animate ? { y: [0, -0.5, 0] } : {}}
        transition={animate ? { duration: 2, repeat: Infinity, delay: 0.5 } : {}}
      >
        <path d="M 12 6 L 14 4 L 16 5 L 18 4 L 20 6 L 19 8 L 13 8 Z" fill="#FFD700" />
        <circle cx="14" cy="4.5" r="0.5" fill="#FF6B6B" />
        <circle cx="16" cy="4" r="0.5" fill="#4ECDC4" />
        <circle cx="18" cy="4.5" r="0.5" fill="#45B7D1" />
      </motion.g>
      
      {/* Sparkles around the mascot */}
      {animate && (
        <>
          <motion.circle
            cx="8" cy="10" r="0.5" fill="#FFD700"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="24" cy="8" r="0.3" fill="#FF6B6B"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          />
          <motion.circle
            cx="10" cy="24" r="0.4" fill="#4ECDC4"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
          />
        </>
      )}
    </motion.svg>
  );
};

export default QuollMascot;