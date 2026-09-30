import React from 'react';
import { Instagram, Heart, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { formatImageUrl } from '../utils/googleDrive';

interface CoupleSectionProps {
  config: WeddingConfig;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  return (
    <section id="mempelai" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      
      {/* Decorative floral leaf watermark background ornament */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-20 relative z-10">
        <span className="text-xs uppercase tracking-[0.35em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2 font-medium">
          Maha Suci Allah
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
          Kedua Mempelai
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-6" />
        
        {/* Sacred Quote Card */}
        <blockquote className="bg-[#FAF7F2]/90 dark:bg-[#18201D]/90 backdrop-blur-xs border-l-2 border-[#B89047] p-6 sm:p-7 rounded-r-2xl text-left sm:text-center text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] italic leading-relaxed shadow-sm">
          "{config.quote.text}"
          <cite className="block mt-2.5 font-normal not-italic text-xs font-semibold text-[#B89047] dark:text-[#E6CA65]">
            — {config.quote.source}
          </cite>
        </blockquote>
      </div>

      {/* Profiles Grid with Center Monogram */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        
        {/* Center Monogram Emblem (Desktop Floating) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#1A221F] border-2 border-[#D4AF37] text-[#B89047] items-center justify-center shadow-xl">
          <span className="font-script text-3xl select-none">&amp;</span>
        </div>

        {/* Groom Card */}
        <div className="flex flex-col items-center text-center bg-[#FAF7F2]/90 dark:bg-[#18201D]/90 backdrop-blur-xs rounded-3xl p-8 sm:p-10 border border-[#EBE1D4] dark:border-[#28352F] shadow-sm hover:shadow-xl transition-all duration-300 relative group">
          {/* Subtle gold corner ornament */}
          <div className="absolute top-4 right-4 text-[#B89047]/30 group-hover:text-[#B89047]/60 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="relative mb-7">
            {/* Arched Luxury Frame */}
            <div className="w-48 h-64 sm:w-56 sm:h-72 rounded-t-full rounded-b-3xl overflow-hidden border-4 border-[#FAF7F2] dark:border-[#18201D] ring-2 ring-[#B89047]/40 shadow-lg relative bg-[#EBE1D4]">
              <img
                src={formatImageUrl(
                  config.groom.photoUrl,
                  '/src/assets/images/groom_portrait_1790611004426.jpg'
                )}
                alt={config.groom.fullName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/src/assets/images/groom_portrait_1790611004426.jpg') {
                    target.src = '/src/assets/images/groom_portrait_1790611004426.jpg';
                  }
                }}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="absolute -bottom-2 right-4 bg-gradient-to-r from-[#B89047] to-[#A37E38] text-white p-2.5 rounded-full shadow-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1 tracking-wide">
            {config.groom.fullName}
          </h3>
          <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-4 font-semibold uppercase tracking-widest">
            {config.groom.nickName}
          </span>

          <div className="w-10 h-0.5 bg-[#B89047]/30 mx-auto mb-4" />

          <p className="text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] leading-relaxed mb-4 max-w-sm">
            {config.groom.childOrder} <br />
            <strong className="text-[#25201C] dark:text-[#FAF7F2] font-semibold">{config.groom.fatherName}</strong> <br />
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium text-[#7A695A] dark:text-[#D1C3B3] bg-[#EFE7DC]/80 dark:bg-[#232F2A] hover:text-[#B89047] hover:border-[#B89047]/40 border border-transparent transition-all shadow-2xs mt-auto cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5 text-[#B89047]" />
              <span>@{config.groom.instagramHandle}</span>
            </a>
          )}
        </div>

        {/* Bride Card */}
        <div className="flex flex-col items-center text-center bg-[#FAF7F2]/90 dark:bg-[#18201D]/90 backdrop-blur-xs rounded-3xl p-8 sm:p-10 border border-[#EBE1D4] dark:border-[#28352F] shadow-sm hover:shadow-xl transition-all duration-300 relative group">
          {/* Subtle gold corner ornament */}
          <div className="absolute top-4 left-4 text-[#B89047]/30 group-hover:text-[#B89047]/60 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="relative mb-7">
            {/* Arched Luxury Frame */}
            <div className="w-48 h-64 sm:w-56 sm:h-72 rounded-t-full rounded-b-3xl overflow-hidden border-4 border-[#FAF7F2] dark:border-[#18201D] ring-2 ring-[#B89047]/40 shadow-lg relative bg-[#EBE1D4]">
              <img
                src={formatImageUrl(
                  config.bride.photoUrl,
                  '/src/assets/images/bride_portrait_1790611016646.jpg'
                )}
                alt={config.bride.fullName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/src/assets/images/bride_portrait_1790611016646.jpg') {
                    target.src = '/src/assets/images/bride_portrait_1790611016646.jpg';
                  }
                }}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="absolute -bottom-2 left-4 bg-gradient-to-r from-[#B89047] to-[#A37E38] text-white p-2.5 rounded-full shadow-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1 tracking-wide">
            {config.bride.fullName}
          </h3>
          <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-4 font-semibold uppercase tracking-widest">
            {config.bride.nickName}
          </span>

          <div className="w-10 h-0.5 bg-[#B89047]/30 mx-auto mb-4" />

          <p className="text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] leading-relaxed mb-4 max-w-sm">
            {config.bride.childOrder} <br />
            <strong className="text-[#25201C] dark:text-[#FAF7F2] font-semibold">{config.bride.fatherName}</strong> <br />
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium text-[#7A695A] dark:text-[#D1C3B3] bg-[#EFE7DC]/80 dark:bg-[#232F2A] hover:text-[#B89047] hover:border-[#B89047]/40 border border-transparent transition-all shadow-2xs mt-auto cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5 text-[#B89047]" />
              <span>@{config.bride.instagramHandle}</span>
            </a>
          )}
        </div>

      </div>

    </section>
  );
};
