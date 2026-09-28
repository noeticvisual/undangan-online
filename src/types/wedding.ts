/**
 * Wedding Invitation Data Models & Types
 */

export interface PersonInfo {
  fullName: string;
  nickName: string;
  photoUrl: string;
  fatherName: string;
  motherName: string;
  childOrder: string; // e.g. "Putra pertama dari"
  instagramHandle?: string;
  bio?: string;
}

export interface WeddingEvent {
  id: 'akad' | 'resepsi' | string;
  title: string;
  subtitle: string;
  date: string; // e.g. "2026-10-24"
  dateFormatted: string; // e.g. "Sabtu, 24 Oktober 2026"
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "10:00"
  timezone: string; // e.g. "WIB"
  venueName: string;
  venueAddress: string;
  mapsEmbedUrl: string;
  mapsDirectUrl: string;
  dressCode?: string;
  notes?: string;
}

export interface LoveStoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankLogoColor?: string;
}

export interface PhysicalGiftAddress {
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  postalCode: string;
  city: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'prewedding' | 'ceremony' | 'venue' | 'details';
}

export interface RSVPRecord {
  id: string;
  guestName: string;
  attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  guestCount: number;
  message: string;
  createdAt: string; // ISO string
}

export type ColorThemeKey = 'gold' | 'emerald' | 'rose' | 'slate';

export interface WeddingConfig {
  groom: PersonInfo;
  bride: PersonInfo;
  eventDateISO: string; // "2026-10-24T08:00:00+07:00"
  events: WeddingEvent[];
  quote: {
    text: string;
    source: string;
  };
  loveStory: LoveStoryItem[];
  bankAccounts: BankAccount[];
  qrisImageUrl?: string;
  physicalGift: PhysicalGiftAddress;
  gallery: GalleryItem[];
  musicTitle: string;
  musicArtist: string;
  colorTheme: ColorThemeKey;
  organizerContacts: {
    role: string;
    name: string;
    phone: string;
  }[];
}
