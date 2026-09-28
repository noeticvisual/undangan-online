import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Sliders, QrCode, Share2 } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface HeaderNavbarProps {
  config: WeddingConfig;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenCustomizer: () => void;
  onOpenQrPass: () => void;
  onOpenShare: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  config,
  isDarkMode,
  onToggleDarkMode,
  isMusicPlaying,
  onToggleMusic,
  onOpenCustomizer,
  onOpenQrPass,
  onOpenShare,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 dark:bg-[#121615]/90 backdrop-blur-md border-b border-[#EADFCF] dark:border-[#242D28] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand title, one line wordmark */}
        <a
          href="#hero"
          className="font-serif-luxury text-xl sm:text-2xl font-semibold tracking-wide text-[#2C2724] dark:text-[#F3EEEA] hover:text-[#B89047] transition-colors whitespace-nowrap"
        >
          {config.groom.nickName} &amp; {config.bride.nickName}
        </a>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-[#685B51] dark:text-[#A79D93]">
          <a href="#mempelai" className="hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors">
            Mempelai
          </a>
          <a href="#acara" className="hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors">
            Acara
          </a>
          <a href="#kisah" className="hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors">
            Kisah Cinta
          </a>
          <a href="#galeri" className="hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors">
            Galeri
          </a>
          <a href="#rsvp" className="hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors">
            RSVP &amp; Doa
          </a>
          <a href="#hadiah" className="hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors">
            Amplop Digital
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions (music disc, dark mode, action buttons) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Music player toggle */}
          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Jeda Musik' : 'Putar Musik'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#F4EFEA] dark:bg-[#1C2521] text-[#2C2724] dark:text-[#F3EEEA] hover:border-[#B89047] transition-colors cursor-pointer"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B89047] animate-pulse" />
                <span className="hidden sm:inline text-[11px] font-medium">Musik</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <span className="hidden sm:inline text-[11px] font-medium">Mute</span>
              </>
            )}
          </button>

          {/* QR Pass check-in modal button */}
          <button
            onClick={onOpenQrPass}
            title="Tiket QR Check-In"
            className="p-1.5 text-[#2C2724] dark:text-[#F3EEEA] rounded-full border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#F4EFEA] dark:bg-[#1C2521] hover:border-[#B89047] transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Share invitation button */}
          <button
            onClick={onOpenShare}
            title="Bagikan Undangan"
            className="p-1.5 text-[#2C2724] dark:text-[#F3EEEA] rounded-full border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#F4EFEA] dark:bg-[#1C2521] hover:border-[#B89047] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            className="p-1.5 text-[#2C2724] dark:text-[#F3EEEA] rounded-full border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#F4EFEA] dark:bg-[#1C2521] hover:border-[#B89047] transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#F5DE93]" /> : <Moon className="w-4 h-4 text-[#8C7A6B]" />}
          </button>

          {/* Customizer trigger */}
          <button
            onClick={onOpenCustomizer}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-full hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kustomisasi</span>
          </button>
        </div>

      </div>
    </header>
  );
};
