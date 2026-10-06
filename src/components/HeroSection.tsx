import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { formatImageUrl } from '../utils/googleDrive';
import { GonjongRoof, SuntiangCrown, PucuakRabuangDivider } from './MinangOrnaments';
import { FadeIn } from './FadeIn';

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
  const isMinang = config.templateId === 'minang-royal';
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
    <section id="hero" className="relative min-h-[94vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6 bg-gradient-to-b from-[#FAF7F0] via-[#F8F3E8] to-[#FAF5EC] dark:from-[#121615] dark:via-[#151C1A] dark:to-[#171F1C]">
      {/* Background Hero Image with measured warm golden scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={formatImageUrl(
            config.heroImageUrl || config.gallery[0]?.url,
            '/src/assets/images/hero_wedding_couple_1790610979338.jpg'
          )}
          alt={`${config.groom.nickName} & ${config.bride.nickName} Wedding`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/src/assets/images/hero_wedding_couple_1790610979338.jpg') {
              target.src = '/src/assets/images/hero_wedding_couple_1790610979338.jpg';
            }
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.9] dark:brightness-[0.62] transition-transform duration-1000 scale-100"
        />
        {/* Measured scrim gradient for warm twilight ivory feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EC] via-[#FAF7F0]/80 to-[#FAF7F0]/40 dark:from-[#171F1C] dark:via-[#121615]/80 dark:to-[#121615]/45" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Minangkabau Simple Elegan Header */}
        {isMinang && (
          <FadeIn direction="down" duration={800} className="flex flex-col items-center mb-3">
            <div className="mb-2">
              <GonjongRoof className="w-32 sm:w-44 h-8 sm:h-9" color="#C5A059" animated={true} />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
              <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-[#851C28] dark:text-[#E8808D] font-semibold">
                Pernikahan Adat Minangkabau
              </span>
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
            </div>
            <p className="text-[11px] font-serif italic text-[#8C7A6B] dark:text-[#BFAF9E] mt-1 tracking-wider opacity-90">
              "Sarumpun bak sarai, sasusun bak siriah"
            </p>
          </FadeIn>
        )}

        {/* Kicker Tagline */}
        <FadeIn delay={150} direction="up" duration={700}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#786452] dark:text-[#D1C3B3] mb-3">
            <span>Walimatul 'Ursy</span>
            <span aria-hidden="true" className={isMinang ? 'text-[#C5A059] animate-twinkle' : 'text-[#B89047]'}>✦</span>
            <span>Undangan Resmi</span>
          </div>
        </FadeIn>

        {/* Hero Display Names with sweet ampersand */}
        <FadeIn delay={250} direction="up" duration={900}>
          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl font-normal text-[#25201C] dark:text-[#FAF7F2] tracking-wide mb-4 text-balance">
            {config.groom.nickName}{' '}
            <span className={`font-script inline-block transform hover:scale-110 transition-transform duration-300 ${isMinang ? 'text-[#C5A059] animate-breathe' : 'text-[#B89047] dark:text-[#E6CA65]'}`}>
              &amp;
            </span>{' '}
            {config.bride.nickName}
          </h1>
        </FadeIn>

        {/* Date & Location */}
        <FadeIn delay={350} direction="up" duration={700}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#5B4E43] dark:text-[#BFAF9E] mb-8">
            <span className="flex items-center gap-1.5 font-medium bg-white/80 dark:bg-[#1A1E1C]/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xs hover:border-[#C5A059]/50 transition-colors">
              <Calendar className={`w-4 h-4 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
              {config.events[0]?.dateFormatted}
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-[#D9CEBF] dark:text-[#3B4A43]">|</span>
            <span className="flex items-center gap-1.5 font-medium bg-white/80 dark:bg-[#1A1E1C]/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xs hover:border-[#C5A059]/50 transition-colors">
              <MapPin className={`w-4 h-4 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
              {config.events[0]?.venueName?.split('-')[0]?.trim() || 'Padang, Sumatera Barat'}
            </span>
          </div>
        </FadeIn>

        {/* Live Countdown Timer Cards */}
        <FadeIn delay={450} direction="up" duration={800} className="w-full max-w-xl mb-10">
          {timeLeft.isPast ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FAF7F2]/90 dark:bg-[#1C2521]/90 backdrop-blur-md border border-[#E0D4C3] dark:border-[#2C3833] text-sm text-[#4E4238] dark:text-[#E2DCD4]">
              <CheckCircle className={`w-4 h-4 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
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
                  className={`backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 sheen-effect group ${
                    isMinang
                      ? 'bg-white/92 dark:bg-[#1A1E1C]/92 border border-[#C5A059]/30 hover:border-[#C5A059]'
                      : 'bg-[#FAF7F2]/90 dark:bg-[#1A221F]/90 border border-[#E8DFD3] dark:border-[#2C3833]'
                  }`}
                >
                  <span className={`block font-serif-luxury text-2xl sm:text-4xl font-semibold tabular-nums group-hover:scale-105 transition-transform duration-300 ${isMinang ? 'text-[#851C28] dark:text-[#E8808D]' : 'text-[#25201C] dark:text-[#F3EEEA]'}`}>
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#8A796A] dark:text-[#A19588] mt-0.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </FadeIn>

        {/* Call to Actions with sweet animations */}
        <FadeIn delay={550} direction="up" duration={700}>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#rsvp"
              className={`px-8 py-3.5 text-xs sm:text-sm font-semibold text-white rounded-full shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer whitespace-nowrap sheen-effect ${
                isMinang
                  ? 'bg-gradient-to-r from-[#851C28] to-[#6A141F] hover:from-[#9B2230] hover:to-[#7A1724]'
                  : 'bg-gradient-to-r from-[#B89047] via-[#C9A050] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E]'
              }`}
            >
              Konfirmasi Kehadiran (RSVP)
            </a>
            <button
              onClick={onOpenCalendarExport}
              className={`px-7 py-3.5 text-xs sm:text-sm font-medium rounded-full shadow-xs hover:shadow-md hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 sheen-effect ${
                isMinang
                  ? 'text-[#851C28] dark:text-[#E8808D] bg-white/92 dark:bg-[#1A1E1C]/92 border border-[#C5A059]/35 hover:border-[#C5A059]'
                  : 'text-[#2C2724] dark:text-[#FAF7F2] bg-[#FAF7F2]/90 dark:bg-[#1C2521]/90 border border-[#D9CEBF] dark:border-[#2F3D36] hover:border-[#B89047]'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
              <span>Simpan ke Kalender</span>
            </button>
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <div className="mt-14 animate-bounce text-[#C5A059] opacity-80">
          <a href="#mempelai" aria-label="Gulir ke profil mempelai">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>

      </div>
    </section>
  );
};
