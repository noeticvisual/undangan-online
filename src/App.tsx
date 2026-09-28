import React, { useState, useEffect } from 'react';
import { WeddingConfig, RSVPRecord, WeddingEvent } from './types/wedding';
import { DEFAULT_WEDDING_CONFIG, INITIAL_RSVPS } from './data/defaultWeddingData';
import { weddingMusicEngine } from './services/audioPlayer';
import { OpeningEnvelopeModal } from './components/OpeningEnvelopeModal';
import { HeaderNavbar } from './components/HeaderNavbar';
import { HeroSection } from './components/HeroSection';
import { CoupleSection } from './components/CoupleSection';
import { EventsSection } from './components/EventsSection';
import { LoveStorySection } from './components/LoveStorySection';
import { GallerySection } from './components/GallerySection';
import { RsvpSection } from './components/RsvpSection';
import { GiftRegistrySection } from './components/GiftRegistrySection';
import { DigitalPassModal } from './components/DigitalPassModal';
import { ShareModal } from './components/ShareModal';
import { CalendarExportModal } from './components/CalendarExportModal';
import { CustomizerModal } from './components/CustomizerModal';
import { FloatingNav } from './components/FloatingNav';
import { FooterSection } from './components/FooterSection';

export default function App() {
  // 1. Config state with localStorage persistence
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem('niskala_wedding_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_WEDDING_CONFIG;
  });

  // 2. RSVP records state with localStorage persistence
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    try {
      const saved = localStorage.getItem('niskala_wedding_rsvps');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_RSVPS;
  });

  // 3. Guest Name detection from URL query parameters (e.g. ?to=Budi+Santoso or ?tamu=dr.+Anisa)
  const [guestName, setGuestName] = useState<string>('Tamu Undangan Terhormat');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('to') || params.get('tamu') || params.get('guest') || params.get('nama');
      if (nameParam) {
        setGuestName(nameParam.trim());
      }
    }
  }, []);

  // 4. Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('niskala_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('niskala_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('niskala_theme', 'light');
    }
  }, [isDarkMode]);

  // 5. Envelope modal (Opening invitation screen)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(true);

  // 6. Music playing state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleToggleMusic = () => {
    const newState = weddingMusicEngine.toggle();
    setIsMusicPlaying(newState);
  };

  const handleOpenInvitation = () => {
    setIsEnvelopeOpen(false);
    weddingMusicEngine.start();
    setIsMusicPlaying(true);
  };

  // 7. Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQrPassOpen, setIsQrPassOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTargetEvent, setCalendarTargetEvent] = useState<WeddingEvent | null>(null);

  const handleOpenCalendarForEvent = (ev: WeddingEvent) => {
    setCalendarTargetEvent(ev);
    setIsCalendarOpen(true);
  };

  // 8. RSVP handler
  const handleAddRsvp = (record: Omit<RSVPRecord, 'id' | 'createdAt'>) => {
    const newRecord: RSVPRecord = {
      ...record,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...rsvps];
    setRsvps(updated);
    try {
      localStorage.setItem('niskala_wedding_rsvps', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Optional background sync to simple backend endpoint
    try {
      fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      }).catch(() => {
        // Safe offline/local-first resilience
      });
    } catch {
      // ignore
    }
  };

  // 9. Save and Reset Config
  const handleSaveConfig = (newConfig: WeddingConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('niskala_wedding_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  const handleResetDefault = () => {
    setConfig(DEFAULT_WEDDING_CONFIG);
    try {
      localStorage.removeItem('niskala_wedding_config');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA] transition-colors duration-300 relative selection:bg-[#B89047]/30">
      
      {/* 1. Opening Cover Envelope Modal */}
      <OpeningEnvelopeModal
        config={config}
        guestName={guestName}
        isOpen={isEnvelopeOpen}
        onOpenInvitation={handleOpenInvitation}
      />

      {/* 2. Top Bar Navigation (Strict 3-Zone Contract) */}
      <HeaderNavbar
        config={config}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenQrPass={() => setIsQrPassOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Content Landmark */}
      <main>
        {/* 3. Hero Section with Live Countdown */}
        <HeroSection
          config={config}
          onOpenCalendarExport={() => {
            setCalendarTargetEvent(config.events[0]);
            setIsCalendarOpen(true);
          }}
        />

        {/* 4. Couple Section */}
        <CoupleSection config={config} />

        {/* 5. Events Section (Akad & Resepsi) + Live Maps */}
        <EventsSection
          config={config}
          onAddToCalendar={handleOpenCalendarForEvent}
        />

        {/* 6. Love Story Journey */}
        <LoveStorySection config={config} />

        {/* 7. Photo Gallery with Fullscreen Lightbox */}
        <GallerySection gallery={config.gallery} />

        {/* 8. Functional RSVP Form & Wishing Board */}
        <RsvpSection
          initialGuestName={guestName === 'Tamu Undangan Terhormat' ? '' : guestName}
          rsvps={rsvps}
          onAddRsvp={handleAddRsvp}
        />

        {/* 9. Gift Registry & Digital Envelope */}
        <GiftRegistrySection config={config} />
      </main>

      {/* 10. Footer Section */}
      <FooterSection
        config={config}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
      />

      {/* 11. Floating Bottom Dock Navigation (Mobile) & Floating Music Vinyl */}
      <FloatingNav
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
      />

      {/* 12. Digital Pass QR Modal */}
      <DigitalPassModal
        config={config}
        guestName={guestName}
        isOpen={isQrPassOpen}
        onClose={() => setIsQrPassOpen(false)}
      />

      {/* 13. Social Share Modal */}
      <ShareModal
        config={config}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* 14. Calendar Export Modal (Google Calendar & iCal) */}
      <CalendarExportModal
        config={config}
        selectedEvent={calendarTargetEvent}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      {/* 15. Live Customizer Modal */}
      <CustomizerModal
        config={config}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSaveConfig={handleSaveConfig}
        onResetDefault={handleResetDefault}
      />

    </div>
  );
}
