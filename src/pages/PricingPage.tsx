import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Crown, 
  Check, 
  Zap, 
  Star, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Shield,
  Rocket,
  Trophy,
  Users,
  BarChart3,
  Download,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { plans, subscription, purchasePlan, restorePurchases, loading, isPremium } = useSubscription();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const handlePurchase = async (plan: any) => {
    if (!user) {
      toast.error('Please sign in to purchase a subscription');
      return;
    }

    setPurchasing(plan.id);
    try {
      await purchasePlan(plan);
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restorePurchases();
    } finally {
      setRestoring(false);
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('Unlimited')) return <Zap className="w-4 h-4" />;
    if (feature.includes('AI') || feature.includes('Advanced')) return <Sparkles className="w-4 h-4" />;
    if (feature.includes('Support')) return <Headphones className="w-4 h-4" />;
    if (feature.includes('Analytics')) return <BarChart3 className="w-4 h-4" />;
    if (feature.includes('Premium')) return <Crown className="w-4 h-4" />;
    if (feature.includes('Custom')) return <Star className="w-4 h-4" />;
    if (feature.includes('Export')) return <Download className="w-4 h-4" />;
    if (feature.includes('Community')) return <Users className="w-4 h-4" />;
    if (feature.includes('Progress')) return <Trophy className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  const getPlanColor = (planId: string) => {
    if (planId === 'free') return 'from-gray-500 to-gray-600';
    if (planId.includes('yearly')) return 'from-fantasy-purple to-fantasy-rose';
    return 'from-primary-500 to-primary-600';
  };

  const getPlanBadge = (plan: any) => {
    if (plan.popular) return { text: 'Most Popular', color: 'bg-fantasy-gold text-black' };
    if (plan.id.includes('yearly')) return { text: 'Best Value', color: 'bg-fantasy-purple text-white' };
    if (plan.id === 'free') return { text: 'Free Forever', color: 'bg-fantasy-emerald text-white' };
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fantasy-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fantasy-bg text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-fantasy-purple bg-clip-text text-transparent">
            💎 Choose Your Adventure
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Unlock your learning potential with our premium features. Start your quest today!
          </p>
          
          {isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-fantasy-emerald/20 border border-fantasy-emerald/30 rounded-2xl p-6 max-w-md mx-auto mb-8"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="w-6 h-6 text-fantasy-gold" />
                <span className="text-lg font-semibold text-fantasy-emerald">Premium Active</span>
              </div>
              <p className="text-sm text-gray-300">
                You're currently enjoying premium features! 
                {subscription.expirationDate && (
                  <span className="block mt-1">
                    Expires: {subscription.expirationDate.toLocaleDateString()}
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const badge = getPlanBadge(plan);
            const isCurrentPlan = subscription.productId === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative bg-dark-card/60 backdrop-blur-lg rounded-3xl p-8 border transition-all duration-300 ${
                  plan.popular 
                    ? 'border-fantasy-gold shadow-2xl shadow-fantasy-gold/20 scale-105' 
                    : 'border-primary-800/30 hover:border-primary-600/50'
                } ${isCurrentPlan ? 'ring-2 ring-fantasy-emerald' : ''}`}
              >
                {/* Badge */}
                {badge && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${badge.color} px-4 py-2 rounded-full text-sm font-bold`}>
                    {badge.text}
                  </div>
                )}

                {/* Current Plan Indicator */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4 bg-fantasy-emerald text-white px-3 py-1 rounded-full text-xs font-bold">
                    Current Plan
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${getPlanColor(plan.id)} flex items-center justify-center`}>
                    {plan.id === 'free' ? (
                      <Shield className="w-8 h-8 text-white" />
                    ) : plan.id.includes('yearly') ? (
                      <Rocket className="w-8 h-8 text-white" />
                    ) : (
                      <Crown className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      className="flex items-center space-x-3"
                    >
                      <div className="text-fantasy-emerald">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePurchase(plan)}
                  disabled={purchasing === plan.id || isCurrentPlan || plan.id === 'free'}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    plan.id === 'free'
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : isCurrentPlan
                      ? 'bg-fantasy-emerald/20 text-fantasy-emerald cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-fantasy-gold to-fantasy-emerald hover:from-fantasy-gold/90 hover:to-fantasy-emerald/90 text-black'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                  } disabled:opacity-50`}
                >
                  {purchasing === plan.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      <span>Processing...</span>
                    </>
                  ) : plan.id === 'free' ? (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Free Forever</span>
                    </>
                  ) : isCurrentPlan ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Current Plan</span>
                    </>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Restore Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">Already have a subscription?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestore}
            disabled={restoring}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
          >
            {restoring ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Restoring...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Restore Purchases</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I cancel anytime?",
                answer: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and other payment methods through our secure payment processor."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! New users get a 7-day free trial of our Premium features. No credit card required to start."
              },
              {
                question: "Can I upgrade or downgrade?",
                answer: "Absolutely! You can change your plan at any time. Changes take effect immediately with prorated billing."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-dark-card/40 rounded-xl p-6 border border-primary-800/30">
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;