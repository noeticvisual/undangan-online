import React, { useState, useEffect, useMemo } from 'react';
import {
  WeddingConfig,
  RSVPRecord,
  GuestItem,
  WeddingEvent,
  AppViewMode,
  WeddingProject,
} from './types/wedding';
import { DEFAULT_WEDDING_CONFIG } from './data/defaultWeddingData';
import { weddingMusicEngine } from './services/audioPlayer';
import { projectManager } from './services/projectManager';
import { getTemplateThemeClasses, INVITATION_TEMPLATES } from './data/templateThemes';

// Modular UI Components
import { OpeningEnvelopeModal } from './components/OpeningEnvelopeModal';
import { HeaderNavbar } from './components/HeaderNavbar';
import { HeroSection } from './components/HeroSection';
import { CoupleSection } from './components/CoupleSection';
import { EventsSection } from './components/EventsSection';
import { LoveStorySection } from './components/LoveStorySection';
import { GallerySection } from './components/GallerySection';
import { RsvpSection } from './components/RsvpSection';
import { GiftRegistrySection } from './components/GiftRegistrySection';
import { FloatingNav } from './components/FloatingNav';
import { CalendarExportModal } from './components/CalendarExportModal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { ShareModal } from './components/ShareModal';
import { CustomizerModal } from './components/CustomizerModal';
import { FooterSection } from './components/FooterSection';
import { ClientGuestPortal } from './components/ClientGuestPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { AccessLoginModal } from './components/AccessLoginModal';
import { MusicSwitcherModal } from './components/MusicSwitcherModal';

