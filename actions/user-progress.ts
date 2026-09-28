"use server";

import { db } from "@/db";
import { getOrCreateUser } from "@/lib/user";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { users, lessons, lessonCompletions, xpEvents, dailyActivity } from "@/db/schema";


export async function selectCourse(courseId: number) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  await db.update(users)
    .set({ activeCourseId: courseId })
    .where(eq(users.id, user.id));

  revalidatePath("/languages");
  redirect("/home");
}

export async function completeLesson(lessonId: number, accuracy: number) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  const lesson = await db.query.lessons.findFirst({ where: eq(lessons.id, lessonId) });
  if (!lesson) throw new Error("Lesson not found");

  const today = new Date().toLocaleDateString("en-CA", { timeZone: user.timezone }); // "YYYY-MM-DD" in user's local time
  const xpEarned = lesson.xpReward;

  await db.transaction(async (tx) => {
    // 1. record / update the lesson completion
    await tx
      .insert(lessonCompletions)
      .values({ userId: user.id, lessonId, bestAccuracy: accuracy })
      .onConflictDoUpdate({
        target: [lessonCompletions.userId, lessonCompletions.lessonId],
        set: {
          timesCompleted: sql`${lessonCompletions.timesCompleted} + 1`,
          lastCompletedAt: new Date(),
        },
      });

    // 2. log the XP event
    await tx.insert(xpEvents).values({ userId: user.id, amount: xpEarned, source: "lesson", lessonId });

    // 3. upsert today's daily_activity row
    await tx
      .insert(dailyActivity)
      .values({ userId: user.id, day: today, xpEarned, lessonsCompleted: 1 })
      .onConflictDoUpdate({
        target: [dailyActivity.userId, dailyActivity.day],
        set: {
          xpEarned: sql`${dailyActivity.xpEarned} + ${xpEarned}`,
          lessonsCompleted: sql`${dailyActivity.lessonsCompleted} + 1`,
        },
      });

    // 4. compute the new streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let newStreak = user.currentStreak;
    if (user.lastActiveDate === today) {
      // already active today, streak unchanged
    } else if (user.lastActiveDate === yesterdayStr) {
      newStreak = user.currentStreak + 1;
    } else {
      newStreak = 1; // streak broken, restart
    }

    await tx.update(users).set({
      totalXp: user.totalXp + xpEarned,
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      lastActiveDate: today,
    }).where(eq(users.id, user.id));
  });

  revalidatePath("/home");
  redirect("/home")
}