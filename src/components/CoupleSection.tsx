import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface CoupleSectionProps {
  config: WeddingConfig;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  return (
    <section id="mempelai" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2">
          Maha Suci Allah
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
          Kedua Mempelai
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-6" />
        
        {/* Sacred Quote */}
        <blockquote className="bg-[#FAF7F2] dark:bg-[#18201D] border-l-2 border-[#B89047] p-5 rounded-r-xl text-left sm:text-center text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] italic leading-relaxed shadow-xs">
          "{config.quote.text}"
          <cite className="block mt-2 font-normal not-italic text-xs font-medium text-[#B89047] dark:text-[#E6CA65]">
            — {config.quote.source}
          </cite>
        </blockquote>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Groom Card */}
        <div className="flex flex-col items-center text-center bg-[#FAF7F2] dark:bg-[#18201D] rounded-2xl p-6 sm:p-8 border border-[#EBE1D4] dark:border-[#28352F] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative mb-6">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#FAF7F2] dark:border-[#18201D] ring-2 ring-[#B89047]/50 shadow-md">
              <img
                src={config.groom.photoUrl}
                alt={config.groom.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-2 -right-1 bg-[#B89047] text-white p-2 rounded-full shadow-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1">
            {config.groom.fullName}
          </h3>
          <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-3 font-medium">
            ({config.groom.nickName})
          </span>

          <p className="text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] leading-relaxed mb-4 max-w-sm">
            {config.groom.childOrder} <br />
            <strong className="text-[#25201C] dark:text-[#FAF7F2]">{config.groom.fatherName}</strong> <br />
            &amp; <strong className="text-[#25201C] dark:text-[#FAF7F2]">{config.groom.motherName}</strong>
          </p>

          {config.groom.bio && (
            <p className="text-xs text-[#7A6B5F] dark:text-[#9EA8A3] italic mb-5 max-w-xs">
              "{config.groom.bio}"
            </p>
          )}

          {config.groom.instagramHandle && (
            <a
              href={`https://instagram.com/${config.groom.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-[#7A695A] dark:text-[#D1C3B3] bg-[#EFE7DC] dark:bg-[#232F2A] hover:text-[#B89047] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#B89047]" />
              <span>@{config.groom.instagramHandle}</span>
            </a>
          )}
        </div>

        {/* Bride Card */}
        <div className="flex flex-col items-center text-center bg-[#FAF7F2] dark:bg-[#18201D] rounded-2xl p-6 sm:p-8 border border-[#EBE1D4] dark:border-[#28352F] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative mb-6">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#FAF7F2] dark:border-[#18201D] ring-2 ring-[#B89047]/50 shadow-md">
              <img
                src={config.bride.photoUrl}
                alt={config.bride.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-2 -right-1 bg-[#B89047] text-white p-2 rounded-full shadow-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1">
            {config.bride.fullName}
          </h3>
          <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-3 font-medium">
            ({config.bride.nickName})
          </span>

          <p className="text-xs sm:text-sm text-[#5C5046] dark:text-[#BFAF9E] leading-relaxed mb-4 max-w-sm">
            {config.bride.childOrder} <br />
            <strong className="text-[#25201C] dark:text-[#FAF7F2]">{config.bride.fatherName}</strong> <br />
            &amp; <strong className="text-[#25201C] dark:text-[#FAF7F2]">{config.bride.motherName}</strong>
          </p>

          {config.bride.bio && (
            <p className="text-xs text-[#7A6B5F] dark:text-[#9EA8A3] italic mb-5 max-w-xs">
              "{config.bride.bio}"
            </p>
          )}

          {config.bride.instagramHandle && (
            <a
              href={`https://instagram.com/${config.bride.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-[#7A695A] dark:text-[#D1C3B3] bg-[#EFE7DC] dark:bg-[#232F2A] hover:text-[#B89047] transition-colors"
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
