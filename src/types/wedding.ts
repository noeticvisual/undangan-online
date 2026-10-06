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

  // Compatibility fields
  name?: string;
  email?: string;
  phone?: string;
  status?: 'confirmed' | 'declined' | 'pending' | 'hadir' | 'tidak_hadir' | 'ragu';
  numberOfGuests?: number;
  specialRequest?: string;
  isWish?: boolean;
}

export interface GuestItem {
  id: string;
  name: string;
  phone?: string;
  category?: 'Keluarga' | 'Sahabat' | 'VIP' | 'Rekan Kerja' | 'Tetangga' | string;
  notes?: string;
  createdAt: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export type AppViewMode = 'guest' | 'client' | 'admin';

export type ColorThemeKey = 'gold' | 'emerald' | 'rose' | 'slate';

export type InvitationTemplateId =
  | 'minang-royal'
  | 'javanese-royal'
  | 'modern-minimalist'
  | 'islamic-emerald'
  | 'rustic-botanical'
  | 'luxury-gold';

export interface TemplateMeta {
  id: InvitationTemplateId;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  secondaryColor: string;
  description: string;
  fontFamilyClass: string;
  ornamentType: 'minang' | 'gunungan' | 'minimalist' | 'arabesque' | 'botanical' | 'luxury';
  previewBgClass: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: 'canon' | 'gamelan' | 'piano' | 'strings' | 'acoustic' | 'custom';
  description: string;
  audioUrl?: string;
  durationFormatted?: string;
}

export interface WeddingConfig {
  coupleNames?: string;
  heroImageUrl?: string;
  openingCoverPhotoUrl?: string;
  templateId?: InvitationTemplateId;
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
  selectedTrackId?: string;
  customAudioUrl?: string;
  clientPasscode?: string;
  colorTheme: ColorThemeKey;
  organizerContacts: {
    role: string;
    name: string;
    phone: string;
  }[];
  // Photo Scale & Ratio Customization Settings
  openingCoverRatio?: 'arched' | '1:1' | '3:4' | '4:5' | '2:3' | 'circle';
  openingCoverScale?: number; // 80 - 150 (%)
  couplePhotoRatio?: 'arched' | 'portrait' | 'square' | '4:5' | 'circle';
  couplePhotoScale?: number; // 80 - 150 (%)
  galleryRatio?: '4:5' | 'square' | '4:3' | '16:9' | '3:2' | 'portrait';
  galleryPhotoSize?: 'small' | 'medium' | 'large';
  galleryAnimationEnabled?: boolean;
  galleryAnimationSpeed?: 'slow' | 'normal' | 'fast';
}

export interface WeddingProject {
  id: string;
  slug: string; // Unique URL identifier e.g. "maya-arya", "dimas-anita"
  title: string;
  templateId: InvitationTemplateId;
  config: WeddingConfig;
  guests: GuestItem[];
  rsvps: RSVPRecord[];
  createdAt: string;
  updatedAt: string;
}

