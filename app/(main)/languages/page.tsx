import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { selectCourse } from "@/actions/user-progress";
import CourseCard from "@/components/CourseCard";

export default async function LanguagesPage() {
  const user = await getOrCreateUser();
  const allCourses = await db.select().from(courses).where(eq(courses.isPublished, true));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-heading font-800 text-2xl mb-1">Choose a language</h1>
      <p className="text-muted-foreground mb-8">Pick what you want to learn today.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {allCourses.map((course, i) => (
          <form key={course.id} action={selectCourse.bind(null, course.id)}>
            <CourseCard
              title={course.title}
              iconSrc={course.iconSrc}
              isActive={user?.activeCourseId === course.id}
              index={i}
            />
          </form>
        ))}
      </div>
    </div>
  );
}