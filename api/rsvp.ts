import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface RSVPBody {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'confirmed' | 'declined' | 'pending';
  numberOfGuests?: number;
  specialRequest?: string;
  isWish?: boolean;
  createdAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Supabase is not configured',
      message: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set'
    });
  }

  // GET - Fetch all RSVPs
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({
          error: 'Failed to fetch RSVPs',
          details: error.message
        });
      }

      return res.status(200).json({
        success: true,
        count: data?.length || 0,
        rsvps: data || []
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // POST - Add new RSVP
  if (req.method === 'POST') {
    try {
      const body: RSVPBody = req.body;

      // Validasi
      if (!body.id || !body.name || !body.status) {
        return res.status(400).json({
          error: 'Missing required fields: id, name, status'
        });
      }

      if (!['confirmed', 'declined', 'pending'].includes(body.status)) {
        return res.status(400).json({
          error: 'Invalid status. Must be: confirmed, declined, or pending'
        });
      }

      // Insert ke Supabase
      const { data, error } = await supabase
        .from('rsvps')
        .insert([{
          id: body.id,
          name: body.name,
          email: body.email || null,
          phone: body.phone || null,
          status: body.status,
          number_of_guests: body.numberOfGuests || 1,
          special_request: body.specialRequest || null,
          is_wish: body.isWish || false,
          created_at: body.createdAt
        }])
        .select();

      if (error) {
        return res.status(400).json({
          error: 'Failed to insert RSVP',
          details: error.message
        });
      }

      return res.status(201).json({
        success: true,
        message: 'RSVP added successfully',
        data: data?.[0]
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // DELETE - Remove RSVP (requires admin)
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          error: 'Missing or invalid id parameter'
        });
      }

      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({
          error: 'Failed to delete RSVP',
          details: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'RSVP deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
