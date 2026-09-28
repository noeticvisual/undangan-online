import { supabase, isSupabaseConfigured } from './supabaseClient';
import { RSVPRecord } from '../types/wedding';

export const rsvpService = {
  /**
   * Add RSVP to Supabase (if configured) and localStorage
   */
  async addRsvp(record: RSVPRecord): Promise<{ success: boolean; data?: RSVPRecord; error?: string }> {
    try {
      // Store in localStorage as fallback
      const stored = localStorage.getItem('niskala_wedding_rsvps');
      const localRsvps = stored ? JSON.parse(stored) : [];
      localRsvps.unshift(record);
      localStorage.setItem('niskala_wedding_rsvps', JSON.stringify(localRsvps));

      // Store in Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('rsvps')
          .insert([{
            id: record.id,
            name: record.name,
            email: record.email,
            phone: record.phone,
            status: record.status,
            number_of_guests: record.numberOfGuests,
            special_request: record.specialRequest,
            is_wish: record.isWish,
            created_at: record.createdAt,
          }]);

        if (error) {
          console.error('Error saving to Supabase:', error);
          return { success: true, data: record }; // Return success anyway since it's stored locally
        }
      }

      return { success: true, data: record };
    } catch (error) {
      console.error('Error in addRsvp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Fetch all RSVPs from Supabase (if configured) or localStorage
   */
  async fetchRsvps(): Promise<RSVPRecord[]> {
    try {
      // Try Supabase first
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching from Supabase:', error);
          return this.getLocalRsvps();
        }

        if (data) {
          return data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            status: item.status,
            numberOfGuests: item.number_of_guests,
            specialRequest: item.special_request,
            isWish: item.is_wish,
            createdAt: item.created_at,
          }));
        }
      }

      return this.getLocalRsvps();
    } catch (error) {
      console.error('Error in fetchRsvps:', error);
      return this.getLocalRsvps();
    }
  },

  /**
   * Get RSVPs from localStorage
   */
  getLocalRsvps(): RSVPRecord[] {
    const stored = localStorage.getItem('niskala_wedding_rsvps');
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Delete RSVP from both Supabase and localStorage
   */
  async deleteRsvp(rsvpId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete from localStorage
      const stored = localStorage.getItem('niskala_wedding_rsvps');
      if (stored) {
        const localRsvps = JSON.parse(stored);
        const filtered = localRsvps.filter((r: any) => r.id !== rsvpId);
        localStorage.setItem('niskala_wedding_rsvps', JSON.stringify(filtered));
      }

      // Delete from Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('rsvps')
          .delete()
          .eq('id', rsvpId);

        if (error) {
          console.error('Error deleting from Supabase:', error);
          return { success: true }; // Return success since local is deleted
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteRsvp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Clear all RSVPs from both Supabase and localStorage
   */
  async clearAllRsvps(): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear localStorage
      localStorage.removeItem('niskala_wedding_rsvps');

      // Clear Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('rsvps')
          .delete()
          .neq('id', ''); // Delete all rows

        if (error) {
          console.error('Error clearing Supabase:', error);
          return { success: true }; // Return success since local is cleared
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error in clearAllRsvps:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Sync local RSVPs to Supabase (useful if offline data needs to be synced)
   */
  async syncLocalToSupabase(): Promise<{ success: boolean; synced: number; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, synced: 0, error: 'Supabase not configured' };
    }

    try {
      const localRsvps = this.getLocalRsvps();
      let synced = 0;

      for (const rsvp of localRsvps) {
        const { data: existing } = await supabase
          .from('rsvps')
          .select('id')
          .eq('id', rsvp.id)
          .single();

        if (!existing) {
          const { error } = await supabase
            .from('rsvps')
            .insert([{
              id: rsvp.id,
              name: rsvp.name,
              email: rsvp.email,
              phone: rsvp.phone,
              status: rsvp.status,
              number_of_guests: rsvp.numberOfGuests,
              special_request: rsvp.specialRequest,
              is_wish: rsvp.isWish,
              created_at: rsvp.createdAt,
            }]);

          if (!error) {
            synced++;
          }
        }
      }

      return { success: true, synced };
    } catch (error) {
      console.error('Error in syncLocalToSupabase:', error);
      return {
        success: false,
        synced: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
