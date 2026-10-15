import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, TrendingUp, ArrowUp, Zap, Send, Flame } from 'lucide-react';
import type { CrisisReason, KaleshForumItem, BhasadLevel } from '@/types';

interface KaleshForumProps {
  visible: boolean;
  forumItems: KaleshForumItem[];
  onTriggerCrisis: (crisis: CrisisReason) => void;
  onCustomSubmit: (text: string, severity: BhasadLevel) => void;
  onUpvote: (id: string) => void;
  currentCrisisId: string | null;
}

const BHASAD_OPTIONS: {
  value: BhasadLevel;
  label: string;
  emoji: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: 'normal',
    label: 'Normal',
    emoji: '🟢',
    desc: 'Chill / Minor',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/40',
  },
  {
    value: 'medium',
    label: 'Medium',
    emoji: '🟡',
    desc: 'Thoda Bhasad',
    color: 'text-jugaad-yellow',
    bgColor: 'bg-jugaad-yellow/10',
    borderColor: 'border-jugaad-yellow/40',
  },
  {
    value: 'code-red',
    label: 'Code Red',
    emoji: '🔴',
    desc: 'Absolute Kalesh',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/40',
  },
];

const SEVERITY_BADGE: Record<BhasadLevel, { emoji: string; label: string; className: string }> = {
  normal: { emoji: '🟢', label: 'Normal', className: 'bg-green-500/15 text-green-400' },
  medium: { emoji: '🟡', label: 'Medium', className: 'bg-jugaad-yellow/15 text-jugaad-yellow' },
  'code-red': { emoji: '🔴', label: 'Code Red', className: 'bg-red-500/15 text-red-400' },
};

