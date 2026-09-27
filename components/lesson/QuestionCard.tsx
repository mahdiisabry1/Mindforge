import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: {
    type: 'true_false' | 'multiple_choice' | 'fill_blank';
    question: string;
    code_snippet?: string;
    options?: string[];
    correct_answer: string;
    explanation?: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  questionNum: number;
  totalQuestions: number;
}

export default function QuestionCard({ question, onAnswer, questionNum, totalQuestions }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (!selected) return;
    const correct = selected === question.correct_answer;
    setIsCorrect(correct);
    setAnswered(true);
  };

  const handleContinue = () => {
    onAnswer(isCorrect);
    setSelected(null);
    setAnswered(false);
    setIsCorrect(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-xl mx-auto"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground">
          {questionNum} of {totalQuestions}
        </span>
        <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNum / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 mt-4">
        {question.type === 'true_false' && (
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">True or False</span>
        )}
        {question.type === 'multiple_choice' && (
          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-lg">Multiple Choice</span>
        )}
        {question.type === 'fill_blank' && (
          <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-lg">Fill in the Blank</span>
        )}

        <h2 className="font-heading font-800 text-xl mt-3 mb-2">{question.question}</h2>

        {question.code_snippet && (
          <div className="code-block text-sm mb-4 overflow-x-auto">
            <pre><code>{question.code_snippet}</code></pre>
          </div>
        )}

        <div className="space-y-2 mt-4">
          {(question.options || []).map((option, i) => {
            const isSelected = selected === option;
            const showCorrect = answered && option === question.correct_answer;
            const showWrong = answered && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-semibold text-sm
                  ${showCorrect
                    ? 'border-green-500 bg-green-500/10 text-green-700'
                    : showWrong
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                    ${showCorrect ? 'border-green-500 bg-green-500 text-white' :
                      showWrong ? 'border-destructive bg-destructive text-white' :
                      isSelected ? 'border-primary bg-primary text-primary-foreground' :
                      'border-border'}`}>
                    {showCorrect ? <CheckCircle className="w-4 h-4" /> :
                     showWrong ? <XCircle className="w-4 h-4" /> :
                     String.fromCharCode(65 + i)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-2xl ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-destructive/10 border border-destructive/30'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isCorrect
                ? <CheckCircle className="w-5 h-5 text-green-600" />
                : <XCircle className="w-5 h-5 text-destructive" />}
              <span className={`font-heading font-800 ${isCorrect ? 'text-green-700' : 'text-destructive'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {question.explanation && (
              <p className="text-sm text-muted-foreground ml-7">{question.explanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {!answered ? (
          <Button onClick={handleCheck} disabled={!selected} className="w-full h-12 rounded-xl font-heading font-800 text-base">
            Check
          </Button>
        ) : (
          <Button onClick={handleContinue} className={`w-full h-12 rounded-xl font-heading font-800 text-base ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90'}`}>
            Continue
          </Button>
        )}
      </div>
    </motion.div>
  );
}