import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Radio, LogOut, UserCircle } from 'lucide-react';
import type { GamePhase, RoomStats, POCVote, SessionUser, CrisisReason, BhasadLevel } from '@/types';
import { ROOMS, POCS, computeVote, getVoteSummary, getRandomCrisis, EXTERNAL_COLLEGES, getCustomPocReaction, buildForumSeed } from '@/gameData';
import DashboardStats from '@/components/DashboardStats';
import CrisisAlertCard from '@/components/CrisisAlertCard';
import UMSRoomGrid from '@/components/UMSRoomGrid';
import VotingPanel from '@/components/VotingPanel';
import ResolutionModal from '@/components/ResolutionModal';
import SocietyLogin from '@/components/SocietyLogin';
import KaleshForum from '@/components/KaleshForum';
import CCTVFeedModal from '@/components/CCTVFeedModal';
import type { KaleshForumItem } from '@/types';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);

  return (
    <AnimatePresence mode="wait">
      {user ? (
        <RippleDashboard key="dashboard" user={user} onLogout={() => setUser(null)} />
      ) : (
        <motion.div key="login" exit={{ opacity: 0, scale: 1.02 }}>
          <SocietyLogin onAuthenticated={(u) => setUser(u)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface RippleDashboardProps {
  user: SessionUser;
  onLogout: () => void;
}

function RippleDashboard({ user, onLogout }: RippleDashboardProps) {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [eventHealth, setEventHealth] = useState(95);
  const [volunteerMorale, setVolunteerMorale] = useState(88);
  const [speakerPatience, setSpeakerPatience] = useState(90);
  const [selectedRoom, setSelectedRoom] = useState<RoomStats | null>(null);
  const [votes, setVotes] = useState<POCVote[]>([]);
  const [pitchStarted, setPitchStarted] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'fail' | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const patienceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Crisis state
  const [currentCrisis, setCurrentCrisis] = useState<CrisisReason | null>(null);

  // Cross-campus state
  const [collegeInput, setCollegeInput] = useState('');
  const [externalRooms, setExternalRooms] = useState<RoomStats[]>([]);

  // CCTV modal state
  const [cctvRoom, setCctvRoom] = useState<RoomStats | null>(null);

  // Kalesh Forum state
  const [forumItems, setForumItems] = useState<KaleshForumItem[]>(() => buildForumSeed());
  const [isCustomCrisis, setIsCustomCrisis] = useState(false);

  // Trigger initial crisis after load
  useEffect(() => {
    if (phase === 'idle') {
      const timer = setTimeout(() => {
        const crisis = getRandomCrisis();
        setCurrentCrisis(crisis);
        setPhase('crisis');
        setEventHealth(55);
        setVolunteerMorale(42);
        setSpeakerPatience(60);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Speaker patience countdown
  useEffect(() => {
    if (phase === 'crisis' || phase === 'room-selection' || phase === 'voting' || phase === 'broadcast') {
      patienceTimerRef.current = setInterval(() => {
        setSpeakerPatience((prev) => {
          if (prev <= 0) {
            if (patienceTimerRef.current) clearInterval(patienceTimerRef.current);
            setPhase('failed');
            setModalType('fail');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (patienceTimerRef.current) clearInterval(patienceTimerRef.current);
      };
    }
  }, [phase]);

  // Morale slowly drops during crisis
  useEffect(() => {
    if (phase === 'crisis' || phase === 'room-selection' || phase === 'voting') {
      const timer = setInterval(() => {
        setVolunteerMorale((prev) => Math.max(15, prev - 0.5));
        setEventHealth((prev) => Math.max(20, prev - 0.3));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // Cleanup on terminal states
  useEffect(() => {
    if (phase === 'success' || phase === 'failed') {
      if (patienceTimerRef.current) clearInterval(patienceTimerRef.current);
    }
  }, [phase]);

  // Filter external rooms based on college input
  useEffect(() => {
    const trimmed = collegeInput.trim().toLowerCase();
    if (trimmed.length < 2) {
      setExternalRooms([]);
      return;
    }
    const matched = Object.keys(EXTERNAL_COLLEGES).find(
      (college) =>
        college.toLowerCase() === trimmed ||
        college.toLowerCase().includes(trimmed) ||
        trimmed.includes(college.toLowerCase())
    );
    if (matched) {
      setExternalRooms(EXTERNAL_COLLEGES[matched]);
    } else {
      setExternalRooms([]);
    }
  }, [collegeInput]);

  const triggerRipple = useCallback((x: number, y: number, color: string = '#FD5DC9') => {
    const id = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1500);
  }, []);

  const handleCrisisSelected = useCallback(
    (crisis: CrisisReason) => {
      setCurrentCrisis(crisis);
      setIsCustomCrisis(false);
      setPhase('crisis');
      setEventHealth(55);
      setVolunteerMorale(42);
      setSpeakerPatience(60);
      setSelectedRoom(null);
      setVotes([]);
      setPitchStarted(false);
      triggerRipple(window.innerWidth / 2, window.innerHeight / 3, '#5B4BB1');
    },
    [triggerRipple]
  );

  const handleRerollCrisis = useCallback(() => {
    const newCrisis = getRandomCrisis(currentCrisis?.id);
    setCurrentCrisis(newCrisis);
    setIsCustomCrisis(false);
    triggerRipple(window.innerWidth / 2, window.innerHeight / 3, '#FD5DC9');
  }, [currentCrisis, triggerRipple]);

  const handleCustomKaleshSubmit = useCallback(
    (text: string, bhasadLevel: BhasadLevel) => {
      const customId = `custom-${Date.now()}`;
      const emoji = bhasadLevel === 'code-red' ? '🔴' : bhasadLevel === 'medium' ? '🟡' : '🟢';
      const desc =
        bhasadLevel === 'code-red'
          ? 'CODE RED crisis triggered by the committee. The Dean is involved. The ripple effect begins...'
          : bhasadLevel === 'medium'
          ? 'Medium bhasad triggered. Fixable but urgent. The ripple effect begins...'
          : 'Minor inconvenience reported. The ripple effect begins...';

      const customCrisis: CrisisReason = {
        id: customId,
        title: text,
        description: desc,
        emoji,
        severity: bhasadLevel,
      };

      const forumItem: KaleshForumItem = {
        id: customId,
        title: text,
        description: `Submitted by ${user.por}`,
        emoji,
        severity: bhasadLevel,
        isCustom: true,
        upvotes: 1,
        author: `@${user.por.toLowerCase().replace(/\s+/g, '_')}`,
        createdAt: Date.now(),
      };

      setForumItems((prev) => [forumItem, ...prev]);
      setCurrentCrisis(customCrisis);
      setIsCustomCrisis(true);
      setPhase('crisis');
      // Severity impacts initial damage
      const healthDrop = bhasadLevel === 'code-red' ? 40 : bhasadLevel === 'medium' ? 50 : 65;
      const moraleDrop = bhasadLevel === 'code-red' ? 30 : bhasadLevel === 'medium' ? 38 : 60;
      const patienceDrop = bhasadLevel === 'code-red' ? 45 : bhasadLevel === 'medium' ? 55 : 75;
      setEventHealth(healthDrop);
      setVolunteerMorale(moraleDrop);
      setSpeakerPatience(patienceDrop);
      setSelectedRoom(null);
      setVotes([]);
      setPitchStarted(false);
      triggerRipple(window.innerWidth / 2, window.innerHeight / 3, '#FD5DC9');
    },
    [triggerRipple, user.por]
  );

  const handleUpvote = useCallback((id: string) => {
    setForumItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
      )
    );
  }, []);

  const handleAcknowledge = useCallback(() => {
    setPhase('room-selection');
    triggerRipple(window.innerWidth / 2, window.innerHeight / 3, '#5B4BB1');
  }, [triggerRipple]);

  const handleRoomSelect = useCallback(
    (room: RoomStats) => {
      setSelectedRoom(room);
      setVotes([]);
      setPitchStarted(false);

      // Cross-campus selection drops Event Health but saves Speaker Patience
      if (room.isExternal) {
        setEventHealth((prev) => Math.max(15, prev - 25));
        setSpeakerPatience((prev) => Math.min(90, prev + 15));
        triggerRipple(window.innerWidth / 2, window.innerHeight / 2, '#FBB328');
      } else {
        triggerRipple(window.innerWidth / 2, window.innerHeight / 2, '#5B4BB1');
      }
    },
    [triggerRipple]
  );

  const handlePitch = useCallback(() => {
    if (!selectedRoom) return;
    setPitchStarted(true);
    setVotes([]);
    triggerRipple(window.innerWidth / 2, window.innerHeight / 2, '#FD5DC9');

    POCS.forEach((poc, index) => {
      setTimeout(() => {
        // Use custom POC reactions for custom crises, room-based votes otherwise
        const result = isCustomCrisis
          ? getCustomPocReaction(poc.id, user.por, currentCrisis?.severity)
          : computeVote(poc.id, selectedRoom);
        setVotes((prev) => [
          ...prev,
          {
            pocId: poc.id,
            vote: result.vote,
            reaction: result.reaction,
          },
        ]);

        triggerRipple(
          window.innerWidth / 2,
          window.innerHeight / 2 + index * 50,
          result.vote === 'yes' ? '#5B4BB1' : '#FD5DC9'
        );
      }, 1200 * (index + 1));
    });

    setPhase('voting');
  }, [selectedRoom, triggerRipple, isCustomCrisis, user.por, currentCrisis?.severity]);

  const handleDeploy = useCallback(() => {
    setPhase('broadcast');
    triggerRipple(window.innerWidth / 2, window.innerHeight / 2, '#FD5DC9');

    setTimeout(() => {
      setEventHealth(100);
      setVolunteerMorale(100);
      setSpeakerPatience(100);
      setPhase('success');
      setModalType('success');
    }, 1500);
  }, [triggerRipple]);

  const handleReset = useCallback(() => {
    if (patienceTimerRef.current) clearInterval(patienceTimerRef.current);
    setPhase('idle');
    setEventHealth(95);
    setVolunteerMorale(88);
    setSpeakerPatience(90);
    setSelectedRoom(null);
    setVotes([]);
    setPitchStarted(false);
    setModalType(null);
    setCurrentCrisis(null);
    setIsCustomCrisis(false);
    setCollegeInput('');
    setExternalRooms([]);
    setForumItems(buildForumSeed());
  }, []);

  const handleModalClose = useCallback(() => {
    setModalType(null);
  }, []);

  const handleCheckCCTV = useCallback(
    (room: RoomStats) => {
      setCctvRoom(room);
      triggerRipple(window.innerWidth / 2, window.innerHeight / 2, '#5B4BB1');
    },
    [triggerRipple]
  );

  const currentSummary = getVoteSummary(votes);
  const allVoted =
    pitchStarted && votes.length === POCS.length && votes.every((v) => v.vote !== 'pending');

  const phaseLabel = useMemo(() => {
    switch (phase) {
      case 'idle': return 'Standby';
      case 'crisis': return 'Kalesh Alert';
      case 'room-selection': return 'Finding Rooms';
      case 'voting': return 'Voting in Progress';
      case 'broadcast': return 'Broadcasting';
      case 'success': return 'Resolved';
      case 'failed': return 'Failed';
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-jugaad-off-white relative overflow-x-hidden"
    >
      {/* Background decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-jugaad-purple/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-jugaad-pink/5 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 rounded-full bg-jugaad-yellow/5 blur-3xl" />
      </div>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed pointer-events-none z-40 rounded-full"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
              backgroundColor: ripple.color,
              filter: 'blur(2px)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* CCTV Modal */}
      <CCTVFeedModal room={cctvRoom} onClose={() => setCctvRoom(null)} />

      {/* Resolution Modal */}
      <ResolutionModal type={modalType} onClose={handleModalClose} onReset={handleReset} />

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-jugaad-purple to-jugaad-pink flex items-center justify-center shadow-lg shadow-jugaad-purple/20">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  <span className="text-gradient">Jugaad.io</span>
                </h1>
                <p className="text-[10px] md:text-xs text-jugaad-gray font-medium tracking-wide">
                  CONTROL ROOM ACTIVE · WELCOME, {user.name.toUpperCase()} · {user.por.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  phase === 'idle'
                    ? 'bg-gray-100 text-gray-500'
                    : phase === 'crisis'
                    ? 'bg-red-50 text-red-500'
                    : phase === 'success'
                    ? 'bg-green-50 text-green-600'
                    : phase === 'failed'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-jugaad-purple/10 text-jugaad-purple'
                }`}
              >
                <Activity size={11} className={phase !== 'idle' ? 'animate-pulse' : ''} />
                {phaseLabel}
              </span>

              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-jugaad-purple bg-jugaad-purple/10 px-3 py-1.5 rounded-full">
                <UserCircle size={12} />
                {user.por}
              </span>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 text-xs font-semibold text-jugaad-gray bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <LogOut size={12} />
                Exit
              </button>
            </div>
          </div>
        </motion.header>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5"
        >
          <DashboardStats
            eventHealth={eventHealth}
            volunteerMorale={volunteerMorale}
            speakerPatience={speakerPatience}
            phase={phase}
          />
        </motion.div>

        {/* Idle state */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-jugaad-purple to-jugaad-pink flex items-center justify-center shadow-xl shadow-jugaad-purple/20 mb-5"
              >
                <Radio size={36} className="text-white" />
              </motion.div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                All systems stable.
              </h2>
              <p className="text-sm text-jugaad-gray max-w-sm">
                The fest is running smoothly... for now. Something's about to go down. Stay ready.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-jugaad-purple animate-pulse" />
                <span className="text-xs text-jugaad-gray font-medium">
                  Waiting for the kalesh...
                </span>
              </div>

              {/* Kalesh Forum available in idle */}
              <div className="mt-8 w-full max-w-2xl">
                <KaleshForum
                  visible={true}
                  forumItems={forumItems}
                  onTriggerCrisis={handleCrisisSelected}
                  onCustomSubmit={handleCustomKaleshSubmit}
                  onUpvote={handleUpvote}
                  currentCrisisId={currentCrisis?.id ?? null}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kalesh Forum (visible during crisis for rerolling/triggering) */}
        <AnimatePresence>
          {phase === 'crisis' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5"
            >
              <KaleshForum
                visible={true}
                forumItems={forumItems}
                onTriggerCrisis={handleCrisisSelected}
                onCustomSubmit={handleCustomKaleshSubmit}
                onUpvote={handleUpvote}
                currentCrisisId={currentCrisis?.id ?? null}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crisis Alert */}
        <div className="mb-5">
          <CrisisAlertCard
            visible={phase === 'crisis'}
            crisis={currentCrisis}
            onAcknowledge={handleAcknowledge}
            onReroll={handleRerollCrisis}
          />
        </div>

        {/* UMS Room Grid */}
        <div className="mb-5">
          <UMSRoomGrid
            rooms={ROOMS}
            selectedRoom={selectedRoom}
            onSelect={handleRoomSelect}
            visible={phase === 'room-selection' || phase === 'voting' || phase === 'broadcast'}
            externalRooms={externalRooms}
            collegeInput={collegeInput}
            onCollegeInputChange={setCollegeInput}
            onCheckCCTV={handleCheckCCTV}
          />
        </div>

        {/* Voting Panel */}
        <div className="mb-5">
          <VotingPanel
            visible={
              (phase === 'room-selection' || phase === 'voting' || phase === 'broadcast') &&
              selectedRoom !== null
            }
            selectedRoom={selectedRoom}
            votes={votes}
            onPitch={handlePitch}
            onDeploy={handleDeploy}
            pitchStarted={pitchStarted}
          />
        </div>

        {/* Live action log */}
        <AnimatePresence>
          {(phase === 'voting' || phase === 'broadcast') && allVoted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-gray-200 bg-white p-4"
            >
              <p className="text-xs font-semibold text-jugaad-gray uppercase tracking-wider mb-2">
                Live Status
              </p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500 font-bold">{currentSummary.yesCount}</span>
                  <span className="text-jugaad-gray text-xs">Yes</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <span className="text-red-500 font-bold">{currentSummary.noCount}</span>
                  <span className="text-jugaad-gray text-xs">No</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <span
                  className={`text-xs font-bold ${
                    currentSummary.passed ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {currentSummary.passed
                    ? '→ Consensus reached. Deploy ready.'
                    : '→ No consensus. Choose another room.'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-jugaad-gray">
            Jugaad.io · The Ripple Effect · A simulation of collective crisis resolution at NSUT
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