export default function KaleshForum({
  visible,
  forumItems,
  onTriggerCrisis,
  onCustomSubmit,
  onUpvote,
  currentCrisisId,
}: KaleshForumProps) {
  const [customText, setCustomText] = useState('');
  const [severity, setSeverity] = useState<BhasadLevel>('medium');
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const canSubmit = customText.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCustomSubmit(customText.trim(), severity);
    setCustomText('');
  };

  useEffect(() => {
    if (forumItems.length > 0) {
      const latest = forumItems[0];
      if (latest.isCustom && latest.id !== newItemId) {
        setNewItemId(latest.id);
        setTimeout(() => setNewItemId(null), 2000);
      }
    }
  }, [forumItems]);

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-jugaad-near-black overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-5 py-4 border-b border-white/10 bg-gradient-to-r from-jugaad-purple/10 to-jugaad-pink/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-jugaad-purple to-jugaad-pink flex items-center justify-center">
            <Flame size={15} className="text-white" fill="white" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-1.5">
              The Kalesh Forum <span className="text-sm">🌶️</span>
            </h3>
            <p className="text-xs text-jugaad-gray">Spill the tea. What just went wrong?</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* Part A: Custom Input */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap size={13} className="text-jugaad-pink" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Custom Kalesh Input
            </span>
          </div>

          <div className="relative">
            {/* Neon border wrapper */}
            <div
              className={`rounded-xl transition-all duration-300 ${
                canSubmit
                  ? 'bg-gradient-to-r from-jugaad-purple/40 to-jugaad-pink/40 p-[1.5px] shadow-lg shadow-jugaad-pink/10'
                  : 'p-[1.5px] bg-white/5'
              }`}
            >
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your own college tragedy here... (e.g., The DJ ghosted us and the crowd is rioting)"
                rows={4}
                maxLength={300}
                className="w-full rounded-[10px] bg-jugaad-near-black text-white placeholder:text-white/25 text-sm p-3.5 resize-none focus:outline-none leading-relaxed"
              />
            </div>

            {/* Char counter */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-white/30 font-mono">
                {customText.length}/300
              </span>
              <span className="text-[10px] text-white/30">
                {canSubmit ? 'Ready to unleash chaos' : 'Write something first...'}
              </span>
            </div>
          </div>

          {/* Bhasad Level Selector */}
          <div className="mt-3">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 block">
              Select Bhasad Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BHASAD_OPTIONS.map((opt) => {
                const isSelected = severity === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSeverity(opt.value)}
                    className={`rounded-xl p-2.5 border-2 transition-all text-center ${
                      isSelected
                        ? `${opt.borderColor} ${opt.bgColor}`
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="text-base mb-0.5">{opt.emoji}</div>
                    <p
                      className={`text-[10px] font-bold leading-tight ${
                        isSelected ? opt.color : 'text-white/50'
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[8px] text-white/30 leading-tight mt-0.5">
                      {opt.desc}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.button
            whileHover={canSubmit ? { scale: 1.02 } : undefined}
            whileTap={canSubmit ? { scale: 0.98 } : undefined}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full mt-3 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canSubmit
                ? 'bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white shadow-lg shadow-jugaad-pink/20 hover:shadow-xl hover:shadow-jugaad-pink/30'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <Send size={14} />
            Trigger Custom Kalesh 🌪️
          </motion.button>
        </div>

        {/* Part B: Live Feed */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={13} className="text-jugaad-yellow" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Trending Kaleshes
            </span>
            <span className="ml-auto text-[10px] text-white/30 font-mono">
              {forumItems.length} posts
            </span>
          </div>

          {/* Scrolling feed */}
          <div
            ref={feedRef}
            className="space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-hide pr-1"
          >
            <AnimatePresence initial={false}>
              {forumItems.map((item) => {
                const isActive = currentCrisisId === item.id;
                const isNew = newItemId === item.id;
                const badge = SEVERITY_BADGE[item.severity];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={
                      item.isCustom
                        ? { opacity: 0, y: -30, scale: 0.95 }
                        : { opacity: 0 }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      boxShadow: isNew
                        ? [
                            '0 0 0px rgba(253,93,201,0)',
                            '0 0 20px rgba(253,93,201,0.6)',
                            '0 0 0px rgba(253,93,201,0)',
                          ]
                        : '0 0 0px rgba(253,93,201,0)',
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className={`rounded-xl p-3 border transition-colors ${
                      isActive
                        ? 'border-jugaad-pink/50 bg-jugaad-pink/10'
                        : isNew
                        ? 'border-jugaad-pink/40 bg-jugaad-pink/5'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg flex-shrink-0 mt-0.5">{item.emoji}</span>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white leading-tight mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2 mb-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Upvote */}
                          <button
                            onClick={() => onUpvote(item.id)}
                            className="group inline-flex items-center gap-1 text-[10px] font-semibold text-white/40 hover:text-jugaad-yellow transition-colors"
                          >
                            <ArrowUp
                              size={12}
                              className="group-hover:scale-110 transition-transform"
                            />
                            {item.upvotes}
                          </button>

                          {/* Author */}
                          <span className="text-[10px] text-white/25 font-mono">
                            {item.author}
                          </span>

                          {/* Severity badge */}
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${badge.className}`}
                          >
                            {badge.emoji} {badge.label}
                          </span>

                          {/* Custom badge */}
                          {item.isCustom && (
                            <span className="text-[9px] font-bold text-jugaad-pink bg-jugaad-pink/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <MessageSquare size={8} /> CUSTOM
                            </span>
                          )}

                          {/* Trigger button */}
                          <button
                            onClick={() =>
                              onTriggerCrisis({
                                id: item.id,
                                title: item.title,
                                description: item.description,
                                emoji: item.emoji,
                                severity: item.severity,
                              })
                            }
                            className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                              isActive
                                ? 'bg-jugaad-pink text-white'
                                : 'bg-white/10 text-white/60 hover:bg-gradient-to-r hover:from-jugaad-purple hover:to-jugaad-pink hover:text-white'
                            }`}
                          >
                            {isActive ? 'ACTIVE' : 'Trigger This'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
