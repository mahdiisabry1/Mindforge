
import Link from "next/link";
import { BookOpen, ChevronRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import StreakCard from "@/components/StreakCard";
import StatsBar from "@/components/StatsBar";
import LessonPath from "@/components/LessonPath";
import { getHomeData } from "@/lib/get-home-data";

// simple XP -> level curve; tune to taste
function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export default async function HomePage() {
  const data = await getHomeData();
  if (!data) return null; // middleware should already redirect signed-out users

  const { user, allCourses, activeCourse, lessonList, completedIds } = data;

  if (!activeCourse) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading font-900 text-3xl mb-2">Welcome to Mindforge!</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Learn programming languages the fun way — bite-sized lessons, daily streaks, and compete with others!
          </p>
          <Link href="/courses">
            <Button size="lg" className="h-14 px-8 rounded-2xl font-heading font-800 text-lg gap-2">
              <BookOpen className="w-5 h-5" />
              Choose a Language
            </Button>
          </Link>
        </div>

        {allCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading font-800 text-lg mb-4 text-center">Popular Languages</h2>
            <div className="grid grid-cols-2 gap-3">
              {allCourses.slice(0, 4).map(course => (
                <Link
                  key={course.id}
                  href="/courses"
                  className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/40 transition-all"
                >
                  <span className="text-2xl">{course.iconSrc}</span>
                  <div>
                    <p className="font-heading font-700 text-sm">{course.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{activeCourse.iconSrc}</span>
          <div>
            <h1 className="font-heading font-900 text-xl">{activeCourse.title}</h1>
            <p className="text-xs text-muted-foreground">Level {levelFromXp(user.totalXp)}</p>
          </div>
        </div>
        <Link href="/languages" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
          Switch <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <StatsBar
        xp={user.totalXp}
        level={levelFromXp(user.totalXp)}
        hearts={user.hearts}
        rank="bronze" // wire up real leaderboard later
      />

      <StreakCard streakDays={user.currentStreak} />

      <div>
        <h2 className="font-heading font-800 text-lg mb-4">Your Path</h2>
        <LessonPath
          lessons={lessonList}
          completedLessons={completedIds}
          languageColor="#7C4DFF"
        />
      </div>
    </div>
  );
}
