import { WeddingConfig, RSVPRecord } from '../types/wedding';

// Asset paths from generation
export const HERO_IMAGE = '/src/assets/images/hero_wedding_couple_1790610979338.jpg';
export const GROOM_IMAGE = '/src/assets/images/groom_portrait_1790611004426.jpg';
export const BRIDE_IMAGE = '/src/assets/images/bride_portrait_1790611016646.jpg';
export const GALLERY_MOMENTS = '/src/assets/images/gallery_wedding_moments_1790611031670.jpg';
export const VENUE_AMBIANCE = '/src/assets/images/wedding_venue_ambiance_1790611045766.jpg';

export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  heroImageUrl: HERO_IMAGE,
  groom: {
    fullName: 'Raden Arya Pratama, S.T.',
    nickName: 'Arya',
    photoUrl: GROOM_IMAGE,
    fatherName: 'Bpk. Ir. Bambang Hermanto',
    motherName: 'Ibu Hj. Siti Nurhasanah',
    childOrder: 'Putra Pertama dari',
    instagramHandle: 'aryapratama.id',
    bio: 'Pribadi yang tenang, arsitek pecinta kopi dan fotografi alam.',
  },
  bride: {
    fullName: 'Maya Faradiba Putri, S.Ds.',
    nickName: 'Maya',
    photoUrl: BRIDE_IMAGE,
    fatherName: 'Bpk. H. Tri Nugroho, S.E.',
    motherName: 'Ibu Ratna Dewi Wardani',
    childOrder: 'Putri Kedua dari',
    instagramHandle: 'mayafaradiba',
    bio: 'Desainer interior ceria yang percaya kehangatan dimulai dari ketulusan hati.',
  },
  eventDateISO: '2026-10-24T08:00:00+07:00',
  quote: {
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      subtitle: 'Prosesi Ijab Kabul & Penyerahan Mahar',
      date: '2026-10-24',
      dateFormatted: 'Sabtu, 24 Oktober 2026',
      startTime: '08:00',
      endTime: '10:00',
      timezone: 'WIB',
      venueName: 'The Botanical Glasshouse - Plataran Menteng',
      venueAddress: 'Jl. H.O.S. Cokroaminoto No.42, Menteng, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10350',
      mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5218765470535!2d106.8288544!3d-6.1946765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305bc84f09%3A0x6d9f0f9b6cba1b93!2sPlataran%20Menteng!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
      mapsDirectUrl: 'https://maps.google.com/?q=Plataran+Menteng+Jakarta',
      dressCode: 'Batik / Formal Attire bernuansa Bumi (Earth Tone)',
      notes: 'Khusus keluarga inti dan kerabat terdekat demi kekhidmatan doa.',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      subtitle: 'Perayaan Syukuran & Ramah Tamah Bersama',
      date: '2026-10-24',
      dateFormatted: 'Sabtu, 24 Oktober 2026',
      startTime: '11:00',
      endTime: '14:30',
      timezone: 'WIB',
      venueName: 'Grand Ballroom & Garden Paviliun - Plataran Menteng',
      venueAddress: 'Jl. H.O.S. Cokroaminoto No.42, Menteng, Kec. Menteng, Kota Jakarta Pusat, 10350',
      mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5218765470535!2d106.8288544!3d-6.1946765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305bc84f09%3A0x6d9f0f9b6cba1b93!2sPlataran%20Menteng!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
      mapsDirectUrl: 'https://maps.google.com/?q=Plataran+Menteng+Jakarta',
      dressCode: 'Pakaian Formal / Gaun / Batik Eksklusif',
      notes: 'Kehadiran Anda merupakan kehormatan dan kebahagiaan terbesar bagi kami.',
    },
  ],
  loveStory: [
    {
      id: '1',
      year: 'September 2020',
      title: 'Awal Pertemuan yang Tak Disengaja',
      description: 'Pertama kali bertegur sapa dalam proyek kolaborasi arsitektur dan interior di Jakarta. Diskusi tentang warna dan ruang perlahan menumbuhkan kecocokan rasa.',
    },
    {
      id: '2',
      year: 'Agustus 2022',
      title: 'Menjalin Komitmen Bersama',
      description: 'Setelah dua tahun saling mengenal kebaikan serta kekurangan masing-masing, kami sepakat untuk berjalan bersama dalam satu tujuan hidup yang sama.',
    },
    {
      id: '3',
      year: 'Desember 2025',
      title: 'Momen Lamaran Sakral',
      description: 'Dikelilingi deburan ombak dan keluarga terdekat di Bandung, Arya melamar Maya. Jawaban hangat mengawali langkah baru menuju pelaminan.',
    },
    {
      id: '4',
      year: 'Oktober 2026',
      title: 'Menuju Ikatan Abadi',
      description: 'Dengan izin Tuhan Yang Maha Esa dan restu orang tua tercinta, kami mengikrarkan janji suci pernikahan untuk saling menyayangi selamanya.',
    },
  ],
  bankAccounts: [
    {
      id: 'bca',
      bankName: 'Bank BCA',
      accountNumber: '8410294821',
      accountHolder: 'Raden Arya Pratama',
      bankLogoColor: '#0060AF',
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      accountNumber: '1370019284729',
      accountHolder: 'Maya Faradiba Putri',
      bankLogoColor: '#003366',
    },
  ],
  physicalGift: {
    recipientName: 'Raden Arya & Maya Faradiba',
    phoneNumber: '+62 812-8901-2345',
    fullAddress: 'Jl. Kemang Timur No. 18B, Bangka, Mampang Prapatan',
    postalCode: '12730',
    city: 'Jakarta Selatan, DKI Jakarta',
    notes: 'Mohon sertakan nama pengirim pada label paket.',
  },
  gallery: [
    {
      id: 'g1',
      url: HERO_IMAGE,
      caption: 'Langkah pertama menuju lembaran baru bersama.',
      category: 'prewedding',
    },
    {
      id: 'g2',
      url: GALLERY_MOMENTS,
      caption: 'Tawa dan kehangatan di tengah taman botani rindang.',
      category: 'prewedding',
    },
    {
      id: 'g3',
      url: VENUE_AMBIANCE,
      caption: 'Ruang penuh cinta tempat ikrar suci akan diabadikan.',
      category: 'venue',
    },
    {
      id: 'g4',
      url: BRIDE_IMAGE,
      caption: 'Senyuman penuh ketulusan sang calon mempelai wanita.',
      category: 'ceremony',
    },
    {
      id: 'g5',
      url: GROOM_IMAGE,
      caption: 'Tekad tulus sang calon mempelai pria untuk masa depan.',
      category: 'ceremony',
    },
  ],
  musicTitle: 'Canon in D - Romantic Acoustic',
  musicArtist: 'Johann Pachelbel (Acoustic Strings)',
  clientPasscode: 'mayaarya2026',
  colorTheme: 'gold',
  organizerContacts: [
    {
      role: 'Wedding Organizer (Niskala Planner)',
      name: 'Dimas Wicaksono',
      phone: '+62 811-2345-6789',
    },
    {
      role: 'Perwakilan Keluarga Pria',
      name: 'Bpk. Irfan Prasetyo',
      phone: '+62 812-3456-7890',
    },
    {
      role: 'Perwakilan Keluarga Wanita',
      name: 'Bpk. Rahmat Hidayat',
      phone: '+62 813-9876-5432',
    },
  ],
};

