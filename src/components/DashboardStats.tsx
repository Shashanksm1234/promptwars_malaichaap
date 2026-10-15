import { motion } from 'framer-motion';
import { Heart, Users, Clock } from 'lucide-react';
import type { HealthStatus } from '@/types';

interface DashboardStatsProps {
  eventHealth: number;
  volunteerMorale: number;
  speakerPatience: number;
  phase: string;
}

function getStatus(value: number): HealthStatus {
  if (value > 60) return 'healthy';
  if (value > 30) return 'warning';
  return 'critical';
}

function getBarColor(status: HealthStatus): string {
  switch (status) {
    case 'healthy':
      return 'from-jugaad-purple to-jugaad-pink';
    case 'warning':
      return 'from-jugaad-yellow to-jugaad-peach';
    case 'critical':
      return 'from-red-500 to-red-600';
  }
}

function getEmoji(value: number, type: 'health' | 'morale' | 'patience'): string {
  if (type === 'patience') {
    if (value > 60) return '😌';
    if (value > 30) return '😒';
    if (value > 10) return '😤';
    return '🤬';
  }
  if (value > 60) return '💪';
  if (value > 30) return '💀';
  return '😭';
}

function StatBar({
  label,
  value,
  icon,
  type,
  subtitle,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  type: 'health' | 'morale' | 'patience';
  subtitle: string;
}) {
  const status = getStatus(value);
  const barColor = getBarColor(status);
  const emoji = getEmoji(value, type);
  const isPatience = type === 'patience';
  const isLow = value <= 30;

  return (
    <div
      className={`flex-1 rounded-2xl p-4 md:p-5 border transition-colors ${
        status === 'critical'
          ? 'border-red-500/30 bg-red-50/50'
          : status === 'warning'
          ? 'border-jugaad-yellow/40 bg-jugaad-yellow/5'
          : 'border-jugaad-purple/20 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={status === 'critical' ? 'text-red-500' : 'text-jugaad-purple'}>
            {icon}
          </span>
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <span className="text-lg leading-none">{emoji}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span
          className={`text-2xl md:text-3xl font-bold tabular-nums ${
            status === 'critical'
              ? 'text-red-600'
              : status === 'warning'
              ? 'text-jugaad-yellow'
              : 'text-jugaad-purple'
          }`}
        >
          {isPatience ? `${value}s` : `${value}%`}
        </span>
        <span className="text-xs text-jugaad-gray font-medium">{subtitle}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} ${
            isLow && isPatience ? 'animate-pulse' : ''
          }`}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

export default function DashboardStats({
  eventHealth,
  volunteerMorale,
  speakerPatience,
  phase,
}: DashboardStatsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      <StatBar
        label="Event Health"
        value={eventHealth}
        icon={<Heart size={18} fill="currentColor" />}
        type="health"
        subtitle="Overall stability"
      />
      <StatBar
        label="Volunteer Morale"
        value={volunteerMorale}
        icon={<Users size={18} />}
        type="morale"
        subtitle="Team energy"
      />
      <StatBar
        label="Speaker Patience"
        value={speakerPatience}
        icon={<Clock size={18} />}
        type="patience"
        subtitle={phase === 'idle' ? 'Standby' : 'Countdown active'}
      />
    </div>
  );
}
