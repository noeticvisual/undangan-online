import type { WeddingConfig } from '../../../src/types/wedding';
import { SERVER_DEFAULTS } from './serverDefaults.js';

export const CONFIG_KEY = 'wedding_config_v1';

export function normalizeConfig(raw: unknown): WeddingConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<WeddingConfig>;
  const base = SERVER_DEFAULTS;
  if (!candidate.groom || !candidate.bride || !Array.isArray(candidate.events)) return null;
  return {
    groom: { ...base.groom, ...candidate.groom },
    bride: { ...base.bride, ...candidate.bride },
    eventDateISO: typeof candidate.eventDateISO === 'string' ? candidate.eventDateISO : base.eventDateISO,
    events: candidate.events.length ? candidate.events : base.events,
    quote: { ...base.quote, ...(candidate.quote ?? {}) },
    loveStory: Array.isArray(candidate.loveStory) ? candidate.loveStory : base.loveStory,
    bankAccounts: Array.isArray(candidate.bankAccounts) ? candidate.bankAccounts : base.bankAccounts,
    qrisImageUrl: typeof candidate.qrisImageUrl === 'string' ? candidate.qrisImageUrl : base.qrisImageUrl,
    physicalGift: { ...base.physicalGift, ...(candidate.physicalGift ?? {}) },
    gallery: Array.isArray(candidate.gallery) && candidate.gallery.length ? candidate.gallery : base.gallery,
    musicTitle: typeof candidate.musicTitle === 'string' ? candidate.musicTitle : base.musicTitle,
    musicArtist: typeof candidate.musicArtist === 'string' ? candidate.musicArtist : base.musicArtist,
    colorTheme: candidate.colorTheme ?? base.colorTheme,
    organizerContacts: Array.isArray(candidate.organizerContacts)
      ? candidate.organizerContacts
      : base.organizerContacts,
  };
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export function errorJson(message: string, status: number): Response {
  return json({ error: message }, status);
}
