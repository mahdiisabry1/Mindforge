import { ObjectId } from 'mongodb';

// Base MongoDB document interface
export interface BaseDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// User model
export interface User extends BaseDocument {
  role: 'admin' | 'user';
}

// LeaderboardEntry model
export interface LeaderboardEntry extends BaseDocument {
  user_id: string;
  user_name: string;
  total_xp: number;
  weekly_xp: number;
  rank_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  streak_days: number;
  languages_learning: string[];
  avatar_color: string;
}

// Lesson model
export interface Question {
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'code_order';
  question: string;
  code_snippet?: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

export interface Lesson extends BaseDocument {
  language_id: string;
  unit_number: number;
  unit_title: string;
  lesson_number: number;
  title: string;
  description: string;
  xp_reward: number;
  questions: Question[];
}

// ProgrammingLanguage model
export interface ProgrammingLanguage extends BaseDocument {
  name: string;
  slug: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  total_lessons: number;
}

// UserProgress model
export interface UserProgress extends BaseDocument {
  user_id: string;
  language_id: string;
  total_xp: number;
  current_unit: number;
  current_lesson: number;
  completed_lessons: string[];
  streak_days: number;
  last_practice_date: Date;
  hearts: number;
  level: number;
}

// Achievement model
export interface Achievement extends BaseDocument {
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_icon?: string;
  badge_description?: string;
  earned_date: Date;
}

// Input types for creating documents (without _id, createdAt, updatedAt)
export type CreateUserInput = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type CreateLeaderboardEntryInput = Omit<LeaderboardEntry, '_id' | 'createdAt' | 'updatedAt'>;
export type CreateLessonInput = Omit<Lesson, '_id' | 'createdAt' | 'updatedAt'>;
export type CreateProgrammingLanguageInput = Omit<ProgrammingLanguage, '_id' | 'createdAt' | 'updatedAt'>;
export type CreateUserProgressInput = Omit<UserProgress, '_id' | 'createdAt' | 'updatedAt'>;
export type CreateAchievementInput = Omit<Achievement, '_id' | 'createdAt' | 'updatedAt'>;
