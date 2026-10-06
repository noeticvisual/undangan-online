import { InvitationTemplateId, TemplateMeta } from '../types/wedding';

export const MINANG_TAPESTRY_BG = '/src/assets/images/minang_tapestry_bg_1790839388923.jpg';
export const MINANG_WEDDING_COUPLE = '/src/assets/images/minang_wedding_couple_1790839408987.jpg';
export const MINANG_BRIDE_SUNTIANG = '/src/assets/images/minang_bride_suntiang_1790839423257.jpg';
export const MINANG_RUMAH_GADANG = '/src/assets/images/minang_rumah_gadang_1790839439988.jpg';

export const INVITATION_TEMPLATES: Record<InvitationTemplateId, TemplateMeta> = {
  'minang-royal': {
    id: 'minang-royal',
    name: 'Minangkabau Elegance & Emas Tradisi',
    tagline: 'Pesona Tradisi Minangkabau dalam Kesederhanaan Elegan',
    badge: 'Pernikahan Adat Minangkabau',
    accentColor: '#851C28',
    secondaryColor: '#C5A059',
    description: 'Sentuhan anggun tradisi Minangkabau dengan perpaduan warna marun lembut, kilau emas antik, dan ornamen Rumah Gadang yang bersahaja serta puitis.',
    fontFamilyClass: 'font-serif-luxury',
    ornamentType: 'minang',
    previewBgClass: 'from-[#3A0C13] via-[#24060B] to-[#120205]',
  },
  'javanese-royal': {
    id: 'javanese-royal',
    name: 'Javanese Royal Heritage',
    tagline: 'Nuansa Keraton Adiluhung & Emas Antik',
    badge: '🏛️ Adat Jawa Klasik',
    accentColor: '#B89047',
    secondaryColor: '#3A2E20',
    description: 'Estetika klasik Jawa dengan ornamen gunungan, kehangatan warna emas tembaga, dan keteduhan budaya adiluhung.',
    fontFamilyClass: 'font-serif-luxury',
    ornamentType: 'gunungan',
    previewBgClass: 'from-[#3A2E20] via-[#2A1F15] to-[#17110C]',
  },
  'modern-minimalist': {
    id: 'modern-minimalist',
    name: 'Modern Contemporary Minimalist',
    tagline: 'Estetika Editorial & Garis Arsitektural Bersih',
    badge: '✨ Editorial Kontemporer',
    accentColor: '#52616B',
    secondaryColor: '#1E2022',
    description: 'Desain modern high-fashion ala majalah editorial dengan garis bersih, aksen batu monokromatik, dan tipografi elegan.',
    fontFamilyClass: 'font-sans',
    ornamentType: 'minimalist',
    previewBgClass: 'from-[#2D3748] via-[#1A202C] to-[#171923]',
  },
  'islamic-emerald': {
    id: 'islamic-emerald',
    name: 'Islamic Emerald & Golden Arabesque',
    tagline: 'Kemegahan Syahdu Zamrud & Emas Kaligrafi',
    badge: '🕌 Nuansa Islami Zamrud',
    accentColor: '#0F5132',
    secondaryColor: '#D4AF37',
    description: 'Kemegahan Islami nan khidmat dengan perpaduan hijau zamrud (emerald), kilau emas, kaligrafi suci, dan pola arabesque.',
    fontFamilyClass: 'font-serif-luxury',
    ornamentType: 'arabesque',
    previewBgClass: 'from-[#0B3B24] via-[#072818] to-[#04160E]',
  },
  'rustic-botanical': {
    id: 'rustic-botanical',
    name: 'Rustic Botanical & Warm Linen',
    tagline: 'Kehangatan Pesta Kebun & Daun Eukaliptus',
    badge: '🌿 Rustic Organik',
    accentColor: '#4A6B53',
    secondaryColor: '#A75D43',
    description: 'Suasana pesta taman romantis bernuansa sage green, terakota hangat, dedaunan botani alami, dan tekstur linen organik.',
    fontFamilyClass: 'font-serif-luxury',
    ornamentType: 'botanical',
    previewBgClass: 'from-[#2F4335] via-[#202E24] to-[#141C16]',
  },
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Niskala Grand Luxury Noir',
    tagline: 'Grand Ballroom Kemewahan Obsidian & Emas 24K',
    badge: '👑 Royal Grand Ballroom',
    accentColor: '#C5A059',
    secondaryColor: '#121316',
    description: 'Kemewahan puncak perayaan formal dengan latar hitam obsidian, aksen bingkai emas ganda, dan kesan aristokrat.',
    fontFamilyClass: 'font-serif-luxury',
    ornamentType: 'luxury',
    previewBgClass: 'from-[#201C14] via-[#15130E] to-[#0A0907]',
  },
};

