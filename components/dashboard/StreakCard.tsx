import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function StreakCard({ streakDays = 0 }) {
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-800 text-lg">Daily Streak</h3>
          <p className="text-sm text-muted-foreground">Keep coding every day!</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-accent/15 rounded-xl">
          <Flame className="w-6 h-6 text-accent" />
          <span className="font-heading font-900 text-2xl text-accent-foreground">{streakDays}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-1">
        {days.map((day, i) => {
          const isCompleted = i < streakDays % 7 && i <= adjustedToday;
          const isToday = i === adjustedToday;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isToday
                      ? 'border-2 border-primary text-primary bg-primary/10'
                      : 'bg-muted text-muted-foreground'
                  }`}
              >
                {isCompleted ? '✓' : day}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}