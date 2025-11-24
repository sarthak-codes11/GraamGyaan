import type { NextApiRequest, NextApiResponse } from 'next';
import { scoreDiagnostic } from '../../../server/diagnostic';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const { grade, subject, answers } = req.body as { grade: string; subject: string; answers: { id: string; answer_id: string }[] };
    if (!grade || !subject || !Array.isArray(answers)) return res.status(400).json({ error: 'Invalid payload' });
    const result = scoreDiagnostic(grade, subject, answers);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
}
