"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Zap, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/lesson/QuestionCard';
import { Lesson, UserProgress } from '@/lib/models';

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadLesson = useCallback(async () => {
    if (!isSignedIn || !user) {
      router.push('/');
      return;
    }

    try {
      const [lessonRes, progressRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}`),
        fetch('/api/user-progress'),
      ]);

      if (!lessonRes.ok) {
        router.push('/');
        return;
      }

      const lessonData = await lessonRes.json();
      setLesson(lessonData);

      if (progressRes.ok) {
        const progressList = await progressRes.json();
        if (progressList && progressList.length > 0) {
          const activeProgress = progressList.find((p: UserProgress) => p.language_id === lessonData.language_id);
          if (activeProgress) {
            setProgress(activeProgress);
            setHearts(activeProgress.hearts || 5);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [lessonId, isSignedIn, user, router]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const handleAnswer = async (correct: boolean) => {
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setXpEarned(prev => prev + (lesson?.xp_reward || 10));
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setFailed(true);
        if (progress) {
          await fetch('/api/user-progress/hearts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hearts: 0, progressId: progress._id.toString() }),
          });
        }
        return;
      }
    }

    const questions = lesson?.questions || [];
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      await completeLesson();
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  const completeLesson = async () => {
    if (!progress || !user) return;
    try {
      const response = await fetch('/api/user-progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          progressId: progress._id.toString(),
          xpEarned: xpEarned + (lesson?.xp_reward || 10),
        }),
      });

      if (!response.ok) {
        console.error('Failed to complete lesson');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) return null;

  const questions = lesson.questions || [];

  if (failed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="font-heading font-900 text-2xl mb-2">Out of Hearts!</h2>
          <p className="text-muted-foreground mb-6">Take a break and try again later</p>
          <Button onClick={() => router.push('/home')} className="rounded-xl font-heading font-800">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  if (finished) {
    const totalXp = xpEarned + (lesson.xp_reward || 10);
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <h2 className="font-heading font-900 text-3xl mb-2">Lesson Complete!</h2>
          <p className="text-muted-foreground mb-8">{lesson.title}</p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-heading font-900 text-2xl">{totalXp}</span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold">XP Earned</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-5 h-5 text-accent" />
                <span className="font-heading font-900 text-2xl">{correctCount}/{questions.length}</span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold">Correct</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Heart className="w-5 h-5 text-destructive" />
                <span className="font-heading font-900 text-2xl">{hearts}</span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold">Hearts Left</p>
            </div>
          </div>

          <Button onClick={() => router.push('/home')} size="lg" className="rounded-xl font-heading font-800 h-12 px-8">
            Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push('/home')} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h1 className="font-heading font-800 text-sm">{lesson.title}</h1>
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5 text-destructive fill-destructive" />
          <span className="font-heading font-800 text-sm">{hearts}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {questions[currentQ] && (
          <QuestionCard
            key={currentQ}
            question={questions[currentQ]}
            onAnswer={handleAnswer}
            questionNum={currentQ + 1}
            totalQuestions={questions.length}
          />
        )}
      </AnimatePresence>

      {questions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-semibold mb-4">This lesson has no questions yet</p>
          <Button onClick={() => router.push('/home')} variant="outline" className="rounded-xl">Go Back</Button>
        </div>
      )}
    </div>
  );
}
