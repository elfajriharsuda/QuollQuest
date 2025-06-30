import React from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Crown, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumFeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgrade = true
}) => {
  const { canAccessFeature, isPremium } = useSubscription();

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-primary-600/20 to-fantasy-purple/20 border border-primary-500/30 rounded-2xl p-8 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 bg-gradient-to-r from-fantasy-gold to-fantasy-emerald rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Crown className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-2">Premium Feature</h3>
      <p className="text-gray-300 mb-6">
        Unlock this feature and many more with QuollQuest Premium
      </p>
      
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center space-x-2 text-fantasy-emerald">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Unlimited Access</span>
        </div>
        <div className="flex items-center space-x-2 text-fantasy-gold">
          <Crown className="w-4 h-4" />
          <span className="text-sm">Premium Features</span>
        </div>
      </div>
      
      <Link to="/pricing">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-fantasy-gold to-fantasy-emerald hover:from-fantasy-gold/90 hover:to-fantasy-emerald/90 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
        >
          <span>Upgrade to Premium</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default PremiumFeatureGate;