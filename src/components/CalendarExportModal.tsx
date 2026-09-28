import React from 'react';
import { X, Calendar, Download, ExternalLink } from 'lucide-react';
import { WeddingConfig, WeddingEvent } from '../types/wedding';

interface CalendarExportModalProps {
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
  selectedEvent?: WeddingEvent | null;
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  config,
  isOpen,
  onClose,
  selectedEvent,
}) => {
  if (!isOpen) return null;

  const eventToUse = selectedEvent || config.events[0];

  // Helper to convert event to Google Calendar Intent URL
  const getGoogleCalendarUrl = (ev: WeddingEvent) => {
    const title = encodeURIComponent(`Pernikahan ${config.groom.nickName} & ${config.bride.nickName} - ${ev.title}`);
    const details = encodeURIComponent(
      `Pernikahan ${config.groom.fullName} & ${config.bride.fullName}.\nLokasi: ${ev.venueName}\nAlamat: ${ev.venueAddress}`
    );
    const location = encodeURIComponent(`${ev.venueName}, ${ev.venueAddress}`);

    // Clean dates to format: 20261024T080000Z
    const dateClean = ev.date.replace(/-/g, '');
    const startClean = ev.startTime.replace(/:/g, '') + '00';
    const endClean = ev.endTime.replace(/:/g, '') + '00';
    const dates = `${dateClean}T${startClean}/${dateClean}T${endClean}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Helper to download iCal file (.ics)
  const handleDownloadIcs = (ev: WeddingEvent) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Niskala Wedding//Online Invitation//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Pernikahan ${config.groom.nickName} & ${config.bride.nickName} - ${ev.title}`,
      `DESCRIPTION:Pernikahan ${config.groom.fullName} & ${config.bride.fullName}.`,
      `LOCATION:${ev.venueName}, ${ev.venueAddress}`,
      `DTSTART:${ev.date.replace(/-/g, '')}T${ev.startTime.replace(/:/g, '')}00`,
      `DTEND:${ev.date.replace(/-/g, '')}T${ev.endTime.replace(/:/g, '')}00`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Wedding_${config.groom.nickName}_${config.bride.nickName}_${ev.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl p-6 sm:p-7">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-[#B89047]" />
          <h3 className="font-serif-luxury text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
            Simpan Tanggal Acara
          </h3>
        </div>
        <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-6">
          Tambahkan pengingat ke kalender digital Anda agar tidak terlewatkan momen bahagia ini.
        </p>

        {/* List of events */}
        <div className="space-y-4">
          {config.events.map((ev) => (
            <div
              key={ev.id}
              className={`p-4 rounded-xl border transition-all ${
                eventToUse.id === ev.id
                  ? 'border-[#B89047] bg-[#B89047]/5 dark:bg-[#B89047]/10'
                  : 'border-[#E2D5C3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#151C19]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-serif-luxury text-lg font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94]">
                    {ev.dateFormatted} · {ev.startTime} - {ev.endTime} {ev.timezone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <a
                  href={getGoogleCalendarUrl(ev)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 text-xs font-medium text-white bg-[#B89047] hover:bg-[#A37E38] rounded-lg text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Calendar</span>
                </a>

                <button
                  onClick={() => handleDownloadIcs(ev)}
                  className="py-2 px-3 text-xs font-medium border border-[#D9CEBF] dark:border-[#2F3D36] text-[#25201C] dark:text-[#FAF7F2] bg-white dark:bg-[#1C2521] hover:border-[#B89047] rounded-lg flex items-center gap-1.5 cursor-pointer"
                  title="Unduh file .ics untuk Apple Calendar / Outlook"
                >
                  <Download className="w-3 h-3 text-[#B89047]" />
                  <span>iCal (.ics)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
