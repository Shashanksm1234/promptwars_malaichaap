import type { RoomStats, POC, CrisisReason, BhasadLevel, POR } from '@/types';

export const CRISIS_REASONS: CrisisReason[] = [
  {
    id: 'ac-fire',
    title: 'The AC in the Main Auditorium just caught fire.',
    description:
      'Venue is unavailable. The keynote speaker is waiting, 150+ attendees are standing in the corridor, and the fest coordinator is having a meltdown. You need to find a new room. Like, right now.',
    emoji: '🔥',
    severity: 'code-red',
  },
  {
    id: 'dean-lock',
    title: 'The Dean locked the Main Auditorium for a VIP visit.',
    description:
      'Some high-profile chief guest is doing a campus tour and the Dean sealed off the auditorium. No entry, no exceptions. 150+ attendees are stranded outside with confused faces.',
    emoji: '🔒',
    severity: 'code-red',
  },
  {
    id: 'drama-society',
    title: 'Drama Society is refusing to vacate the APJ Lecture Hall.',
    description:
      'Their play rehearsal "just needs 10 more minutes" — it\'s been 2 hours. They won\'t budge, and their director is doing method acting as a brick wall. You need another room.',
    emoji: '🎭',
    severity: 'medium',
  },
  {
    id: 'power-cut',
    title: 'Massive power cut in C-Block, and the generator is out of diesel.',
    description:
      'The entire C-Block is dark. The backup generator? Out of diesel because someone "forgot" to refill it. No power means no projector, no mics, no AC. The keynote is in 20 minutes.',
    emoji: '⚡',
    severity: 'code-red',
  },
  {
    id: 'monkeys',
    title: 'Monkeys infiltrated the Smart Classroom. Venue compromised.',
    description:
      'A troop of campus monkeys has taken over the Smart Classroom. They\'ve knocked over the projector, claimed the front row, and are NOT leaving. Animal control is "on the way" (they said that an hour ago).',
    emoji: '🐒',
    severity: 'medium',
  },
];

export const ROOMS: RoomStats[] = [
  {
    id: 'apj-101',
    name: 'APJ Lecture Hall 101',
    building: 'APJ Block',
    capacity: 120,
    distance: '450m (far)',
    hasProjector: true,
    hasAC: true,
    status: 'available',
    statusLabel: 'Available',
    description: 'Big enough, has everything. But it\'s across the campus.',
  },
  {
    id: 'smart-201',
    name: 'Smart Classroom 201',
    building: 'C-Block',
    capacity: 50,
    distance: '80m (close)',
    hasProjector: true,
    hasAC: true,
    status: 'available-small',
    statusLabel: 'Available but small',
    description: 'Right next door with full tech. But only fits 50 people.',
  },
  {
    id: 'cblock-305',
    name: 'C-Block Seminar Hall',
    building: 'C-Block',
    capacity: 80,
    distance: '120m (close)',
    hasProjector: false,
    hasAC: true,
    status: 'available-small',
    statusLabel: 'Available but small',
    description: 'Decent size and close by. No projector though.',
  },
  {
    id: 'apj-203',
    name: 'APJ Lecture Hall 203',
    building: 'APJ Block',
    capacity: 100,
    distance: '420m (far)',
    hasProjector: true,
    hasAC: false,
    status: 'occupied',
    statusLabel: 'Occupied',
    description: 'Class in session until 4 PM. Not happening.',
  },
  {
    id: 'smart-105',
    name: 'Smart Classroom 105',
    building: 'C-Block',
    capacity: 40,
    distance: '60m (close)',
    hasProjector: true,
    hasAC: false,
    status: 'available-small',
    statusLabel: 'Available but small',
    description: 'Super close, has projector. No AC and very tight squeeze.',
  },
  {
    id: 'admin-aud',
    name: 'Admin Auditorium',
    building: 'Admin Block',
    capacity: 200,
    distance: '600m (very far)',
    hasProjector: true,
    hasAC: true,
    status: 'occupied',
    statusLabel: 'Occupied',
    description: 'Booked for a conference. Locked up tight.',
  },
];

