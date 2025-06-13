import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        <motion.div
          className="absolute inset-2 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      <motion.p
        className="absolute mt-32 text-white text-lg font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading your adventure...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;