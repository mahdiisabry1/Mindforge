"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLesson } from "@/actions/user-progress";

type Challenge = {
  id: number;
  question: string;
  codeSnippet: string | null;
  options: { id: number; text: string; isCorrect: boolean }[];
};

export default function LessonClient({
  lesson,
  challenges,
}: {
  lesson: { id: number; title: string; xpReward: number };
  challenges: Challenge[];
}) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const current = challenges[index];
  const isLast = index === challenges.length - 1;

  function handleAnswer(optionId: number) {
    setSelected(optionId);
  }

  function handleNext() {
    const chosen = current.options.find(o => o.id === selected);
    const wasCorrect = chosen?.isCorrect ?? false;
    const nextCorrect = correctCount + (wasCorrect ? 1 : 0);
    setCorrectCount(nextCorrect);
    setSelected(null);

    if (isLast) {
      const accuracy = Math.round((nextCorrect / challenges.length) * 100);
      startTransition(async () => {
        await completeLesson(lesson.id, accuracy);
        router.push("/"); // back to Home — path + streak will reflect the update
      });
    } else {
      setIndex(index + 1);
    }
  }

  if (!current) return <p className="p-8 text-center">This lesson has no challenges yet.</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <p className="text-sm text-muted-foreground mb-2">
        {index + 1} / {challenges.length}
      </p>
      <h2 className="font-heading font-800 text-xl mb-4">{current.question}</h2>

      {current.codeSnippet && (
        <pre className="bg-muted rounded-xl p-4 mb-6 text-sm overflow-x-auto">
          <code>{current.codeSnippet}</code>
        </pre>
      )}

      <div className="space-y-3 mb-8">
        {current.options.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
            className={`w-full text-left rounded-xl border p-4 transition-colors
              ${selected === opt.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
          >
            {opt.text}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selected === null || isPending}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading font-800 disabled:opacity-40"
      >
        {isPending ? "Saving..." : isLast ? "Finish lesson" : "Next"}
      </button>
    </div>
  );
}