export const EXTERNAL_COLLEGES: Record<string, RoomStats[]> = {
  DTU: [
    {
      id: 'dtu-aud',
      name: 'DTU Main Auditorium',
      building: 'Delhi Technological University',
      capacity: 300,
      distance: '4.5km (cross-campus)',
      hasProjector: true,
      hasAC: true,
      status: 'available',
      statusLabel: 'Available',
      description: 'Massive auditorium with full tech. But you need buses to get 150+ people there.',
      isExternal: true,
      college: 'DTU',
    },
    {
      id: 'dtu-seminar',
      name: 'DTU Seminar Hall B',
      building: 'Delhi Technological University',
      capacity: 150,
      distance: '4.2km (cross-campus)',
      hasProjector: true,
      hasAC: true,
      status: 'available',
      statusLabel: 'Available',
      description: 'Perfect capacity, full tech. The travel logistics though...',
      isExternal: true,
      college: 'DTU',
    },
  ],
  'IIIT-Delhi': [
    {
      id: 'iiitd-aud',
      name: 'IIITD Okhla Auditorium',
      building: 'IIIT-Delhi',
      capacity: 200,
      distance: '8km (cross-campus)',
      hasProjector: true,
      hasAC: true,
      status: 'available',
      statusLabel: 'Available',
      description: 'Beautiful auditorium with everything. But 8km is... a lot.',
      isExternal: true,
      college: 'IIIT-Delhi',
    },
    {
      id: 'iiitd-lecture',
      name: 'IIITD Lecture Hall 3',
      building: 'IIIT-Delhi',
      capacity: 120,
      distance: '7.5km (cross-campus)',
      hasProjector: true,
      hasAC: true,
      status: 'available',
      statusLabel: 'Available',
      description: 'Decent size, full tech. Requires serious coordination to pull off.',
      isExternal: true,
      college: 'IIIT-Delhi',
    },
  ],
  'IIT-D': [
    {
      id: 'iitd-aud',
      name: 'IIT-D Seminar Hall',
      building: 'IIT Delhi',
      capacity: 250,
      distance: '6km (cross-campus)',
      hasProjector: true,
      hasAC: true,
      status: 'available',
      statusLabel: 'Available',
      description: 'IIT-D\'s finest. Premium venue but you need to bus everyone there.',
      isExternal: true,
      college: 'IIT-D',
    },
  ],
  IGDTUW: [
    {
      id: 'igdtuw-aud',
      name: 'IGDTUW Auditorium',
      building: 'IGDTUW',
      capacity: 180,
      distance: '5km (cross-campus)',
      hasProjector: true,
      hasAC: true,
      status: 'available',
      statusLabel: 'Available',
      description: 'Great venue with full facilities. Travel coordination will be intense.',
      isExternal: true,
      college: 'IGDTUW',
    },
  ],
};

export const POCS: POC[] = [
  {
    id: 'logistics',
    name: 'Riya',
    role: 'Logistics Head',
    avatar: '🧑‍💼',
    color: '#5B4BB1',
  },
  {
    id: 'tech',
    name: 'Karthik',
    role: 'Tech Head',
    avatar: '🧑‍💻',
    color: '#FD5DC9',
  },
  {
    id: 'sponsorship',
    name: 'Aditya',
    role: 'Sponsorship Lead',
    avatar: '🧑‍🎤',
    color: '#FBB328',
  },
];

export function computeVote(
  pocId: string,
  room: RoomStats
): { vote: 'yes' | 'no'; reaction: string } {
  const isFar = room.distance.includes('far');
  const isVeryFar = room.distance.includes('very far');
  const isCrossCampus = room.distance.includes('cross-campus');
  const isSmall = room.capacity < 80;
  const isVerySmall = room.capacity < 50;

  // Cross-campus special reactions
  if (isCrossCampus) {
    switch (pocId) {
      case 'logistics':
        return {
          vote: 'no',
          reaction: `Bro, booking buses to ${room.college} right now? Are you crazy? I'd need to arrange 4 buses, coordinate departures, handle a convoy. This is NOT happening. 🚌🛑`,
        };
      case 'tech':
        return {
          vote: 'no',
          reaction: `Setting up the speaker's deck at ${room.college}? I'd need to go there hours early, test their AV, configure their systems. I'm one person, not a squad. Hard no. 🛑`,
        };
      case 'sponsorship':
        return {
          vote: 'no',
          reaction: `Moving the event to another college entirely? The sponsors paid for NSUT branding and footfall. ${room.college} has a different audience. They'll sue. Absolutely not. 💀`,
        };
      default:
        return { vote: 'no', reaction: 'Cross-campus is too risky. No.' };
    }
  }

  switch (pocId) {
    case 'logistics':
      if (isVeryFar) {
        return {
          vote: 'no',
          reaction: 'Bro, you want me to move catering 600m? The samosas will be cold. Hard no. 🛑',
        };
      }
      if (isFar) {
        return {
          vote: 'no',
          reaction: 'Moving all the decor and catering that far? My volunteers will legit collapse. Nah. 😩',
        };
      }
      if (isVerySmall) {
        return {
          vote: 'no',
          reaction: '40 people? We have 150+ registered. Half the audience will be standing outside. L. 📉',
        };
      }
      return {
        vote: 'yes',
        reaction: 'Close enough, decent capacity. Catering can manage this. Let\'s gooo. ✅',
      };

    case 'tech':
      if (!room.hasProjector) {
        return {
          vote: 'no',
          reaction: 'Bro, how will I run the presentation on a whiteboard? The speaker has a full deck. L decision. 🛑',
        };
      }
      if (!room.hasAC && room.capacity >= 80) {
        return {
          vote: 'yes',
          reaction: 'Projector is there, no AC but we can manage with fans. Acceptable. 👍',
        };
      }
      if (isVerySmall && room.hasProjector) {
        return {
          vote: 'yes',
          reaction: 'Tech setup is fine, projector works. Size is not my problem though. ✅',
        };
      }
      return {
        vote: 'yes',
        reaction: 'Full tech stack, projector, AC. This works. Massive W. ✅',
      };

    case 'sponsorship':
      if (isVerySmall) {
        return {
          vote: 'no',
          reaction: 'Our title sponsor paid for 150+ visibility. 40 seater? They\'ll pull funding. Absolutely not. 💀',
        };
      }
      if (isSmall && !room.hasProjector) {
        return {
          vote: 'no',
          reaction: 'Small room AND no projector? The sponsor branding slides won\'t even play. Big L. 📉',
        };
      }
      if (isFar && room.capacity >= 100) {
        return {
          vote: 'yes',
          reaction: 'Far, but big enough for sponsor visibility. We can spin it as an "exclusive venue". I\'m in. ✅',
        };
      }
      if (room.capacity >= 80 && room.hasProjector) {
        return {
          vote: 'yes',
          reaction: 'Good capacity, branding can play. Sponsors will be happy. Full send. ✅',
        };
      }
      return {
        vote: 'no',
        reaction: 'Not enough audience reach for our sponsors. Can\'t justify this to the title sponsor. Nah. 🛑',
      };

    default:
      return { vote: 'no', reaction: 'Something\'s off. No.' };
  }
}

