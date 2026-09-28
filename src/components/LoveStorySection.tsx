import React from 'react';
import { Heart } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface LoveStorySectionProps {
  config: WeddingConfig;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ config }) => {
  return (
    <section id="kisah" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2">
          Perjalanan Cinta Kami
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
          Kisah Kasih &amp; Jejak Langkah
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
          Setiap kisah memiliki bab istimewa, dan inilah rangkaian momen berharga yang menuntun kami menuju pelaminan.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-[#E2D5C3] dark:border-[#2C3833] ml-4 sm:ml-32 space-y-10">
        {config.loveStory.map((item, idx) => (
          <div key={item.id || idx} className="relative pl-7 sm:pl-10 group">
            
            {/* Timeline Dot with heart */}
            <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-[#FAF7F2] dark:bg-[#18201D] border-2 border-[#B89047] flex items-center justify-center text-[#B89047] group-hover:scale-110 transition-transform">
              <Heart className="w-2.5 h-2.5 fill-current" />
            </div>

            {/* Date Tag */}
            <div className="sm:absolute sm:-left-32 sm:top-1 sm:text-right sm:w-24">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B89047] dark:text-[#E2C799]">
                {item.year}
              </span>
            </div>

            {/* Card Content */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 sm:p-6 rounded-2xl border border-[#EBE1D4] dark:border-[#28352F] shadow-xs">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#63554A] dark:text-[#BFAF9E] leading-relaxed">
                {item.description}
              </p>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
