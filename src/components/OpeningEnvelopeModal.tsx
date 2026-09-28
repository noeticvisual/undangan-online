import React from 'react';
import { MailOpen, Heart, Music, Calendar } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface OpeningEnvelopeModalProps {
  config: WeddingConfig;
  guestName: string;
  isOpen: boolean;
  onOpenInvitation: () => void;
}

export const OpeningEnvelopeModal: React.FC<OpeningEnvelopeModalProps> = ({
  config,
  guestName,
  isOpen,
  onOpenInvitation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-700 animate-fadeIn">
      {/* Decorative Envelope Card */}
      <div className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl shadow-2xl border border-[#E8DFD3] dark:border-[#2C3833] overflow-hidden text-center p-8 sm:p-12 transition-all transform duration-500 scale-100">
        
        {/* Subtle decorative floral corner ornaments (SVG) */}
        <div className="absolute top-3 left-3 opacity-30 pointer-events-none text-[#B89047]">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 Q50,0 50,50 Q0,50 0,0 Z" />
          </svg>
        </div>
        <div className="absolute top-3 right-3 opacity-30 pointer-events-none text-[#B89047] rotate-90">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 Q50,0 50,50 Q0,50 0,0 Z" />
          </svg>
        </div>

        {/* Small Invitation Subtitle */}
        <p className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] mb-3">
          The Wedding Celebration of
        </p>

        {/* Couple Names */}
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#2C2724] dark:text-[#F3EEEA] tracking-wide mb-3">
          {config.groom.nickName} &amp; {config.bride.nickName}
        </h1>

        {/* Date indication */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-8">
          <Calendar className="w-3.5 h-3.5 text-[#B89047]" />
          <span>{config.events[0]?.dateFormatted || 'Sabtu, 24 Oktober 2026'}</span>
        </div>

        {/* Personalized Guest Badge */}
        <div className="bg-[#F3EDE2] dark:bg-[#232D28] rounded-xl p-5 mb-8 border border-[#E2D6C5] dark:border-[#35433C]">
          <span className="text-xs text-[#7B6E62] dark:text-[#9EA8A3] block mb-1">
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
          Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia kami.
        </p>

        {/* Primary Open Invitation Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onOpenInvitation}
            className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-[#B89047] via-[#C9A050] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <MailOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Buka Undangan</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C7A6B] dark:text-[#9EA8A3]">
            <Music className="w-3 h-3 text-[#B89047]" />
            <span>Dilengkapi alunan musik romantis</span>
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
