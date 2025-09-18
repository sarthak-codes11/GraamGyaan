import fs from "fs";
import path from "path";

export type MCQ = {
  question: string;
  options: string[]; // length >= 2, typically 4
  correctIndex: number; // 0-based
};

export type Quiz = {
  id: string; // timestamp-based id
  title: string;
  unitNumber?: number;
  questions: MCQ[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type QuizDB = {
  quizzes: Quiz[];
};

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

export const getProjectRoot = () => path.resolve(process.cwd());
export const getDataDir = () => path.join(getProjectRoot(), "data");
export const getQuizFilePath = () => path.join(getDataDir(), "quizzes.json");

export const readQuizDB = (): QuizDB => {
  ensureDir(getDataDir());
  const file = getQuizFilePath();
  if (!fs.existsSync(file)) {
    const empty: QuizDB = { quizzes: [] };
    fs.writeFileSync(file, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as QuizDB;
    if (!parsed.quizzes) parsed.quizzes = [];
    return parsed;
  } catch {
    return { quizzes: [] };
  }
};

export const writeQuizDB = (db: QuizDB) => {
  ensureDir(getDataDir());
  fs.writeFileSync(getQuizFilePath(), JSON.stringify(db, null, 2), "utf8");
};

export const addQuiz = (quiz: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => {
  const db = readQuizDB();
  const now = new Date().toISOString();
  const item: Quiz = {
    id: `${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    ...quiz,
  };
  db.quizzes.unshift(item);
  writeQuizDB(db);
  return item;
};

export const updateQuiz = (id: string, patch: Partial<Omit<Quiz, "id" | "createdAt">>) => {
  const db = readQuizDB();
  const q = db.quizzes.find((x) => x.id === id);
  if (!q) return null;
  if (typeof patch.title === "string") q.title = patch.title;
  if (typeof patch.unitNumber !== "undefined") q.unitNumber = patch.unitNumber;
  if (Array.isArray(patch.questions)) q.questions = patch.questions;
  q.updatedAt = new Date().toISOString();
  writeQuizDB(db);
  return q;
};

export const deleteQuiz = (id: string) => {
  const db = readQuizDB();
  const idx = db.quizzes.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const [removed] = db.quizzes.splice(idx, 1);
  writeQuizDB(db);
  return removed;
};
