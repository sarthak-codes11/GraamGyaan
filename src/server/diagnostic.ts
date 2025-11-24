import { SeededRandom } from '../utils/seededRandom';
import { questionBankByGrade, DiagnosticQuestion, SubjectQuestionBank, Difficulty, findQuestionById } from '../data/questionBank';

export type GeneratedQuestion = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  options?: { id: string; text: string }[];
  input_type?: string;
  correct_answer_id: string;
  explanation: string;
};

export type GenerateParams = { grade: string; subject: string; seed?: string | number };

export function generateDiagnosticQuiz({ grade, subject, seed }: GenerateParams) {
  const bank: SubjectQuestionBank | undefined = questionBankByGrade[grade]?.[subject];
  if (!bank) {
    return { error: 'QUESTION_BANK_NOT_FOUND', message: `No question bank for grade=${grade} subject=${subject}` };
  }
  const rng = new SeededRandom(seed);
  const topics = Object.keys(bank);
  if (topics.length < 4) {
    return { error: 'INSUFFICIENT_TOPICS', message: 'Need at least 4 topics in the question bank' };
  }
  const difficultyTargets: Difficulty[] = ['easy','easy','easy','medium','medium','medium','hard','hard'];
  const poolByTopicAndDiff: Record<string, Record<Difficulty, DiagnosticQuestion[]>> = {};
  for (const t of topics) {
    poolByTopicAndDiff[t] = { easy: [], medium: [], hard: [] };
    const list = bank[t] ?? [];
    for (const q of list) {
      poolByTopicAndDiff[t][q.difficulty].push(q);
    }
  }

  const selected: DiagnosticQuestion[] = [];
  const used = new Set<string>();

  // Step 1: ensure at least 4 topics covered
  const shuffledTopics = rng.shuffleInPlace([...topics]);
  const firstTopics = shuffledTopics.slice(0, 4);
  const remainingDifficulties = [...difficultyTargets];
  for (const t of firstTopics) {
    // pick a difficulty from remaining that has availability in this topic
    const diffs = rng.shuffleInPlace(['easy','medium','hard'] as Difficulty[]);
    let picked: DiagnosticQuestion | undefined = undefined;
    let pickedDiffIndex = -1;
    for (let dIdx = 0; dIdx < diffs.length && !picked; dIdx++) {
      const d = diffs[dIdx] as Difficulty;
      const remIdx = remainingDifficulties.findIndex(x => x === d);
      if (remIdx === -1) continue;
      const cand = (poolByTopicAndDiff[t]?.[d] ?? []).filter(q => !used.has(q.id));
      if (cand.length > 0) {
        const idx = rng.int(cand.length);
        const choice = cand[idx];
        if (choice) picked = choice;
        pickedDiffIndex = remIdx;
      }
    }
    // fallback: any difficulty available
    if (!picked) {
      const candAny = (['easy','medium','hard'] as Difficulty[])
        .flatMap(d => (poolByTopicAndDiff[t]?.[d] ?? []))
        .filter(q => !used.has(q.id));
      if (candAny.length === 0) continue;
      const idx = rng.int(candAny.length);
      const choice = candAny[idx];
      if (choice) {
        picked = choice;
        pickedDiffIndex = remainingDifficulties.findIndex(x => x === choice.difficulty);
      }
    }
    if (picked) {
      selected.push(picked);
      used.add(picked.id);
      if (pickedDiffIndex !== -1) remainingDifficulties.splice(pickedDiffIndex, 1);
    }
  }

  // Step 2: fill remaining slots to reach 8 with difficulty targets
  const allQuestions = topics.flatMap(t => bank[t] ?? []);
  while (selected.length < 8 && remainingDifficulties.length > 0) {
    // try to satisfy remaining difficulties first
    const d = remainingDifficulties[0];
    // prefer topics not yet used to increase coverage
    const usedTopics = new Set(selected.map(q => q.topic));
    const candidateTopics = topics.filter(t => !usedTopics.has(t));
    const topicOrder = rng.shuffleInPlace(candidateTopics.length ? candidateTopics : [...topics]);
    let picked: DiagnosticQuestion | null = null;
    for (const t of topicOrder) {
      const list = bank[t] ?? [];
      const cand = list.filter(q => q.difficulty === d && !used.has(q.id));
      if (cand.length) {
        const idx = rng.int(cand.length);
        const choice = cand[idx];
        if (choice) { picked = choice; break; }
      }
    }
    if (!picked) {
      // fallback any of remaining difficulty across all
      const cand2 = allQuestions.filter(q => q.difficulty === d && !used.has(q.id));
      if (cand2.length) {
        const idx = rng.int(cand2.length);
        const choice = cand2[idx];
        if (choice) picked = choice;
      }
    }
    if (!picked) {
      // if no question left for this difficulty, drop it and continue
      remainingDifficulties.shift();
      continue;
    }
    selected.push(picked);
    used.add(picked.id);
    remainingDifficulties.shift();
  }

  // if still not 8, fill with any remaining
  if (selected.length < 8) {
    const rest = allQuestions.filter(q => !used.has(q.id));
    rng.shuffleInPlace(rest);
    for (const q of rest) {
      if (selected.length >= 8) break;
      selected.push(q);
      used.add(q.id);
    }
  }

  // final check
  const coveredTopics = new Set(selected.map(q => q.topic));
  if (coveredTopics.size < 4) {
    // attempt to swap in additional topics
    const missingTopics = topics.filter(t => !coveredTopics.has(t));
    for (const mt of missingTopics) {
      if (coveredTopics.size >= 4) break;
      const cand = (bank[mt] ?? []).find(q => !used.has(q.id));
      if (!cand) continue;
      // replace a question from an over-represented topic
      const replaceIdx = selected.findIndex(x => selected.filter(y => y.topic === x.topic).length > 1);
      if (replaceIdx !== -1) {
        const toReplace = selected[replaceIdx];
        if (toReplace) {
          used.delete(toReplace.id);
          selected[replaceIdx] = cand;
          used.add(cand.id);
          coveredTopics.add(mt);
        }
      }
    }
  }

  const questions: GeneratedQuestion[] = selected.map(q => ({
    id: q.id,
    topic: q.topic,
    difficulty: q.difficulty,
    prompt: q.prompt,
    options: q.options,
    input_type: q.type === 'input' ? 'text' : undefined,
    correct_answer_id: q.correct_answer_id,
    explanation: q.explanation,
  }));

  return {
    grade,
    subject,
    seed: seed ?? null,
    total: questions.length,
    questions,
  };
}

