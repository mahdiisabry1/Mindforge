import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';
import type {
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
} from './models';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  LEADERBOARD: 'leaderboard',
  LESSONS: 'lessons',
  LANGUAGES: 'programming_languages',
  USER_PROGRESS: 'user_progress',
  ACHIEVEMENTS: 'achievements',
} as const;

// Helper to add timestamps
const addTimestamps = <T>(data: T) => ({
  ...data,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// User operations
export const userDb = {
  async create(input: CreateUserInput): Promise<User> {
    const db = await getDb();
    const doc = addTimestamps(input);
    const result = await db.collection(COLLECTIONS.USERS).insertOne(doc);
    return { ...doc, _id: result.insertedId } as User;
  },

  async findById(id: string): Promise<User | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) }) as User | null;
  },

  async findAll(): Promise<User[]> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.USERS).find({}).toArray() as User[];
  },

  async update(id: string, updates: Partial<CreateUserInput>): Promise<User | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.USERS).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result as User | null;
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.USERS).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

// Leaderboard operations
export const leaderboardDb = {
  async create(input: CreateLeaderboardEntryInput): Promise<LeaderboardEntry> {
    const db = await getDb();
    const doc = addTimestamps(input);
    const result = await db.collection(COLLECTIONS.LEADERBOARD).insertOne(doc);
    return { ...doc, _id: result.insertedId } as LeaderboardEntry;
  },

  async findById(id: string): Promise<LeaderboardEntry | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LEADERBOARD).findOne({ _id: new ObjectId(id) }) as LeaderboardEntry | null;
  },

  async findByUserId(userId: string): Promise<LeaderboardEntry | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LEADERBOARD).findOne({ user_id: userId }) as LeaderboardEntry | null;
  },

  async getTopWeekly(limit = 50): Promise<LeaderboardEntry[]> {
    const db = await getDb();
    return await db
      .collection(COLLECTIONS.LEADERBOARD)
      .find({})
      .sort({ weekly_xp: -1 })
      .limit(limit)
      .toArray() as LeaderboardEntry[];
  },

  async getTopTotal(limit = 50): Promise<LeaderboardEntry[]> {
    const db = await getDb();
    return await db
      .collection(COLLECTIONS.LEADERBOARD)
      .find({})
      .sort({ total_xp: -1 })
      .limit(limit)
      .toArray() as LeaderboardEntry[];
  },

  async update(userId: string, updates: Partial<CreateLeaderboardEntryInput>): Promise<LeaderboardEntry | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.LEADERBOARD).findOneAndUpdate(
      { user_id: userId },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result as LeaderboardEntry | null;
  },

  async incrementXP(userId: string, xpAmount: number): Promise<LeaderboardEntry | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.LEADERBOARD).findOneAndUpdate(
      { user_id: userId },
      { 
        $inc: { total_xp: xpAmount, weekly_xp: xpAmount },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    return result as LeaderboardEntry | null;
  },
};

// Lesson operations
export const lessonDb = {
  async create(input: CreateLessonInput): Promise<Lesson> {
    const db = await getDb();
    const doc = addTimestamps(input);
    const result = await db.collection(COLLECTIONS.LESSONS).insertOne(doc);
    return { ...doc, _id: result.insertedId } as Lesson;
  },

  async findById(id: string): Promise<Lesson | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LESSONS).findOne({ _id: new ObjectId(id) }) as Lesson | null;
  },

  async findByLanguage(languageId: string): Promise<Lesson[]> {
    const db = await getDb();
    return await db
      .collection(COLLECTIONS.LESSONS)
      .find({ language_id: languageId })
      .sort({ unit_number: 1, lesson_number: 1 })
      .toArray() as Lesson[];
  },

  async findByUnit(languageId: string, unitNumber: number): Promise<Lesson[]> {
    const db = await getDb();
    return await db
      .collection(COLLECTIONS.LESSONS)
      .find({ language_id: languageId, unit_number: unitNumber })
      .sort({ lesson_number: 1 })
      .toArray() as Lesson[];
  },

  async findAll(): Promise<Lesson[]> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LESSONS).find({}).toArray() as Lesson[];
  },

  async update(id: string, updates: Partial<CreateLessonInput>): Promise<Lesson | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.LESSONS).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result as Lesson | null;
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.LESSONS).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

