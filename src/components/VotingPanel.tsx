import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Hourglass, Sparkles, Bus } from 'lucide-react';
import type { RoomStats, POCVote } from '@/types';
import { POCS, computeVote, getVoteSummary } from '@/gameData';

interface VotingPanelProps {
  visible: boolean;
  selectedRoom: RoomStats | null;
  votes: POCVote[];
  onPitch: () => void;
  onDeploy: () => void;
  pitchStarted: boolean;
}

export default function VotingPanel({
  visible,
  selectedRoom,
  votes,
  onPitch,
  onDeploy,
  pitchStarted,
}: VotingPanelProps) {
  if (!visible || !selectedRoom) return null;

  const summary = getVoteSummary(votes);
  const allVoted =
    pitchStarted && votes.length === POCS.length && votes.every((v) => v.vote !== 'pending');
  const canDeploy = allVoted && summary.passed;
  const isExternal = selectedRoom.isExternal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            POC Consensus Panel
          </h3>
          <p className="text-sm text-jugaad-gray">
            Pitch your jugaad to the panel. Each POC gets one vote.
          </p>
        </div>
        {pitchStarted && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {votes.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.3 }}
                  className={`w-2.5 h-2.5 rounded-full ${
                    v.vote === 'yes'
                      ? 'bg-green-500'
                      : v.vote === 'no'
                      ? 'bg-red-500'
                      : 'bg-jugaad-yellow animate-pulse'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Room summary / Pitch */}
      <div
        className={`rounded-2xl text-white p-4 md:p-5 mb-4 ${
          isExternal
            ? 'bg-gradient-to-br from-jugaad-yellow/20 via-jugaad-near-black to-jugaad-near-black border border-jugaad-yellow/30'
            : 'bg-jugaad-near-black'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {isExternal ? (
            <>
              <Bus size={14} className="text-jugaad-yellow" />
              <span className="text-xs font-semibold text-jugaad-yellow uppercase tracking-wider">
                Cross-Campus Pitch · Desperate Mode
              </span>
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-jugaad-pink" />
              <span className="text-xs font-semibold text-jugaad-gray uppercase tracking-wider">
                Your Pitch
              </span>
            </>
          )}
        </div>
        <p className="text-sm md:text-base leading-relaxed">
          {isExternal ? (
            <>
              "Hear me out. I know this sounds insane, but we move the keynote to{' '}
              <span className="text-jugaad-yellow font-bold">{selectedRoom.name}</span> at{' '}
              <span className="text-jugaad-pink font-bold">{selectedRoom.college}</span>. It fits{' '}
              <span className="text-jugaad-yellow font-bold">{selectedRoom.capacity} people</span>,
              has full tech, and the speaker gets more time to prep during transit. Yes, we need
              buses. Yes, it's far ({selectedRoom.distance}). But it's either this or we cancel the
              keynote. Trust me."
            </>
          ) : (
            <>
              "Listen up, the main auditorium is toast. I'm proposing we move the keynote to{' '}
              <span className="text-jugaad-pink font-bold">{selectedRoom.name}</span>. It fits{' '}
              <span className="text-jugaad-yellow font-bold">{selectedRoom.capacity} people</span>,
              is <span className="text-jugaad-peach font-bold">{selectedRoom.distance}</span>, and
              has{' '}
              <span className="text-jugaad-pink font-bold">
                {selectedRoom.hasProjector ? 'projector' : 'no projector'}
              </span>{' '}
              &{' '}
              <span className="text-jugaad-pink font-bold">
                {selectedRoom.hasAC ? 'AC' : 'no AC'}
              </span>
              . Trust me, it's a W."
            </>
          )}
        </p>
      </div>

      {/* POC Cards */}
      <div className="space-y-3">
        {POCS.map((poc, index) => {
          const voteData = votes.find((v) => v.pocId === poc.id);
          const vote = voteData?.vote || 'pending';
          const reaction = voteData?.reaction || '';

          const preview = computeVote(poc.id, selectedRoom);

          return (
            <motion.div
              key={poc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border-2 p-4 transition-all ${
                vote === 'yes'
                  ? 'border-green-500/30 bg-green-50/40'
                  : vote === 'no'
                  ? 'border-red-500/30 bg-red-50/40'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${poc.color}15` }}
                >
                  {poc.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-900">{poc.name}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${poc.color}15`, color: poc.color }}
                    >
                      {poc.role}
                    </span>
                    {vote !== 'pending' && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`ml-auto inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                          vote === 'yes'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {vote === 'yes' ? (
                          <>
                            <ThumbsUp size={10} fill="white" /> YES
                          </>
                        ) : (
                          <>
                            <ThumbsDown size={10} fill="white" /> NO
                          </>
                        )}
                      </motion.span>
                    )}
                    {vote === 'pending' && pitchStarted && (
                      <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-jugaad-yellow bg-jugaad-yellow/10 px-2 py-1 rounded-full">
                        <Hourglass size={10} /> thinking...
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {vote !== 'pending' && reaction ? (
                      <motion.div
                        key="reaction"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm leading-relaxed rounded-xl p-3 ${
                          vote === 'yes'
                            ? 'bg-green-50 text-gray-700'
                            : 'bg-red-50 text-gray-700'
                        }`}
                      >
                        {reaction}
                      </motion.div>
                    ) : pitchStarted ? (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-jugaad-gray italic"
                      >
                        <span className="inline-flex gap-1">
                          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
                            .
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
                            .
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
                            .
                          </span>
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-jugaad-gray italic"
                      >
                        Likely vote: {preview.vote === 'yes' ? '✅ Lean yes' : '🛑 Lean no'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-5">
        {!pitchStarted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPitch}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 ${
              isExternal
                ? 'bg-gradient-to-r from-jugaad-yellow to-jugaad-peach text-jugaad-near-black shadow-jugaad-yellow/20'
                : 'bg-gradient-to-r from-jugaad-purple to-jugaad-pink shadow-jugaad-purple/20'
            }`}
          >
            <Sparkles size={16} />
            {isExternal ? 'Pitch the Desperate Jugaad' : 'Pitch the Jugaad to the Panel'}
          </motion.button>
        ) : allVoted ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 text-sm font-semibold">
              <span className="text-green-600 flex items-center gap-1">
                <ThumbsUp size={14} /> {summary.yesCount} Yes
              </span>
              <span className="text-red-500 flex items-center gap-1">
                <ThumbsDown size={14} /> {summary.noCount} No
              </span>
            </div>

            {canDeploy ? (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDeploy}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white font-bold text-base shadow-xl shadow-jugaad-pink/30 flex items-center justify-center gap-2 animate-glow"
              >
                Deploy Broadcast 🚀
              </motion.button>
            ) : (
              <div className="text-center py-4 px-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm font-bold text-red-600">
                  Big L. The panel rejected your jugaad.
                </p>
                <p className="text-xs text-jugaad-gray mt-1">
                  Try a different room — the ripple effect is brutal out here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-3 text-sm text-jugaad-gray font-medium">
            <span className="inline-flex items-center gap-2">
              <Hourglass size={14} className="animate-spin" />
              POCs are deliberating...
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
