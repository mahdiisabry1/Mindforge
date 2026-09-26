import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Award, Trophy } from 'lucide-react';

const tierColors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
};

const tierIcons = {
  1: Crown,
  2: Medal,
  3: Award,
};

interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  weekly_xp: number;
  rank_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  streak_days: number;
  avatar_color?: string;
}

interface LeaderboardListProps {
  entries?: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardList({ entries = [], currentUserId }: LeaderboardListProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => {
        const rank = idx + 1;
        const isCurrentUser = entry.user_id === currentUserId;
        const RankIcon = tierIcons[rank as keyof typeof tierIcons];

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all
              ${isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-card border border-border'}
              ${rank <= 3 ? 'py-4' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-900 text-sm
              ${rank === 1 ? 'bg-amber-100 text-amber-700' : rank === 2 ? 'bg-gray-100 text-gray-600' : rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-muted-foreground'}`}>
              {RankIcon ? <RankIcon className="w-4 h-4" /> : rank}
            </div>

            <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-800 text-sm text-white"
              style={{ background: entry.avatar_color || '#6C63FF' }}>
              {(entry.user_name || '?')[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-heading font-700 text-sm truncate">
                  {entry.user_name}
                  {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full"
                  style={{ background: `${tierColors[entry.rank_tier]}22`, color: tierColors[entry.rank_tier] }}>
                  {entry.rank_tier}
                </span>
                {entry.streak_days > 0 && (
                  <span className="text-xs text-muted-foreground">🔥 {entry.streak_days}d</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="font-heading font-800 text-sm">{entry.weekly_xp} XP</p>
              <p className="text-[10px] text-muted-foreground font-semibold">this week</p>
            </div>
          </motion.div>
        );
      })}

      {entries.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-semibold">No rankings yet</p>
          <p className="text-sm text-muted-foreground">Start learning to climb the ranks!</p>
        </div>
      )}
    </div>
  );
}