export function getVoteSummary(votes: { vote: string }[]): {
  yesCount: number;
  noCount: number;
  passed: boolean;
} {
  const yesCount = votes.filter((v) => v.vote === 'yes').length;
  const noCount = votes.filter((v) => v.vote === 'no').length;
  return { yesCount, noCount, passed: yesCount > noCount };
}

export function getRandomCrisis(excludeId?: string): CrisisReason {
  const available = excludeId
    ? CRISIS_REASONS.filter((c) => c.id !== excludeId)
    : CRISIS_REASONS;
  return available[Math.floor(Math.random() * available.length)];
}

export function getExternalColleges(): string[] {
  return Object.keys(EXTERNAL_COLLEGES);
}

export const CUSTOM_POC_REACTIONS: { pocId: string; vote: 'yes' | 'no'; reaction: string }[] = [
  {
    pocId: 'logistics',
    vote: 'no',
    reaction: 'Bro, I didn\'t even know this was physically possible. We are SO cooked. How do I plan around THIS? 😩',
  },
  {
    pocId: 'tech',
    vote: 'no',
    reaction: 'Yeah no, this is beyond my pay grade. I can fix a projector, I can\'t fix... whatever THIS is. 💀',
  },
  {
    pocId: 'sponsorship',
    vote: 'no',
    reaction: 'The sponsors are NOT going to understand this one. "Dear Sir, unfortunately..." nah I can\'t even draft this email. 📉',
  },
];

export const CODE_RED_HIERARCHY_REACTIONS: Record<string, { vote: 'yes' | 'no'; reaction: string }> = {
  logistics: {
    vote: 'no',
    reaction: 'Who let a junior handle a Code Red?! 😭 Fix it NOW using the UMS grid before I lose my mind! This is NOT a drill! 🚨',
  },
  tech: {
    vote: 'no',
    reaction: 'A Code Red from ExeCom/Volunteer?! Bro, where are the Heads?! I\'m not taking instructions from a first-year for THIS. Fix it or I\'m walking. 😤',
  },
  sponsorship: {
    vote: 'no',
    reaction: 'Code Red and no Head is leading?! The sponsors are going to SUE US. I need someone with AUTHORITY on this call, not an ExeCom kid. 😭🛑',
  },
};

export function getCustomPocReaction(
  pocId: string,
  userPor?: POR,
  severity?: BhasadLevel
): { vote: 'yes' | 'no'; reaction: string } {
  // If a Volunteer or ExeCom submits a Code Red, the Heads react more stressed
  const isJunior = userPor === 'Volunteer' || userPor === 'ExeCom';
  if (isJunior && severity === 'code-red') {
    const stressed = CODE_RED_HIERARCHY_REACTIONS[pocId];
    if (stressed) return stressed;
  }

  const found = CUSTOM_POC_REACTIONS.find((r) => r.pocId === pocId);
  return found || { vote: 'no', reaction: 'This is chaos. Absolute no. 🛑' };
}

export function buildForumSeed(): import('@/types').KaleshForumItem[] {
  return CRISIS_REASONS.map((c, i) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    emoji: c.emoji,
    severity: c.severity,
    isCustom: false,
    upvotes: Math.floor(Math.random() * 40) + 5,
    author: ['@fest_coord', '@admin_sahab', '@senior_poc', '@campus_ops', '@dean_office'][i % 5],
    createdAt: Date.now() - (i + 1) * 3600000,
  }));
}
