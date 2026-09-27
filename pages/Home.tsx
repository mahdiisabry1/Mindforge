import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SignInButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BookOpen, ChevronRight, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import StreakCard from "@/components/dashboard/StreakCard";
import StatsBar from "@/components/dashboard/StatsBar";
import LessonPath from "@/components/dashboard/LessonPath";
import { Lesson, ProgrammingLanguage, UserProgress, LeaderboardEntry } from "@/lib/models";

export default function Home() {
    const { isSignedIn, user } = useUser();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [leaderboardEntry, setLeaderboardEntry] = useState<LeaderboardEntry | null>(null);
    const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLang, setActiveLang] = useState<ProgrammingLanguage | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            if (!isSignedIn || !user) {
                setLoading(false);
                return;
            }

            const [allLangs, allProgress, lbEntries] = await Promise.all([
                fetch('/api/languages').then((res) => res.json()),
                fetch('/api/user-progress').then((res) => res.json()),
                fetch('/api/leaderboard').then((res) => res.json()),
            ]);

            setLanguages(allLangs);

            if (allProgress && allProgress.length > 0) {
                const activeProgress = allProgress[0];
                setProgress(activeProgress);
                setActiveLang(
                    allLangs.find((l: ProgrammingLanguage) => l._id.toString() === activeProgress.language_id),
                );

                const langLessons = await fetch(`/api/lessons/${activeProgress.language_id}`).then((res) => res.json());
                setLessons(
                    langLessons.sort(
                        (a: Lesson, b: Lesson) =>
                            a.unit_number - b.unit_number ||
                            a.lesson_number - b.lesson_number,
                    ),
                );
            }

            if (lbEntries) {
                setLeaderboardEntry(lbEntries);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!progress) {
        return (
            <div className="max-w-lg mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
                        <Rocket className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="font-heading font-900 text-3xl mb-2">
                        Welcome to CodeQuest!
                    </h1>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Learn programming languages the fun way — bite-sized
                        lessons, daily streaks, and compete with others!
                    </p>
                    <Link href="/languages">
                        <Button
                            size="lg"
                            className="h-14 px-8 rounded-2xl font-heading font-800 text-lg gap-2"
                        >
                            <BookOpen className="w-5 h-5" />
                            Choose a Language
                        </Button>
                    </Link>
                </motion.div>

                {languages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12"
                    >
                        <h2 className="font-heading font-800 text-lg mb-4 text-center">
                            Popular Languages
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {languages.slice(0, 4).map((lang) => (
                                <Link
                                    key={lang._id.toString()}
                                    href="/languages"
                                    className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/40 transition-all"
                                >
                                    <span className="text-2xl">
                                        {lang.icon}
                                    </span>
                                    <div>
                                        <p className="font-heading font-700 text-sm">
                                            {lang.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {lang.difficulty}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
            {activeLang && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{activeLang.icon}</span>
                        <div>
                            <h1 className="font-heading font-900 text-xl">
                                {activeLang.name}
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Level {progress.level}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/languages"
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                        Switch <ChevronRight className="w-3 h-3" />
                    </Link>
                </motion.div>
            )}

            <StatsBar
                xp={progress.total_xp}
                level={progress.level}
                hearts={progress.hearts}
                rank={leaderboardEntry?.rank_tier || "bronze"}
            />

            <StreakCard streakDays={progress.streak_days} />

            <div>
                <h2 className="font-heading font-800 text-lg mb-4">
                    Your Path
                </h2>
                <LessonPath
                    lessons={lessons.map((lesson: Lesson) => ({ ...lesson, id: lesson._id.toString() }))}
                    completedLessons={progress.completed_lessons || []}
                    languageColor={activeLang?.color || "#7C4DFF"}
                />
            </div>
        </div>
    );
}
