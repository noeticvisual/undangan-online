import React from 'react';
import { Heart } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { PucuakRabuangDivider, SongketCorner } from './MinangOrnaments';
import { FadeIn } from './FadeIn';

interface LoveStorySectionProps {
  config: WeddingConfig;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ config }) => {
  const isMinang = config.templateId === 'minang-royal';
  return (
    <section
      id="kisah"
      className="py-22 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EFE6D7] via-[#F6F1E8] to-[#ECE3D5] dark:from-[#131916] dark:via-[#151C19] dark:to-[#121815] transition-colors relative"
    >
      {/* Ambient background aura */}
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#851C28]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <FadeIn direction="up" delay={50}>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#851C28] dark:text-[#E8808D] block mb-2">
              Perjalanan Cinta Kami
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-3">
              Kisah Kasih &amp; Jejak Langkah
            </h2>
            {isMinang ? (
              <PucuakRabuangDivider className="w-52 mx-auto mb-4 opacity-80" color="#C5A059" />
            ) : (
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
            )}
            <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
              Setiap kisah memiliki bab istimewa, dan inilah rangkaian momen berharga yang menuntun kami menuju pelaminan.
            </p>
          </FadeIn>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-[#C5A059]/35 ml-4 sm:ml-32 space-y-10">
          {config.loveStory.map((item, idx) => (
            <FadeIn key={item.id || idx} direction="up" delay={idx * 120 + 80}>
              <div className="relative pl-7 sm:pl-10 group">
                
                {/* Timeline Dot with heart */}
                <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-white dark:bg-[#18201D] border-2 border-[#C5A059] flex items-center justify-center text-[#851C28] group-hover:scale-125 transition-transform duration-300 shadow-xs">
                  <Heart className="w-2.5 h-2.5 fill-current animate-pulse" />
                </div>

                {/* Date Tag */}
                <div className="sm:absolute sm:-left-32 sm:top-1 sm:text-right sm:w-24">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#851C28] dark:text-[#E8808D] bg-white/70 dark:bg-[#1A1E1C]/70 px-2.5 py-1 rounded-full border border-[#C5A059]/25 shadow-2xs inline-block">
                    {item.year}
                  </span>
                </div>

                {/* Card Content with sheen effect and sweet hover */}
                <div className="bg-white/95 dark:bg-[#1A221F] p-5 sm:p-6 rounded-3xl border border-[#C5A059]/25 hover:border-[#C5A059] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sheen-effect relative">
                  {/* Subtle Minang corner */}
                  {isMinang && (
                    <div className="absolute top-2 right-2 rotate-90">
                      <SongketCorner className="w-3.5 h-3.5" color="#C5A059" />
                    </div>
                  )}

                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#63554A] dark:text-[#BFAF9E] leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