export const TEMPLATE_LIST = Object.values(INVITATION_TEMPLATES);

/**
 * Returns dynamic CSS classes and theme tokens based on selected template
 */
export function getTemplateThemeClasses(templateId: InvitationTemplateId = 'minang-royal') {
  switch (templateId) {
    case 'minang-royal':
      return {
        wrapper: 'theme-minang-royal font-serif-luxury',
        accentText: 'text-[#851C28] dark:text-[#E8808D]',
        accentBg: 'bg-[#851C28]',
        accentBorder: 'border-[#851C28]',
        goldText: 'text-[#A88239] dark:text-[#E5CA78]',
        goldBg: 'bg-[#C5A059]',
        goldBorder: 'border-[#C5A059]/30 dark:border-[#C5A059]/50',
        badgeBg: 'bg-[#851C28]/5 text-[#851C28] dark:text-[#E8808D] border-[#851C28]/20',
        cardBg: 'bg-[#FFFDF9] dark:bg-[#1A1E1C] border border-[#C5A059]/25 dark:border-[#C5A059]/35 shadow-xs hover:shadow-md transition-shadow',
        headingFont: 'font-serif-luxury tracking-wide',
        ornament: 'minang',
        buttonGradient: 'from-[#851C28] to-[#6A141F] hover:from-[#9B2230] hover:to-[#7A1724]',
        sealColor: 'bg-[#851C28] text-[#F9F4EB] border-[#C5A059]',
        isMinang: true,
      };

    case 'modern-minimalist':
      return {
        wrapper: 'theme-modern-minimalist font-sans',
        accentText: 'text-[#4A5568] dark:text-[#CBD5E1]',
        accentBg: 'bg-[#4A5568]',
        accentBorder: 'border-[#4A5568]',
        goldText: 'text-[#4A5568] dark:text-[#E2E8F0]',
        goldBg: 'bg-[#4A5568]',
        goldBorder: 'border-[#CBD5E1] dark:border-[#4A5568]',
        badgeBg: 'bg-[#4A5568]/10 text-[#2D3748] dark:text-[#E2E8F0] border-[#4A5568]/20',
        cardBg: 'bg-white dark:bg-[#1E2022] border border-[#E2E8F0] dark:border-[#333A42]',
        headingFont: 'font-serif tracking-tight',
        ornament: 'minimalist',
        buttonGradient: 'from-[#4A5568] to-[#2D3748] hover:from-[#3D4756] hover:to-[#1E2530]',
        sealColor: 'bg-[#2D3748] text-white border-[#4A5568]',
        isMinang: false,
      };

    case 'islamic-emerald':
      return {
        wrapper: 'theme-islamic-emerald font-serif-luxury',
        accentText: 'text-[#0F5132] dark:text-[#48BB78]',
        accentBg: 'bg-[#0F5132]',
        accentBorder: 'border-[#0F5132]',
        goldText: 'text-[#D4AF37] dark:text-[#ECC94B]',
        goldBg: 'bg-[#0F5132]',
        goldBorder: 'border-[#0F5132]/30 dark:border-[#0F5132]/60',
        badgeBg: 'bg-[#0F5132]/10 text-[#0F5132] dark:text-[#68D391] border-[#0F5132]/30',
        cardBg: 'bg-[#F4F9F5] dark:bg-[#0B2519] border border-[#C6E2D0] dark:border-[#1E4D36]',
        headingFont: 'font-serif-luxury tracking-wide',
        ornament: 'arabesque',
        buttonGradient: 'from-[#0F5132] to-[#0A3622] hover:from-[#0B3F27] hover:to-[#082A1A]',
        sealColor: 'bg-[#0F5132] text-[#F6E05E] border-[#D4AF37]',
        isMinang: false,
      };

    case 'rustic-botanical':
      return {
        wrapper: 'theme-rustic-botanical font-serif-luxury',
        accentText: 'text-[#4A6B53] dark:text-[#88B896]',
        accentBg: 'bg-[#4A6B53]',
        accentBorder: 'border-[#4A6B53]',
        goldText: 'text-[#A75D43] dark:text-[#E28768]',
        goldBg: 'bg-[#4A6B53]',
        goldBorder: 'border-[#A75D43]/30 dark:border-[#A75D43]/60',
        badgeBg: 'bg-[#4A6B53]/10 text-[#4A6B53] dark:text-[#A3D9B1] border-[#4A6B53]/25',
        cardBg: 'bg-[#F9F7F3] dark:bg-[#1C2520] border border-[#DDD5C7] dark:border-[#2D3C34]',
        headingFont: 'font-serif-luxury tracking-wide',
        ornament: 'botanical',
        buttonGradient: 'from-[#4A6B53] to-[#364F3D] hover:from-[#3F5B46] hover:to-[#2B3F31]',
        sealColor: 'bg-[#A75D43] text-white border-[#E28768]',
        isMinang: false,
      };

    case 'luxury-gold':
      return {
        wrapper: 'theme-luxury-gold font-serif-luxury',
        accentText: 'text-[#C5A059] dark:text-[#E8CD8F]',
        accentBg: 'bg-[#C5A059]',
        accentBorder: 'border-[#C5A059]',
        goldText: 'text-[#C5A059] dark:text-[#F3DEAB]',
        goldBg: 'bg-[#C5A059]',
        goldBorder: 'border-[#C5A059]/40 dark:border-[#C5A059]/70',
        badgeBg: 'bg-[#C5A059]/10 text-[#C5A059] dark:text-[#F3DEAB] border-[#C5A059]/30',
        cardBg: 'bg-[#FAF6EE] dark:bg-[#181611] border border-[#EADBBD] dark:border-[#383120]',
        headingFont: 'font-serif-luxury tracking-widest',
        ornament: 'luxury',
        buttonGradient: 'from-[#B89047] to-[#8C6D32] hover:from-[#A88239] hover:to-[#7A5E2B]',
        sealColor: 'bg-[#B89047] text-[#1A1A1A] border-[#F3DEAB]',
        isMinang: false,
      };

    case 'javanese-royal':
    default:
      return {
        wrapper: 'theme-javanese-royal font-serif-luxury',
        accentText: 'text-[#B89047] dark:text-[#E5C378]',
        accentBg: 'bg-[#B89047]',
        accentBorder: 'border-[#B89047]',
        goldText: 'text-[#B89047] dark:text-[#F5DE93]',
        goldBg: 'bg-[#B89047]',
        goldBorder: 'border-[#B89047]/30 dark:border-[#B89047]/60',
        badgeBg: 'bg-[#B89047]/10 text-[#B89047] dark:text-[#F5DE93] border-[#B89047]/20',
        cardBg: 'bg-[#FAF7F2] dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833]',
        headingFont: 'font-serif-luxury tracking-wide',
        ornament: 'gunungan',
        buttonGradient: 'from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E]',
        sealColor: 'bg-[#B89047] text-white border-[#F5DE93]',
        isMinang: false,
      };
  }
}
