import {
  pgTable, pgEnum, text, integer, serial, boolean, timestamp,
  date, jsonb, index, primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/* ENUMS                                                               */
/* ------------------------------------------------------------------ */
export const challengeType = pgEnum("challenge_type", [
  "select",        // multiple choice: "What does print() do?"
  "fill_blank",    // fill missing token in a code snippet
  "arrange_lines", // reorder shuffled lines of code
  "match_pairs",   // match keyword <-> meaning
  "write_code",    // free-form code, checked against test cases
]);

export const xpSource = pgEnum("xp_source", [
  "lesson", "practice", "streak_bonus", "achievement", "daily_quest",
]);

/* ------------------------------------------------------------------ */
/* USERS  (id = Clerk user id, e.g. "user_2abc...")                    */
/* Sync via Clerk webhook (user.created / user.updated) or lazily      */
/* upsert on first request.                                            */
/* ------------------------------------------------------------------ */
export const users = pgTable("users", {
  id: text("id").primaryKey(),                       // Clerk userId
  username: text("username"),
  imageUrl: text("image_url"),
  timezone: text("timezone").notNull().default("UTC"), // needed for correct streaks

  // gamification (cached counters - source of truth is xp_events / daily_activity)
  totalXp: integer("total_xp").notNull().default(0),
  hearts: integer("hearts").notNull().default(5),
  heartsRefilledAt: timestamp("hearts_refilled_at"),
  gems: integer("gems").notNull().default(0),

  // streak cache
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),          // in the user's local timezone
  streakFreezes: integer("streak_freezes").notNull().default(0),

  activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "set null" }),
  dailyXpGoal: integer("daily_xp_goal").notNull().default(20),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* CONTENT:  course -> unit -> lesson -> challenge -> option           */
/* ------------------------------------------------------------------ */
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),             // "python", "javascript"
  title: text("title").notNull(),
  iconSrc: text("icon_src").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),                    // "Variables & Types"
  description: text("description"),
  order: integer("order").notNull(),
}, (t) => [index("units_course_idx").on(t.courseId, t.order)]);

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  xpReward: integer("xp_reward").notNull().default(10),
}, (t) => [index("lessons_unit_idx").on(t.unitId, t.order)]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  type: challengeType("type").notNull(),
  question: text("question").notNull(),
  codeSnippet: text("code_snippet"),                 // shown to the learner
  language: text("language"),                        // for syntax highlighting
  // Type-specific data (test cases, correct line order, pairs...) lives here
  // so you don't need a new table per challenge type.
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
}, (t) => [index("challenges_lesson_idx").on(t.lessonId, t.order)]);

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

/* ------------------------------------------------------------------ */
/* USER PROGRESS                                                       */
/* ------------------------------------------------------------------ */
// One row per lesson a user has completed (unlocks the next lesson).
export const lessonCompletions = pgTable("lesson_completions", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  timesCompleted: integer("times_completed").notNull().default(1),
  bestAccuracy: integer("best_accuracy"),            // 0-100
  firstCompletedAt: timestamp("first_completed_at").notNull().defaultNow(),
  lastCompletedAt: timestamp("last_completed_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.lessonId] })]);

// Every answer attempt: powers "review mistakes", analytics, and heart loss.
export const challengeAttempts = pgTable("challenge_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  isCorrect: boolean("is_correct").notNull(),
  submittedAnswer: jsonb("submitted_answer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("attempts_user_idx").on(t.userId, t.createdAt)]);

/* ------------------------------------------------------------------ */
/* XP + STREAKS                                                        */
/* ------------------------------------------------------------------ */
// Immutable ledger of XP. Good for leaderboards (SUM by week) and audits.
export const xpEvents = pgTable("xp_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  source: xpSource("source").notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("xp_user_time_idx").on(t.userId, t.createdAt)]);

// One row per user per LOCAL day they were active. Streak = consecutive days here.
// Also drives the streak calendar UI and daily goal progress.
export const dailyActivity = pgTable("daily_activity", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  day: date("day").notNull(),                        // user's local date
  xpEarned: integer("xp_earned").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  goalMet: boolean("goal_met").notNull().default(false),
  freezeUsed: boolean("freeze_used").notNull().default(false),
}, (t) => [primaryKey({ columns: [t.userId, t.day] })]);

/* ------------------------------------------------------------------ */
/* ACHIEVEMENTS                                                        */
/* ------------------------------------------------------------------ */
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),             // "streak_7", "first_lesson"
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconSrc: text("icon_src"),
  gemReward: integer("gem_reward").notNull().default(0),
});

export const userAchievements = pgTable("user_achievements", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.achievementId] })]);

/* ------------------------------------------------------------------ */
/* SOCIAL (optional, add later)                                        */
/* ------------------------------------------------------------------ */
export const friendships = pgTable("friendships", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  friendId: text("friend_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.friendId] })]);

/* ------------------------------------------------------------------ */
/* RELATIONS (for db.query.* with `with:`)                             */
/* ------------------------------------------------------------------ */
export const coursesRelations = relations(courses, ({ many }) => ({ units: many(units) }));
export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, { fields: [units.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, { fields: [lessons.unitId], references: [units.id] }),
  challenges: many(challenges),
}));
export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, { fields: [challenges.lessonId], references: [lessons.id] }),
  options: many(challengeOptions),
}));
export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, { fields: [challengeOptions.challengeId], references: [challenges.id] }),
}));

/* ------------------------------------------------------------------ */
/* STREAK LOGIC (call inside a transaction when a lesson completes)    */
/* ------------------------------------------------------------------ */
/*
  const today     = local date string in user.timezone   // e.g. "2026-09-28"
  const yesterday = today - 1 day

  1. upsert daily_activity (userId, today): xp_earned += xp, lessons_completed += 1
  2. if user.lastActiveDate === today       -> streak unchanged
     if user.lastActiveDate === yesterday   -> currentStreak += 1
     else if a freeze covers the gap        -> consume freeze, keep streak
     else                                   -> currentStreak = 1
  3. longestStreak = max(longestStreak, currentStreak)
  4. lastActiveDate = today
  5. insert xp_events row, bump users.totalXp
*/