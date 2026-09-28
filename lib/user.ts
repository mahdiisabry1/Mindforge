import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const getOrCreateUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Check if this Clerk user already has a row
  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (existing) return existing;

  // 2. First time we've seen this user — create the row
  const clerkUser = await currentUser();
  const [inserted] = await db
    .insert(users)
    .values({
      id: userId,
      username: clerkUser?.username ?? clerkUser?.firstName ?? "Learner",
      imageUrl: clerkUser?.imageUrl,
    })
    .onConflictDoNothing()
    .returning();

  // handles the rare case of two requests racing to insert at once
  return inserted ?? (await db.query.users.findFirst({ where: eq(users.id, userId) }))!;
});