// ProgrammingLanguage operations
export const languageDb = {
  async create(input: CreateProgrammingLanguageInput): Promise<ProgrammingLanguage> {
    const db = await getDb();
    const doc = addTimestamps(input);
    const result = await db.collection(COLLECTIONS.LANGUAGES).insertOne(doc);
    return { ...doc, _id: result.insertedId } as ProgrammingLanguage;
  },

  async findById(id: string): Promise<ProgrammingLanguage | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LANGUAGES).findOne({ _id: new ObjectId(id) }) as ProgrammingLanguage | null;
  },

  async findBySlug(slug: string): Promise<ProgrammingLanguage | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LANGUAGES).findOne({ slug }) as ProgrammingLanguage | null;
  },

  async findAll(): Promise<ProgrammingLanguage[]> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.LANGUAGES).find({}).toArray() as ProgrammingLanguage[];
  },

  async update(id: string, updates: Partial<CreateProgrammingLanguageInput>): Promise<ProgrammingLanguage | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.LANGUAGES).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result as ProgrammingLanguage | null;
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.LANGUAGES).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

// UserProgress operations
export const userProgressDb = {
  async create(input: CreateUserProgressInput): Promise<UserProgress> {
    const db = await getDb();
    const doc = addTimestamps(input);
    const result = await db.collection(COLLECTIONS.USER_PROGRESS).insertOne(doc);
    return { ...doc, _id: result.insertedId } as UserProgress;
  },

  async findById(id: string): Promise<UserProgress | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.USER_PROGRESS).findOne({ _id: new ObjectId(id) }) as UserProgress | null;
  },

  async findByUserAndLanguage(userId: string, languageId: string): Promise<UserProgress | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.USER_PROGRESS).findOne({ 
      user_id: userId, 
      language_id: languageId 
    }) as UserProgress | null;
  },

  async findByUser(userId: string): Promise<UserProgress[]> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.USER_PROGRESS).find({ user_id: userId }).toArray() as UserProgress[];
  },

  async update(id: string, updates: Partial<CreateUserProgressInput>): Promise<UserProgress | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.USER_PROGRESS).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result as UserProgress | null;
  },

  async completeLesson(userId: string, languageId: string, lessonId: string): Promise<UserProgress | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.USER_PROGRESS).findOneAndUpdate(
      { user_id: userId, language_id: languageId },
      { 
        $addToSet: { completed_lessons: lessonId },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    return result as UserProgress | null;
  },

  async updateStreak(userId: string, languageId: string, streakDays: number): Promise<UserProgress | null> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.USER_PROGRESS).findOneAndUpdate(
      { user_id: userId, language_id: languageId },
      { 
        $set: { 
          streak_days: streakDays, 
          last_practice_date: new Date(),
          updatedAt: new Date() 
        }
      },
      { returnDocument: 'after' }
    );
    return result as UserProgress | null;
  },
};

// Achievement operations
export const achievementDb = {
  async create(input: CreateAchievementInput): Promise<Achievement> {
    const db = await getDb();
    const doc = addTimestamps(input);
    const result = await db.collection(COLLECTIONS.ACHIEVEMENTS).insertOne(doc);
    return { ...doc, _id: result.insertedId } as Achievement;
  },

  async findById(id: string): Promise<Achievement | null> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.ACHIEVEMENTS).findOne({ _id: new ObjectId(id) }) as Achievement | null;
  },

  async findByUser(userId: string): Promise<Achievement[]> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.ACHIEVEMENTS).find({ user_id: userId }).toArray() as Achievement[];
  },

  async findAll(): Promise<Achievement[]> {
    const db = await getDb();
    return await db.collection(COLLECTIONS.ACHIEVEMENTS).find({}).toArray() as Achievement[];
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.ACHIEVEMENTS).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};
