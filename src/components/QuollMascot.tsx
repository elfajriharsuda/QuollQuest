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
        scale: [1, 1.05, 1]
      } : {}}
      transition={animate ? { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      {/* Quoll body with school uniform */}
      <ellipse cx="16" cy="20" rx="9" ry="7" fill="#2C3E50" />
      
      {/* School shirt/vest */}
      <ellipse cx="16" cy="19" rx="7" ry="5" fill="#34495E" />
      <ellipse cx="16" cy="18" rx="6" ry="4" fill="#FFFFFF" />
      
      {/* School tie */}
      <rect x="15.5" y="15" width="1" height="6" fill="#E74C3C" />
      <polygon points="15,15 17,15 16.5,17 15.5,17" fill="#C0392B" />
      
      {/* School badge/emblem */}
      <circle cx="13" cy="17" r="1" fill="#F39C12" />
      <text x="13" y="17.5" fontSize="1" textAnchor="middle" fill="#FFFFFF">Q</text>
      
      {/* Spots on uniform */}
      <circle cx="18" cy="18" r="0.5" fill="#BDC3C7" />
      <circle cx="14" cy="20" r="0.4" fill="#BDC3C7" />
      
      {/* Head */}
      <circle cx="16" cy="12" r="6.5" fill="#A0522D" />
      
      {/* School cap */}
      <ellipse cx="16" cy="8" rx="7" ry="2" fill="#2C3E50" />
      <ellipse cx="16" cy="7" rx="5" ry="2.5" fill="#34495E" />
      <circle cx="16" cy="6" r="0.8" fill="#F39C12" />
      
      {/* Ears under cap */}
      <ellipse cx="13" cy="9" rx="1.5" ry="2" fill="#8B4513" />
      <ellipse cx="19" cy="9" rx="1.5" ry="2" fill="#8B4513" />
      <ellipse cx="13" cy="9" rx="0.8" ry="1" fill="#DEB887" />
      <ellipse cx="19" cy="9" rx="0.8" ry="1" fill="#DEB887" />
      
      {/* Eyes with glasses */}
      <circle cx="14" cy="11" r="2" fill="white" stroke="#2C3E50" strokeWidth="0.3" />
      <circle cx="18" cy="11" r="2" fill="white" stroke="#2C3E50" strokeWidth="0.3" />
      
      <motion.circle 
        cx="14" cy="11" r="1.2" fill="black"
        animate={animate ? { scaleY: [1, 0.1, 1] } : {}}
        transition={animate ? { duration: 4, repeat: Infinity } : {}}
      />
      <motion.circle 
        cx="18" cy="11" r="1.2" fill="black"
        animate={animate ? { scaleY: [1, 0.1, 1] } : {}}
        transition={animate ? { duration: 4, repeat: Infinity } : {}}
      />
      
      <circle cx="14.3" cy="10.7" r="0.3" fill="white" />
      <circle cx="18.3" cy="10.7" r="0.3" fill="white" />
      
      {/* Glasses bridge */}
      <line x1="16" y1="11" x2="16" y2="11" stroke="#2C3E50" strokeWidth="0.3" />
      
      {/* Nose */}
      <ellipse cx="16" cy="13.5" rx="0.8" ry="0.5" fill="black" />
      
      {/* Mouth - studious expression */}
      <motion.path
        d="M 15.2 14.8 Q 16 15.2 16.8 14.8"
        stroke="black"
        strokeWidth="0.4"
        fill="none"
        animate={animate ? { 
          d: ["M 15.2 14.8 Q 16 15.2 16.8 14.8", "M 15.2 14.8 Q 16 15.5 16.8 14.8", "M 15.2 14.8 Q 16 15.2 16.8 14.8"] 
        } : {}}
        transition={animate ? { duration: 3, repeat: Infinity } : {}}
      />
      
      {/* Tail */}
      <motion.ellipse
        cx="24" cy="21" rx="4" ry="2" fill="#8B4513"
        animate={animate ? { rotate: [0, 5, -5, 0] } : {}}
        transition={animate ? { duration: 2.5, repeat: Infinity } : {}}
      />
      <circle cx="25" cy="20" r="0.5" fill="#654321" />
      <circle cx="23" cy="22" r="0.5" fill="#654321" />
      
      {/* School book in hand */}
      <rect x="8" y="22" width="3" height="2" fill="#E74C3C" rx="0.2" />
      <rect x="8.2" y="22.2" width="2.6" height="1.6" fill="#FFFFFF" />
      <line x1="8.4" y1="22.6" x2="10.4" y2="22.6" stroke="#2C3E50" strokeWidth="0.1" />
      <line x1="8.4" y1="23" x2="10.4" y2="23" stroke="#2C3E50" strokeWidth="0.1" />
      <line x1="8.4" y1="23.4" x2="10" y2="23.4" stroke="#2C3E50" strokeWidth="0.1" />
      
      {/* Pencil behind ear */}
      <rect x="19.5" y="9" width="0.3" height="3" fill="#F39C12" />
      <rect x="19.5" y="9" width="0.3" height="0.5" fill="#E74C3C" />
      <circle cx="19.65" cy="12.2" r="0.2" fill="#2C3E50" />
      
      {/* Study sparkles (knowledge symbols) */}
      {animate && (
        <>
          <motion.text
            x="8" y="12" fontSize="1.5" fill="#3498DB"
            animate={{ opacity: [0, 1, 0], y: [12, 10, 12] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            📚
          </motion.text>
          <motion.text
            x="24" y="14" fontSize="1.2" fill="#9B59B6"
            animate={{ opacity: [0, 1, 0], y: [14, 12, 14] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          >
            ✏️
          </motion.text>
          <motion.text
            x="10" y="26" fontSize="1" fill="#E67E22"
            animate={{ opacity: [0, 1, 0], y: [26, 24, 26] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
          >
            💡
          </motion.text>
        </>
      )}
    </motion.svg>
  );
};

export default QuollMascot;