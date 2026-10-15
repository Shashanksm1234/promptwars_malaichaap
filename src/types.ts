export type GamePhase =
  | 'idle'
  | 'crisis'
  | 'room-selection'
  | 'voting'
  | 'broadcast'
  | 'success'
  | 'failed';

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface RoomStats {
  id: string;
  name: string;
  building: string;
  capacity: number;
  distance: string;
  hasProjector: boolean;
  hasAC: boolean;
  status: 'available' | 'occupied' | 'available-small';
  statusLabel: string;
  description: string;
  isExternal?: boolean;
  college?: string;
}

export interface POC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

export type VoteValue = 'yes' | 'no' | 'pending';

export interface POCVote {
  pocId: string;
  vote: VoteValue;
  reaction: string;
}

export interface GameState {
  phase: GamePhase;
  eventHealth: number;
  volunteerMorale: number;
  speakerPatience: number;
  selectedRoom: RoomStats | null;
  votes: POCVote[];
  patienceIntervalId: number | null;
}

export type POR =
  | 'Volunteer'
  | 'ExeCom'
  | 'PR & Outreach'
  | 'Event Lead'
  | 'Tech Head'
  | 'Logistics Head'
  | 'Sponsorship Lead';

export interface SessionUser {
  name: string;
  por: POR;
  accessCode: string;
  rollNumber: string;
}

export type BhasadLevel = 'normal' | 'medium' | 'code-red';

export interface CrisisReason {
  id: string;
  title: string;
  description: string;
  emoji: string;
  severity: BhasadLevel;
}

export interface CCTVState {
  hasSleepers: boolean;
  actualStatus: 'available' | 'occupied';
}

export interface KaleshForumItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  severity: BhasadLevel;
  isCustom: boolean;
  upvotes: number;
  author: string;
  createdAt: number;
}
