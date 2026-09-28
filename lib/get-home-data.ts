import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, units, lessons, lessonCompletions } from "@/db/schema";
import { getOrCreateUser } from "./user";

export async function getHomeData() {
  const user = await getOrCreateUser();
  if (!user) return null;

  const allCourses = await db.select().from(courses).where(eq(courses.isPublished, true));

  if (!user.activeCourseId) {
    return { user, allCourses, activeCourse: null, lessonList: [], completedIds: [] };
  }

  const activeCourse = allCourses.find(c => c.id === user.activeCourseId) ?? null;

  // lessons for the active course, joined with their unit (for unit_number / unit_title)
  const rows = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      order: lessons.order,
      unitNumber: units.order,
      unitTitle: units.title,
    })
    .from(lessons)
    .innerJoin(units, eq(lessons.unitId, units.id))
    .where(eq(units.courseId, user.activeCourseId))
    .orderBy(units.order, lessons.order);

  const completed = await db
    .select({ lessonId: lessonCompletions.lessonId })
    .from(lessonCompletions)
    .where(eq(lessonCompletions.userId, user.id));

  return {
    user,
    allCourses,
    activeCourse,
    lessonList: rows.map(r => ({
      id: String(r.id),
      title: r.title,
      unit_number: r.unitNumber,
      unit_title: r.unitTitle,
    })),
    completedIds: completed.map(c => String(c.lessonId)),
  };
}