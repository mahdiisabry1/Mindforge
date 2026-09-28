import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { lessons, challenges } from "@/db/schema";
import LessonClient from "./lesson-client";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lessonId = Number(id);
  if (Number.isNaN(lessonId)) notFound();

  const lesson = await db.query.lessons.findFirst({ where: eq(lessons.id, lessonId) });
  if (!lesson) notFound();

  const challengeRows = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId),
    orderBy: challenges.order,
    with: { options: true },
  });

  return <LessonClient lesson={lesson} challenges={challengeRows} />;
}