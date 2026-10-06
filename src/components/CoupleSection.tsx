import React from 'react';
import { Instagram, Heart, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { formatImageUrl } from '../utils/googleDrive';
import { SuntiangCrown, GonjongRoof, PucuakRabuangDivider, CaranoMotif, SongketCorner } from './MinangOrnaments';
import { FadeIn } from './FadeIn';

interface CoupleSectionProps {
  config: WeddingConfig;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  const isMinang = config.templateId === 'minang-royal';
  const coupleScale = (config.couplePhotoScale || 100) / 100;
  const coupleRatio = config.couplePhotoRatio || 'arched';

  const getCoupleFrameClasses = (ratio: string) => {
    switch (ratio) {
      case 'square':
        return 'w-48 h-48 sm:w-56 sm:h-56 rounded-3xl';
      case 'circle':
        return 'w-48 h-48 sm:w-56 sm:h-56 rounded-full';
      case 'portrait':
        return 'w-44 h-58 sm:w-52 sm:h-68 rounded-3xl';
      case '4:5':
        return 'w-44 h-55 sm:w-52 sm:h-65 rounded-3xl';
      case 'arched':
      default:
        return 'w-44 h-60 sm:w-52 sm:h-68 rounded-t-full rounded-b-2xl';
    }
  };

  return (
    <section id="mempelai" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#FAF5EC] via-[#FFFDF9] to-[#F7F1E7] dark:from-[#171F1C] dark:via-[#161D1A] dark:to-[#151C19] transition-colors overflow-hidden">
      
      {/* Decorative floral & carano watermark background ornaments */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A059]/6 dark:bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#851C28]/4 dark:bg-[#851C28]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#C5A059]/5 dark:bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <FadeIn direction="up" delay={100}>
          <span className={`text-xs uppercase tracking-[0.35em] block mb-2 font-semibold ${isMinang ? 'text-[#851C28] dark:text-[#E8808D]' : 'text-[#8C7A6B] dark:text-[#A89E94]'}`}>
            Bismillaahirrohmaanirrohiim
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-3">
            Kedua Mempelai
          </h2>
          {isMinang ? (
            <PucuakRabuangDivider className="w-52 mx-auto mb-6 opacity-80" color="#C5A059" />
          ) : (
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-6" />
          )}
        </FadeIn>
        
        {/* Sacred Quote Card */}
        <FadeIn direction="up" delay={200}>
          <blockquote className="bg-white/85 dark:bg-[#1A1E1C]/85 backdrop-blur-xs p-6 sm:p-7 rounded-2xl text-left sm:text-center text-xs sm:text-sm leading-relaxed shadow-xs border border-[#E8DFD3] dark:border-[#2C3833]">
            "{config.quote.text}"
            <cite className={`block mt-2.5 font-normal not-italic text-xs font-semibold ${isMinang ? 'text-[#851C28] dark:text-[#E8808D]' : 'text-[#B89047] dark:text-[#E6CA65]'}`}>
              — {config.quote.source}
            </cite>
          </blockquote>
        </FadeIn>
      </div>

      {/* Profiles Grid with Center Monogram */}
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        
        {/* Center Monogram Emblem (Desktop Floating) with gentle animation */}
        <div className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border items-center justify-center shadow-lg animate-float-soft glow-gold ${
          isMinang
            ? 'bg-[#FFFDF9] dark:bg-[#1A1E1C] border-[#C5A059]/50 text-[#851C28]'
            : 'bg-[#FAF7F2] dark:bg-[#1A221F] border-[#D4AF37] text-[#B89047]'
        }`}>
          {isMinang ? (
            <SuntiangCrown className="w-8 h-8" color="#C5A059" animated={true} />
          ) : (
            <span className="font-script text-2xl select-none">&amp;</span>
          )}
        </div>

        {/* Groom Card (Marapulai) */}
        <FadeIn direction="up" delay={250} className="h-full">
          <div className={`h-full flex flex-col items-center text-center backdrop-blur-xs rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative group bg-white/92 dark:bg-[#1A1E1C]/92 border sheen-effect ${
            isMinang
              ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
              : 'border-[#EBE1D4] dark:border-[#28352F]'
          }`}>
            {/* Subtle songket corner ornaments for Minang */}
            {isMinang && (
              <>
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
              </>
            )}

            <div className="relative mb-6">
              {/* Luxury Frame with configurable ratio & scale */}
              <div className={`${getCoupleFrameClasses(coupleRatio)} overflow-hidden border-2 shadow-md relative transition-transform duration-700 ease-out group-hover:scale-102 ${
                isMinang
                  ? 'border-[#C5A059]/40 bg-[#FAF8F5] ring-2 ring-[#C5A059]/20'
                  : 'border-[#FAF7F2] dark:border-[#18201D] ring-2 ring-[#B89047]/40 bg-[#EBE1D4]'
              }`}>
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={formatImageUrl(
                      config.groom.photoUrl,
                      '/src/assets/images/groom_portrait_1790611004426.jpg'
                    )}
                    alt={config.groom.fullName}
                    referrerPolicy="no-referrer"
                    style={{ transform: `scale(${coupleScale})` }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== '/src/assets/images/groom_portrait_1790611004426.jpg') {
                        target.src = '/src/assets/images/groom_portrait_1790611004426.jpg';
                      }
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
                  />
                </div>
              </div>
              <div className={`absolute -bottom-2 right-4 text-white p-2 rounded-full shadow-md animate-breathe ${
                isMinang ? 'bg-gradient-to-r from-[#851C28] to-[#6A141F]' : 'bg-gradient-to-r from-[#B89047] to-[#A37E38]'
              }`}>
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#851C28] dark:text-[#E8808D] font-semibold mb-1.5 flex items-center gap-1.5">
              {isMinang ? 'Marapulai (Mempelai Pria)' : 'Mempelai Pria'}
            </span>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1 tracking-wide">
              {config.groom.fullName}
            </h3>
            <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-4 font-semibold uppercase tracking-widest">
              {config.groom.nickName}
            </span>

            <div className="w-12 h-0.5 bg-[#C5A059]/35 mx-auto mb-4" />

            <p className="text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] leading-relaxed mb-4 max-w-sm">
              {config.groom.childOrder} <br />
              Putra dari <strong className="text-[#25201C] dark:text-[#FAF7F2] font-semibold">{config.groom.fatherName}</strong> <br />
              &amp; <strong className="text-[#25201C] dark:text-[#FAF7F2] font-semibold">{config.groom.motherName}</strong>
            </p>

            {config.groom.bio && (
              <p className="text-xs text-[#7A6B5F] dark:text-[#9EA8A3] italic mb-6 max-w-xs leading-relaxed">
                "{config.groom.bio}"
              </p>
            )}

            {config.groom.instagramHandle && (
              <a
                href={`https://instagram.com/${config.groom.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium text-[#7A695A] dark:text-[#D1C3B3] bg-[#EFE7DC]/70 dark:bg-[#232F2A] hover:text-[#851C28] hover:border-[#851C28]/30 border border-transparent transition-all shadow-2xs mt-auto cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>@{config.groom.instagramHandle}</span>
              </a>
            )}
          </div>
        </FadeIn>

        {/* Bride Card (Anak Daro) */}
        <FadeIn direction="up" delay={350} className="h-full">
          <div className={`h-full flex flex-col items-center text-center backdrop-blur-xs rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative group bg-white/92 dark:bg-[#1A1E1C]/92 border sheen-effect ${
            isMinang
              ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
              : 'border-[#EBE1D4] dark:border-[#28352F]'
          }`}>
            {/* Subtle songket corner ornaments for Minang */}
            {isMinang && (
              <>
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
              </>
            )}

            <div className="relative mb-6">
              {/* Luxury Frame with configurable ratio & scale */}
              <div className={`${getCoupleFrameClasses(coupleRatio)} overflow-hidden border-2 shadow-md relative transition-transform duration-700 ease-out group-hover:scale-102 ${
                isMinang
                  ? 'border-[#C5A059]/40 bg-[#FAF8F5] ring-2 ring-[#C5A059]/20'
                  : 'border-[#FAF7F2] dark:border-[#18201D] ring-2 ring-[#B89047]/40 bg-[#EBE1D4]'
              }`}>
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={formatImageUrl(
                      config.bride.photoUrl,
                      '/src/assets/images/bride_portrait_1790611016646.jpg'
                    )}
                    alt={config.bride.fullName}
                    referrerPolicy="no-referrer"
                    style={{ transform: `scale(${coupleScale})` }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== '/src/assets/images/bride_portrait_1790611016646.jpg') {
                        target.src = '/src/assets/images/bride_portrait_1790611016646.jpg';
                      }
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
                  />
                </div>
              </div>
              <div className={`absolute -bottom-2 left-4 text-white p-2 rounded-full shadow-md animate-breathe ${
                isMinang ? 'bg-gradient-to-r from-[#851C28] to-[#6A141F]' : 'bg-gradient-to-r from-[#B89047] to-[#A37E38]'
              }`}>
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#851C28] dark:text-[#E8808D] font-semibold mb-1.5 flex items-center gap-1.5">
              {isMinang ? 'Anak Daro (Mempelai Wanita)' : 'Mempelai Wanita'}
            </span>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1 tracking-wide">
              {config.bride.fullName}
            </h3>
            <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-4 font-semibold uppercase tracking-widest">
              {config.bride.nickName}
            </span>

            <div className="w-12 h-0.5 bg-[#C5A059]/35 mx-auto mb-4" />

            <p className="text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] leading-relaxed mb-4 max-w-sm">
              {config.bride.childOrder} <br />
              Putri dari <strong className="text-[#25201C] dark:text-[#FAF7F2] font-semibold">{config.bride.fatherName}</strong> <br />
              &amp; <strong className="text-[#25201C] dark:text-[#FAF7F2] font-semibold">{config.bride.motherName}</strong>
            </p>

            {config.bride.bio && (
              <p className="text-xs text-[#7A6B5F] dark:text-[#9EA8A3] italic mb-6 max-w-xs leading-relaxed">
                "{config.bride.bio}"
              </p>
            )}

            {config.bride.instagramHandle && (
              <a
                href={`https://instagram.com/${config.bride.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium text-[#7A695A] dark:text-[#D1C3B3] bg-[#EFE7DC]/70 dark:bg-[#232F2A] hover:text-[#851C28] hover:border-[#851C28]/30 border border-transparent transition-all shadow-2xs mt-auto cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>@{config.bride.instagramHandle}</span>
              </a>
            )}
          </div>
        </FadeIn>

      </div>

    </section>
  );
};
