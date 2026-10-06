import {
  WeddingProject,
  WeddingConfig,
  GuestItem,
  RSVPRecord,
  InvitationTemplateId,
  ColorThemeKey,
} from '../types/wedding';
import {
  DEFAULT_WEDDING_CONFIG,
  INITIAL_GUESTS,
  INITIAL_RSVPS,
  GROOM_IMAGE,
  BRIDE_IMAGE,
  HERO_IMAGE,
  VENUE_AMBIANCE,
  GALLERY_MOMENTS,
} from '../data/defaultWeddingData';
import {
  MINANG_TAPESTRY_BG,
  MINANG_WEDDING_COUPLE,
  MINANG_BRIDE_SUNTIANG,
  MINANG_RUMAH_GADANG,
} from '../data/templateThemes';

const PROJECTS_STORAGE_KEY = 'niskala_wedding_projects_v4';
const ACTIVE_PROJECT_SLUG_KEY = 'niskala_active_project_slug';

/**
 * Default Seed Projects
 */
const SEED_PROJECTS: WeddingProject[] = [
  {
    id: 'proj-benny-indah',
    slug: 'benny-indah',
    title: 'The Wedding of Benny & Indah',
    templateId: 'minang-royal',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    guests: [
      {
        id: 'bi-g1',
        name: 'Yogi dan Ratna',
        category: 'Sahabat',
        phone: '081289001122',
        createdAt: '2026-03-05T09:00:00.000Z',
      },
      {
        id: 'bi-g2',
        name: 'Keluarga Bpk. H. Syamsuddin',
        category: 'Keluarga',
        phone: '081289001133',
        createdAt: '2026-03-05T09:15:00.000Z',
      },
      {
        id: 'bi-g3',
        name: 'Datuak Marajo & Rombongan Kerabat',
        category: 'VIP',
        phone: '081289001144',
        createdAt: '2026-03-05T09:30:00.000Z',
      },
    ],
    rsvps: [
      {
        id: 'bi-r1',
        guestName: 'Yogi dan Ratna',
        attendance: 'hadir',
        guestCount: 2,
        message: 'Barakallahu lakum wa baraka alaikum. Selamat untuk Benny & Indah! Rancak bana acaranyo, semoga sakinah mawaddah warahmah.',
        createdAt: '2026-03-10T10:00:00.000Z',
      },
      {
        id: 'bi-r2',
        guestName: 'Galeri Undangan Official',
        attendance: 'hadir',
        guestCount: 1,
        message: 'Happy wedding ya Benny dan Indah, lancar acaranya dan bahagia selalu!',
        createdAt: '2026-03-11T12:30:00.000Z',
      },
    ],
    config: {
      ...DEFAULT_WEDDING_CONFIG,
      templateId: 'minang-royal',
      clientPasscode: 'bennyindah2026',
      colorTheme: 'rose',
      heroImageUrl: MINANG_WEDDING_COUPLE,
      groom: {
        fullName: 'Benny Erlangga, S.Pd.',
        nickName: 'Benny',
        photoUrl: MINANG_WEDDING_COUPLE,
        fatherName: 'Bpk. Nasruddin Hatta',
        motherName: 'Ibu Elma Maria',
        childOrder: 'Putra Pertama dari',
        instagramHandle: 'benny.erlangga',
        bio: 'Pribadi yang bersahaja, bertanggung jawab, dan penuh kehangatan dalam keluarga.',
      },
      bride: {
        fullName: 'Indah Sukma, S.Pd.',
        nickName: 'Indah',
        photoUrl: MINANG_BRIDE_SUNTIANG,
        fatherName: 'Bpk. Drs. H. Anwar Chaniago',
        motherName: 'Ibu Hj. Syamsiar Tanjung',
        childOrder: 'Putri Kedua dari',
        instagramHandle: 'indah.sukma',
        bio: 'Sosok yang santun, mencintai seni budaya tradisi dan kehangatan kebersamaan keluarga.',
      },
      eventDateISO: '2026-10-25T10:00:00+07:00',
      quote: {
        text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
        source: 'QS. Ar-Rum: 21',
      },
      musicTitle: 'Saluang & Talempong Tradisi Minang',
      musicArtist: 'Ansambel Tradisional Minangkabau',
      selectedTrackId: 'minang_saluang_talempong',
      loveStory: [
        {
          id: 'ls-1',
          year: '2020',
          title: 'Awal Bertemu',
          description: 'Di dunia yang luas ini, kami percaya bahwa tidak ada pertemuan yang benar-benar kebetulan. Tahun mempertemukan dua hati pada waktu yang tepat dengan cara yang sederhana tapi bermakna.',
        },
        {
          id: 'ls-2',
          year: 'April 2025',
          title: 'Lamaran & Pertunangan',
          description: 'Atas kehendak-Nya, kami melangkah ke tahap yang lebih serius dengan melangsungkan prosesi lamaran adat. Restu tulus kedua belah keluarga mengiringi langkah suci kami.',
        },
        {
          id: 'ls-3',
          year: 'Oktober 2026',
          title: 'Hari Bahagia Pernikahan',
          description: 'Kini saatnya kami mengikat janji suci pernikahan, melangkah bersama mengarungi bahtera rumah tangga di bawah naungan berkah dan cinta sejati.',
        },
      ],
      bankAccounts: [
        {
          id: 'ba-1',
          bankName: 'Bank Mandiri',
          accountNumber: '1210012345678',
          accountHolder: 'Indah Sukma',
          bankLogoColor: '#003D79',
        },
        {
          id: 'ba-2',
          bankName: 'Bank Nagari / BSI',
          accountNumber: '71900889900',
          accountHolder: 'Benny Erlangga',
          bankLogoColor: '#00704A',
        },
      ],
      physicalGift: {
        recipientName: 'Benny Erlangga & Indah Sukma',
        phoneNumber: '0812-8900-1122',
        fullAddress: 'Jl. Harapan Dusun II Tanjung Morawa / Jl. Khatib Sulaiman No. 45',
        city: 'Kota Padang, Sumatera Barat',
        postalCode: '25135',
        notes: 'Konfirmasi pengiriman kado fisik melalui WhatsApp keluarga.',
      },
      events: [
        {
          id: 'akad',
          title: 'Akad Nikah Khidmat',
          subtitle: 'Prosesi Ijab Kabul & Mahar Pernikahan',
          date: '2026-10-25',
          dateFormatted: 'Sabtu, 25 Oktober 2026',
          startTime: '10:00',
          endTime: '12:00',
          timezone: 'WIB',
          venueName: 'Kediaman Mempelai Wanita',
          venueAddress: 'Jl. Harapan Dusun II Tanjung Morawa / Kompleks Rumah Gadang',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=Kompleks+Rumah+Gadang+Padang+Sumatera+Barat&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=Kompleks+Rumah+Gadang+Padang+Sumatera+Barat',
          dressCode: 'Batik Formal / Busana Tradisional Rapi',
        },
        {
          id: 'resepsi',
          title: 'Resepsi Pernikahan',
          subtitle: 'Perayaan Syukuran & Jamuan Doa Restu Bersama Kerabat',
          date: '2026-10-25',
          dateFormatted: 'Sabtu, 25 Oktober 2026',
          startTime: '12:00',
          endTime: 'Selesai',
          timezone: 'WIB',
          venueName: 'Gedung Pertemuan Bagindo Aziz Chan',
          venueAddress: 'Jl. Bagindo Aziz Chan No. 1, Kota Padang, Sumatera Barat',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=Gedung+Bagindo+Aziz+Chan+Padang+Sumatera+Barat&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=Gedung+Bagindo+Aziz+Chan+Padang+Sumatera+Barat',
          dressCode: 'Batik / Busana Formal Sopan',
        },
      ],
      gallery: [
        {
          id: 'm1',
          url: MINANG_WEDDING_COUPLE,
          caption: 'Busana agung pengantin Minang bertabur songket dan Suntiang emas.',
          category: 'prewedding',
        },
        {
          id: 'm2',
          url: MINANG_BRIDE_SUNTIANG,
          caption: 'Kecantikan anggun sang anak daro bermahkotakan Suntiang gadang.',
          category: 'ceremony',
        },
        {
          id: 'm3',
          url: MINANG_RUMAH_GADANG,
          caption: 'Kemegahan arsitektur Rumah Gadang dengan atap gonjong yang mempesona.',
          category: 'venue',
        },
        {
          id: 'm4',
          url: MINANG_TAPESTRY_BG,
          caption: 'Harmoni alam dan budaya luhur Ranah Minang.',
          category: 'details',
        },
      ],
    },
  },
  {
    id: 'proj-maya-arya',
    slug: 'maya-arya',
    title: 'Pernikahan Maya & Arya',
    templateId: 'javanese-royal',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
    guests: INITIAL_GUESTS,
    rsvps: INITIAL_RSVPS,
    config: {
      ...DEFAULT_WEDDING_CONFIG,
      templateId: 'javanese-royal',
      clientPasscode: 'mayaarya2026',
      colorTheme: 'gold',
    },
  },
  {
    id: 'proj-dimas-anita',
    slug: 'dimas-anita',
    title: 'Pernikahan Dimas & Anita',
    templateId: 'modern-minimalist',
    createdAt: '2026-02-10T08:30:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
    guests: [
      {
        id: 'da-g1',
        name: 'dr. Hendra Kusuma & Partner',
        category: 'VIP',
        phone: '081234567801',
        createdAt: '2026-02-15T09:00:00.000Z',
      },
      {
        id: 'da-g2',
        name: 'Nadya Amanda, S.Kom.',
        category: 'Sahabat',
        phone: '081234567802',
        createdAt: '2026-02-15T09:05:00.000Z',
      },
      {
        id: 'da-g3',
        name: 'Keluarga Bpk. Santoso',
        category: 'Keluarga',
        phone: '081234567803',
        createdAt: '2026-02-15T09:10:00.000Z',
      },
    ],
    rsvps: [
      {
        id: 'da-r1',
        guestName: 'dr. Hendra Kusuma & Partner',
        attendance: 'hadir',
        guestCount: 2,
        message: 'Selamat untuk Dimas dan Anita! Semoga selalu harmonis dan berbahagia selamanya.',
        createdAt: '2026-02-20T10:15:00.000Z',
      },
      {
        id: 'da-r2',
        guestName: 'Nadya Amanda, S.Kom.',
        attendance: 'hadir',
        guestCount: 1,
        message: 'Happy wedding Dimas & Anita! Cant wait to see you both on the big day!',
        createdAt: '2026-02-21T14:20:00.000Z',
      },
    ],
    config: {
      ...DEFAULT_WEDDING_CONFIG,
      templateId: 'modern-minimalist',
      clientPasscode: 'dimasanita2026',
      colorTheme: 'slate',
      heroImageUrl: HERO_IMAGE,
      groom: {
        fullName: 'Dimas Aditya Pratama, S.Kom.',
        nickName: 'Dimas',
        photoUrl: GROOM_IMAGE,
        fatherName: 'Bpk. Ir. Gunawan Wicaksono',
        motherName: 'Ibu Dra. Endang Suryani',
        childOrder: 'Putra Pertama dari',
        instagramHandle: 'dimas.aditya',
        bio: 'Tech enthusiast dan desainer visual yang percaya cinta adalah kolaborasi terindah.',
      },
      bride: {
        fullName: 'Anita Larasati, S.M.',
        nickName: 'Anita',
        photoUrl: BRIDE_IMAGE,
        fatherName: 'Bpk. H. Bambang Priyanto',
        motherName: 'Ibu Hj. Sri Rahayu',
        childOrder: 'Putri Bungsu dari',
        instagramHandle: 'anitalarasati',
        bio: 'Penyuka seni minimalis dan literatur, menemukan rumah teduhnya dalam diri Dimas.',
      },
      eventDateISO: '2026-11-14T09:00:00+07:00',
      quote: {
        text: 'Two souls with but a single thought, two hearts that beat as one. In true love, the smallest distance is too great, and the greatest distance can be bridged.',
        source: 'Kahlil Gibran',
      },
      musicTitle: 'Gymnopédie No. 1 - Piano Minimalist',
      musicArtist: 'Erik Satie (Contemporary Piano Solo)',
      selectedTrackId: 'piano-minimal',
      events: [
        {
          id: 'akad',
          title: 'Holy Matrimony & Ijab Kabul',
          subtitle: 'Prosesi Janji Suci & Doa Restu',
          date: '2026-11-14',
          dateFormatted: 'Sabtu, 14 November 2026',
          startTime: '09:00',
          endTime: '11:00',
          timezone: 'WIB',
          venueName: 'The Glass Pavilion SCBD',
          venueAddress: 'Kawasan Sudirman Central Business District Lot 8, Jakarta Selatan',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=SCBD+Lot+8+Jakarta+Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=SCBD+Jakarta',
          dressCode: 'Modern Monochromatic / Earth Tones (Bebas Rapi)',
        },
        {
          id: 'resepsi',
          title: 'Evening Celebration & Cocktail Dinner',
          subtitle: 'Makan Malam Hangat Bersama Kolega & Sahabat',
          date: '2026-11-14',
          dateFormatted: 'Sabtu, 14 November 2026',
          startTime: '18:30',
          endTime: '21:30',
          timezone: 'WIB',
          venueName: 'The Glass Pavilion SCBD - Rooftop Ballroom',
          venueAddress: 'Kawasan Sudirman Central Business District Lot 8, Jakarta Selatan',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=SCBD+Lot+8+Jakarta+Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=SCBD+Jakarta',
          dressCode: 'Cocktail Dress & Modern Suit / Batik Formal',
        },
      ],
    },
  },
  {
    id: 'proj-rizky-sarah',
    slug: 'rizky-sarah',
    title: 'Pernikahan Rizky & Sarah',
    templateId: 'islamic-emerald',
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
    guests: [
      {
        id: 'rs-g1',
        name: 'Ustadz Ahmad Fauzi & Keluarga',
        category: 'VIP',
        phone: '081398760001',
        createdAt: '2026-03-05T10:00:00.000Z',
      },
      {
        id: 'rs-g2',
        name: 'dr. Fathia Zahra',
        category: 'Sahabat',
        phone: '081398760002',
        createdAt: '2026-03-05T10:05:00.000Z',
      },
    ],
    rsvps: [
      {
        id: 'rs-r1',
        guestName: 'Ustadz Ahmad Fauzi & Keluarga',
        attendance: 'hadir',
        guestCount: 2,
        message: 'Barakallahu laka wa baraka alaika wa jamaa bainakuma fii khoir. Semoga sakinah mawaddah warahmah.',
        createdAt: '2026-03-10T11:00:00.000Z',
      },
    ],
    config: {
      ...DEFAULT_WEDDING_CONFIG,
      templateId: 'islamic-emerald',
      clientPasscode: 'rizkysarah2026',
      colorTheme: 'emerald',
      heroImageUrl: VENUE_AMBIANCE,
      groom: {
        fullName: 'Muhammad Rizky Fadilah, Lc., M.Ag.',
        nickName: 'Rizky',
        photoUrl: GROOM_IMAGE,
        fatherName: 'K.H. Dr. Abdullah Syukri',
        motherName: 'Nyai Hj. Nurul Hidayati',
        childOrder: 'Putra Kedua dari',
        instagramHandle: 'rizkyfadilah.id',
        bio: 'Pendidik yang senantiasa bersyukur, memandang pernikahan sebagai ladang ibadah seumur hidup.',
      },
      bride: {
        fullName: 'Sarah Aisyah Humaira, S.Farm., Apt.',
        nickName: 'Sarah',
        photoUrl: BRIDE_IMAGE,
        fatherName: 'Bpk. H. Lukman Hakim, S.T.',
        motherName: 'Ibu Hj. Halimah Munawaroh',
        childOrder: 'Putri Pertama dari',
        instagramHandle: 'sarah.humaira',
        bio: 'Apoteker yang gemar membaca dan menyukai keindahan alam dan ketulusan berbagi.',
      },
      eventDateISO: '2026-12-05T08:00:00+07:00',
      quote: {
        text: 'Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan orang-orang yang layak (bernikah) dari hamba-hamba sahayamu yang lelaki dan hamba-hamba sahayamu yang perempuan. Jika mereka miskin, Allah akan memampukan mereka dengan karunia-Nya.',
        source: 'QS. An-Nur: 32',
      },
      musicTitle: 'Shalawat & String Acoustic Serenade',
      musicArtist: 'Sacred Harmony Strings',
      selectedTrackId: 'canon-strings',
      events: [
        {
          id: 'akad',
          title: 'Akad Nikah Khidmat',
          subtitle: 'Prosesi Ijab Kabul & Khutbah Nikah',
          date: '2026-12-05',
          dateFormatted: 'Sabtu, 5 Desember 2026',
          startTime: '08:00',
          endTime: '10:00',
          timezone: 'WIB',
          venueName: 'Masjid Agung Sunda Kelapa - Ruang Utama',
          venueAddress: 'Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=Masjid+Agung+Sunda+Kelapa+Jakarta&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=Masjid+Agung+Sunda+Kelapa',
          dressCode: 'Baju Muslim / Batik Formal (Sopan & Rapi)',
        },
        {
          id: 'resepsi',
          title: 'Walimatul Ursy (Resepsi Pernikahan)',
          subtitle: 'Syukuran & Jamuan Doa Bersama Para Tamu',
          date: '2026-12-05',
          dateFormatted: 'Sabtu, 5 Desember 2026',
          startTime: '11:00',
          endTime: '14:00',
          timezone: 'WIB',
          venueName: 'Grand Ballroom Menara Bidakara',
          venueAddress: 'Jl. Gatot Subroto Kav. 71-73, Pancoran, Jakarta Selatan',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=Menara+Bidakara+Jakarta&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=Menara+Bidakara+Jakarta',
          dressCode: 'Busana Muslimah / Batik Nasional Formal',
        },
      ],
    },
  },
];

