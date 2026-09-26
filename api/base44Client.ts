// MongoDB data access layer - replaces base44 SDK
// This file exports all database operations for the application
export {
  userDb,
  leaderboardDb,
  lessonDb,
  languageDb,
  userProgressDb,
  achievementDb,
} from '@/lib/db';

export type {
  User,
  LeaderboardEntry,
  Lesson,
  ProgrammingLanguage,
  UserProgress,
  Achievement,
  CreateUserInput,
  CreateLeaderboardEntryInput,
  CreateLessonInput,
  CreateProgrammingLanguageInput,
  CreateUserProgressInput,
  CreateAchievementInput,
} from '@/lib/models';