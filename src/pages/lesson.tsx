"use client";

import type { NextPage } from "next";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
  LessonFastForwardEndFailSvg,
  LessonFastForwardEndPassSvg,
} from "~/components/Svgs";
import { useBoundStore } from "~/hooks/useBoundStore";

// TYPES ----------------------------------------------------------------------

// Lesson 1: Sorting Materials Into Groups
const lesson1Problems = [
  {
    type: "MCQ",
    question: "Why is sorting materials into groups important?",
    answers: [
      "To make everything look neat",
      "To confuse scientists", 
      "To study materials easily and use them properly",
      "To make them expensive"
    ],
    correctAnswer: 2,
    explanation: "Sorting helps us compare, study, and understand materials better. It allows us to select the right material for a specific purpose."
  },
  {
    type: "MCQ",
    question: "Which of the following is NOT a benefit of sorting materials?",
    answers: [
      "Helps in studying materials",
      "Makes recycling easier",
      "Wastes more time",
      "Helps in choosing the right material"
    ],
    correctAnswer: 2,
    explanation: "Sorting actually saves time and effort by organizing materials efficiently. It does not waste time."
  },
  {
    type: "MCQ",
    question: "A cooking pot is made of metal mainly because:",
    answers: [
      "It looks shiny",
      "It is colourful",
      "It conducts heat well",
      "It is cheap"
    ],
    correctAnswer: 2,
    explanation: "Metals are good conductors of heat, which is why cooking pots are made from them so that food cooks evenly."
  },
  {
    type: "MCQ",
    question: "Grouping materials based on similar properties is known as:",
    answers: [
      "Painting",
      "Sorting",
      "Mixing",
      "Designing"
    ],
    correctAnswer: 1,
    explanation: "Sorting means grouping similar materials together based on common properties like appearance, hardness, solubility, etc."
  }
] as const;

// Objects and Materials Lesson (Good Morning)
const objectsAndMaterialsProblems = [
  {
    type: "MCQ",
    question: "What is the main difference between an object and a material?",
    answers: [
      "Object is expensive, material is cheap",
      "Object is made of material",
      "Material is always colourful",
      "Object is natural, material is man-made"
    ],
    correctAnswer: 1,
    explanation: "Materials are substances (wood, metal, plastic) while objects are things made from them (chair, table, bottle)."
  },
  {
    type: "MCQ",
    question: "Which material is commonly used to make transparent windows?",
    answers: [
      "Wood",
      "Glass",
      "Metal",
      "Rubber"
    ],
    correctAnswer: 1,
    explanation: "Glass is transparent, allowing light to pass through, which makes it perfect for windows."
  },
  {
    type: "MCQ",
    question: "A pencil is usually made of:",
    answers: [
      "Plastic",
      "Rubber",
      "Wood",
      "Metal"
    ],
    correctAnswer: 2,
    explanation: "The body of a pencil is made of wood because it is easy to sharpen and holds the graphite core well."
  },
  {
    type: "MCQ",
    question: "Which of the following materials can be used to make multiple objects?",
    answers: [
      "Gold",
      "Wood",
      "Oil",
      "Salt"
    ],
    correctAnswer: 1,
    explanation: "Wood is used to make many objects like furniture, pencils, doors, boats, etc."
  }
] as const;

// Properties of Materials Lesson (Greet People)
const propertiesOfMaterialsProblems = [
  {
    type: "MCQ",
    question: "What property makes a material float on water?",
    answers: [
      "Density",
      "Color",
      "Shape",
      "Size"
    ],
    correctAnswer: 0,
    explanation: "Materials with lower density than water will float on water. Density is the mass per unit volume of a material."
  },
  {
    type: "MCQ",
    question: "Which material is most likely to be transparent?",
    answers: [
      "Wood",
      "Metal",
      "Glass",
      "Clay"
    ],
    correctAnswer: 2,
    explanation: "Glass is transparent because it allows light to pass through it clearly, unlike wood, metal, or clay which are opaque."
  },
  {
    type: "MCQ",
    question: "What happens to most metals when heated?",
    answers: [
      "They become softer",
      "They expand",
      "They change color",
      "They become magnetic"
    ],
    correctAnswer: 1,
    explanation: "Most metals expand when heated due to increased molecular motion, which is why metal bridges have expansion joints."
  },
  {
    type: "MCQ",
    question: "Which property makes rubber useful for making tires?",
    answers: [
      "It is transparent",
      "It is flexible and elastic",
      "It is magnetic",
      "It conducts electricity"
    ],
    correctAnswer: 1,
    explanation: "Rubber's flexibility and elasticity make it perfect for tires as it can deform under pressure and return to its original shape."
  }
] as const;

