import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, AlertCircle, Users, Moon, Camera } from 'lucide-react';
import type { RoomStats } from '@/types';

interface CCTVFeedModalProps {
  room: RoomStats | null;
  onClose: () => void;
}

interface CCTVSnapshot {
  hasSleepers: boolean;
  actualStatus: 'available' | 'occupied';
}

function useCCTVTimestamp() {
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const time = now.toLocaleTimeString('en-IN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTimestamp(`${date} ${time}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return timestamp;
}

function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)',
      }}
    />
  );
}

function CCTVScene({ room, snapshot }: { room: RoomStats; snapshot: CCTVSnapshot }) {
  const isOccupied = snapshot.actualStatus === 'occupied';
  const hasSleepers = snapshot.hasSleepers;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0a1a0a]">
      {/* Grainy green tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-green-950/10 to-black/40" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,20,0,0.6) 100%)',
        }}
      />

      {/* Room scene */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
        style={{ filter: 'grayscale(0.3) contrast(1.2) brightness(0.7) sepia(0.3) hue-rotate(60deg)' }}
      >
        {/* Mock room layout with CSS */}
        <div className="relative w-[85%] h-[70%] rounded-lg border-2 border-green-800/40 bg-green-950/20">
          {/* Front wall / projector area */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-3 rounded-sm bg-green-800/30" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-green-600/60 font-mono">
            PROJECTOR AREA
          </div>

          {/* Seats grid */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pt-8">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex gap-3">
                {[0, 1, 2, 3, 4, 5].map((col) => (
                  <div
                    key={col}
                    className={`w-5 h-5 rounded-sm ${
                      isOccupied || (hasSleepers && row >= 2)
                        ? 'bg-green-700/50'
                        : 'bg-green-900/30 border border-green-800/20'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Label for what's happening */}
          <div className="absolute bottom-2 left-2 text-[9px] text-green-500/50 font-mono">
            {room.building}
          </div>
        </div>

        {/* Status text */}
        <div className="mt-4 text-center">
          {isOccupied ? (
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-mono">
              <Users size={12} />
              <span>OCCUPIED · CLASS IN SESSION · ~45 STUDENTS</span>
            </div>
          ) : hasSleepers ? (
            <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-mono">
              <Moon size={12} />
              <span>AVAILABLE BUT... 3 STUDENTS SLEEPING IN BACK ROW</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-mono">
              <span>CONFIRMED EMPTY · READY FOR USE</span>
            </div>
          )}
        </div>
      </div>

      {/* Scanlines */}
      <ScanlineOverlay />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 80px 20px rgba(0,0,0,0.7)',
        }}
      />
    </div>
  );
}

export default function CCTVFeedModal({ room, onClose }: CCTVFeedModalProps) {
  const timestamp = useCCTVTimestamp();
  const [snapshot, setSnapshot] = useState<CCTVSnapshot | null>(null);
  const [clearingRoom, setClearingRoom] = useState(false);
  const [cleared, setCleared] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate CCTV snapshot when room changes
  useEffect(() => {
    if (!room) {
      setSnapshot(null);
      setCleared(false);
      setClearingRoom(false);
      return;
    }

    const isOccupied = room.status === 'occupied';
    // 10% easter egg chance for sleepers in available rooms
    const sleeperChance = Math.random() < 0.1;

    setSnapshot({
      hasSleepers: !isOccupied && sleeperChance,
      actualStatus: isOccupied ? 'occupied' : 'available',
    });
    setCleared(false);
    setClearingRoom(false);
  }, [room]);

  if (!room || !snapshot) return null;

  const handleClearRoom = () => {
    setClearingRoom(true);
    setTimeout(() => {
      setClearingRoom(false);
      setCleared(true);
      setSnapshot((prev) => (prev ? { ...prev, hasSleepers: false } : prev));
    }, 2000);
  };

  return (
    <AnimatePresence>
      {room && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-[#040404] shadow-2xl border border-white/10"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/10">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-jugaad-pink" />
                <span className="text-xs font-mono text-white/70">
                  CAM_{room.id.toUpperCase()} · LIVE FEED
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* REC dot */}
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                  <span className="text-[10px] font-mono font-bold text-red-500">REC</span>
                </div>
                {/* Timestamp */}
                <span className="text-[10px] font-mono text-green-400 tabular-nums">
                  {timestamp}
                </span>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="ml-2 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Feed area */}
            <div className="relative aspect-video bg-[#040404]">
              <CCTVScene room={room} snapshot={snapshot} />

              {/* Feed overlay info */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-green-400/80 bg-black/40 px-2 py-0.5 rounded">
                  {room.name}
                </span>
                <span className="text-[10px] font-mono text-green-400/60 bg-black/40 px-2 py-0.5 rounded">
                  UMS STATUS: {room.statusLabel.toUpperCase()}
                </span>
              </div>

              {/* Camera label */}
              <div className="absolute top-3 right-3 z-20">
                <span className="text-[10px] font-mono text-white/40 bg-black/40 px-2 py-0.5 rounded">
                  NSUT-CCTV-NETWORK
                </span>
              </div>

              {/* Hidden canvas ref for potential future frame capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Footer / Action area */}
            <div className="px-4 py-3 bg-[#0a0a0a] border-t border-white/10">
              {snapshot.actualStatus === 'occupied' ? (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-white/70">
                    Camera confirms: room is occupied. Move on to another option.
                  </span>
                </div>
              ) : snapshot.hasSleepers && !cleared ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Moon size={16} className="text-yellow-400" />
                    <span className="text-white/70">
                      Easter egg! UMS says available, but CCTV shows 3 students sleeping in the back
                      row. Clear them out?
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearRoom}
                    disabled={clearingRoom}
                    className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white disabled:opacity-50"
                  >
                    {clearingRoom ? 'Sending volunteers...' : 'Send Volunteers 🧹'}
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Video size={16} className="text-green-500" />
                  <span className="text-white/70">
                    {cleared
                      ? 'Room cleared! Sleepers have been politely (forcefully) removed. Good to go.'
                      : 'Camera confirms: room is empty and ready for use. Lock it in.'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
