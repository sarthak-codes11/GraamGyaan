import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { events } = req.body || {};
  
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    // Log the received events (in production, you might want to store these in a database)
    console.log('Received events:', events.length);
    
    // Here you can add your analytics processing logic
    // For example, store events in a database or forward to an analytics service
    
    return res.status(200).json({ 
      status: 'ok', 
      received: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing events:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
