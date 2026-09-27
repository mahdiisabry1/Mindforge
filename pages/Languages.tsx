import React, { useState, useEffect } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

interface ProgrammingLanguage {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  total_lessons: number;
}

interface Lesson {
  _id: string;
  unit_number: number;
  lesson_number: number;
}

interface UserProgress {
  id: string;
  user_id: string;
  language_id: string;
  total_xp: number;
  current_unit: number;
  current_lesson: number;
  completed_lessons: string[];
  streak_days: number;
  last_practice_date: string;
  hearts: number;
  level: number;
}

const difficultyLabels = {
  beginner: { label: 'Beginner', color: 'text-green-600 bg-green-100' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600 bg-amber-100' },
  advanced: { label: 'Advanced', color: 'text-red-600 bg-red-100' },
};

export default function Languages() {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch('/api/languages');
        const data = await response.json();
        const languagesArray = Array.isArray(data) ? data : [];
        setLanguages(languagesArray);
        
        const savedProgress = languagesArray.map((lang: ProgrammingLanguage) => {
          const saved = localStorage.getItem(`progress_${lang._id}`);
          return saved ? JSON.parse(saved) : null;
        }).filter(Boolean);
        
        setUserProgress(savedProgress);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLanguages();
  }, []);

  const startLanguage = async (lang: ProgrammingLanguage) => {
    setStarting(lang._id);
    try {
      const existing = userProgress.find(p => p.language_id === lang._id);
      if (!existing) {
        const newProgress: UserProgress = {
          id: `${user?.id}_${lang._id}`,
          user_id: user?.id || '',
          language_id: lang._id,
          total_xp: 0,
          current_unit: 1,
          current_lesson: 1,
          completed_lessons: [],
          streak_days: 0,
          hearts: 5,
          level: 1,
          last_practice_date: new Date().toISOString().split('T')[0],
        };
        setUserProgress([...userProgress, newProgress]);
        localStorage.setItem(`progress_${lang._id}`, JSON.stringify(newProgress));
        router.push('/');
      } else {
        // Fetch lessons for this language to find the current lesson
        const lessonsResponse = await fetch(`/api/lessons/${lang._id}`);
        if (lessonsResponse.ok) {
          const lessons = await lessonsResponse.json();
          const currentLesson = lessons.find(
            (l: Lesson) => l.unit_number === existing.current_unit && l.lesson_number === existing.current_lesson
          );
          if (currentLesson) {
            router.push(`/lesson/${currentLesson._id}`);
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      }
    } catch (e) {
      console.error(e);
      router.push('/');
    } finally {
      setStarting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Sign in to choose a language.</p>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="font-heading font-900 text-2xl">Choose a Language</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-6">Pick a programming language to start your journey</p>
      </motion.div>

      <div className="space-y-3">
        {languages.map((lang, i) => {
          const progress = userProgress.find(p => p.language_id === lang._id);
          const diff = difficultyLabels[lang.difficulty as keyof typeof difficultyLabels] || difficultyLabels.beginner;

          return (
            <motion.div
              key={lang._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${lang.color}18` }}>
                  {lang.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-heading font-800 text-lg">{lang.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.color}`}>
                      {diff.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{lang.description}</p>
                  {progress && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground font-semibold">
                          {(progress.completed_lessons || []).length} / {lang.total_lessons || '?'} lessons
                        </span>
                        <span className="font-bold text-primary">{progress.total_xp} XP</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{
                            width: `${lang.total_lessons ? ((progress.completed_lessons || []).length / lang.total_lessons) * 100 : 0}%`,
                            background: lang.color
                          }} />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => startLanguage(lang)}
                  disabled={starting === lang._id}
                  variant={progress ? 'outline' : 'default'}
                  size="sm"
                  className="rounded-xl font-bold shrink-0"
                >
                  {starting === lang._id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : progress ? (
                    <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
                  ) : (
                    'Start'
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {languages.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No languages available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
