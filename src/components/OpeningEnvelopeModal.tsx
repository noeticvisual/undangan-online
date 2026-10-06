import React from 'react';
import { MailOpen, Heart, Music, Calendar, SlidersHorizontal, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { weddingMusicEngine } from '../services/audioPlayer';
import { getTemplateThemeClasses, INVITATION_TEMPLATES, MINANG_TAPESTRY_BG, MINANG_WEDDING_COUPLE } from '../data/templateThemes';
import { HERO_IMAGE } from '../data/defaultWeddingData';
import { GonjongRoof, SuntiangCrown, PucuakRabuangDivider, SongketCorner } from './MinangOrnaments';
import { formatImageUrl } from '../utils/googleDrive';

interface OpeningEnvelopeModalProps {
  config: WeddingConfig;
  guestName: string;
  isOpen: boolean;
  isGuest?: boolean;
  onOpenInvitation: () => void;
  onOpenMusicModal?: () => void;
  onOpenCustomizer?: () => void;
}

export const OpeningEnvelopeModal: React.FC<OpeningEnvelopeModalProps> = ({
  config,
  guestName,
  isOpen,
  isGuest = false,
  onOpenInvitation,
  onOpenMusicModal,
  onOpenCustomizer,
}) => {
  if (!isOpen) return null;

  const currentTrack = weddingMusicEngine.getCurrentTrack();
  const theme = getTemplateThemeClasses(config.templateId);
  const isMinang = config.templateId === 'minang-royal';
  const templateMeta = config.templateId ? INVITATION_TEMPLATES[config.templateId] : null;

  const rawCover = config.openingCoverPhotoUrl || config.heroImageUrl || (isMinang ? MINANG_WEDDING_COUPLE : HERO_IMAGE);
  const coverPhoto = formatImageUrl(rawCover, isMinang ? MINANG_WEDDING_COUPLE : HERO_IMAGE);

  const coverScale = (config.openingCoverScale || 100) / 100;
  const coverRatio = config.openingCoverRatio || 'arched';

  const getFrameRatioClasses = (ratio: string) => {
    switch (ratio) {
      case '1:1':
        return 'w-44 h-44 sm:w-48 sm:h-48 rounded-3xl';
      case '3:4':
        return 'w-40 h-52 sm:w-44 sm:h-58 rounded-3xl';
      case '4:5':
        return 'w-40 h-50 sm:w-44 sm:h-56 rounded-3xl';
      case '2:3':
        return 'w-38 h-56 sm:w-42 sm:h-62 rounded-3xl';
      case 'circle':
        return 'w-44 h-44 sm:w-48 sm:h-48 rounded-full';
      case 'arched':
      default:
        return 'w-40 h-48 sm:w-44 sm:h-52 rounded-t-full rounded-b-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-700 animate-fadeIn overflow-y-auto">
      
      {/* If Minangkabau theme, render simple elegan Minang nuance */}
      {isMinang ? (
        <div className="relative w-full max-w-sm sm:max-w-md my-auto rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/40 bg-[#FFFDF9] dark:bg-[#1A1E1C] text-center p-6 sm:p-8 animate-fadeInUp">
          
          {/* Songket Corner Accents */}
          <div className="absolute top-3 left-3">
            <SongketCorner className="w-5 h-5" color="#C5A059" />
          </div>
          <div className="absolute top-3 right-3 rotate-90">
            <SongketCorner className="w-5 h-5" color="#C5A059" />
          </div>
          <div className="absolute bottom-3 left-3 -rotate-90">
            <SongketCorner className="w-5 h-5" color="#C5A059" />
          </div>
          <div className="absolute bottom-3 right-3 rotate-180">
            <SongketCorner className="w-5 h-5" color="#C5A059" />
          </div>

          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#C5A059]/12 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#851C28]/12 rounded-full blur-2xl pointer-events-none" />

          {/* Top Ornamental Header with gentle floating animation */}
          <div className="flex flex-col items-center mb-4 relative z-10">
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-[#851C28] dark:text-[#E8808D] font-bold mb-1">
              Undangan Pernikahan
            </span>
            <div className="my-1.5">
              <GonjongRoof className="w-28 sm:w-36 h-7" color="#C5A059" animated={true} />
            </div>
            <span className="text-[11px] text-[#A88239] dark:text-[#E5CA78] tracking-widest font-serif italic">
              Adat Minangkabau
            </span>
          </div>

          {/* Minang Couple Photo with configured ratio and scale */}
          <div className={`relative mx-auto mb-4 ${getFrameRatioClasses(coverRatio)} overflow-hidden border border-[#C5A059]/35 shadow-md ring-2 ring-[#C5A059]/20 group`}>
            <div className="w-full h-full overflow-hidden">
              <img
                src={coverPhoto}
                alt="Kedua Mempelai"
                referrerPolicy="no-referrer"
                style={{ transform: `scale(${coverScale})` }}
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/60 text-[#F9F4EB] text-[9px] font-medium tracking-wider backdrop-blur-xs border border-white/20">
              Kedua Mempelai
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] mb-1 font-medium">
            Walimatul 'Ursy
          </p>

          {/* Couple Names */}
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#25201C] dark:text-[#FAF7F2] tracking-wide mb-1.5">
            {config.groom.nickName} <span className="font-script text-3xl text-[#C5A059] inline-block animate-breathe">&amp;</span> {config.bride.nickName}
          </h1>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#7A6B5F] dark:text-[#BFAF9E] mb-5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{config.events[0]?.dateFormatted || 'Sabtu, 25 Oktober 2026'}</span>
          </div>

          {/* Personalized Guest Badge */}
          <div className="bg-[#FAF7F2] dark:bg-[#151817] rounded-2xl p-4 mb-5 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] dark:text-[#A89E94] block mb-1">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#2C2724] dark:text-[#FAF7F2] tracking-wide text-balance">
              {guestName || 'Tamu Undangan'}
            </h2>
            <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] block mt-1 italic">
              Di Tempat
            </span>
          </div>

          {/* Open Invitation Button with sweet micro-interaction */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onOpenInvitation}
              className="w-full group inline-flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#851C28] to-[#6A141F] hover:from-[#9B2230] hover:to-[#7A1724] rounded-full shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer sheen-effect"
            >
              <MailOpen className="w-4 h-4 text-[#F9F4EB] transition-transform duration-300 group-hover:scale-110" />
              <span className="tracking-wide">Buka Undangan</span>
            </button>

            {/* Audio Indicator */}
            <div className="flex items-center gap-2 text-[10px] text-[#8C7A6B] dark:text-[#A89E94]">
              <Music className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
              <span className="truncate max-w-[200px] font-medium">Musik: {currentTrack.title}</span>
              {!isGuest && onOpenMusicModal && (
                <button
                  type="button"
                  onClick={onOpenMusicModal}
                  className="underline hover:text-[#851C28] text-[#C5A059] font-semibold cursor-pointer ml-1"
                >
                  Pilih Lagu
                </button>
              )}
            </div>
          </div>

          <PucuakRabuangDivider className="mt-5 opacity-75" color="#C5A059" />
        </div>
      ) : (
        /* Standard Luxury Envelope Card for Other Themes */
        <div className={`relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#1A221F] rounded-3xl shadow-2xl border-2 ${theme.goldBorder} overflow-hidden text-center p-8 sm:p-12 transition-all transform duration-500 scale-100 ring-1 ring-black/5`}>
          
          {/* Decorative filigree corners */}
          <div className={`absolute top-4 left-4 opacity-40 pointer-events-none ${theme.accentText}`}>
            <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 Q60,0 60,60 Q0,60 0,0 Z" />
            </svg>
          </div>
          <div className={`absolute top-4 right-4 opacity-40 pointer-events-none ${theme.accentText} rotate-90`}>
            <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 Q60,0 60,60 Q0,60 0,0 Z" />
            </svg>
          </div>

          {/* Couple Photo for Standard Luxury Envelope with configured ratio and scale */}
          <div className={`relative mx-auto mb-4 ${getFrameRatioClasses(coverRatio)} overflow-hidden border-2 border-[#C5A059]/40 shadow-lg ring-2 ring-black/5 group`}>
            <div className="w-full h-full overflow-hidden">
              <img
                src={coverPhoto}
                alt="Kedua Mempelai"
                referrerPolicy="no-referrer"
                style={{ transform: `scale(${coverScale})` }}
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full ${theme.sealColor} text-white text-[9px] font-semibold tracking-wider shadow-xs`}>
              {config.groom.nickName[0]} &amp; {config.bride.nickName[0]}
            </div>
          </div>

          {templateMeta && (
            <div className="mb-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${theme.badgeBg}`}>
                {templateMeta.badge}
              </span>
            </div>
          )}

          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8C7A6B] dark:text-[#A89E94] mb-2 font-medium">
            The Wedding Celebration of
          </p>

          <h1 className={`${theme.headingFont} text-4xl sm:text-5xl font-normal text-[#2C2724] dark:text-[#F3EEEA] tracking-wide mb-3`}>
            {config.groom.nickName} <span className={`font-script text-4xl ${theme.accentText}`}>&amp;</span> {config.bride.nickName}
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-7 font-medium">
            <Calendar className={`w-3.5 h-3.5 ${theme.accentText}`} />
            <span>{config.events[0]?.dateFormatted || 'Sabtu, 24 Oktober 2026'}</span>
          </div>

          <div className="bg-[#F3EDE2]/80 dark:bg-[#232D28]/80 backdrop-blur-xs rounded-2xl p-5 mb-7 border border-[#E2D6C5] dark:border-[#35433C] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#7B6E62] dark:text-[#9EA8A3] block mb-1">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#2C2724] dark:text-[#F3EEEA] tracking-wide text-balance">
              {guestName || 'Tamu Undangan'}
            </h2>
            <span className="text-[11px] text-[#8C7A6B] dark:text-[#8E9B94] block mt-1.5 italic">
              Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#6A5E53] dark:text-[#B4AAA0] leading-relaxed mb-8 max-w-sm mx-auto">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dan memberikan doa restu pada perayaan hari bahagia kami.
          </p>

          <div className="flex flex-col items-center gap-3.5">
            <button
              onClick={onOpenInvitation}
              className={`group inline-flex items-center justify-center gap-3 px-9 py-4 text-sm font-semibold text-white bg-gradient-to-r ${theme.buttonGradient} rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer ring-2 ring-black/10`}
            >
              <MailOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Buka Undangan</span>
            </button>
            
            <div className="flex items-center gap-2 text-[11px] text-[#8C7A6B] dark:text-[#9EA8A3]">
              <Music className={`w-3.5 h-3.5 ${theme.accentText}`} />
              <span className="truncate max-w-[190px]">Melodi: {currentTrack.title}</span>
              {!isGuest && onOpenMusicModal && (
                <button
                  type="button"
                  onClick={onOpenMusicModal}
                  className="underline hover:text-[#B89047] transition-colors cursor-pointer flex items-center gap-1 font-medium"
                >
                  <Music className="w-3 h-3 text-[#B89047]" />
                  <span>Pilih Lagu</span>
                </button>
              )}
            </div>
          </div>

          <div className={`mt-8 flex justify-center ${theme.accentText} opacity-60`}>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>
      )}

    </div>
  );
};
