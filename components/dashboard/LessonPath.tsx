import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, Star } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  unit_number: number;
  unit_title?: string;
  title: string;
}

interface LessonPathProps {
  lessons?: Lesson[];
  completedLessons?: string[];
  languageColor?: string;
}

export default function LessonPath({ lessons = [], completedLessons = [], languageColor = '#7C4DFF' }: LessonPathProps) {
  const grouped: Record<number, { title: string; lessons: Lesson[] }> = {};
  lessons.forEach(l => {
    if (!grouped[l.unit_number]) {
      grouped[l.unit_number] = { title: l.unit_title || `Unit ${l.unit_number}`, lessons: [] };
    }
    grouped[l.unit_number].lessons.push(l);
  });

  const units = Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <div className="space-y-8">
      {units.map(([unitNum, unit], unitIdx) => (
        <motion.div
          key={unitNum}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: unitIdx * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-800 text-sm text-primary-foreground"
              style={{ background: languageColor }}>
              {unitNum}
            </div>
            <h3 className="font-heading font-800 text-lg">{unit.title}</h3>
          </div>

          <div className="flex flex-col items-center gap-4 relative">
            {unit.lessons.map((lesson, i) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const prevCompleted = i === 0
                ? (unitIdx === 0 || units[unitIdx - 1][1].lessons.every(l => completedLessons.includes(l.id)))
                : completedLessons.includes(unit.lessons[i - 1]?.id);
              const isUnlocked = isCompleted || prevCompleted;
              const isCurrent = isUnlocked && !isCompleted;

              const offsets = [0, -40, -20, 30, 10];
              const offset = offsets[i % offsets.length];

              return (
                <div key={lesson.id} className="relative" style={{ marginLeft: `${offset}px` }}>
                  {i > 0 && (
                    <div className="absolute -top-4 left-1/2 w-0.5 h-4"
                      style={{ background: isUnlocked ? languageColor : 'hsl(var(--border))' }} />
                  )}
                  {isCurrent ? (
                    <Link href={`/lesson/${lesson.id}`}>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer relative"
                        style={{ background: languageColor }}
                      >
                        <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap"
                          style={{ background: languageColor }}>
                          START
                        </div>
                      </motion.div>
                    </Link>
                  ) : isCompleted ? (
                    <Link href={`/lesson/${lesson.id}`}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer border-4"
                        style={{ borderColor: languageColor, background: `${languageColor}22` }}>
                        <CheckCircle className="w-7 h-7" style={{ color: languageColor }} />
                      </div>
                    </Link>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border opacity-50">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <p className={`text-xs font-bold text-center mt-2 max-w-20 ${!isUnlocked ? 'text-muted-foreground' : ''}`}>
                    {lesson.title}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {units.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-semibold">No lessons yet</p>
          <p className="text-sm text-muted-foreground">Pick a language to start learning!</p>
        </div>
      )}
    </div>
  );
}
