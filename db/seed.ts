// import { db } from "./index";
// import { courses } from "./schema";

// import { config } from "dotenv";
// config({ path: ".env.local" });

// async function main() {
//   await db.insert(courses).values([
//     { slug: "python", title: "Python", iconSrc: "🐍", isPublished: true },
//     { slug: "javascript", title: "JavaScript", iconSrc: "⚡", isPublished: true },
//     { slug: "java", title: "Java", iconSrc: "☕", isPublished: true },
//     { slug: "csharp", title: "C#", iconSrc: "🔷", isPublished: true },
//     { slug: "cpp", title: "C++", iconSrc: "⚡", isPublished: true },
//     { slug: "go", title: "Go", iconSrc: "🐹", isPublished: true },
//   ]);
//   console.log("Seeded courses");
//   process.exit(0);
// }

// main();

import "dotenv/config";
import { db } from "./index";
import { courses, units, lessons, challenges, challengeOptions } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const python = await db.query.courses.findFirst({ where: eq(courses.slug, "python") });
  if (!python) throw new Error("Run the courses seed first — python course not found");

  // ---- Unit 1 ----
  const [unit1] = await db.insert(units).values({
    courseId: python.id,
    title: "Basics",
    description: "Variables, types, and printing",
    order: 1,
  }).returning();

  const [lesson1] = await db.insert(lessons).values({
    unitId: unit1.id,
    title: "Hello, Python",
    order: 1,
    xpReward: 10,
  }).returning();

  const [c1] = await db.insert(challenges).values({
    lessonId: lesson1.id,
    type: "select",
    question: "Which function prints text to the screen?",
    order: 1,
  }).returning();

  await db.insert(challengeOptions).values([
    { challengeId: c1.id, text: "print()", isCorrect: true },
    { challengeId: c1.id, text: "echo()", isCorrect: false },
    { challengeId: c1.id, text: "console.log()", isCorrect: false },
    { challengeId: c1.id, text: "output()", isCorrect: false },
  ]);

  const [c2] = await db.insert(challenges).values({
    lessonId: lesson1.id,
    type: "select",
    question: "What will this code print?",
    codeSnippet: `x = 5\nprint(x + 2)`,
    order: 2,
  }).returning();

  await db.insert(challengeOptions).values([
    { challengeId: c2.id, text: "7", isCorrect: true },
    { challengeId: c2.id, text: "52", isCorrect: false },
    { challengeId: c2.id, text: "Error", isCorrect: false },
    { challengeId: c2.id, text: "5", isCorrect: false },
  ]);

  const [lesson2] = await db.insert(lessons).values({
    unitId: unit1.id,
    title: "Variables",
    order: 2,
    xpReward: 10,
  }).returning();

  const [c3] = await db.insert(challenges).values({
    lessonId: lesson2.id,
    type: "select",
    question: "Which is a valid variable name in Python?",
    order: 1,
  }).returning();

  await db.insert(challengeOptions).values([
    { challengeId: c3.id, text: "user_name", isCorrect: true },
    { challengeId: c3.id, text: "2cool", isCorrect: false },
    { challengeId: c3.id, text: "user-name", isCorrect: false },
    { challengeId: c3.id, text: "class", isCorrect: false },
  ]);

  // ---- Unit 2 ----
  const [unit2] = await db.insert(units).values({
    courseId: python.id,
    title: "Control Flow",
    description: "If statements and loops",
    order: 2,
  }).returning();

  const [lesson3] = await db.insert(lessons).values({
    unitId: unit2.id,
    title: "If Statements",
    order: 1,
    xpReward: 15,
  }).returning();

  const [c4] = await db.insert(challenges).values({
    lessonId: lesson3.id,
    type: "select",
    question: "What does this print?",
    codeSnippet: `x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")`,
    order: 1,
  }).returning();

  await db.insert(challengeOptions).values([
    { challengeId: c4.id, text: "big", isCorrect: true },
    { challengeId: c4.id, text: "small", isCorrect: false },
    { challengeId: c4.id, text: "10", isCorrect: false },
    { challengeId: c4.id, text: "nothing", isCorrect: false },
  ]);

  console.log("Seeded units, lessons, challenges, options for Python");
  process.exit(0);
}

main();