// Load environment variables before any other imports
import { config } from 'dotenv';
config({ path: '.env' });

import { getDb } from '../lib/mongodb';
import type {
  ProgrammingLanguage,
  Lesson,
  LeaderboardEntry,
  User,
  UserProgress,
} from '../lib/models';

async function seed() {
  console.log('🌱 Starting database seed...');

  const db = await getDb();

  // Clear existing collections
  console.log('🧹 Clearing existing collections...');
  await db.collection('programming_languages').deleteMany({});
  await db.collection('lessons').deleteMany({});
  await db.collection('leaderboard').deleteMany({});
  await db.collection('users').deleteMany({});
  await db.collection('user_progress').deleteMany({});

  // Seed Programming Languages
  console.log('📚 Seeding programming languages...');
  const languages:Omit<ProgrammingLanguage, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Python',
      slug: 'python',
      icon: '🐍',
      color: '#3776AB',
      difficulty: 'beginner',
      description: 'A versatile language perfect for beginners and experts alike',
      total_lessons: 12,
    },
    {
      name: 'JavaScript',
      slug: 'javascript',
      icon: '⚡',
      color: '#F7DF1E',
      difficulty: 'beginner',
      description: 'The language of the web - essential for modern development',
      total_lessons: 15,
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      icon: '📘',
      color: '#3178C6',
      difficulty: 'intermediate',
      description: 'JavaScript with syntax for types - safer and more scalable',
      total_lessons: 10,
    },
    {
      name: 'Rust',
      slug: 'rust',
      icon: '🦀',
      color: '#DEA584',
      difficulty: 'advanced',
      description: 'A systems programming language focused on safety and performance',
      total_lessons: 8,
    },
    {
      name: 'Go',
      slug: 'go',
      icon: '🐹',
      color: '#00ADD8',
      difficulty: 'intermediate',
      description: 'Simple, reliable, and efficient software development',
      total_lessons: 9,
    },
  ];

  const languageDocs = await db.collection('programming_languages').insertMany(
    languages.map(lang => ({
      ...lang,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`✅ Created ${languageDocs.insertedCount} programming languages`);

  // Get language IDs
  const pythonId = languageDocs.insertedIds[0].toString();
  const jsId = languageDocs.insertedIds[1].toString();

  // Seed Lessons for Python
  console.log('📖 Seeding Python lessons...');
  const pythonLessons: Omit<Lesson, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      language_id: pythonId,
      unit_number: 1,
      unit_title: 'Getting Started',
      lesson_number: 1,
      title: 'Hello World',
      description: 'Write your first Python program',
      xp_reward: 10,
      questions: [
        {
          type: 'multiple_choice',
          question: 'What function is used to output text in Python?',
          code_snippet: '___("Hello, World!")',
          options: ['print()', 'console.log()', 'echo()', 'write()'],
          correct_answer: 'print()',
          explanation: 'print() is the standard function to output text in Python',
        },
        {
          type: 'fill_blank',
          question: 'Complete the code to print "Hello"',
          code_snippet: '___("Hello")',
          correct_answer: 'print',
          explanation: 'Use print() to display output',
        },
      ],
    },
    {
      language_id: pythonId,
      unit_number: 1,
      unit_title: 'Getting Started',
      lesson_number: 2,
      title: 'Variables',
      description: 'Learn how to store and use data',
      xp_reward: 15,
      questions: [
        {
          type: 'multiple_choice',
          question: 'Which is a valid variable name in Python?',
          options: ['2variable', 'my-var', 'my_variable', 'class'],
          correct_answer: 'my_variable',
          explanation: 'Variable names must start with a letter or underscore and cannot contain spaces or hyphens',
        },
        {
          type: 'true_false',
          question: 'Python is dynamically typed',
          correct_answer: 'true',
          explanation: 'Python determines variable types at runtime',
        },
      ],
    },
    {
      language_id: pythonId,
      unit_number: 2,
      unit_title: 'Control Flow',
      lesson_number: 1,
      title: 'If Statements',
      description: 'Make decisions in your code',
      xp_reward: 20,
      questions: [
        {
          type: 'multiple_choice',
          question: 'What keyword is used for conditional statements?',
          options: ['when', 'if', 'case', 'check'],
          correct_answer: 'if',
          explanation: 'if is used for conditional logic in Python',
        },
      ],
    },
  ];

  const pythonLessonDocs = await db.collection('lessons').insertMany(
    pythonLessons.map(lesson => ({
      ...lesson,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`✅ Created ${pythonLessonDocs.insertedCount} Python lessons`);

  // Seed Lessons for JavaScript
  console.log('📖 Seeding JavaScript lessons...');
  const jsLessons: Omit<Lesson, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      language_id: jsId,
      unit_number: 1,
      unit_title: 'Basics',
      lesson_number: 1,
      title: 'Variables',
      description: 'Learn let, const, and var',
      xp_reward: 10,
      questions: [
        {
          type: 'multiple_choice',
          question: 'Which keyword creates a constant variable?',
          options: ['let', 'var', 'const', 'final'],
          correct_answer: 'const',
          explanation: 'const declares a constant that cannot be reassigned',
        },
      ],
    },
    {
      language_id: jsId,
      unit_number: 1,
      unit_title: 'Basics',
      lesson_number: 2,
      title: 'Functions',
      description: 'Create reusable code blocks',
      xp_reward: 15,
      questions: [
        {
          type: 'multiple_choice',
          question: 'How do you declare a function?',
          code_snippet: '___ myFunc() { }',
          options: ['function', 'def', 'fn', 'func'],
          correct_answer: 'function',
          explanation: 'function keyword is used to declare functions in JavaScript',
        },
      ],
    },
  ];

  const jsLessonDocs = await db.collection('lessons').insertMany(
    jsLessons.map(lesson => ({
      ...lesson,
      updatedAt: new Date(),
      createdAt: new Date(),
    }))
  );
  console.log(`✅ Created ${jsLessonDocs.insertedCount} JavaScript lessons`);

  // Seed Users
  console.log('👤 Seeding users...');
  const users: Omit<User, '_id' | 'createdAt' | 'updatedAt'>[] = [
    { role: 'admin' },
    { role: 'user' },
    { role: 'user' },
  ];

  const userDocs = await db.collection('users').insertMany(
    users.map(user => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`✅ Created ${userDocs.insertedCount} users`);

  const adminId = userDocs.insertedIds[0].toString();
  const user1Id = userDocs.insertedIds[1].toString();
  const user2Id = userDocs.insertedIds[2].toString();

  // Seed Leaderboard
  console.log('🏆 Seeding leaderboard entries...');
  const leaderboardEntries: Omit<LeaderboardEntry, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      user_id: adminId,
      user_name: 'Admin User',
      total_xp: 1500,
      weekly_xp: 350,
      rank_tier: 'gold',
      streak_days: 15,
      languages_learning: ['python', 'javascript'],
      avatar_color: '#6C63FF',
    },
    {
      user_id: user1Id,
      user_name: 'Code Master',
      total_xp: 2300,
      weekly_xp: 520,
      rank_tier: 'platinum',
      streak_days: 30,
      languages_learning: ['python', 'typescript', 'rust'],
      avatar_color: '#FF6B6B',
    },
    {
      user_id: user2Id,
      user_name: 'New Learner',
      total_xp: 150,
      weekly_xp: 150,
      rank_tier: 'bronze',
      streak_days: 3,
      languages_learning: ['python'],
      avatar_color: '#4ECDC4',
    },
  ];

  const leaderboardDocs = await db.collection('leaderboard').insertMany(
    leaderboardEntries.map(entry => ({
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`✅ Created ${leaderboardDocs.insertedCount} leaderboard entries`);

  // Seed User Progress
  console.log('📈 Seeding user progress...');
  const userProgress: Omit<UserProgress, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      user_id: adminId,
      language_id: pythonId,
      total_xp: 800,
      current_unit: 2,
      current_lesson: 1,
      completed_lessons: [pythonLessonDocs.insertedIds[0].toString()],
      streak_days: 15,
      last_practice_date: new Date(),
      hearts: 5,
      level: 5,
    },
    {
      user_id: user1Id,
      language_id: pythonId,
      total_xp: 1200,
      current_unit: 2,
      current_lesson: 2,
      completed_lessons: [
        pythonLessonDocs.insertedIds[0].toString(),
        pythonLessonDocs.insertedIds[1].toString(),
      ],
      streak_days: 30,
      last_practice_date: new Date(),
      hearts: 5,
      level: 8,
    },
    {
      user_id: user2Id,
      language_id: pythonId,
      total_xp: 150,
      current_unit: 1,
      current_lesson: 2,
      completed_lessons: [],
      streak_days: 3,
      last_practice_date: new Date(),
      hearts: 4,
      level: 1,
    },
  ];

  const progressDocs = await db.collection('user_progress').insertMany(
    userProgress.map(progress => ({
      ...progress,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`✅ Created ${progressDocs.insertedCount} user progress records`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Programming Languages: ${languageDocs.insertedCount}`);
  console.log(`- Lessons: ${pythonLessonDocs.insertedCount + jsLessonDocs.insertedCount}`);
  console.log(`- Users: ${userDocs.insertedCount}`);
  console.log(`- Leaderboard Entries: ${leaderboardDocs.insertedCount}`);
  console.log(`- User Progress Records: ${progressDocs.insertedCount}`);

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
