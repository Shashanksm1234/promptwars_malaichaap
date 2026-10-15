import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import type { CrisisReason } from '@/types';

interface CrisisAlertCardProps {
  visible: boolean;
  crisis: CrisisReason | null;
  onAcknowledge: () => void;
  onReroll: () => void;
}

export default function CrisisAlertCard({
  visible,
  crisis,
  onAcknowledge,
  onReroll,
}: CrisisAlertCardProps) {
  return (
    <AnimatePresence>
      {visible && crisis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative overflow-hidden rounded-3xl border-2 border-red-500/40 bg-white shadow-xl shadow-red-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-jugaad-pink/5 to-jugaad-yellow/5" />

          {/* Animated glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-radial from-red-400/20 to-transparent blur-3xl animate-pulse" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                className="flex-shrink-0 w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 text-2xl"
              >
                {crisis.emoji}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    Kalesh Alert
                  </span>
                  <AlertTriangle size={14} className="text-red-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {crisis.title}
                </h2>
                <p className="text-sm md:text-base text-jugaad-gray leading-relaxed">
                  {crisis.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAcknowledge}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white font-semibold text-sm shadow-lg shadow-jugaad-purple/20 hover:shadow-jugaad-pink/30 transition-shadow"
              >
                Find a Jugaad
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReroll}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={14} />
                Reroll Crisis
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
