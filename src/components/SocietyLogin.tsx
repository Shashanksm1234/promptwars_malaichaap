import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, KeyRound, Hash, Lock, Loader2, Shield, Crown } from 'lucide-react';
import type { POR, SessionUser } from '@/types';

interface SocietyLoginProps {
  onAuthenticated: (user: SessionUser) => void;
}

const POR_OPTIONS: { value: POR; icon: string; desc: string }[] = [
  { value: 'Volunteer', icon: '🧱', desc: 'Bottom of the ladder' },
  { value: 'ExeCom', icon: '📋', desc: 'Executive Committee' },
  { value: 'PR & Outreach', icon: '📣', desc: 'Hype machine' },
  { value: 'Event Lead', icon: '👑', desc: 'Run the show' },
  { value: 'Tech Head', icon: '💻', desc: 'Make it work' },
  { value: 'Logistics Head', icon: '🧑‍💼', desc: 'Move things' },
  { value: 'Sponsorship Lead', icon: '🧑‍🎤', desc: 'Get the bag' },
];

export default function SocietyLogin({ onAuthenticated }: SocietyLoginProps) {
  const [accessCode, setAccessCode] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPor, setSelectedPor] = useState<POR | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isFormValid =
    accessCode.trim().length > 0 &&
    rollNumber.trim().length > 0 &&
    password.trim().length > 0 &&
    selectedPor !== null;

  const handleSubmit = () => {
    if (!isFormValid || loading) return;
    setLoading(true);

    setTimeout(() => {
      onAuthenticated({
        name: 'Shashank Shekhar',
        por: selectedPor!,
        accessCode: accessCode.trim(),
        rollNumber: rollNumber.trim(),
      });
    }, 1500);
  };

  const handlePorSelect = (por: POR) => {
    setSelectedPor(por);
    // Scroll the selected card into view
    const container = scrollRef.current;
    if (container) {
      const buttons = container.querySelectorAll('[data-por]');
      buttons.forEach((btn) => {
        if (btn.getAttribute('data-por') === por) {
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-jugaad-near-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glowing orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[15%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-jugaad-purple/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] right-[15%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-jugaad-pink/15 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-jugaad-purple/10 blur-3xl pointer-events-none"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 md:p-8 shadow-2xl shadow-jugaad-purple/10">
          {/* Header */}
          <div className="text-center mb-7">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-jugaad-purple to-jugaad-pink shadow-lg shadow-jugaad-pink/30 mb-4"
            >
              <Zap size={28} className="text-white" fill="white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Jugaad<span className="text-gradient">.io</span>
            </h1>
            <p className="text-xs text-jugaad-gray font-medium tracking-wider uppercase mt-1">
              Core Committee Portal
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-jugaad-pink bg-jugaad-pink/10 px-3 py-1 rounded-full font-semibold">
              <Shield size={10} />
              NSUT Fest · Exclusive Access
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Access Code */}
            <div>
              <label className="text-xs font-semibold text-jugaad-gray mb-1.5 block uppercase tracking-wider">
                Society Access Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jugaad-gray" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="INNOVISION-26"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm font-medium focus:outline-none focus:border-jugaad-purple/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="text-xs font-semibold text-jugaad-gray mb-1.5 block uppercase tracking-wider">
                College Roll Number
              </label>
              <div className="relative">
                <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jugaad-gray" />
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  placeholder="2025UBT1072"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm font-medium focus:outline-none focus:border-jugaad-purple/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-jugaad-gray mb-1.5 block uppercase tracking-wider">
                Secure Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jugaad-gray" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm font-medium focus:outline-none focus:border-jugaad-purple/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* POR Sliding Bar */}
            <div>
              <label className="text-xs font-semibold text-jugaad-gray mb-2 block uppercase tracking-wider">
                Select Your POR
              </label>

              {/* Sliding carousel */}
              <div
                ref={scrollRef}
                className="flex gap-2.5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 pt-1 px-[calc(50%-70px)]"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {POR_OPTIONS.map((por) => {
                  const isSelected = selectedPor === por.value;
                  return (
                    <motion.button
                      key={por.value}
                      data-por={por.value}
                      type="button"
                      whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePorSelect(por.value)}
                      animate={{ scale: isSelected ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`relative flex flex-col items-center justify-center flex-shrink-0 w-[140px] h-[100px] rounded-2xl p-2.5 border-2 snap-center transition-colors ${
                        isSelected
                          ? 'border-jugaad-pink bg-jugaad-pink/10 shadow-lg shadow-jugaad-pink/20'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <motion.span
                        animate={isSelected ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl mb-1"
                      >
                        {por.icon}
                      </motion.span>
                      <p
                        className={`text-[11px] font-bold leading-tight text-center ${
                          isSelected ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {por.value}
                      </p>
                      <p className="text-[9px] text-jugaad-gray leading-tight mt-0.5 text-center">
                        {por.desc}
                      </p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-jugaad-pink flex items-center justify-center"
                        >
                          <Crown size={8} className="text-white" fill="white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Scroll hint */}
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="text-[9px] text-white/20 font-medium">
                  ← Scroll to explore all roles →
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={isFormValid && !loading ? { scale: 1.01 } : undefined}
              whileTap={isFormValid && !loading ? { scale: 0.99 } : undefined}
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white shadow-lg shadow-jugaad-pink/20 hover:shadow-xl hover:shadow-jugaad-pink/30'
                  : 'bg-white/5 text-jugaad-gray cursor-not-allowed border border-white/5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <Zap size={16} fill="currentColor" />
                  Authenticate & Enter Chaos 🚀
                </>
              )}
            </motion.button>
          </div>

          {/* Footer hint */}
          <p className="text-center text-[10px] text-white/20 mt-5 leading-relaxed">
            Authorized personnel only. All sessions are monitored by the Core Committee.
            <br />
            Pick the wrong POR and the ripple effect hits different.
          </p>
        </div>

        {/* Floating accent */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-br from-jugaad-pink to-jugaad-purple shadow-lg shadow-jugaad-pink/40"
        />
      </motion.div>
    </div>
  );
}
