"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Option = { id: string; text: string };

type GeneratedQuestion = {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  options?: Option[];
  input_type?: string;
  correct_answer_id: string;
  explanation: string;
};

type GeneratedQuiz = {
  grade: string;
  subject: string;
  seed: string | null;
  total: number;
  questions: GeneratedQuestion[];
};

type ScoreResult = {
  score: { raw: number; total: number; percentage: number };
  label: "Needs Foundations" | "Developing" | "Proficient";
  recommendations: string[];
  details: { per_topic: Record<string, { correct: number; total: number }> };
};

const DiagnosticPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();

  const queryGrade = (params?.get("grade") || "").trim();
  const querySubject = (params?.get("subject") || "").trim();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const grade = useMemo(() => {
    if (queryGrade) return queryGrade;
    if (typeof window !== "undefined") return window.localStorage.getItem("selectedGrade") || "";
    return "";
  }, [queryGrade]);

  const subject = useMemo(() => querySubject, [querySubject]);

  useEffect(() => {
    let active = true;
    const loadQuiz = async () => {
      try {
        const ls = typeof window !== "undefined" ? window.localStorage : null;
        if (!grade || !subject) {
          setLoading(false);
          return;
        }
        // Try cached quiz first
        const cached = ls?.getItem("diagnosticQuiz");
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as GeneratedQuiz;
            if (parsed && parsed.grade === grade && parsed.subject === subject && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
              if (active) setQuiz(parsed);
              setLoading(false);
              // Mark user as not new anymore
              try { ls?.setItem("isNewStudent", "false"); } catch {}
              return;
            }
          } catch {}
        }
        // Fetch fresh quiz
        const res = await fetch(`/api/diagnostic/generate?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = (await res.json()) as GeneratedQuiz;
        if (active) setQuiz(data);
        try { ls?.setItem("diagnosticQuiz", JSON.stringify(data)); ls?.setItem("isNewStudent", "false"); } catch {}
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadQuiz();
    return () => { active = false; };
  }, [grade, subject]);

  const current = quiz?.questions[qIndex];
  const onChoose = (qid: string, optionId: string) => setAnswers(prev => ({ ...prev, [qid]: optionId }));

  const canSubmit = useMemo(() => quiz && Object.keys(answers).length === (quiz.total || quiz.questions.length), [answers, quiz]);

  const submit = async () => {
    if (!quiz) return;
    setScoring(true);
    try {
      const payload = {
        grade: quiz.grade,
        subject: quiz.subject,
        answers: quiz.questions.map(q => ({ id: q.id, answer_id: answers[q.id] || "" })),
      };
      const res = await fetch("/api/diagnostic/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const data = (await res.json()) as ScoreResult;
        setResult(data);
        try { if (typeof window !== "undefined") window.localStorage.setItem("diagnosticResult", JSON.stringify(data)); } catch {}
      }
    } finally {
      setScoring(false);
    }
  };

  const continueToLearn = () => {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const lang = ls?.getItem("lang") || "";
    const s = subject || "";
    const path = lang === "hi" ? `/hindi?subject=${encodeURIComponent(s)}` : lang === "te" ? `/telugu?subject=${encodeURIComponent(s)}` : lang === "od" ? `/odia?subject=${encodeURIComponent(s)}` : `/learn?subject=${encodeURIComponent(s)}`;
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
        <div className="text-xl font-semibold">Preparing your diagnostic quiz…</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg">Unable to load diagnostic quiz.</div>
          <button className="rounded bg-green-600 px-4 py-2 text-white" onClick={continueToLearn}>Continue</button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-r from-emerald-50 to-emerald-100 p-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
          <h1 className="mb-4 text-3xl font-extrabold text-emerald-800">Your Diagnostic Result</h1>
          <div className="mb-4 text-lg">Score: {result.score.raw}/{result.score.total} ({result.score.percentage}%)</div>
          <div className="mb-6 text-2xl font-bold">Classification: {result.label}</div>
          <div className="mb-3 text-lg font-semibold">Recommended next actions:</div>
          <ul className="mb-6 list-disc pl-6">
            {result.recommendations.map((r, i) => (<li key={i}>{r}</li>))}
          </ul>
          <button onClick={continueToLearn} className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">Continue to Learn</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-emerald-50 to-emerald-100 p-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-2 text-3xl font-extrabold text-emerald-800">Diagnostic Quiz</h1>
        <div className="mb-6 text-gray-600">Grade {quiz.grade} · {quiz.subject} · Question {qIndex + 1} of {quiz.questions.length}</div>

        {current && (
          <div className="mb-6">
            <div className="mb-4 text-xl font-semibold">{current.prompt}</div>
            {current.options && (
              <div className="flex flex-col gap-3">
                {current.options.map(opt => (
                  <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`q-${current.id}`}
                      checked={(answers[current.id] || "") === opt.id}
                      onChange={() => onChoose(current.id, opt.id)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            )}
            {!current.options && current.input_type === "text" && (
              <input
                className="mt-2 w-full rounded border p-2"
                type="text"
                value={answers[current.id] || ""}
                onChange={(e) => onChoose(current.id, e.target.value)}
                placeholder="Your answer"
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            disabled={qIndex === 0}
            onClick={() => setQIndex(i => Math.max(0, i - 1))}
          >
            ← Previous
          </button>

          {qIndex < (quiz.questions.length - 1) ? (
            <button
              className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={!answers[current?.id || ""]}
              onClick={() => setQIndex(i => Math.min(quiz.questions.length - 1, i + 1))}
            >
              Next →
            </button>
          ) : (
            <button
              className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={!canSubmit || scoring}
              onClick={submit}
            >
              {scoring ? "Scoring..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
