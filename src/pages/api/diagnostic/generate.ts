import type { NextApiRequest, NextApiResponse } from 'next';
import { generateDiagnosticQuiz } from '../../../server/diagnostic';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }
  const grade = String(req.query.grade || '').trim();
  const subject = String(req.query.subject || '').trim();
  const seed = (req.query.seed as string | undefined) ?? undefined;
  if (!grade || !subject) return res.status(400).json({ error: 'Missing grade or subject' });
  const result = generateDiagnosticQuiz({ grade, subject, seed });
  if ((result as any).error) return res.status(400).json(result);
  return res.status(200).json(result);
}
