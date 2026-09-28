import React, { useState, useEffect } from 'react';
import { WeddingConfig, WeddingEvent, RSVPRecord } from './types/wedding';
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
import { AdminPage } from './admin/AdminPage';
import { ClientLandingPage } from './admin/ClientLandingPage';

type RouteView = 'invitation' | 'admin' | 'kelola' | 'client';

function detectRoute(): RouteView {
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
  if (path === '/kelola' || path.startsWith('/kelola/')) return 'kelola';
  if (path === '/klien' || path.startsWith('/klien/')) return 'client';
  return 'invitation';
}

function detectGuestSlug(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('tamu') || params.get('to') || params.get('guest') || params.get('nama');
}

export default function App() {
  const [route] = useState<RouteView>(() => detectRoute());

  // 1. Config state with localStorage persistence + server sync
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem('niskala_wedding_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_WEDDING_CONFIG;
  });
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/wedding-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.config) {
          setConfig(data.config);
          try {
            localStorage.setItem('niskala_wedding_config', JSON.stringify(data.config));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // offline/local-first resilience
      })
      .finally(() => {
        if (!cancelled) setConfigLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. RSVP records state with localStorage persistence + server sync
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    try {
      const saved = localStorage.getItem('niskala_wedding_rsvps');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_RSVPS;
  });

  useEffect(() => {
    fetch('/api/rsvp')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.rsvps) && data.rsvps.length > 0) {
          setRsvps(data.rsvps);
        }
      })
      .catch(() => {
        // offline/local-first resilience
      });
  }, []);

  // 3. Guest Name detection from URL query parameters (e.g. ?to=Budi+Santoso or ?tamu=dr.+Anisa)
  const [guestName, setGuestName] = useState<string>('Tamu Undangan Terhormat');
  const [guestSlug, setGuestSlug] = useState<string | null>(null);

  useEffect(() => {
    if (route !== 'invitation') return;
    const slugParam = detectGuestSlug();
    if (!slugParam) return;
    setGuestSlug(slugParam);
    fetch(`/api/guests?slug=${encodeURIComponent(slugParam)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.guest?.name) setGuestName(data.guest.name);
      })
      .catch(() => {
        setGuestName(decodeURIComponent(slugParam).replace(/[-+]/g, ' '));
      });
  }, [route]);

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
    if (guestSlug) {
      fetch('/api/guest-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestSlug }),
      }).catch(() => {
        // ignore
      });
    }
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

    fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRecord, guestSlug }),
    }).catch(() => {
      // Safe offline/local-first resilience
    });
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

  // Admin dashboard route
  if (route === 'admin') {
    return <AdminPage />;
  }

  // Client onboarding route
  if (route === 'client') {
    return <ClientLandingPage />;
  }

  const invitationReady = configLoaded;

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
        onOpenQrPass={() => setIsQrPassOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Content Landmark */}
      <main className={!invitationReady ? 'opacity-0 pointer-events-none' : ''}>
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
      <FooterSection config={config} />

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
