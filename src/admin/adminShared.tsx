import React from 'react';
import { WeddingConfig, WeddingEvent, LoveStoryItem, BankAccount, GalleryItem, OrganizerContact } from '../types/wedding';
import { DEFAULT_WEDDING_CONFIG, HERO_IMAGE, GROOM_IMAGE, BRIDE_IMAGE, GALLERY_MOMENTS, VENUE_AMBIANCE } from '../data/defaultWeddingData';

export type { WeddingConfig };

export const EMPTY_ORGANIZER: OrganizerContact = { role: '', name: '', phone: '' };

export function createDefaultEvent(): WeddingEvent {
  const base = DEFAULT_WEDDING_CONFIG.events[0];
  return {
    ...base,
    id: `event-${Date.now()}`,
    title: 'Acara Baru',
    subtitle: '',
  };
}

export function createLoveStoryItem(): LoveStoryItem {
  return { id: `story-${Date.now()}`, year: '', title: '', description: '' };
}

export function createBankAccount(): BankAccount {
  return { id: `bank-${Date.now()}`, bankName: '', accountNumber: '', accountHolder: '' };
}

export function createGalleryItem(url: string): GalleryItem {
  return { id: `gal-${Date.now()}`, url, caption: '', category: 'prewedding' };
}

export const ASSET_LIBRARY = [
  { label: 'Hero Pasangan', url: HERO_IMAGE },
  { label: 'Mempelai Pria', url: GROOM_IMAGE },
  { label: 'Mempelai Wanita', url: BRIDE_IMAGE },
  { label: 'Momen Galeri', url: GALLERY_MOMENTS },
  { label: 'Suasana Venue', url: VENUE_AMBIANCE },
];

export const FIELD_STYLES =
  'w-full px-3 py-2 text-sm rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] text-[#25201C] dark:text-[#F3EEEA] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50';

export const LABEL_STYLES = 'block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1';

export function TextField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className={LABEL_STYLES}>{props.label}</label>
      {props.multiline ? (
        <textarea
          rows={props.rows ?? 3}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
          className={FIELD_STYLES}
        />
      ) : (
        <input
          type="text"
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
          className={`${FIELD_STYLES} ${props.mono ? 'font-mono text-xs' : ''}`}
        />
      )}
    </div>
  );
}

export function SelectField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className={LABEL_STYLES}>{props.label}</label>
      <select value={props.value} onChange={(e) => props.onChange(e.target.value)} className={FIELD_STYLES}>
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CardFrame(props: { title?: string; children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="relative p-4 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#141A17] space-y-3">
      {props.title && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-[#B89047]">{props.title}</h4>
          {props.onRemove && (
            <button
              type="button"
              onClick={props.onRemove}
              className="text-[11px] text-red-500 hover:text-red-600 font-medium cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>
      )}
      {props.children}
    </div>
  );
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
