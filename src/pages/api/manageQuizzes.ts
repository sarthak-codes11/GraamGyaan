import type { NextApiRequest, NextApiResponse } from "next";
import { addQuiz, deleteQuiz, readQuizDB, updateQuiz, type MCQ, type Quiz } from "~/server/quizzes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const db = readQuizDB();
      return res.status(200).json({ ok: true, quizzes: db.quizzes });
    }

    if (req.method === "POST") {
      const body = req.body as { title?: string; unitNumber?: number; questions?: MCQ[] };
      const title = String(body.title ?? "Untitled Quiz");
      const unitNumber = typeof body.unitNumber === "number" ? body.unitNumber : undefined;
      const questions = Array.isArray(body.questions) ? body.questions : [];
      // Basic validation
      const valid = questions.every((q) =>
        typeof q?.question === "string" &&
        Array.isArray(q?.options) && q.options.length >= 2 &&
        typeof q?.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < q.options.length
      );
      if (!valid) return res.status(400).json({ error: "Invalid questions payload" });
      const saved = addQuiz({ title, unitNumber, questions });
      return res.status(200).json({ ok: true, quiz: saved });
    }

    if (req.method === "PATCH") {
      const body = req.body as Partial<Quiz> & { id?: string };
      if (!body.id) return res.status(400).json({ error: "Missing id" });
      const patched = updateQuiz(body.id, {
        title: body.title,
        unitNumber: body.unitNumber,
        questions: body.questions as MCQ[] | undefined,
      });
      if (!patched) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ok: true, quiz: patched });
    }

    if (req.method === "DELETE") {
      const { id } = req.query as { id?: string };
      if (!id) return res.status(400).json({ error: "Missing id" });
      const removed = deleteQuiz(id);
      if (!removed) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ok: true, quiz: removed });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Server error" });
  }
}
