import { NextResponse } from 'next/server';
import { userProgressDb, leaderboardDb, lessonDb } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonId, progressId, xpEarned } = body;

    // Get the lesson to find language_id
    const lesson = await lessonDb.findById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get current progress
    const progress = await userProgressDb.findById(progressId);
    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      );
    }

    // Update completed lessons
    const completed = [...(progress.completed_lessons || [])];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    }

    const newXp = (progress.total_xp || 0) + xpEarned;
    const newLevel = Math.floor(newXp / 100) + 1;

    const today = new Date().toISOString().split('T')[0];
    const lastPractice = progress.last_practice_date ? new Date(progress.last_practice_date).toISOString().split('T')[0] : null;
    let newStreak = progress.streak_days || 0;
    
    if (lastPractice !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      newStreak = lastPractice === yesterdayStr ? newStreak + 1 : 1;
    }

    // Update user progress
    await userProgressDb.update(progressId, {
      completed_lessons: completed,
      total_xp: newXp,
      level: newLevel,
      hearts: Math.min(progress.hearts || 5, 5),
      streak_days: newStreak,
      last_practice_date: new Date(),
    });

    // Update leaderboard
    const lbEntry = await leaderboardDb.findByUserId(userId);
    if (lbEntry) {
      const totalXp = (lbEntry.total_xp || 0) + xpEarned;
      const weeklyXp = (lbEntry.weekly_xp || 0) + xpEarned;
      let tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' = 'bronze';
      if (totalXp >= 5000) tier = 'diamond';
      else if (totalXp >= 2000) tier = 'platinum';
      else if (totalXp >= 1000) tier = 'gold';
      else if (totalXp >= 500) tier = 'silver';

      await leaderboardDb.update(userId, {
        total_xp: totalXp,
        weekly_xp: weeklyXp,
        streak_days: newStreak,
        rank_tier: tier,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}