export class ProjectManagerService {
  /**
   * Load all projects from localStorage (or seeds if empty)
   */
  public getAllProjects(): WeddingProject[] {
    if (typeof window === 'undefined') return SEED_PROJECTS;
    try {
      const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (!raw) {
        // Also check if v2 or v1 had projects, and merge
        const oldRaw = localStorage.getItem('niskala_wedding_projects_v2');
        if (oldRaw) {
          try {
            const oldParsed = JSON.parse(oldRaw);
            if (Array.isArray(oldParsed) && oldParsed.length > 0) {
              const hasBenny = oldParsed.some((p: WeddingProject) => p.slug === 'benny-indah');
              const merged = hasBenny ? oldParsed : [SEED_PROJECTS[0], ...oldParsed];
              this.saveAllProjects(merged);
              return merged;
            }
          } catch {}
        }
        this.saveAllProjects(SEED_PROJECTS);
        return SEED_PROJECTS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (!parsed.some((p: WeddingProject) => p.slug === 'benny-indah')) {
          parsed.unshift(SEED_PROJECTS[0]);
        }
        const normalized = parsed.map((p: WeddingProject) => ({
          ...p,
          config: {
            ...DEFAULT_WEDDING_CONFIG,
            ...p.config,
            openingCoverRatio: p.config?.openingCoverRatio || 'arched',
            openingCoverScale: p.config?.openingCoverScale || 100,
            couplePhotoRatio: p.config?.couplePhotoRatio || 'arched',
            couplePhotoScale: p.config?.couplePhotoScale || 100,
            galleryRatio: p.config?.galleryRatio || '4:5',
            galleryPhotoSize: p.config?.galleryPhotoSize || 'medium',
            galleryAnimationEnabled: p.config?.galleryAnimationEnabled !== undefined ? p.config.galleryAnimationEnabled : true,
            galleryAnimationSpeed: p.config?.galleryAnimationSpeed || 'normal',
          },
        }));
        return normalized;
      }
    } catch {
      // Fallback
    }
    this.saveAllProjects(SEED_PROJECTS);
    return SEED_PROJECTS;
  }

