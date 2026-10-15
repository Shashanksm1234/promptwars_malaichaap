import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Monitor,
  Snowflake,
  Check,
  Lock,
  Clock,
  Video,
  Building2,
  Search,
  AlertTriangle,
  Bus,
} from 'lucide-react';
import type { RoomStats } from '@/types';

interface UMSRoomGridProps {
  rooms: RoomStats[];
  selectedRoom: RoomStats | null;
  onSelect: (room: RoomStats) => void;
  visible: boolean;
  externalRooms: RoomStats[];
  collegeInput: string;
  onCollegeInputChange: (value: string) => void;
  onCheckCCTV: (room: RoomStats) => void;
}

export default function UMSRoomGrid({
  rooms,
  selectedRoom,
  onSelect,
  visible,
  externalRooms,
  collegeInput,
  onCollegeInputChange,
  onCheckCCTV,
}: UMSRoomGridProps) {
  const [showExternal, setShowExternal] = useState(false);

  const allRooms = [...rooms, ...externalRooms];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                UMS: Room Finder
              </h3>
              <p className="text-sm text-jugaad-gray">
                Pick a backup room. Each choice has consequences. Choose wisely.
              </p>
            </div>
            <span className="text-xs font-semibold text-jugaad-purple bg-jugaad-purple/10 px-3 py-1.5 rounded-full hidden md:block">
              NSUT Campus Network
            </span>
          </div>

          {/* Room grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {allRooms.map((room, index) => {
              const isSelected = selectedRoom?.id === room.id;
              const isOccupied = room.status === 'occupied';
              const isSmall = room.status === 'available-small';
              const isExternal = room.isExternal;

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={!isOccupied ? { scale: 1.02, y: -2 } : undefined}
                  className={`relative rounded-2xl p-4 md:p-5 border-2 transition-all overflow-hidden ${
                    isSelected
                      ? 'border-jugaad-pink bg-jugaad-pink/5 shadow-lg shadow-jugaad-pink/15'
                      : isOccupied
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : isExternal
                      ? 'border-jugaad-yellow/30 bg-jugaad-yellow/5 hover:border-jugaad-yellow/50 hover:shadow-md'
                      : 'border-gray-200 bg-white hover:border-jugaad-purple/40 hover:shadow-md'
                  }`}
                >
                  {/* External badge */}
                  {isExternal && (
                    <div className="mb-2 flex items-center gap-1 text-[10px] font-bold text-jugaad-yellow bg-jugaad-yellow/15 px-2 py-0.5 rounded-full w-fit">
                      <Bus size={10} />
                      CROSS-CAMPUS · {room.college}
                    </div>
                  )}

                  {/* Status badge */}
                  {!isExternal && (
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isOccupied
                            ? 'bg-gray-200 text-gray-500'
                            : isSmall
                            ? 'bg-jugaad-yellow/15 text-jugaad-yellow'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {isOccupied && <Lock size={10} />}
                        {!isOccupied && isSmall && <Clock size={10} />}
                        {!isOccupied && !isSmall && <Check size={10} />}
                        {room.statusLabel}
                      </span>
                    </div>
                  )}

                  {isExternal && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-600">
                        <Check size={10} />
                        {room.statusLabel}
                      </span>
                    </div>
                  )}

                  <h4 className="font-bold text-sm md:text-base text-gray-900 mb-0.5 leading-tight">
                    {room.name}
                  </h4>
                  <p className="text-xs text-jugaad-gray mb-3 flex items-center gap-1">
                    <MapPin size={11} /> {room.building}
                  </p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <Users size={13} className="mx-auto text-jugaad-purple mb-0.5" />
                      <p className="text-xs font-bold text-gray-700">{room.capacity}</p>
                      <p className="text-[10px] text-jugaad-gray">cap</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <MapPin size={13} className="mx-auto text-jugaad-pink mb-0.5" />
                      <p className="text-[10px] font-bold text-gray-700 leading-tight">
                        {isExternal
                          ? room.distance.split('(')[0].trim()
                          : room.distance.split('(')[0].trim()}
                      </p>
                      <p className="text-[10px] text-jugaad-gray">
                        {room.distance.match(/\(([^)]+)\)/)?.[1] || ''}
                      </p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="flex justify-center gap-0.5 mb-0.5">
                        <Monitor
                          size={11}
                          className={room.hasProjector ? 'text-jugaad-purple' : 'text-gray-300'}
                        />
                        <Snowflake
                          size={11}
                          className={room.hasAC ? 'text-jugaad-pink' : 'text-gray-300'}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-gray-700">
                        {room.hasProjector && room.hasAC
                          ? 'Full'
                          : room.hasProjector || room.hasAC
                          ? 'Partial'
                          : 'None'}
                      </p>
                      <p className="text-[10px] text-jugaad-gray">tech</p>
                    </div>
                  </div>

                  <p className="text-xs text-jugaad-gray leading-relaxed mb-3">
                    {room.description}
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => !isOccupied && onSelect(room)}
                      disabled={isOccupied}
                      className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-jugaad-purple to-jugaad-pink text-white'
                          : isOccupied
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check size={12} strokeWidth={3} /> Selected
                        </span>
                      ) : isOccupied ? (
                        'Unavailable'
                      ) : (
                        'Select Room'
                      )}
                    </button>
                    <button
                      onClick={() => onCheckCCTV(room)}
                      className="flex-shrink-0 text-xs font-bold py-2 px-3 rounded-lg bg-jugaad-near-black text-white hover:bg-jugaad-purple transition-colors flex items-center gap-1"
                    >
                      <Video size={12} />
                      CCTV
                    </button>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r from-jugaad-purple to-jugaad-pink flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Desperate Times / Cross-Campus section */}
          <div className="mt-5">
            <button
              onClick={() => setShowExternal(!showExternal)}
              className="w-full flex items-center justify-between rounded-xl bg-jugaad-near-black text-white px-4 py-3 hover:bg-jugaad-purple transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span className="text-sm font-bold">Desperate Times: Other Colleges</span>
              </div>
              <span className="text-xs text-white/60">
                {showExternal ? '▲ Hide' : '▼ Expand'}
              </span>
            </button>

            <AnimatePresence>
              {showExternal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-xl border-2 border-jugaad-yellow/20 bg-jugaad-yellow/5 p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle size={16} className="text-jugaad-yellow flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-bold">Warning:</span> Selecting a cross-campus venue
                        will drastically drop <span className="text-red-500 font-bold">Event Health</span> due
                        to travel logistics, but it preserves <span className="text-green-600 font-bold">Speaker Patience</span> by
                        giving you more time. The POCs will NOT be happy about buses.
                      </p>
                    </div>

                    {/* College input */}
                    <div className="relative mb-3">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-jugaad-gray"
                      />
                      <input
                        type="text"
                        value={collegeInput}
                        onChange={(e) => onCollegeInputChange(e.target.value)}
                        placeholder="Type a neighboring college (DTU, IIIT-Delhi, IIT-D, IGDTUW)..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-jugaad-gray focus:outline-none focus:border-jugaad-purple/40 focus:ring-2 focus:ring-jugaad-purple/10 transition-all"
                      />
                    </div>

                    {externalRooms.length > 0 && (
                      <p className="text-xs text-green-600 font-semibold mb-2">
                        ✓ Venues at {externalRooms[0].college} unlocked below!
                      </p>
                    )}

                    {collegeInput &&
                      externalRooms.length === 0 &&
                      collegeInput.trim().length > 1 && (
                        <p className="text-xs text-jugaad-gray italic">
                          No venues found for "{collegeInput}". Try: DTU, IIIT-Delhi, IIT-D, or
                          IGDTUW.
                        </p>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected room summary */}
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 ${
                selectedRoom.isExternal
                  ? 'bg-gradient-to-r from-jugaad-yellow/10 to-jugaad-peach/10 border-jugaad-yellow/30'
                  : 'bg-gradient-to-r from-jugaad-purple/10 to-jugaad-pink/10 border-jugaad-purple/20'
              }`}
            >
              <div>
                <p className="text-xs text-jugaad-gray font-medium">
                  {selectedRoom.isExternal ? 'Cross-Campus Selection' : 'Selected Room'}
                </p>
                <p
                  className={`text-sm font-bold ${
                    selectedRoom.isExternal ? 'text-jugaad-yellow' : 'text-jugaad-purple'
                  }`}
                >
                  {selectedRoom.name}
                </p>
              </div>
              <span className="text-xs font-semibold text-jugaad-pink bg-white px-3 py-1.5 rounded-full">
                Ready to pitch →
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
