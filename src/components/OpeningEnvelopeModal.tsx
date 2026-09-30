import React from 'react';
import { MailOpen, Heart, Music, Calendar, SlidersHorizontal } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { weddingMusicEngine } from '../services/audioPlayer';

interface OpeningEnvelopeModalProps {
  config: WeddingConfig;
  guestName: string;
  isOpen: boolean;
  onOpenInvitation: () => void;
  onOpenMusicModal?: () => void;
}

export const OpeningEnvelopeModal: React.FC<OpeningEnvelopeModalProps> = ({
  config,
  guestName,
  isOpen,
  onOpenInvitation,
  onOpenMusicModal,
}) => {
  if (!isOpen) return null;

  const currentTrack = weddingMusicEngine.getCurrentTrack();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-700 animate-fadeIn">
      {/* Decorative Luxury Envelope Card */}
      <div className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#1A221F] rounded-3xl shadow-2xl border-2 border-[#D4AF37]/30 dark:border-[#B89047]/30 overflow-hidden text-center p-8 sm:p-12 transition-all transform duration-500 scale-100 ring-1 ring-[#D4AF37]/20">
        
        {/* Subtle decorative gold filigree corners */}
        <div className="absolute top-4 left-4 opacity-40 pointer-events-none text-[#B89047]">
          <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 Q60,0 60,60 Q0,60 0,0 Z" />
          </svg>
        </div>
        <div className="absolute top-4 right-4 opacity-40 pointer-events-none text-[#B89047] rotate-90">
          <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 Q60,0 60,60 Q0,60 0,0 Z" />
          </svg>
        </div>

        {/* Wax Seal Monogram Medallion */}
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#8C1D24] via-[#A8252E] to-[#6E141A] text-[#F3E5D8] flex items-center justify-center shadow-lg border-2 border-[#E6CA65]/60 relative transform hover:rotate-6 transition-transform">
          <span className="font-serif-luxury text-xl font-bold tracking-widest text-[#F9EBD6] drop-shadow-sm select-none">
            {config.groom.nickName[0]} &amp; {config.bride.nickName[0]}
          </span>
          <div className="absolute inset-0 rounded-full border border-amber-300/30 pointer-events-none" />
        </div>

        {/* Invitation Subtitle */}
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8C7A6B] dark:text-[#A89E94] mb-2 font-medium">
          The Wedding Celebration of
        </p>

        {/* Couple Names in Luxury Display Font */}
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#2C2724] dark:text-[#F3EEEA] tracking-wide mb-3">
          {config.groom.nickName} <span className="font-script text-4xl text-[#B89047]">&amp;</span> {config.bride.nickName}
        </h1>

        {/* Date indication */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-7 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#B89047]" />
          <span>{config.events[0]?.dateFormatted || 'Sabtu, 24 Oktober 2026'}</span>
        </div>

        {/* Personalized Guest Badge with Gold Hairline Border */}
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

        {/* Primary Open Invitation Button */}
        <div className="flex flex-col items-center gap-3.5">
          <button
            onClick={onOpenInvitation}
            className="group inline-flex items-center justify-center gap-3 px-9 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#B89047] via-[#D4AF37] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer ring-2 ring-[#B89047]/30"
          >
            <MailOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Buka Undangan</span>
          </button>
          
          {/* Audio Indicator & Switcher Button */}
          <div className="flex items-center gap-2 text-[11px] text-[#8C7A6B] dark:text-[#9EA8A3]">
            <Music className="w-3.5 h-3.5 text-[#B89047]" />
            <span className="truncate max-w-[190px]">Melodi: {currentTrack.title}</span>
            {onOpenMusicModal && (
              <button
                type="button"
                onClick={onOpenMusicModal}
                className="underline hover:text-[#B89047] transition-colors cursor-pointer flex items-center gap-1 font-medium"
                title="Ganti melodi musik pengiring"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#B89047]" />
                <span>Ganti</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom subtle heart ornament */}
        <div className="mt-8 flex justify-center text-[#B89047] opacity-60">
          <Heart className="w-4 h-4 fill-current" />
        </div>
      </div>
    </div>
  );
};
