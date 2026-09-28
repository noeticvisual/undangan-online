import { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage (will reset on each deployment)
// For production, use a database like MongoDB, PostgreSQL, or Supabase
let rsvpData: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      rsvps: rsvpData,
      count: rsvpData.length,
      message: 'RSVP data retrieved successfully'
    });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      if (!data.name || !data.status) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, status' 
        });
      }

      const rsvpEntry = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      rsvpData.unshift(rsvpEntry);

      return res.status(200).json({ 
        success: true, 
        count: rsvpData.length,
        data: rsvpEntry
      });
    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to process RSVP',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
