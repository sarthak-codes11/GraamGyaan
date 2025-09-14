"use client";

import type { NextPage } from "next";
import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  AppleSvg,
  BoySvg,
  WomanSvg,
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
  LessonFastForwardEndFailSvg,
  LessonFastForwardEndPassSvg,
} from "~/components/Svgs";

// TYPES ----------------------------------------------------------------------

const lessonProblem1 = {
  type: "SELECT_1_OF_3",
  question: `Which one of these is "the apple"?`,
  answers: [
    { icon: <AppleSvg />, name: "la manzana" },
    { icon: <BoySvg />, name: "el niño" },
    { icon: <WomanSvg />, name: "la mujer" },
  ],
  correctAnswer: 0,
} as const;

const lessonProblem2 = {
  type: "WRITE_IN_ENGLISH",
  question: "El niño",
  answerTiles: ["woman", "milk", "water", "I", "The", "boy"],
  correctAnswer: [4, 5],
} as const;

const lessonProblems = [lessonProblem1, lessonProblem2];

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 1000 / 60) % 60;
  return [minutes, seconds].map(n => n.toString().padStart(2, "0")).join(":");
};

const TIMER_DURATION_MS = 60000; // 60s per problem
const MAX_LIVES = 3;

// COMPONENTS -----------------------------------------------------------------

const ProgressBar = ({ hearts, timer }: { hearts: number; timer: number }) => (
  <header className="flex items-center gap-4">
    {[...Array(MAX_LIVES)].map((_, i) =>
      i < hearts ? <LessonTopBarHeart key={i} /> : <LessonTopBarEmptyHeart key={i} />
    )}
    <span className="ml-4 font-mono text-gray-800">⏳ {formatTime(timer)}</span>
  </header>
);

const FancyButton = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-xl px-6 py-3 font-semibold shadow-md transform transition-all 
      bg-gradient-to-br from-white to-beige-200 hover:from-beige-100 hover:to-white 
      border border-gray-300 hover:scale-105 
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
  >
    {children}
  </button>
);

// STYLED END SCREENS ---------------------------------------------------------

const LessonFastForwardEndFail = ({ unitNumber }: { unitNumber: number }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <LessonFastForwardEndFailSvg width={96} height={96} />
      <h1 className="text-2xl font-bold text-red-600">
        Did not unlock Unit {unitNumber}.
      </h1>
      <FancyButton>
        <Link href="/learn">Back to main</Link>
      </FancyButton>
    </div>
  </div>
);

const LessonFastForwardEndPass = ({ unitNumber }: { unitNumber: number }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <LessonFastForwardEndPassSvg width={96} height={96} />
      <h1 className="text-2xl font-bold text-green-600">
        Unlocked Unit {unitNumber}!
      </h1>
      <FancyButton>
        <Link href="/learn">Back to main</Link>
      </FancyButton>
    </div>
  </div>
);

const LessonComplete = ({
  correctAnswerCount,
  incorrectAnswerCount,
}: {
  correctAnswerCount: number;
  incorrectAnswerCount: number;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800">Lesson Complete 🎉</h1>
      <p className="text-lg text-green-600 font-semibold">
        Correct answers: {correctAnswerCount}
      </p>
      <p className="text-lg text-red-600 font-semibold">
        Incorrect answers: {incorrectAnswerCount}
      </p>
      <FancyButton>
        <Link href="/learn">Back to main</Link>
      </FancyButton>
    </div>
  </div>
);

// PROBLEM UI -----------------------------------------------------------------

const ProblemSelect1Of3 = ({
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
  const { question, answers, correctAnswer } = problem;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col gap-6">
        <ProgressBar hearts={hearts} timer={timer} />
        <h2 className="text-xl font-bold text-gray-800">{question}</h2>
        <div className="grid grid-cols-3 gap-4">
          {answers.map((ans: any, i: number) => (
            <FancyButton
              key={i}
              onClick={() => setSelectedAnswer(i)}
              disabled={correctAnswerShown}
            >
              <div className="flex flex-col items-center gap-2">
                {ans.icon}
                <span>{ans.name}</span>
              </div>
            </FancyButton>
          ))}
        </div>
        {!correctAnswerShown ? (
          <FancyButton onClick={onCheckAnswer} disabled={selectedAnswer === null}>
            Check
          </FancyButton>
        ) : (
          <FancyButton onClick={onFinish}>Continue</FancyButton>
        )}
        {correctAnswerShown && (
          <div
            className={`text-center font-semibold ${
              isAnswerCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isAnswerCorrect
              ? "Correct!"
              : `Correct answer: ${answers[correctAnswer].name}`}
          </div>
        )}
      </div>
    </div>
  );
};

const ProblemWriteInEnglish = ({
  problem,
  selectedAnswers,
  setSelectedAnswers,
  correctAnswerShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  hearts,
  timer,
}: any) => {
  const { question, answerTiles, correctAnswer } = problem;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col gap-6">
        <ProgressBar hearts={hearts} timer={timer} />
        <h2 className="text-xl font-bold text-gray-800">
          {question} <span className="text-gray-600">(Write in English)</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {selectedAnswers.map((i: number, idx: number) => (
            <FancyButton
              key={idx}
              onClick={() =>
                setSelectedAnswers(selectedAnswers.filter((x: number) => x !== i))
              }
            >
              {answerTiles[i]}
            </FancyButton>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {answerTiles.map((tile: string, i: number) => (
            <FancyButton
              key={i}
              onClick={() => setSelectedAnswers([...selectedAnswers, i])}
              disabled={selectedAnswers.includes(i) || correctAnswerShown}
            >
              {tile}
            </FancyButton>
          ))}
        </div>

        {!correctAnswerShown ? (
          <FancyButton
            onClick={onCheckAnswer}
            disabled={selectedAnswers.length === 0}
          >
            Check
          </FancyButton>
        ) : (
          <FancyButton onClick={onFinish}>Continue</FancyButton>
        )}

        {correctAnswerShown && (
          <div
            className={`text-center font-semibold ${
              isAnswerCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isAnswerCorrect
              ? "Correct!"
              : `Correct answer: ${correctAnswer
                  .map((i: number) => answerTiles[i])
                  .join(" ")}`}
          </div>
        )}
      </div>
    </div>
  );
};

// MAIN LESSON ----------------------------------------------------------------

const Lesson: NextPage = () => {
  const [problemIdx, setProblemIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timer, setTimer] = useState(TIMER_DURATION_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const problem = lessonProblems[problemIdx];
  const unitNumber = 1;

  // Early exits
  if (lives <= 0) return <LessonFastForwardEndFail unitNumber={unitNumber} />;
  if (showSummary)
    return (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        incorrectAnswerCount={incorrectAnswerCount}
      />
    );

  if (!problem) return <div>Unknown problem type</div>;

  const isAnswerCorrect =
    problem.type === "SELECT_1_OF_3"
      ? selectedAnswer === problem.correctAnswer
      : numbersEqual(selectedAnswers, problem.correctAnswer);

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    if (isAnswerCorrect) setCorrectAnswerCount(c => c + 1);
    else setIncorrectAnswerCount(c => c + 1);
  };

  const onFinish = () => {
    if (problemIdx + 1 < lessonProblems.length) {
      setProblemIdx(problemIdx + 1);
    } else {
      setShowSummary(true);
    }
  };

  switch (problem.type) {
    case "SELECT_1_OF_3":
      return (
        <ProblemSelect1Of3
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
    case "WRITE_IN_ENGLISH":
      return (
        <ProblemWriteInEnglish
          problem={problem}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
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
