import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, RotateCcw, PartyPopper, Skull } from 'lucide-react';

interface ResolutionModalProps {
  type: 'success' | 'fail' | null;
  onClose: () => void;
  onReset: () => void;
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ['#5B4BB1', '#FD5DC9', '#FBB328', '#FABFA4'];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 2 + Math.random() * 1.5;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      initial={{
        top: '-10%',
        left: `${left}%`,
        opacity: 1,
        rotate: 0,
      }}
      animate={{
        top: '110%',
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1) * 3,
        opacity: [1, 1, 0.8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        position: 'absolute',
      }}
    />
  );
}

export default function ResolutionModal({ type, onClose, onReset }: ResolutionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (type === 'success') {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [type]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Confetti */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <ConfettiPiece key={i} index={i} />
              ))}
            </div>
          )}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
              type === 'success'
                ? 'bg-white'
                : 'bg-jugaad-near-black'
            }`}
          >
            {type === 'success' ? (
              <div className="relative">
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-jugaad-purple to-jugaad-pink p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: 20,
                          height: 20,
                        }}
                      >
                        <PartyPopper size={20} className="text-white" />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl mb-2 relative"
                  >
                    👑
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white relative">Massive W!</h2>
                </div>

                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    The broadcast went out to all 150+ attendees. The speaker was relocated in under
                    60 seconds. Volunteers are hyped, sponsors are impressed, and the crowd is
                    chanting your name. You just pulled off the ultimate jugaad. 🎉
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-xs text-jugaad-gray mb-0.5">Event Health</p>
                      <p className="text-lg font-bold text-green-600">100%</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-xs text-jugaad-gray mb-0.5">Morale</p>
                      <p className="text-lg font-bold text-green-600">100%</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-xs text-jugaad-gray mb-0.5">Sponsors</p>
                      <p className="text-lg font-bold text-green-600">Happy</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Stay Here
                    </button>
                    <button
                      onClick={onReset}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white text-sm font-semibold flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      Run It Back
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Fail header */}
                <div className="bg-gradient-to-r from-red-900 to-jugaad-purple-dark p-8 text-center relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-5xl mb-2"
                  >
                    💀
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Mission Failed.</h2>
                  <p className="text-sm text-jugaad-gray mt-1">Big L.</p>
                </div>

                <div className="p-6 text-center">
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    The speaker walked out. Volunteers are quitting left and right. Sponsors are
                    pulling funding. The ripple effect just cascaded into a full-blown disaster.
                    The fest is over. 😭
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="rounded-xl bg-red-950/50 p-3">
                      <p className="text-xs text-jugaad-gray mb-0.5">Event Health</p>
                      <p className="text-lg font-bold text-red-500">0%</p>
                    </div>
                    <div className="rounded-xl bg-red-950/50 p-3">
                      <p className="text-xs text-jugaad-gray mb-0.5">Morale</p>
                      <p className="text-lg font-bold text-red-500">2%</p>
                    </div>
                    <div className="rounded-xl bg-red-950/50 p-3">
                      <p className="text-xs text-jugaad-gray mb-0.5">Sponsors</p>
                      <p className="text-lg font-bold text-red-500">Gone</p>
                    </div>
                  </div>

                  <button
                    onClick={onReset}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Try Again (New Jugaad)
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