// Add this type definition after the problem arrays (around line 172)
type LessonData = {
  problems: readonly any[];
  title: string;
  nextUnlock: string | null;
  xpRequired: number;
};

// Update the lessonData declaration (around line 174)
const lessonData: Record<string, LessonData> = {
  "Importance of Sorting Materials": { 
    problems: lesson1Problems, 
    title: "Sorting Materials Into Groups",
    nextUnlock: "Objects and Materials",
    xpRequired: 4
  },
  "Objects and Materials": { 
    problems: objectsAndMaterialsProblems, 
    title: "Objects and Materials",
    nextUnlock: "Properties of Materials",
    xpRequired: 8
  },
  "Properties of Materials": { 
    problems: propertiesOfMaterialsProblems, 
    title: "Properties of Materials",
    nextUnlock: null,
    xpRequired: 12
  }
};

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 1000 / 60) % 60;
  return [minutes, seconds].map(n => n.toString().padStart(2, "0")).join(":");
};

const TIMER_DURATION_MS = 30000; // 30s per problem
const MAX_LIVES = 3;
const XP_PER_CORRECT_ANSWER = 1; // Each correct answer = 1 lesson completed
const XP_BONUS_FOR_PERFECT = 1; // Perfect score = 1 additional lesson completed

// COMPONENTS -----------------------------------------------------------------

const ProgressBar = ({ hearts, timer }: { hearts: number; timer: number }) => (
  <header className="flex items-center gap-2">
    {[...Array(MAX_LIVES)].map((_, i) =>
      i < hearts ? (
        <LessonTopBarHeart key={i} width={24} height={24} />
      ) : (
        <LessonTopBarEmptyHeart key={i} width={24} height={24} />
      )
    )}
    <span className="ml-4 font-mono text-gray-800 text-sm">⏳ {formatTime(timer)}</span>
  </header>
);

