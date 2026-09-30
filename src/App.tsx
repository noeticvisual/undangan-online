import React, { useState, useEffect } from 'react';
import { WeddingConfig, RSVPRecord, WeddingEvent, GuestItem, AppViewMode } from './types/wedding';
import { DEFAULT_WEDDING_CONFIG, INITIAL_RSVPS, INITIAL_GUESTS } from './data/defaultWeddingData';
import { weddingMusicEngine } from './services/audioPlayer';
import { supabaseWeddingService } from './services/supabase';
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
import { ClientGuestPortal } from './components/ClientGuestPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { AccessLoginModal } from './components/AccessLoginModal';
import { MusicSwitcherModal } from './components/MusicSwitcherModal';

export default function App() {
  // Session & local authorization states for protected portals
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('niskala_auth_admin') === 'true' ||
        sessionStorage.getItem('niskala_auth_admin') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [isClientAuthenticated, setIsClientAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('niskala_auth_client') === 'true' ||
        sessionStorage.getItem('niskala_auth_client') === 'true'
      );
    } catch {
      return false;
    }
  });

  // 1. View mode routing: 'guest' | 'client' | 'admin'
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal') || params.get('mode') || params.get('page');
      const path = window.location.pathname.toLowerCase();
      if (portalParam === 'admin' || window.location.hash === '#admin' || path.endsWith('/admin')) return 'admin';
      if (portalParam === 'client' || window.location.hash === '#client' || path.endsWith('/client')) return 'client';
    }
    return 'guest';
  });

  // Listen for URL or Hash changes dynamically
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const portalParam = params.get('portal') || params.get('mode') || params.get('page');
        const path = window.location.pathname.toLowerCase();
        if (portalParam === 'admin' || window.location.hash === '#admin' || path.endsWith('/admin')) {
          setViewMode('admin');
        } else if (portalParam === 'client' || window.location.hash === '#client' || path.endsWith('/client')) {
          setViewMode('client');
        } else if (portalParam === 'guest' || (!portalParam && !window.location.hash && !path.endsWith('/admin') && !path.endsWith('/client'))) {
          setViewMode('guest');
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const changeViewMode = (mode: AppViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (mode === 'guest') {
        url.searchParams.delete('portal');
        url.searchParams.delete('mode');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } else {
        url.searchParams.set('portal', mode);
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  // 2. Config state with localStorage & Supabase persistence
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem('niskala_wedding_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_WEDDING_CONFIG;
  });

  // 3. RSVP records state with localStorage & Supabase persistence
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    try {
      const saved = localStorage.getItem('niskala_wedding_rsvps');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_RSVPS;
  });

  // 4. Client's Guest List state with localStorage & Supabase persistence
  const [guests, setGuests] = useState<GuestItem[]>(() => {
    try {
      const saved = localStorage.getItem('niskala_client_guests');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_GUESTS;
  });

  // 5. Detect guest name from URL query parameter (?to=Budi or ?tamu=dr.+Anisa)
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

  // 6. Supabase Initial Cloud Sync on Mount
  useEffect(() => {
    const syncFromSupabase = async () => {
      try {
        const cloudConfig = await supabaseWeddingService.fetchWeddingConfig();
        if (cloudConfig) {
          setConfig(cloudConfig);
          localStorage.setItem('niskala_wedding_config', JSON.stringify(cloudConfig));
        }

        const cloudGuests = await supabaseWeddingService.fetchGuests();
        if (cloudGuests && cloudGuests.length > 0) {
          setGuests(cloudGuests);
          localStorage.setItem('niskala_client_guests', JSON.stringify(cloudGuests));
        }

        const cloudRsvps = await supabaseWeddingService.fetchRsvps();
        if (cloudRsvps && cloudRsvps.length > 0) {
          setRsvps(cloudRsvps);
          localStorage.setItem('niskala_wedding_rsvps', JSON.stringify(cloudRsvps));
        }
      } catch {
        // Fallback to local storage
      }
    };

    syncFromSupabase();
  }, []);

  // 7. Dark mode state
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

  // 8. Envelope modal (Opening invitation screen)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(() => viewMode === 'guest');

  // 9. Music playing state & modal
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  // Sync music engine state
  useEffect(() => {
    const unsubscribe = weddingMusicEngine.subscribe((state) => {
      setIsMusicPlaying(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  // Sync initial music track from config if specified
  useEffect(() => {
    if (config.selectedTrackId) {
      weddingMusicEngine.setTrack(config.selectedTrackId, config.customAudioUrl);
    }
  }, [config.selectedTrackId, config.customAudioUrl]);

  const handleToggleMusic = () => {
    const newState = weddingMusicEngine.toggle();
    setIsMusicPlaying(newState);
  };

  const handleOpenInvitation = () => {
    setIsEnvelopeOpen(false);
    weddingMusicEngine.start();
    setIsMusicPlaying(true);
  };

  // 10. Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQrPassOpen, setIsQrPassOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTargetEvent, setCalendarTargetEvent] = useState<WeddingEvent | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const handleOpenCalendarForEvent = (ev: WeddingEvent) => {
    setCalendarTargetEvent(ev);
    setIsCalendarOpen(true);
  };

  // 11. RSVP handler (Guest submission)
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

    // Sync to Supabase in background
    supabaseWeddingService.saveRsvp(newRecord).catch(() => {});

    // Sync to backend endpoint
    try {
      fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const handleDeleteRsvp = (id: string) => {
    const updated = rsvps.filter((r) => r.id !== id);
    setRsvps(updated);
    try {
      localStorage.setItem('niskala_wedding_rsvps', JSON.stringify(updated));
    } catch {
      // ignore
    }
    supabaseWeddingService.deleteRsvp(id).catch(() => {});
  };

  // 12. Client Guest Management handlers
  const handleAddGuest = (guest: Omit<GuestItem, 'id' | 'createdAt'>) => {
    const newGuest: GuestItem = {
      ...guest,
      id: `guest-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newGuest, ...guests];
    setGuests(updated);
    try {
      localStorage.setItem('niskala_client_guests', JSON.stringify(updated));
    } catch {
      // ignore
    }
    supabaseWeddingService.saveGuest(newGuest).catch(() => {});
  };

  const handleBulkAddGuests = (names: string[], category: string) => {
    const newGuests: GuestItem[] = names.map((name, index) => ({
      id: `guest-${Date.now()}-${index}`,
      name,
      category,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...newGuests, ...guests];
    setGuests(updated);
    try {
      localStorage.setItem('niskala_client_guests', JSON.stringify(updated));
    } catch {
      // ignore
    }
    newGuests.forEach((g) => supabaseWeddingService.saveGuest(g).catch(() => {}));
  };

  const handleDeleteGuest = (id: string) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    try {
      localStorage.setItem('niskala_client_guests', JSON.stringify(updated));
    } catch {
      // ignore
    }
    supabaseWeddingService.deleteGuest(id).catch(() => {});
  };

  // 13. Admin Config Save and Reset
  const handleSaveConfig = (newConfig: WeddingConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('niskala_wedding_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    supabaseWeddingService.saveWeddingConfig(newConfig).catch(() => {});
  };

  const handleResetDefault = () => {
    setConfig(DEFAULT_WEDDING_CONFIG);
    try {
      localStorage.removeItem('niskala_wedding_config');
    } catch {
      // ignore
    }
    supabaseWeddingService.saveWeddingConfig(DEFAULT_WEDDING_CONFIG).catch(() => {});
  };

  // =========================================================================
  // VIEW: CLIENT PORTAL (Pengantin mengelola daftar tamu & membagikan link)
  // =========================================================================
  if (viewMode === 'client') {
    // Gate: Require client authentication
    if (!isClientAuthenticated) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] flex items-center justify-center p-4">
          <AccessLoginModal
            isOpen={true}
            onClose={() => changeViewMode('guest')}
            initialRole="client"
            lockRole={true}
            clientPasscode={config.clientPasscode}
            onSelectRole={(role) => {
              if (role === 'client') {
                try {
                  localStorage.setItem('niskala_auth_client', 'true');
                  sessionStorage.setItem('niskala_auth_client', 'true');
                } catch {}
                setIsClientAuthenticated(true);
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA]">
        {/* Floating Client Top Bar */}
        <div className="sticky top-2 z-50 max-w-fit mx-auto bg-[#FAF7F2]/95 dark:bg-[#121615]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D9CEBF] dark:border-[#2F3D36] shadow-md flex items-center gap-2 text-xs mb-2">
          <button
            onClick={() => changeViewMode('guest')}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#5C5046] dark:text-[#BFAF9E] hover:text-[#B89047] transition-all cursor-pointer"
          >
            ← Undangan Tamu
          </button>
          <span className="text-[#D9CEBF]">|</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#B89047] text-white shadow-xs">
            Portal Klien (Pengantin)
          </span>
          <span className="text-[#D9CEBF]">|</span>
          <button
            onClick={() => {
              try {
                localStorage.removeItem('niskala_auth_client');
                sessionStorage.removeItem('niskala_auth_client');
              } catch {}
              setIsClientAuthenticated(false);
              changeViewMode('guest');
            }}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            Keluar
          </button>
        </div>

        <ClientGuestPortal
          config={config}
          guests={guests}
          rsvps={rsvps}
          onAddGuest={handleAddGuest}
          onBulkAddGuests={handleBulkAddGuests}
          onDeleteGuest={handleDeleteGuest}
          onBackToInvitation={() => changeViewMode('guest')}
          onOpenMusicModal={() => setIsMusicModalOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Music Switcher Modal for Client */}
        <MusicSwitcherModal
          isOpen={isMusicModalOpen}
          onClose={() => setIsMusicModalOpen(false)}
          config={config}
          onUpdateConfig={handleSaveConfig}
        />

        {/* Photo & Customizer Modal for Client */}
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

  // =========================================================================
  // VIEW: ADMIN DASHBOARD (Master admin mengubah seluruh isi web undangan)
  // =========================================================================
  if (viewMode === 'admin') {
    // Gate: Require admin authentication (passcode: noetic123)
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] flex items-center justify-center p-4">
          <AccessLoginModal
            isOpen={true}
            onClose={() => changeViewMode('guest')}
            initialRole="admin"
            lockRole={true}
            onSelectRole={(role) => {
              if (role === 'admin') {
                try {
                  localStorage.setItem('niskala_auth_admin', 'true');
                  sessionStorage.setItem('niskala_auth_admin', 'true');
                } catch {}
                setIsAdminAuthenticated(true);
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA]">
        {/* Floating Admin Top Bar */}
        <div className="sticky top-2 z-50 max-w-fit mx-auto bg-[#FAF7F2]/95 dark:bg-[#121615]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D9CEBF] dark:border-[#2F3D36] shadow-md flex items-center gap-2 text-xs mb-2">
          <button
            onClick={() => changeViewMode('guest')}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#5C5046] dark:text-[#BFAF9E] hover:text-[#B89047] transition-all cursor-pointer"
          >
            ← Undangan Tamu
          </button>
          <span className="text-[#D9CEBF]">|</span>
          <button
            onClick={() => changeViewMode('client')}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#5C5046] dark:text-[#BFAF9E] hover:text-[#B89047] transition-all cursor-pointer"
          >
            Portal Klien
          </button>
          <span className="text-[#D9CEBF]">|</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#B89047] text-white shadow-xs">
            Master Admin
          </span>
          <span className="text-[#D9CEBF]">|</span>
          <button
            onClick={() => {
              try {
                localStorage.removeItem('niskala_auth_admin');
                sessionStorage.removeItem('niskala_auth_admin');
              } catch {}
              setIsAdminAuthenticated(false);
              changeViewMode('guest');
            }}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            Keluar
          </button>
        </div>

        <AdminDashboard
          config={config}
          rsvps={rsvps}
          onSaveConfig={handleSaveConfig}
          onResetDefault={handleResetDefault}
          onDeleteRsvp={handleDeleteRsvp}
          onBackToInvitation={() => changeViewMode('guest')}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: GUEST INVITATION (Tamu hanya melihat undangan - Bersih & Khidmat)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA] transition-colors duration-300 relative selection:bg-[#B89047]/30">
      {/* 1. Opening Cover Envelope Modal */}
      <OpeningEnvelopeModal
        config={config}
        guestName={guestName}
        isOpen={isEnvelopeOpen}
        onOpenInvitation={handleOpenInvitation}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
      />

      {/* 2. Top Bar Navigation (Strict 3-Zone Contract) */}
      <HeaderNavbar
        config={config}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenQrPass={() => setIsQrPassOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenPortalLogin={() => setIsAccessModalOpen(true)}
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

        {/* 8. Functional RSVP Form & Wishing Board (Tamu hanya bisa mengisi ini) */}
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
        onOpenPortalLogin={() => setIsAccessModalOpen(true)}
      />

      {/* 11. Floating Bottom Dock Navigation (Mobile) & Floating Music Vinyl */}
      <FloatingNav
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
      />

      {/* 12. Music Switcher & Preview Modal */}
      <MusicSwitcherModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        config={config}
        onUpdateConfig={handleSaveConfig}
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

      {/* 16. Portal Login Modal (Klien & Admin Access) */}
      <AccessLoginModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        clientPasscode={config.clientPasscode}
        onSelectRole={(role) => {
          if (role === 'admin') {
            try { sessionStorage.setItem('niskala_auth_admin', 'true'); } catch {}
            setIsAdminAuthenticated(true);
          } else if (role === 'client') {
            try { sessionStorage.setItem('niskala_auth_client', 'true'); } catch {}
            setIsClientAuthenticated(true);
          }
          changeViewMode(role);
        }}
      />

    </div>
  );
}
