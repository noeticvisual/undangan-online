import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WeddingConfig, RSVPRecord, GuestItem, SupabaseConfig } from '../types/wedding';

const CONFIG_STORAGE_KEY = 'niskala_supabase_credentials';

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        url: parsed.url || envUrl,
        anonKey: parsed.anonKey || envKey,
        isConnected: Boolean(parsed.url && parsed.anonKey),
      };
    }
  } catch {
    // fallback
  }

  return {
    url: envUrl,
    anonKey: envKey,
    isConnected: Boolean(envUrl && envKey),
  };
}

export function saveStoredSupabaseConfig(config: { url: string; anonKey: string }): void {
  try {
    localStorage.setItem(
      CONFIG_STORAGE_KEY,
      JSON.stringify({
        url: config.url.trim(),
        anonKey: config.anonKey.trim(),
        isConnected: Boolean(config.url && config.anonKey),
      })
    );
  } catch {
    // fallback
  }
}

class SupabaseWeddingService {
  private client: SupabaseClient | null = null;
  private currentUrl = '';
  private currentKey = '';

  private getClient(): SupabaseClient | null {
    const config = getStoredSupabaseConfig();
    if (!config.url || !config.anonKey) {
      return null;
    }

    if (!this.client || this.currentUrl !== config.url || this.currentKey !== config.anonKey) {
      try {
        this.client = createClient(config.url, config.anonKey);
        this.currentUrl = config.url;
        this.currentKey = config.anonKey;
      } catch {
        this.client = null;
      }
    }
    return this.client;
  }

  public async testConnection(url: string, key: string): Promise<{ ok: boolean; message: string }> {
    if (!url || !key) {
      return { ok: false, message: 'URL Proyek dan Anon Key tidak boleh kosong.' };
    }
    try {
      const tempClient = createClient(url.trim(), key.trim());
      // Test querying wedding_configs
      const { error } = await tempClient.from('wedding_configs').select('id').limit(1);
      if (error) {
        // Table might not exist yet
        if (error.code === '42P01') {
          return {
            ok: true,
            message: 'Terkoneksi ke Supabase, namun tabel belum dibuat. Harap jalankan supabase_schema.sql di SQL Editor.',
          };
        }
        return { ok: false, message: `Koneksi gagal: ${error.message}` };
      }
      return { ok: true, message: 'Koneksi ke Supabase berhasil dan siap digunakan!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { ok: false, message: `Gagal menghubungkan: ${msg}` };
    }
  }

  // 1. Wedding Config sync
  public async fetchWeddingConfig(): Promise<WeddingConfig | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('wedding_configs')
        .select('config_data')
        .eq('id', 'default')
        .single();

      if (error || !data) return null;
      return data.config_data as WeddingConfig;
    } catch {
      return null;
    }
  }

  public async saveWeddingConfig(config: WeddingConfig): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('wedding_configs').upsert({
        id: 'default',
        config_data: config,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  }

  // 2. Client Guest List sync
  public async fetchGuests(): Promise<GuestItem[] | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('wedding_guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((d) => ({
        id: d.id,
        name: d.name,
        phone: d.phone,
        category: d.category,
        notes: d.notes,
        createdAt: d.created_at,
      }));
    } catch {
      return null;
    }
  }

  public async saveGuest(guest: GuestItem): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('wedding_guests').upsert({
        id: guest.id,
        name: guest.name,
        phone: guest.phone || '',
        category: guest.category || 'Umum',
        notes: guest.notes || '',
        created_at: guest.createdAt || new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  }

  public async deleteGuest(id: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('wedding_guests').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // 3. RSVP sync
  public async fetchRsvps(): Promise<RSVPRecord[] | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('wedding_rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((d) => ({
        id: d.id,
        guestName: d.guest_name,
        attendance: d.attendance as 'hadir' | 'tidak_hadir' | 'ragu',
        guestCount: d.guest_count,
        message: d.message,
        createdAt: d.created_at,
      }));
    } catch {
      return null;
    }
  }

  public async saveRsvp(rsvp: RSVPRecord): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('wedding_rsvps').upsert({
        id: rsvp.id,
        guest_name: rsvp.guestName,
        attendance: rsvp.attendance,
        guest_count: rsvp.guestCount,
        message: rsvp.message,
        created_at: rsvp.createdAt,
      });
      return !error;
    } catch {
      return false;
    }
  }

  public async deleteRsvp(id: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('wedding_rsvps').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseWeddingService = new SupabaseWeddingService();