const FancyButton = ({
  children,
  onClick,
  disabled,
  variant = "default"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "correct" | "incorrect" | "selected";
}) => {
  const baseClasses = "rounded-xl px-6 py-3 font-semibold shadow-md transform transition-all border";
  
  const variantClasses = {
    default: "bg-gradient-to-br from-white to-beige-200 hover:from-beige-100 hover:to-white border-gray-300 hover:scale-105 hover:shadow-lg",
    selected: "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 text-blue-800 scale-105",
    correct: "bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800",
    incorrect: "bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

// STYLED END SCREENS ---------------------------------------------------------

const LessonFastForwardEndFail = ({ unitNumber }: { unitNumber: number }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <LessonFastForwardEndFailSvg width={96} height={96} />
      <h1 className="text-2xl font-bold text-red-600">
        Did not unlock the next part.
      </h1>
      <FancyButton>
        <Link href="/learn">Back to main</Link>
      </FancyButton>
    </div>
  </div>
);

const LessonFastForwardEndPass = ({ nextUnlock }: { nextUnlock: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <LessonFastForwardEndPassSvg width={96} height={96} />
      <h1 className="text-2xl font-bold text-green-600">
        Unlocked "{nextUnlock}"! 
      </h1>
      <p className="text-center text-gray-600">
        You've successfully completed all questions and unlocked the next lesson!
      </p>
      <FancyButton>
        <Link href="/learn">Back to main</Link>
      </FancyButton>
    </div>
  </div>
);

const LessonComplete = ({
  correctAnswerCount,
  incorrectAnswerCount,
  xpGained,
  isPerfect,
  nextUnlock,
  lessonsCompleted,
}: {
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  xpGained: number;
  isPerfect: boolean;
  nextUnlock: string | null;
  lessonsCompleted: number;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800">Lesson Complete </h1>
      <div className="text-center space-y-2">
        <p className="text-lg text-green-600 font-semibold">
          Correct answers: {correctAnswerCount}
        </p>
        <p className="text-lg text-red-600 font-semibold">
          Incorrect answers: {incorrectAnswerCount}
        </p>
        <p className="text-lg text-blue-600 font-semibold">
          Lessons Completed: {lessonsCompleted}
        </p>
        {isPerfect && (
          <p className="text-lg text-yellow-600 font-semibold">
            Perfect Score! ⭐
          </p>
        )}
        {nextUnlock && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg text-purple-600 font-semibold">
              🚀 "{nextUnlock}" lesson unlocked!
            </p>
            <Link
              href={`/lesson?lesson=${encodeURIComponent(nextUnlock)}`}
              className="underline text-blue-600"
            >
              Start "{nextUnlock}"
            </Link>
          </div>
        )}
      </div>
      <FancyButton>
        <Link href="/learn">Back to main</Link>
      </FancyButton>
    </div>
  </div>
);

// PROBLEM UI -----------------------------------------------------------------

const ProblemMCQ = ({
  problem,
  selectedAnswer,
  setSelectedAnswer,
  correctAnswerShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  hearts,
  timer,
}: any) => {
  const { question, answers, correctAnswer, explanation } = problem;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col gap-6">
        <ProgressBar hearts={hearts} timer={timer} />
        <h2 className="text-xl font-bold text-gray-800 text-center">{question}</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {answers.map((answer: string, i: number) => {
            let buttonVariant: "default" | "correct" | "incorrect" | "selected" = "default";
            
            if (correctAnswerShown) {
              if (i === correctAnswer) {
                buttonVariant = "correct";
              } else if (i === selectedAnswer && !isAnswerCorrect) {
                buttonVariant = "incorrect";
              }
            } else if (selectedAnswer === i) {
              buttonVariant = "selected";
            }
            
            return (
              <label key={i} className="cursor-pointer">
                <FancyButton
                  onClick={() => setSelectedAnswer(i)}
                  disabled={correctAnswerShown}
                  variant={buttonVariant}
                >
                  <div className="flex items-center gap-3 w-full text-left">
                    <input
                      type="radio"
                      name="answer"
                      value={i}
                      checked={selectedAnswer === i}
                      onChange={() => setSelectedAnswer(i)}
                      disabled={correctAnswerShown}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-bold text-lg">{String.fromCharCode(65 + i)})</span>
                    <span>{answer}</span>
                  </div>
                </FancyButton>
              </label>
            );
          })}
        </div>
        
        {!correctAnswerShown ? (
          <FancyButton onClick={onCheckAnswer} disabled={selectedAnswer === null}>
            Check Answer
          </FancyButton>
        ) : (
          <FancyButton onClick={onFinish}>Continue</FancyButton>
        )}
        
        {correctAnswerShown && (
          <div className="space-y-4">
            <div
              className={`text-center font-semibold text-lg ${
                isAnswerCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAnswerCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold text-lg">💡</span>
                <div>
                  <p className="font-semibold text-blue-800 mb-1">Explanation:</p>
                  <p className="text-blue-700">{explanation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// MAIN LESSON ----------------------------------------------------------------

const Lesson: NextPage = () => {
  const router = useRouter();
  const [problemIdx, setProblemIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timer, setTimer] = useState(TIMER_DURATION_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [nextUnlock, setNextUnlock] = useState<string | null>(null);

  // Store hooks
  const increaseXp = useBoundStore((state) => state.increaseXp);
  const increaseLessonsCompleted = useBoundStore((state) => state.increaseLessonsCompleted);
  const lessonsCompleted = useBoundStore((state) => state.lessonsCompleted);

  // near the top, after problem arrays
  type LessonKey = "1" | "2" | "3";
  const lessons: Record<LessonKey, { title: string; problems: readonly any[] }> = {
    "1": { title: "Importance of Sorting Materials", problems: lesson1Problems },
    "2": { title: "Objects and Materials", problems: objectsAndMaterialsProblems },
    "3": { title: "Properties of Materials", problems: [] }, // temp
  };

  const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

  const resolveLessonKey = (q?: string): LessonKey => {
    if (!q) return "1";
    // direct numeric
    if (q === "1" || q === "2" || q === "3") return q;
    // known aliases
    if (q === "objects" || q === "good-morning") return "2";
    if (q === "properties" || q === "greet-people") return "3";
    // titles or slugs
    const byTitle =
      q === "Importance of Sorting Materials" ? "1" :
      q === "Objects and Materials" ? "2" :
      q === "Properties of Materials" ? "3" : undefined;
    if (byTitle) return byTitle;
    const bySlug =
      q === slug("Importance of Sorting Materials") ? "1" :
      q === slug("Objects and Materials") ? "2" :
      q === slug("Properties of Materials") ? "3" : undefined;
    return (bySlug as LessonKey) ?? "1";
  };

  // state + effect
  const [currentLesson, setCurrentLesson] = useState<LessonKey>("1");
  useEffect(() => {
    if (!router.isReady) return;
    setCurrentLesson(resolveLessonKey(router.query.lesson as string | undefined));
  }, [router.isReady, router.query.lesson]);

  // select problems; do NOT fall back to lesson1
  const problems = lessons[currentLesson].problems;
  if (!router.isReady) return null; // or a loader
  if (problems.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Coming soon</div>;
  }

  const problem = problems[problemIdx];

  // Timer effect
  useEffect(() => {
    if (timer > 0 && !correctAnswerShown) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1000);
      }, 1000);
    } else if (timer === 0 && !correctAnswerShown) {
      // Time's up - treat as wrong answer
      setCorrectAnswerShown(true);
      setIncorrectAnswerCount(c => c + 1);
      setLives(l => Math.max(0, l - 1));
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, correctAnswerShown]);

  // Reset timer for new problems
  useEffect(() => {
    if (!correctAnswerShown) {
      setTimer(TIMER_DURATION_MS);
    }
  }, [problemIdx]);

  // Early exits
  if (lives <= 0) return <LessonFastForwardEndFail unitNumber={1} />;
  if (showSummary) {
    const isPerfect = incorrectAnswerCount === 0;
    return (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        incorrectAnswerCount={incorrectAnswerCount}
        xpGained={xpGained}
        isPerfect={isPerfect}
        nextUnlock={nextUnlock}
        lessonsCompleted={lessonsCompleted}
      />
    );
  }

  if (!problem) return <div>Unknown problem type</div>;

  const isAnswerCorrect = selectedAnswer === problem.correctAnswer;

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    
    if (isAnswerCorrect) {
      setCorrectAnswerCount(c => c + 1);
      const xpToAdd = XP_PER_CORRECT_ANSWER;
      setXpGained(prev => prev + xpToAdd);
      increaseXp(xpToAdd);
    } else {
      setIncorrectAnswerCount(c => c + 1);
      setLives(l => Math.max(0, l - 1));
    }
  };

  const onFinish = () => {
    if (problemIdx + 1 < problems.length) {
      setProblemIdx(problemIdx + 1);
      setSelectedAnswer(null);
      setCorrectAnswerShown(false);
      setTimer(TIMER_DURATION_MS);
    } else {
      // Lesson completed: +10 XP, mark completed, go back to main
      increaseXp(10);
      increaseLessonsCompleted(1);
      setShowSummary(true);
    }
  };

  switch (problem.type) {
    case "MCQ":
      return (
        <ProblemMCQ
          problem={problem}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          correctAnswerShown={correctAnswerShown}
          isAnswerCorrect={isAnswerCorrect}
          onCheckAnswer={onCheckAnswer}
          onFinish={onFinish}
          hearts={lives}
          timer={timer}
        />
      );
    default:
      return <div>Unknown problem type</div>;
  }
};

export default Lesson;