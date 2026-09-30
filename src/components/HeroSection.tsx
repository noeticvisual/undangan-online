import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, CheckCircle } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { formatImageUrl } from '../utils/googleDrive';

interface HeroSectionProps {
  config: WeddingConfig;
  onOpenCalendarExport: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onOpenCalendarExport }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const target = new Date(config.eventDateISO).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.eventDateISO]);

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={formatImageUrl(
            config.heroImageUrl || config.gallery[0]?.url,
            '/src/assets/images/hero_wedding_couple_1790610979338.jpg'
          )}
          alt={`${config.groom.nickName} & ${config.bride.nickName} Wedding`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Graceful fallback to default asset if external drive image fails to load
            const target = e.currentTarget;
            if (target.src !== '/src/assets/images/hero_wedding_couple_1790610979338.jpg') {
              target.src = '/src/assets/images/hero_wedding_couple_1790610979338.jpg';
            }
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.88] dark:brightness-[0.65] transition-transform duration-1000 scale-100"
        />
        {/* Measured scrim gradient for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/65 to-[#FAF7F2]/30 dark:from-[#121615] dark:via-[#121615]/75 dark:to-[#121615]/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Kicker Tagline (Zero-Pill discipline: unboxed clean text) */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#786452] dark:text-[#D1C3B3] mb-4">
          <span>The Wedding Of</span>
          <span aria-hidden="true" className="text-[#B89047]">·</span>
          <span>Official Invitation</span>
        </div>

        {/* Hero Display Names */}
        <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl font-normal text-[#25201C] dark:text-[#FAF7F2] tracking-wide mb-4 text-balance">
          {config.groom.nickName} <span className="font-script text-[#B89047] dark:text-[#E6CA65]">&amp;</span> {config.bride.nickName}
        </h1>

        {/* Date & Location */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#5B4E43] dark:text-[#BFAF9E] mb-8">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#B89047]" />
            {config.events[0]?.dateFormatted}
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-[#D9CEBF] dark:text-[#3B4A43]">|</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#B89047]" />
            Jakarta, Indonesia
          </span>
        </div>

        {/* Live Countdown Timer Cards */}
        <div className="w-full max-w-xl mb-10">
          {timeLeft.isPast ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FAF7F2]/90 dark:bg-[#1C2521]/90 backdrop-blur-md border border-[#E0D4C3] dark:border-[#2C3833] text-sm text-[#4E4238] dark:text-[#E2DCD4]">
              <CheckCircle className="w-4 h-4 text-[#B89047]" />
              <span>Hari Bahagia Telah Berlangsung. Terima Kasih Atas Segala Doa Restu!</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2]/90 dark:bg-[#1A221F]/90 backdrop-blur-md border border-[#E8DFD3] dark:border-[#2C3833] rounded-xl p-3 sm:p-4 text-center shadow-sm"
                >
                  <span className="block font-serif-luxury text-2xl sm:text-4xl font-semibold text-[#25201C] dark:text-[#F3EEEA] tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#8A796A] dark:text-[#A19588] mt-0.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#rsvp"
            className="px-7 py-3 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#B89047] via-[#C9A050] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Konfirmasi RSVP
          </a>
          <button
            onClick={onOpenCalendarExport}
            className="px-6 py-3 text-xs sm:text-sm font-medium text-[#2C2724] dark:text-[#FAF7F2] bg-[#FAF7F2]/90 dark:bg-[#1C2521]/90 backdrop-blur-md border border-[#D9CEBF] dark:border-[#2F3D36] hover:border-[#B89047] rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-[#B89047]" />
            <span>Simpan Tanggal</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 animate-bounce text-[#B89047] opacity-80">
          <a href="#mempelai" aria-label="Gulir ke profil mempelai">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>

      </div>
    </section>
  );
};
