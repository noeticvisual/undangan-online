import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { WeddingConfig, WeddingEvent } from '../types/wedding';

interface EventsSectionProps {
  config: WeddingConfig;
  onAddToCalendar: (event: WeddingEvent) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ config, onAddToCalendar }) => {
  return (
    <section id="acara" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4EFEA] dark:bg-[#151C19] transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2">
            Rangkaian Acara
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
            Waktu &amp; Lokasi Acara
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {config.events.map((event) => (
            <div
              key={event.id}
              className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-8 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Event Badge Header */}
                <div className="flex items-center justify-between border-b border-[#EADFCF] dark:border-[#28352F] pb-4 mb-6">
                  <div>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94] mt-0.5">
                      {event.subtitle}
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#F2EAE0] dark:bg-[#24302A] rounded-xl text-[#B89047]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-4 mb-6 text-xs sm:text-sm">
                  {/* Date */}
                  <div className="flex items-start gap-3 text-[#4A3F36] dark:text-[#D1C3B3]">
                    <Calendar className="w-4 h-4 text-[#B89047] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium block text-[#25201C] dark:text-[#FAF7F2]">
                        {event.dateFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3 text-[#4A3F36] dark:text-[#D1C3B3]">
                    <Clock className="w-4 h-4 text-[#B89047] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium block text-[#25201C] dark:text-[#FAF7F2]">
                        Pukul {event.startTime} - {event.endTime} {event.timezone}
                      </span>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-3 text-[#4A3F36] dark:text-[#D1C3B3]">
                    <MapPin className="w-4 h-4 text-[#B89047] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#25201C] dark:text-[#FAF7F2] font-semibold">
                        {event.venueName}
                      </strong>
                      <p className="text-xs text-[#736458] dark:text-[#A49A8F] mt-0.5 leading-relaxed">
                        {event.venueAddress}
                      </p>
                    </div>
                  </div>

                  {/* Dress Code & Notes */}
                  {event.dressCode && (
                    <div className="p-3 bg-[#F4EFEA] dark:bg-[#222C27] rounded-lg text-xs text-[#5D5046] dark:text-[#BFAF9E]">
                      <span className="font-medium text-[#25201C] dark:text-[#FAF7F2]">Dresscode:</span> {event.dressCode}
                      {event.notes && <p className="mt-1 text-[11px] italic text-[#8A796B] dark:text-[#8E9B94]">{event.notes}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#EADFCF] dark:border-[#28352F]">
                <a
                  href={event.mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#B89047] hover:bg-[#A37E38] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={() => onAddToCalendar(event)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#25201C] dark:text-[#FAF7F2] bg-[#FAF7F2] dark:bg-[#1A221F] border border-[#D9CEBF] dark:border-[#2F3D36] hover:border-[#B89047] rounded-xl transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B89047]" />
                  <span>+ Kalender</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Live Interactive Venue Map Embed */}
        <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-4 sm:p-6 border border-[#E8DFD3] dark:border-[#2C3833] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B89047]" />
              <h3 className="text-sm font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                Petunjuk Peta Lokasi Acara
              </h3>
            </div>
            <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94]">
              Plataran Menteng, Jakarta Pusat
            </span>
          </div>

          <div className="w-full h-72 sm:h-96 rounded-xl overflow-hidden border border-[#E2D6C5] dark:border-[#2F3D36] bg-[#EFE9E0] dark:bg-[#18201D]">
            <iframe
              title="Peta Lokasi Pernikahan"
              src={config.events[0]?.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
