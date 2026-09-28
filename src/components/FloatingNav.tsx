import React from 'react';
import { Home, Users, Calendar, Image, MessageSquare, Gift, Disc } from 'lucide-react';

interface FloatingNavProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ isMusicPlaying, onToggleMusic }) => {
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
      {/* Floating Vinyl Music Disc (Bottom-Right) */}
      <button
        onClick={onToggleMusic}
        title={isMusicPlaying ? 'Jeda Musik' : 'Putar Musik Romantis'}
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 rounded-full shadow-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#B89047] dark:text-[#E6CA65] hover:scale-105 active:scale-95 transition-all cursor-pointer ${
          isMusicPlaying ? 'ring-2 ring-[#B89047]/40 ring-offset-2' : 'opacity-80'
        }`}
      >
        <Disc className={`w-5 h-5 ${isMusicPlaying ? 'animate-spin-slow' : ''}`} />
      </button>

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
