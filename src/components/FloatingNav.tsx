import React, { useState, useEffect } from 'react';
import { Home, Users, Calendar, Image, MessageSquare, Gift, Disc, Play, Pause, SkipForward, Music2, SlidersHorizontal } from 'lucide-react';
import { MusicTrack } from '../types/wedding';
import { AVAILABLE_WEDDING_TRACKS, weddingMusicEngine } from '../services/audioPlayer';

interface FloatingNavProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenMusicModal?: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  isMusicPlaying,
  onToggleMusic,
  onOpenMusicModal,
}) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(() =>
    weddingMusicEngine.getCurrentTrack()
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = weddingMusicEngine.subscribe((state) => {
      const track = AVAILABLE_WEDDING_TRACKS.find((t) => t.id === state.trackId);
      if (track) setCurrentTrack(track);
    });
    return unsubscribe;
  }, []);

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    weddingMusicEngine.nextTrack();
  };

  const navItems = [
    { href: '#hero', icon: Home, label: 'Awal' },
    { href: '#mempelai', icon: Users, label: 'Pasangan' },
    { href: '#acara', icon: Calendar, label: 'Acara' },
    { href: '#galeri', icon: Image, label: 'Galeri' },
    { href: '#rsvp', icon: MessageSquare, label: 'RSVP' },
    { href: '#hadiah', icon: Gift, label: 'Amplop' },
  ];

  return (
    <>
      {/* Luxury Floating Audio Widget (Bottom-Right on Desktop, Bottom-Left/Floating on Mobile) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300">
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-full shadow-2xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2]/95 dark:bg-[#1A221F]/95 backdrop-blur-md transition-all ${
            isExpanded ? 'pr-4 ring-1 ring-[#B89047]/40' : ''
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Vinyl Disc Toggle */}
          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Jeda Musik' : 'Putar Musik'}
            className="relative p-2 rounded-full bg-[#B89047] text-white hover:bg-[#A37E38] transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Disc className={`w-4 h-4 ${isMusicPlaying ? 'animate-spin-slow' : ''}`} />
            {isMusicPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
            )}
          </button>

          {/* Equalizer Wave Bars */}
          {isMusicPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 px-0.5 shrink-0" title="Audio Aktif">
              <span className="w-0.5 bg-[#B89047] h-full animate-pulse rounded-full" />
              <span className="w-0.5 bg-[#B89047] h-2/3 animate-bounce rounded-full" />
              <span className="w-0.5 bg-[#B89047] h-4/5 animate-pulse rounded-full" />
              <span className="w-0.5 bg-[#B89047] h-1/2 animate-bounce rounded-full" />
            </div>
          )}

          {/* Track Name & Info (Visible on Hover or Desktop) */}
          <div
            onClick={onOpenMusicModal || undefined}
            className={`${onOpenMusicModal ? 'cursor-pointer' : 'cursor-default'} max-w-[140px] sm:max-w-[180px] overflow-hidden select-none`}
            title={onOpenMusicModal ? "Klik untuk memilih musik lain" : currentTrack.title}
          >
            <p className="text-[11px] font-semibold text-[#2C2724] dark:text-[#F3EEEA] truncate leading-tight">
              {currentTrack.title}
            </p>
            <p className="text-[9px] text-[#7C6E61] dark:text-[#A79D93] truncate leading-tight">
              {isMusicPlaying ? 'Memutar Melodi' : 'Musik Dijeda'} · {currentTrack.artist.split('·')[0]}
            </p>
          </div>

          {/* Next Track Button */}
          <button
            onClick={handleNextTrack}
            title="Lagu Berikutnya"
            className="p-1.5 rounded-full text-[#7C6E61] dark:text-[#A79D93] hover:text-[#B89047] dark:hover:text-[#E2C799] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Open Full Music Switcher Modal Button (only for admin / host) */}
          {onOpenMusicModal && (
            <button
              onClick={onOpenMusicModal}
              title="Pilih & Tukar Musik Latar"
              className="p-1.5 rounded-full text-[#7C6E61] dark:text-[#A79D93] hover:text-[#B89047] dark:hover:text-[#E2C799] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Music2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Mobile Bottom Navigation Bar (Max 15% viewport height cap) */}
      <nav className="lg:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto bg-[#FAF7F2]/95 dark:bg-[#121615]/95 backdrop-blur-md rounded-2xl border border-[#E8DFD3] dark:border-[#28352F] shadow-xl px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-1 px-2 text-[#7C6E61] dark:text-[#A79D93] hover:text-[#B89047] dark:hover:text-[#E2C799] transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
    </>
  );
};
