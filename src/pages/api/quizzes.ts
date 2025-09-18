import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  unitNumber: number;
  questions: QuizQuestion[];
  createdAt: string;
  isActive: boolean;
};

type QuizzesFile = { quizzes: Quiz[] };

const DATA_FILE = path.join(process.cwd(), 'data', 'quizzes.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify({ quizzes: [] }, null, 2), 'utf-8');
    }
  } catch (e) {
    // noop, will surface on read
  }
}

function readQuizzes(): QuizzesFile {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as QuizzesFile;
    if (!parsed || !Array.isArray(parsed.quizzes)) return { quizzes: [] };
    return parsed;
  } catch (err) {
    return { quizzes: [] };
  }
}

function writeQuizzes(data: QuizzesFile) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const data = readQuizzes();
      return res.status(200).json({ quizzes: data.quizzes });
    }

    case 'POST': {
      try {
        const incoming = req.body as Quiz;
        const data = readQuizzes();
        // prevent duplicates by id
        const idx = data.quizzes.findIndex(q => q.id === incoming.id);
        if (idx !== -1) {
          data.quizzes[idx] = incoming;
        } else {
          data.quizzes.push(incoming);
        }
        writeQuizzes(data);
        return res.status(201).json({ success: true, quiz: incoming });
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid quiz payload' });
      }
    }

    case 'PATCH': {
      try {
        const { id, isActive } = req.body as { id: string; isActive: boolean };
        const data = readQuizzes();
        const i = data.quizzes.findIndex(q => q.id === id);
        if (i === -1) return res.status(404).json({ error: 'Quiz not found' });
        const quizAtIndex = data.quizzes[i];
        if (!quizAtIndex) return res.status(404).json({ error: 'Quiz not found' });
        quizAtIndex.isActive = isActive;
        data.quizzes[i] = quizAtIndex;
        writeQuizzes(data);
        return res.status(200).json({ success: true, quiz: quizAtIndex });
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid request' });
      }
    }

    case 'DELETE': {
      const { id } = req.query;
      const data = readQuizzes();
      const before = data.quizzes.length;
      data.quizzes = data.quizzes.filter(q => q.id !== id);
      if (data.quizzes.length === before) return res.status(404).json({ error: 'Quiz not found' });
      writeQuizzes(data);
      return res.status(200).json({ success: true });
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
