import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { WeddingConfig, WeddingEvent } from '../types/wedding';
import { GonjongRoof, PucuakRabuangDivider, CaranoMotif, SongketCorner } from './MinangOrnaments';
import { FadeIn } from './FadeIn';
import { formatGoogleMapsEmbedUrl, isJakartaPlaceholder } from '../utils/googleMaps';

interface EventsSectionProps {
  config: WeddingConfig;
  onAddToCalendar: (event: WeddingEvent) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ config, onAddToCalendar }) => {
  const isMinang = config.templateId === 'minang-royal';
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);

  const selectedEvent = config.events[selectedMapIndex] || config.events[0];
  const activeEmbedUrl = formatGoogleMapsEmbedUrl(
    selectedEvent?.mapsEmbedUrl || selectedEvent?.mapsDirectUrl,
    selectedEvent?.venueName,
    selectedEvent?.venueAddress
  );

  const getDirectMapsLink = (event: WeddingEvent | undefined) => {
    if (!event) return 'https://maps.google.com';
    const venueIsJakarta = isJakartaPlaceholder(event.venueName) || isJakartaPlaceholder(event.venueAddress);
    if (event.mapsDirectUrl && (!isJakartaPlaceholder(event.mapsDirectUrl) || venueIsJakarta)) {
      return event.mapsDirectUrl;
    }
    const q = [event.venueName, event.venueAddress].filter(Boolean).join(' ').trim();
    return q ? `https://maps.google.com/?q=${encodeURIComponent(q)}` : 'https://maps.google.com';
  };

  return (
    <section id="acara" className="py-22 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F7F1E7] via-[#F3ECE0] to-[#EFE6D7] dark:from-[#151C19] dark:via-[#161E1B] dark:to-[#131916] transition-colors relative overflow-hidden">
      {/* Ambient festive golden Baralek Gadang glow */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#C5A059]/7 dark:bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#851C28]/4 dark:bg-[#851C28]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn direction="up" delay={50}>
            <span className="text-xs uppercase tracking-[0.3em] block mb-2 font-semibold text-[#851C28] dark:text-[#E8808D]">
              Rangkaian Acara
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-3">
              Waktu &amp; Tempat Acara
            </h2>
            {isMinang ? (
              <PucuakRabuangDivider className="w-52 mx-auto mb-4 opacity-80" color="#C5A059" />
            ) : (
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
            )}
            <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu pada perayaan hari bahagia kami.
            </p>
          </FadeIn>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {config.events.map((event, idx) => (
            <FadeIn key={event.id} direction="up" delay={idx * 150 + 100} className="h-full">
              <div
                className={`h-full bg-white/95 dark:bg-[#1A1E1C]/95 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group relative sheen-effect ${
                  isMinang
                    ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
                    : 'border-[#E8DFD3] dark:border-[#2C3833] hover:border-[#B89047]/40'
                }`}
              >
                {/* Songket corners for Minang */}
                {isMinang && (
                  <>
                    <div className="absolute top-3 left-3">
                      <SongketCorner className="w-4 h-4" color="#C5A059" />
                    </div>
                    <div className="absolute top-3 right-3 rotate-90">
                      <SongketCorner className="w-4 h-4" color="#C5A059" />
                    </div>
                  </>
                )}

                <div>
                  {/* Event Badge Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EADFCF] dark:border-[#28352F]">
                    <div>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94] mt-0.5">
                        {event.subtitle}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-2xs ${
                      isMinang ? 'bg-[#851C28]/10 text-[#851C28] dark:text-[#E8808D] border border-[#C5A059]/30' : 'bg-[#F2EAE0] dark:bg-[#24302A] text-[#B89047]'
                    }`}>
                      {isMinang ? <CaranoMotif className="w-5 h-5 animate-float-soft" color="#C5A059" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Details list */}
                  <div className="space-y-4 mb-6 text-xs sm:text-sm">
                    {/* Date */}
                    <div className="flex items-start gap-3 text-[#4A3F36] dark:text-[#D1C3B3]">
                      <div className="p-1 rounded-lg bg-[#FAF7F2] dark:bg-[#151C19] border border-[#E8DFD3] dark:border-[#2C3833]">
                        <Calendar className={`w-4 h-4 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
                      </div>
                      <div>
                        <span className="font-semibold block text-[#25201C] dark:text-[#FAF7F2]">
                          {event.dateFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3 text-[#4A3F36] dark:text-[#D1C3B3]">
                      <div className="p-1 rounded-lg bg-[#FAF7F2] dark:bg-[#151C19] border border-[#E8DFD3] dark:border-[#2C3833]">
                        <Clock className={`w-4 h-4 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
                      </div>
                      <div>
                        <span className="font-semibold block text-[#25201C] dark:text-[#FAF7F2]">
                          Pukul {event.startTime} - {event.endTime} {event.timezone}
                        </span>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-3 text-[#4A3F36] dark:text-[#D1C3B3]">
                      <div className="p-1 rounded-lg bg-[#FAF7F2] dark:bg-[#151C19] border border-[#E8DFD3] dark:border-[#2C3833]">
                        <MapPin className={`w-4 h-4 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
                      </div>
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
                      <div className="p-3 bg-[#FAF7F2] dark:bg-[#222C27] rounded-xl text-xs text-[#5D5046] dark:text-[#BFAF9E] border border-[#E8DFD3] dark:border-[#2C3833]">
                        <span className="font-semibold text-[#25201C] dark:text-[#FAF7F2]">Ketentuan Busana:</span> {event.dressCode}
                        {event.notes && <p className="mt-1 text-[11px] italic text-[#8A796B] dark:text-[#8E9B94]">{event.notes}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons with sweet sheen */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#EADFCF] dark:border-[#28352F]">
                  <a
                    href={getDirectMapsLink(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
                      isMinang
                        ? 'bg-gradient-to-r from-[#851C28] to-[#6A141F] hover:from-[#9B2230] hover:to-[#7A1724]'
                        : 'bg-[#B89047] hover:bg-[#A37E38]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <button
                    onClick={() => onAddToCalendar(event)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer ${
                      isMinang
                        ? 'text-[#851C28] dark:text-[#E8808D] bg-[#FFFDF9] dark:bg-[#1A1E1C] border border-[#C5A059]/40 hover:border-[#C5A059]'
                        : 'text-[#25201C] dark:text-[#FAF7F2] bg-[#FAF7F2] dark:bg-[#1A221F] border border-[#D9CEBF] dark:border-[#2F3D36] hover:border-[#B89047]'
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${isMinang ? 'text-[#C5A059]' : 'text-[#B89047]'}`} />
                    <span>+ Kalender</span>
                  </button>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

        {/* Live Interactive Venue Map Embed */}
        <FadeIn direction="up" delay={200}>
          <div className="bg-white/95 dark:bg-[#1A221F] rounded-3xl p-4 sm:p-6 border border-[#C5A059]/30 hover:border-[#C5A059] shadow-sm transition-all duration-500">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-sm font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                  Petunjuk Peta Lokasi Acara: <span className="text-[#851C28] dark:text-[#E8808D]">{selectedEvent?.title}</span>
                </h3>
              </div>

              {/* Event toggle tabs if there are multiple events */}
              {config.events.length > 1 && (
                <div className="flex items-center gap-1.5 p-1 bg-[#F4EFEA] dark:bg-[#151C19] rounded-xl border border-[#E8DFD3] dark:border-[#2C3833]">
                  {config.events.map((ev, idx) => (
                    <button
                      key={ev.id || idx}
                      type="button"
                      onClick={() => setSelectedMapIndex(idx)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        selectedMapIndex === idx
                          ? 'bg-[#851C28] text-white shadow-xs'
                          : 'text-[#6B5E52] dark:text-[#A89E94] hover:text-[#25201C] dark:hover:text-white'
                      }`}
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#736458] dark:text-[#A49A8F] mb-3 px-1">
              <span>{selectedEvent?.venueName} — {selectedEvent?.venueAddress}</span>
              <a
                href={getDirectMapsLink(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#851C28] dark:text-[#E8808D] font-semibold hover:underline shrink-0 ml-2"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-[#E2D6C5] dark:border-[#2F3D36] bg-[#EFE9E0] dark:bg-[#18201D]">
              <iframe
                title={`Peta Lokasi ${selectedEvent?.title}`}
                src={activeEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};
