import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Wifi, 
  WifiOff, 
  Loader2, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Settings,
  ExternalLink
} from 'lucide-react';

const SupabaseConnectionStatus: React.FC = () => {
  const { supabaseConfigured, connectionStatus, reconnect } = useAuth();

  // Don't show anything if properly connected
  if (supabaseConfigured && connectionStatus === 'connected') {
    return null;
  }

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          icon: Loader2,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30',
          title: 'Menghubungkan ke Supabase...',
          message: 'Sedang memeriksa koneksi database',
          showReconnect: false,
          animate: true
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10 border-red-500/30',
          title: 'Koneksi Supabase Bermasalah',
          message: 'Terjadi kesalahan saat menghubungkan ke database',
          showReconnect: true,
          animate: false
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10 border-orange-500/30',
          title: 'Supabase Belum Terhubung',
          message: 'Gunakan tombol "Connect to Supabase" untuk setup otomatis',
          showReconnect: false,
          animate: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className={`${config.bgColor} backdrop-blur-lg rounded-2xl p-4 border shadow-lg`}>
          <div className="flex items-start space-x-3">
            <motion.div
              animate={config.animate ? { rotate: 360 } : {}}
              transition={config.animate ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
              className={`${config.color} mt-0.5`}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold ${config.color} mb-1`}>
                {config.title}
              </h3>
              <p className="text-xs text-gray-300 mb-3">
                {config.message}
              </p>
              
              <div className="flex items-center space-x-2">
                {config.showReconnect && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={reconnect}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Coba Lagi</span>
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://supabase.com', '_blank')}
                  className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                >
                  <Settings className="w-3 h-3" />
                  <span>Setup Manual</span>
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Progress indicator for connecting state */}
          {connectionStatus === 'connecting' && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <motion.div
                  className="bg-blue-500 h-1 rounded-full"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SupabaseConnectionStatus;