  /**
   * Save all projects back to localStorage and sync to server
   */
  public saveAllProjects(projects: WeddingProject[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      // Background sync each project to server persistence
      projects.forEach((p) => this.syncProjectToServer(p));
    } catch (err) {
      console.error('Failed to save projects to localStorage:', err);
    }
  }

  /**
   * Sync single project to server storage
   */
  public syncProjectToServer(project: WeddingProject): void {
    if (typeof window === 'undefined') return;
    try {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      }).catch(() => {});
    } catch {}
  }

  /**
   * Sync all projects from server to client
   */
  public async syncFromServer(): Promise<WeddingProject[]> {
    if (typeof window === 'undefined') return this.getAllProjects();
    try {
      const resp = await fetch('/api/projects');
      if (resp.ok) {
        const data = await resp.json();
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          const local = this.getAllProjects();
          const map = new Map<string, WeddingProject>();
          // Server projects take precedence
          data.projects.forEach((p: WeddingProject) => map.set(p.slug.toLowerCase(), p));
          // Keep local-only projects too and sync them back to server
          local.forEach((p: WeddingProject) => {
            if (!map.has(p.slug.toLowerCase())) {
              map.set(p.slug.toLowerCase(), p);
              this.syncProjectToServer(p);
            }
          });
          const merged = Array.from(map.values());
          this.saveAllProjects(merged);
          return merged;
        } else {
          // If server is empty, push local projects to server
          const local = this.getAllProjects();
          local.forEach((p) => this.syncProjectToServer(p));
        }
      }
    } catch (err) {
      console.error('Failed to sync projects from server:', err);
    }
    return this.getAllProjects();
  }

  /**
   * Fetch project by slug from local cache or directly from server
   */
  public async fetchProjectBySlug(slug: string): Promise<WeddingProject | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();
    const local = this.getProjectBySlug(cleanSlug);
    if (local) return local;

    if (typeof window !== 'undefined') {
      try {
        const resp = await fetch(`/api/projects/${encodeURIComponent(cleanSlug)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.project) {
            const projects = this.getAllProjects();
            const existingIdx = projects.findIndex(
              (p) => p.slug.toLowerCase() === data.project.slug.toLowerCase()
            );
            if (existingIdx >= 0) {
              projects[existingIdx] = data.project;
            } else {
              projects.unshift(data.project);
            }
            this.saveAllProjects(projects);
            return data.project;
          }
        }
      } catch (err) {
        console.error('Error fetching project from server:', err);
      }
    }
    return null;
  }

  /**
   * Get project by its unique slug (case-insensitive)
   */
  public getProjectBySlug(slug: string): WeddingProject | null {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();
    const projects = this.getAllProjects();
    const found = projects.find((p) => p.slug.toLowerCase() === cleanSlug);
    return found || null;
  }

  /**
   * Get project by its ID
   */
  public getProjectById(id: string): WeddingProject | null {
    if (!id) return null;
    const projects = this.getAllProjects();
    return projects.find((p) => p.id === id) || null;
  }

  /**
   * Get or set active project slug for current session
   */
  public getActiveProjectSlug(): string {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACTIVE_PROJECT_SLUG_KEY);
      if (saved && this.getProjectBySlug(saved)) {
        return saved;
      }
    }
    const all = this.getAllProjects();
    return all[0]?.slug || 'benny-indah';
  }

  public setActiveProjectSlug(slug: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACTIVE_PROJECT_SLUG_KEY, slug);
    } catch {}
  }

  /**
   * Sanitize text to valid clean slug (e.g. "Maya & Arya" -> "maya-arya")
   */
  public generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/&/g, ' ')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Check if slug is available
   */
  public isSlugAvailable(slug: string, excludeId?: string): boolean {
    const cleanSlug = this.generateSlug(slug);
    if (!cleanSlug) return false;
    const projects = this.getAllProjects();
    return !projects.some((p) => p.slug.toLowerCase() === cleanSlug && p.id !== excludeId);
  }

  /**
   * Generate an automated unique slug based on groom & bride nicknames
   */
  public generateUniqueSlug(groomNick: string, brideNick: string, excludeId?: string): string {
    const baseSlug = this.generateSlug(`${groomNick}-${brideNick}`) || 'wedding-invitation';
    let candidate = baseSlug;
    let counter = 1;
    while (!this.isSlugAvailable(candidate, excludeId)) {
      counter++;
      candidate = `${baseSlug}-${counter}`;
    }
    return candidate;
  }

  /**
   * Create a new project for a client
   */
  public createProject(data: {
    title: string;
    slug: string;
    templateId: InvitationTemplateId;
    groomName: string;
    groomNick: string;
    brideName: string;
    brideNick: string;
    weddingDateISO: string;
    clientPasscode: string;
    colorTheme?: ColorThemeKey;
    openingCoverPhotoUrl?: string;
  }): WeddingProject {
    const projects = this.getAllProjects();
    const cleanSlug = this.generateSlug(data.slug) || this.generateUniqueSlug(data.groomNick, data.brideNick);
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Build fresh base config for new client
    const baseConfig: WeddingConfig = {
      ...DEFAULT_WEDDING_CONFIG,
      templateId: data.templateId,
      colorTheme: data.colorTheme || 'gold',
      clientPasscode: data.clientPasscode.trim() || `${data.groomNick.toLowerCase()}${data.brideNick.toLowerCase()}2026`,
      openingCoverPhotoUrl: data.openingCoverPhotoUrl?.trim() || DEFAULT_WEDDING_CONFIG.openingCoverPhotoUrl,
      groom: {
        ...DEFAULT_WEDDING_CONFIG.groom,
        fullName: data.groomName,
        nickName: data.groomNick,
        photoUrl: GROOM_IMAGE,
        instagramHandle: `${data.groomNick.toLowerCase()}.id`,
      },
      bride: {
        ...DEFAULT_WEDDING_CONFIG.bride,
        fullName: data.brideName,
        nickName: data.brideNick,
        photoUrl: BRIDE_IMAGE,
        instagramHandle: `${data.brideNick.toLowerCase()}.id`,
      },
      eventDateISO: data.weddingDateISO,
      events: [
        {
          id: 'akad',
          title: 'Akad Nikah',
          subtitle: 'Prosesi Ijab Kabul & Doa Restu',
          date: data.weddingDateISO.split('T')[0] || '2026-11-20',
          dateFormatted: new Date(data.weddingDateISO).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          startTime: '08:00',
          endTime: '10:00',
          timezone: 'WIB',
          venueName: 'Kediaman Mempelai / Gedung Akad',
          venueAddress: 'Lokasi Acara Akad Nikah',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=Lokasi+Akad+Nikah&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=Lokasi+Akad+Nikah',
          dressCode: 'Batik Formal / Busana Tradisional Sopan',
        },
        {
          id: 'resepsi',
          title: 'Resepsi Pernikahan',
          subtitle: 'Syukuran & Jamuan Doa Bersama Para Tamu',
          date: data.weddingDateISO.split('T')[0] || '2026-11-20',
          dateFormatted: new Date(data.weddingDateISO).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          startTime: '11:00',
          endTime: '13:00',
          timezone: 'WIB',
          venueName: 'Ballroom / Gedung Resepsi',
          venueAddress: 'Lokasi Acara Resepsi Pernikahan',
          mapsEmbedUrl: 'https://maps.google.com/maps?q=Lokasi+Resepsi+Pernikahan&t=&z=15&ie=UTF8&iwloc=&output=embed',
          mapsDirectUrl: 'https://maps.google.com/?q=Lokasi+Resepsi+Pernikahan',
          dressCode: 'Batik Formal / Gaun Malam / Pakaian Rapi',
        },
      ],
    };

    const newProject: WeddingProject = {
      id: newId,
      slug: cleanSlug,
      title: data.title || `Pernikahan ${data.groomNick} & ${data.brideNick}`,
      templateId: data.templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      guests: [
        {
          id: `g-${Date.now()}-1`,
          name: 'Keluarga Besar',
          category: 'Keluarga',
          phone: '',
          createdAt: new Date().toISOString(),
        },
        {
          id: `g-${Date.now()}-2`,
          name: 'Sahabat Dekat & Rekan',
          category: 'Sahabat',
          phone: '',
          createdAt: new Date().toISOString(),
        },
      ],
      rsvps: [],
      config: baseConfig,
    };

    projects.unshift(newProject);
    this.saveAllProjects(projects);
    this.setActiveProjectSlug(cleanSlug);
    return newProject;
  }

  /**
   * Duplicate an existing project to quickly create a clone for a new client
   */
  public duplicateProject(sourceId: string, newSlug: string, newTitle: string): WeddingProject | null {
    const projects = this.getAllProjects();
    const source = projects.find((p) => p.id === sourceId);
    if (!source) return null;

    const cleanSlug = this.generateSlug(newSlug) || `${source.slug}-copy`;
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const duplicated: WeddingProject = {
      ...source,
      id: newId,
      slug: cleanSlug,
      title: newTitle || `${source.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rsvps: [], // Start fresh RSVPs for new client
      guests: source.guests.map((g) => ({ ...g, id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` })),
      config: {
        ...source.config,
        clientPasscode: `${cleanSlug.replace(/[^a-z0-9]/gi, '')}2026`,
      },
    };

    projects.unshift(duplicated);
    this.saveAllProjects(projects);
    return duplicated;
  }

  /**
   * Update full project details or config
   */
  public updateProject(id: string, updates: Partial<WeddingProject>): WeddingProject | null {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: WeddingProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updated;
    this.saveAllProjects(projects);
    return updated;
  }

  /**
   * Update wedding config for a specific project
   */
  public updateProjectConfig(slug: string, config: WeddingConfig): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (index === -1) return;

    projects[index].config = config;
    projects[index].templateId = config.templateId || projects[index].templateId;
    projects[index].updatedAt = new Date().toISOString();
    this.saveAllProjects(projects);
  }

  /**
   * Add a guest to a specific project
   */
  public addGuest(slug: string, guest: GuestItem): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (index === -1) return;

    projects[index].guests.unshift(guest);
    projects[index].updatedAt = new Date().toISOString();
    this.saveAllProjects(projects);
  }

  /**
   * Bulk add guests to a specific project
   */
  public bulkAddGuests(slug: string, newGuests: GuestItem[]): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (index === -1) return;

    projects[index].guests = [...newGuests, ...projects[index].guests];
    projects[index].updatedAt = new Date().toISOString();
    this.saveAllProjects(projects);
  }

  /**
   * Delete a guest from a specific project
   */
  public deleteGuest(slug: string, guestId: string): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (index === -1) return;

    projects[index].guests = projects[index].guests.filter((g) => g.id !== guestId);
    projects[index].updatedAt = new Date().toISOString();
    this.saveAllProjects(projects);
  }

  /**
   * Add an RSVP to a specific project (guarantees no collision!)
   */
  public addRsvp(slug: string, rsvp: RSVPRecord): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (index === -1) return;

    projects[index].rsvps.unshift(rsvp);
    projects[index].updatedAt = new Date().toISOString();
    this.saveAllProjects(projects);
  }

  /**
   * Delete a project (protects from deleting last remaining project)
   */
  public deleteProject(id: string): { success: boolean; message: string } {
    const projects = this.getAllProjects();
    if (projects.length <= 1) {
      return { success: false, message: 'Tidak dapat menghapus satu-satunya projek yang tersisa.' };
    }

    const filtered = projects.filter((p) => p.id !== id);
    this.saveAllProjects(filtered);
    if (typeof window !== 'undefined') {
      try {
        fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
      } catch {}
    }
    return { success: true, message: 'Projek berhasil dihapus.' };
  }
}

export const projectManager = new ProjectManagerService();
