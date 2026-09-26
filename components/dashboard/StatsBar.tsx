import React from 'react';
import { Zap, Target, Heart, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsBar({ xp = 0, level = 1, hearts = 5, rank = '--' }) {
  const xpForNext = level * 100;
  const progress = Math.min((xp % 100) / 100, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold">Total XP</p>
          <p className="font-heading font-800 text-lg">{xp}</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
          <Target className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold">Level</p>
          <p className="font-heading font-800 text-lg">{level}</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
          <Heart className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold">Hearts</p>
          <p className="font-heading font-800 text-lg">{hearts}</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold">Rank</p>
          <p className="font-heading font-800 text-lg capitalize">{rank}</p>
        </div>
      </div>
    </motion.div>
  );
}