export function scoreDiagnostic(grade: string, subject: string, answers: { id: string; answer_id: string }[]) {
  let correct = 0;
  const perTopic: Record<string, { correct: number; total: number }> = {};
  for (const ans of answers) {
    const q = findQuestionById(grade, subject, ans.id);
    if (!q) continue;
    const entry = (perTopic[q.topic] ||= { correct: 0, total: 0 });
    entry.total += 1;
    if (q.correct_answer_id === ans.answer_id) {
      correct += 1;
      entry.correct += 1;
    }
  }
  const total = answers.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  let label: 'Needs Foundations' | 'Developing' | 'Proficient';
  if (percentage < 50) label = 'Needs Foundations';
  else if (percentage < 75) label = 'Developing';
  else label = 'Proficient';

  const recommendations = buildRecommendations(label, perTopic);

  return {
    score: { raw: correct, total, percentage },
    label,
    recommendations,
    details: { per_topic: perTopic },
  };
}

function buildRecommendations(label: string, perTopic: Record<string, { correct: number; total: number }>) {
  const weakestTopics = Object.entries(perTopic)
    .map(([topic, s]) => ({ topic, pct: s.total ? s.correct / s.total : 0 }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 2)
    .map(x => x.topic);

  if (label === 'Needs Foundations') {
    return [
      `Review basics of: ${weakestTopics.join(', ') || 'core topics'}`,
      'Do 3–5 easy practice sets to build confidence',
      'Rewatch intro lessons and target Easy questions',
    ];
  }
  if (label === 'Developing') {
    return [
      `Target practice on: ${weakestTopics.join(', ') || 'mixed topics'}`,
      'Mix Easy and Medium sets; focus on explanations',
      'Attempt 1–2 challenge problems after practice',
    ];
  }
  return [
    'Continue with Medium problems to consolidate skills',
    `Take on Hard problems in: ${weakestTopics.join(', ') || 'varied topics'}`,
    'Attempt a timed mini-quiz to test mastery',
  ];
}