export const INITIAL_RSVPS: RSVPRecord[] = [
  {
    id: 'rsvp-1',
    guestName: 'dr. Anisa & Keluarga',
    attendance: 'hadir',
    guestCount: 2,
    message: 'Selamat berbahagia untuk Arya dan Maya! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H yaa!',
    createdAt: '2026-09-27T10:15:00Z',
  },
  {
    id: 'rsvp-2',
    guestName: 'Ferry Pratama (Alumni ITB)',
    attendance: 'hadir',
    guestCount: 1,
    message: 'Selamat menempuh hidup baru sahabatku Arya! Turut berbahagia untuk kalian berdua.',
    createdAt: '2026-09-26T14:40:00Z',
  },
  {
    id: 'rsvp-3',
    guestName: 'Rina Kusuma & Rekan Desain',
    attendance: 'hadir',
    guestCount: 3,
    message: 'Happy wedding Maya cantik & Mas Arya! Semoga pernikahannya diberkahi kebahagiaan dan rezeki yang melimpah selalu.',
    createdAt: '2026-09-25T09:20:00Z',
  },
  {
    id: 'rsvp-4',
    guestName: 'Bambang Soediro (Kerabat Surabaya)',
    attendance: 'tidak_hadir',
    guestCount: 0,
    message: 'Mohon maaf belum bisa hadir langsung karena dinas luar kota, namun doa restu kami sekeluarga selalu menyertai kedua mempelai.',
    createdAt: '2026-09-24T18:05:00Z',
  },
];

export const INITIAL_GUESTS = [
  {
    id: 'guest-1',
    name: 'dr. Anisa & Keluarga',
    phone: '081234567890',
    category: 'Sahabat',
    notes: 'Meja VIP A',
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'guest-2',
    name: 'Ferry Pratama (Alumni ITB)',
    phone: '081398765432',
    category: 'Sahabat',
    notes: 'Teman Kuliah Arya',
    createdAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'guest-3',
    name: 'Rina Kusuma & Rekan Desain',
    phone: '085712345678',
    category: 'Rekan Kerja',
    notes: 'Rekan Kantor Maya',
    createdAt: '2026-09-20T12:00:00Z',
  },
  {
    id: 'guest-4',
    name: 'Bpk. Irfan Prasetyo & Istri',
    phone: '081122334455',
    category: 'Keluarga',
    notes: 'Keluarga Pria',
    createdAt: '2026-09-20T13:00:00Z',
  },
  {
    id: 'guest-5',
    name: 'Bambang Soediro (Kerabat Surabaya)',
    phone: '081987654321',
    category: 'Keluarga',
    notes: 'Kerabat Surabaya',
    createdAt: '2026-09-20T14:00:00Z',
  },
];

