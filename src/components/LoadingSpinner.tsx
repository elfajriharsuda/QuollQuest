import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading your adventure..." }) => {
  return (
    <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="relative w-20 h-20 mx-auto mb-8"
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
          className="text-white text-lg font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
        
        {/* Supabase Setup Message */}
        {message.includes('Loading') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-6 p-4 bg-primary-600/20 border border-primary-600/30 rounded-lg max-w-md mx-auto"
          >
            <p className="text-sm text-primary-300 mb-2">
              💡 <strong>First time setup?</strong>
            </p>
            <p className="text-xs text-gray-300">
              If this is taking too long, you may need to connect to Supabase using the "Connect to Supabase" button in the top-right corner.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;