export default function App() {
  // 1. Multi-client Projects State
  const [projects, setProjects] = useState<WeddingProject[]>(() => projectManager.getAllProjects());

  // 2. Active project slug from URL or fallback
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const uParam =
        params.get('u') ||
        params.get('invitation') ||
        params.get('project') ||
        params.get('wedding') ||
        params.get('slug');
      if (uParam) {
        const found = projectManager.getProjectBySlug(uParam);
        if (found) return found.slug;
        return uParam.trim().toLowerCase();
      }
    }
    return projectManager.getActiveProjectSlug();
  });

  const refreshProjects = () => {
    setProjects(projectManager.getAllProjects());
  };

  // 3. Active project computation
  const activeProject: WeddingProject = useMemo(() => {
    const found = projects.find((p) => p.slug.toLowerCase() === activeSlug.toLowerCase());
    return found || projects[0] || projectManager.getAllProjects()[0];
  }, [projects, activeSlug]);

  const config: WeddingConfig = activeProject.config;
  const guests: GuestItem[] = activeProject.guests || [];
  const rsvps: RSVPRecord[] = activeProject.rsvps || [];

  // Theme styling for the active template
  const themeClasses = getTemplateThemeClasses(activeProject.templateId || config.templateId || 'javanese-royal');

  // 4. Session & local authorization states for protected portals
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
        localStorage.getItem(`niskala_auth_client_${activeSlug}`) === 'true' ||
        sessionStorage.getItem(`niskala_auth_client_${activeSlug}`) === 'true'
      );
    } catch {
      return false;
    }
  });

  // Track preview return origin (admin or client)
  const [previewReturnMode, setPreviewReturnMode] = useState<'admin' | 'client' | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = (sessionStorage.getItem('niskala_preview_origin') || localStorage.getItem('niskala_preview_origin')) as any;
        if (stored === 'admin' || stored === 'client') return stored;
      } catch {}
    }
    return null;
  });

  // Sync projects from server on mount & ensure active slug from URL is fetched
  useEffect(() => {
    projectManager.syncFromServer().then((synced) => {
      if (synced && synced.length > 0) {
        setProjects(synced);
      }
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const uParam =
        params.get('u') ||
        params.get('invitation') ||
        params.get('project') ||
        params.get('wedding') ||
        params.get('slug');
      if (uParam) {
        projectManager.fetchProjectBySlug(uParam).then((proj) => {
          if (proj) {
            setActiveSlug(proj.slug);
            setProjects(projectManager.getAllProjects());
          }
        });
      }
    }
  }, []);

  // Re-sync client authorization whenever the active project changes
  useEffect(() => {
    try {
      const isAuth =
        localStorage.getItem(`niskala_auth_client_${activeSlug}`) === 'true' ||
        sessionStorage.getItem(`niskala_auth_client_${activeSlug}`) === 'true';
      setIsClientAuthenticated(isAuth);
    } catch {
      setIsClientAuthenticated(false);
    }
  }, [activeSlug]);

  // 5. View mode routing: 'guest' | 'client' | 'admin'
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal') || params.get('mode') || params.get('page');
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      // 1. Explicit guest invitation: if the link has ?to= or ?portal=guest, it is 100% guest view!
      if (params.has('to') || portalParam === 'guest' || hash === '#guest') {
        return 'guest';
      }

      // 2. Check URL query parameters and hashes for admin or client
      if (portalParam === 'admin' || hash === '#admin' || path.endsWith('/admin')) return 'admin';
      if (portalParam === 'client' || hash === '#client' || path.endsWith('/client')) return 'client';

      // 3. Persistent storage ONLY when not visiting a guest invitation link!
      try {
        const storedMode = (localStorage.getItem('niskala_view_mode') || sessionStorage.getItem('niskala_view_mode')) as AppViewMode | null;
        if (storedMode === 'admin' || storedMode === 'client') {
          return storedMode;
        }
      } catch {}
    }
    return 'guest';
  });

  // Listen for URL or Hash changes dynamically
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const portalParam = params.get('portal') || params.get('mode') || params.get('page');
        const hash = window.location.hash.toLowerCase();
        const path = window.location.pathname.toLowerCase();

        // Check if project slug changed
        const uParam =
          params.get('u') ||
          params.get('invitation') ||
          params.get('project') ||
          params.get('wedding') ||
          params.get('slug');
        if (uParam) {
          const found = projectManager.getProjectBySlug(uParam);
          if (found && found.slug !== activeSlug) {
            setActiveSlug(found.slug);
          }
        }

        if (params.has('to') || portalParam === 'guest' || hash === '#guest') {
          setViewMode('guest');
        } else if (portalParam === 'admin' || hash === '#admin' || path.endsWith('/admin')) {
          setViewMode('admin');
        } else if (portalParam === 'client' || hash === '#client' || path.endsWith('/client')) {
          setViewMode('client');
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [activeSlug]);

  // Keep viewMode synced to localStorage and URL query/hash so refresh never resets to guest
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('niskala_view_mode', viewMode);
        sessionStorage.setItem('niskala_view_mode', viewMode);
      } catch {}

      const url = new URL(window.location.href);
      if (activeSlug) {
        url.searchParams.set('u', activeSlug);
      }

      if (viewMode === 'admin') {
        url.searchParams.set('portal', 'admin');
        if (window.location.hash !== '#admin') {
          window.location.hash = 'admin';
        }
      } else if (viewMode === 'client') {
        url.searchParams.set('portal', 'client');
        if (window.location.hash !== '#client') {
          window.location.hash = 'client';
        }
      } else if (viewMode === 'guest') {
        url.searchParams.delete('portal');
        url.searchParams.delete('mode');
        if (window.location.hash === '#admin' || window.location.hash === '#client') {
          window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
        }
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [viewMode, activeSlug]);

  const changeActiveProject = (newSlug: string) => {
    setActiveSlug(newSlug);
    projectManager.setActiveProjectSlug(newSlug);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('u', newSlug);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const changeViewMode = (mode: AppViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('niskala_view_mode', mode);
      sessionStorage.setItem('niskala_view_mode', mode);
    } catch {}

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (activeSlug) {
        url.searchParams.set('u', activeSlug);
      }
      if (mode === 'guest') {
        url.searchParams.delete('portal');
        url.searchParams.delete('mode');
        if (window.location.hash === '#admin' || window.location.hash === '#client') {
          window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
        } else {
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        url.searchParams.set('portal', mode);
        window.location.hash = mode;
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const handleOpenPreview = (origin: 'admin' | 'client') => {
    setPreviewReturnMode(origin);
    setIsEnvelopeOpen(true);
    try {
      sessionStorage.setItem('niskala_preview_origin', origin);
      localStorage.setItem('niskala_preview_origin', origin);
    } catch {}
    changeViewMode('guest');
  };

  const handleReturnFromPreview = () => {
    const target = previewReturnMode || (isAdminAuthenticated ? 'admin' : isClientAuthenticated ? 'client' : 'admin');
    setPreviewReturnMode(null);
    try {
      sessionStorage.removeItem('niskala_preview_origin');
      localStorage.removeItem('niskala_preview_origin');
    } catch {}
    changeViewMode(target);
  };

  // 6. Detect guest name from URL query parameter (?to=Budi or ?tamu=dr.+Anisa)
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

  // Sync initial music track from active config if specified
  useEffect(() => {
    if (config.selectedTrackId) {
      weddingMusicEngine.setTrack(config.selectedTrackId, config.customAudioUrl);
    }
  }, [config.selectedTrackId, config.customAudioUrl]);

  const handleToggleMusic = () => {
    const newState = weddingMusicEngine.toggle();
    setIsMusicPlaying(newState);
  };

  // 10. Floating Modals states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTargetEvent, setCalendarTargetEvent] = useState<WeddingEvent | undefined>(config.events[0]);
  const [isQrPassOpen, setIsQrPassOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const handleOpenCalendarForEvent = (event: WeddingEvent) => {
    setCalendarTargetEvent(event);
    setIsCalendarOpen(true);
  };

  // 11. RSVP handler (Guest submission) - strictly isolated to active project
  const handleAddRsvp = (record: Omit<RSVPRecord, 'id' | 'createdAt'>) => {
    const newRecord: RSVPRecord = {
      ...record,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    projectManager.addRsvp(activeSlug, newRecord);
    refreshProjects();

    // Background sync to backend proxy endpoint if configured
    try {
      fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRecord, projectSlug: activeSlug }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const handleDeleteRsvp = (id: string) => {
    const currentProj = projectManager.getProjectBySlug(activeSlug);
    if (currentProj) {
      const filtered = (currentProj.rsvps || []).filter((r) => r.id !== id);
      projectManager.updateProject(currentProj.id, { rsvps: filtered });
      refreshProjects();
    }
  };

  // 12. Client Guest Management handlers - strictly isolated to active project
  const handleAddGuest = (guest: Omit<GuestItem, 'id' | 'createdAt'>) => {
    const newGuest: GuestItem = {
      ...guest,
      id: `guest-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    projectManager.addGuest(activeSlug, newGuest);
    refreshProjects();
  };

  const handleBulkAddGuests = (names: string[], category: string) => {
    const newGuests: GuestItem[] = names.map((name, index) => ({
      id: `guest-${Date.now()}-${index}`,
      name,
      category,
      createdAt: new Date().toISOString(),
    }));
    projectManager.bulkAddGuests(activeSlug, newGuests);
    refreshProjects();
  };

  const handleDeleteGuest = (id: string) => {
    projectManager.deleteGuest(activeSlug, id);
    refreshProjects();
  };

  // 13. Admin Config Save and Reset - strictly saved to active project
  const handleSaveConfig = (newConfig: WeddingConfig) => {
    projectManager.updateProjectConfig(activeSlug, newConfig);
    refreshProjects();
  };

  const handleResetDefault = () => {
    projectManager.updateProjectConfig(activeSlug, DEFAULT_WEDDING_CONFIG);
    refreshProjects();
  };

  // =========================================================================
  // VIEW: CLIENT PORTAL (Pengantin mengelola daftar tamu & membagikan link)
  // =========================================================================
  if (viewMode === 'client') {
    // Gate: Require client authentication with this project's passcode
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
                  localStorage.setItem(`niskala_auth_client_${activeSlug}`, 'true');
                  sessionStorage.setItem(`niskala_auth_client_${activeSlug}`, 'true');
                  localStorage.setItem('niskala_view_mode', 'client');
                  sessionStorage.setItem('niskala_view_mode', 'client');
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
            onClick={() => handleOpenPreview('client')}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#5C5046] dark:text-[#BFAF9E] hover:text-[#B89047] transition-all cursor-pointer"
          >
            👁️ Pratinjau Undangan
          </button>
          <span className="text-[#D9CEBF]">|</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#B89047] text-white shadow-xs">
            Portal Klien: {config.groom.nickName} &amp; {config.bride.nickName}
          </span>
          <span className="text-[#D9CEBF]">|</span>
          <button
            onClick={() => {
              try {
                localStorage.removeItem(`niskala_auth_client_${activeSlug}`);
                sessionStorage.removeItem(`niskala_auth_client_${activeSlug}`);
                localStorage.setItem('niskala_view_mode', 'guest');
                sessionStorage.setItem('niskala_view_mode', 'guest');
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
          projectSlug={activeSlug}
          onAddGuest={handleAddGuest}
          onBulkAddGuests={handleBulkAddGuests}
          onDeleteGuest={handleDeleteGuest}
          onBackToInvitation={() => handleOpenPreview('client')}
          onOpenMusicModal={() => setIsMusicModalOpen(true)}
          onUpdateConfig={handleSaveConfig}
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
                  localStorage.setItem('niskala_view_mode', 'admin');
                  sessionStorage.setItem('niskala_view_mode', 'admin');
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
            onClick={() => handleOpenPreview('admin')}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#5C5046] dark:text-[#BFAF9E] hover:text-[#B89047] transition-all cursor-pointer"
          >
            👁️ Pratinjau Undangan
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
                localStorage.setItem('niskala_view_mode', 'guest');
                sessionStorage.setItem('niskala_view_mode', 'guest');
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
          projects={projects}
          activeProjectSlug={activeSlug}
          onSelectProject={changeActiveProject}
          onRefreshProjects={refreshProjects}
          onSaveConfig={handleSaveConfig}
          onResetDefault={handleResetDefault}
          onDeleteRsvp={handleDeleteRsvp}
          onBackToInvitation={() => handleOpenPreview('admin')}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: GUEST INVITATION (Tamu hanya melihat undangan - Bersih & Khidmat)
  // =========================================================================
  const isGuestView = viewMode === 'guest';

  return (
    <div className={`min-h-screen bg-[#FAF7F2] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA] transition-colors duration-300 relative selection:bg-[#B89047]/30 ${themeClasses.wrapper}`}>
      
      {/* Floating Preview Return Bar (ONLY when explicitly previewing from Admin or Client, NEVER for guests) */}
      {previewReturnMode !== null && (
        <aside
          aria-label="Mode Pratinjau Undangan"
          className="sticky top-2 z-50 max-w-2xl mx-auto px-4 py-2 bg-gradient-to-r from-[#2B1B17] via-[#3A241C] to-[#2B1B17] text-[#FAF7F2] rounded-full shadow-2xl border border-[#C5A059]/70 flex items-center justify-between gap-3 text-xs backdrop-blur-md animate-fadeIn mb-2"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-semibold text-[#E5CA78] truncate text-[11px] sm:text-xs">
              👁️ Pratinjau Undangan: {config.groom.nickName} &amp; {config.bride.nickName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Envelope Re-open button */}
            <button
              type="button"
              onClick={() => setIsEnvelopeOpen(true)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Buka kembali tampilan amplop pembuka untuk tamu"
            >
              ✉️ Amplop
            </button>

            {previewReturnMode === 'admin' && (
              <button
                type="button"
                onClick={handleReturnFromPreview}
                className="px-3 py-1 rounded-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#1E140F] font-bold text-[11px] transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                ← Kembali ke Dashboard Admin
              </button>
            )}
            {previewReturnMode === 'client' && (
              <button
                type="button"
                onClick={handleReturnFromPreview}
                className="px-3 py-1 rounded-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#1E140F] font-bold text-[11px] transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                ← Kembali ke Portal Klien
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setPreviewReturnMode(null);
                try {
                  sessionStorage.removeItem('niskala_preview_origin');
                  localStorage.removeItem('niskala_preview_origin');
                } catch {}
              }}
              title="Tutup mode pratinjau"
              className="text-[#D9CEBF] hover:text-white text-xs p-1 rounded-full cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* 1. Opening Cover Envelope Modal */}
      <OpeningEnvelopeModal
        config={config}
        guestName={guestName}
        isOpen={isEnvelopeOpen}
        isGuest={isGuestView}
        onOpenInvitation={() => {
          setIsEnvelopeOpen(false);
          weddingMusicEngine.start();
        }}
        onOpenMusicModal={isGuestView ? undefined : () => setIsMusicModalOpen(true)}
      />

      {/* 2. Top Header Navigation (Guest view will NEVER have customizer/photo changer) */}
      <HeaderNavbar
        config={config}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenMusicModal={isGuestView ? undefined : () => setIsMusicModalOpen(true)}
        onOpenCustomizer={isGuestView ? undefined : () => setIsCustomizerOpen(true)}
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
        <GallerySection
          gallery={config.gallery}
          config={config}
          onUpdateConfig={handleSaveConfig}
        />

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
        onOpenPortalLogin={() => setIsAccessModalOpen(true)}
      />

      {/* 11. Floating Bottom Dock Navigation (Mobile) & Floating Music Vinyl */}
      <FloatingNav
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenMusicModal={isGuestView ? undefined : () => setIsMusicModalOpen(true)}
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
        projectSlug={activeSlug}
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
            try {
              localStorage.setItem('niskala_auth_admin', 'true');
              sessionStorage.setItem('niskala_auth_admin', 'true');
              localStorage.setItem('niskala_view_mode', 'admin');
              sessionStorage.setItem('niskala_view_mode', 'admin');
            } catch {}
            setIsAdminAuthenticated(true);
          } else if (role === 'client') {
            try {
              localStorage.setItem(`niskala_auth_client_${activeSlug}`, 'true');
              sessionStorage.setItem(`niskala_auth_client_${activeSlug}`, 'true');
              localStorage.setItem('niskala_view_mode', 'client');
              sessionStorage.setItem('niskala_view_mode', 'client');
            } catch {}
            setIsClientAuthenticated(true);
          }
          changeViewMode(role);
        }}
      />
    </div>
  );
}
