import React, { useState } from 'react';
import {
  Settings,
  Users,
  Calendar,
  Image,
  CreditCard,
  Database,
  Cloud,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  ExternalLink,
  Download,
  AlertCircle,
  FileCode,
  Shield,
  Heart,
  Disc,
  Play,
  Pause,
  Volume2,
  Music,
  Sparkles,
  KeyRound,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Layers,
  FolderOpen,
  LayoutTemplate,
  Crop,
  ZoomIn,
  Film,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import {
  WeddingConfig,
  RSVPRecord,
  WeddingEvent,
  LoveStoryItem,
  BankAccount,
  GalleryItem,
  SupabaseConfig,
  MusicTrack,
  WeddingProject,
  InvitationTemplateId,
  ColorThemeKey,
} from '../types/wedding';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  supabaseWeddingService,
} from '../services/supabase';
import {
  AVAILABLE_WEDDING_TRACKS,
  weddingMusicEngine,
} from '../services/audioPlayer';
import {
  formatImageUrl,
  isGoogleDriveUrl,
  extractGoogleDriveFileId,
} from '../utils/googleDrive';
import { formatGoogleMapsEmbedUrl } from '../utils/googleMaps';
import { INVITATION_TEMPLATES, TEMPLATE_LIST } from '../data/templateThemes';
import { ProjectManagerTab } from './ProjectManagerTab';
import { NewProjectModal } from './NewProjectModal';

interface AdminDashboardProps {
  config: WeddingConfig;
  rsvps: RSVPRecord[];
  projects?: WeddingProject[];
  activeProjectSlug?: string;
  onSelectProject?: (slug: string) => void;
  onRefreshProjects?: () => void;
  onSaveConfig: (newConfig: WeddingConfig) => void;
  onResetDefault: () => void;
  onDeleteRsvp: (id: string) => void;
  onBackToInvitation: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  rsvps,
  projects = [],
  activeProjectSlug = 'maya-arya',
  onSelectProject,
  onRefreshProjects,
  onSaveConfig,
  onResetDefault,
  onDeleteRsvp,
  onBackToInvitation,
}) => {
  const [activeTab, setActiveTab] = useState<
    'projects' | 'couple' | 'events' | 'story' | 'gallery' | 'gifts' | 'music' | 'rsvps' | 'supabase' | 'vercel'
  >('projects');

  // Audio preview playing state inside admin
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);

  // Client portal security & share state
  const [showClientPasscode, setShowClientPasscode] = useState(false);
  const [copiedClientLink, setCopiedClientLink] = useState(false);
  const [copiedClientMessage, setCopiedClientMessage] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Working copy of config
  const [formData, setFormData] = useState<WeddingConfig>(config);

  // Sync formData whenever config or active project switches
  React.useEffect(() => {
    setFormData(config);
  }, [config, activeProjectSlug]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Supabase settings state
  const [supabaseCreds, setSupabaseCreds] = useState<SupabaseConfig>(getStoredSupabaseConfig());
  const [supabaseStatus, setSupabaseStatus] = useState<{ testing: boolean; message: string; isOk?: boolean }>({
    testing: false,
    message: '',
  });
  const [isSyncingToSupabase, setIsSyncingToSupabase] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Global Save Handler
  const handleSaveAll = () => {
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Test Supabase connection
  const handleTestSupabase = async () => {
    setSupabaseStatus({ testing: true, message: 'Menghubungkan ke Supabase...' });
    const res = await supabaseWeddingService.testConnection(supabaseCreds.url, supabaseCreds.anonKey);
    setSupabaseStatus({ testing: false, message: res.message, isOk: res.ok });
    if (res.ok) {
      saveStoredSupabaseConfig({ url: supabaseCreds.url, anonKey: supabaseCreds.anonKey });
    }
  };

  // Sync current config to Supabase
  const handleSyncToSupabase = async () => {
    setIsSyncingToSupabase(true);
    setSyncFeedback(null);
    try {
      saveStoredSupabaseConfig({ url: supabaseCreds.url, anonKey: supabaseCreds.anonKey });
      const success = await supabaseWeddingService.saveWeddingConfig(formData);
      if (success) {
        setSyncFeedback('Data konfigurasi berhasil disinkronkan ke tabel wedding_configs di Supabase!');
      } else {
        setSyncFeedback('Gagal menyimpan ke Supabase. Pastikan tabel wedding_configs sudah dibuat menggunakan script SQL.');
      }
    } catch {
      setSyncFeedback('Terjadi kesalahan saat sinkronisasi.');
    } finally {
      setIsSyncingToSupabase(false);
    }
  };

  // Helper to download SQL schema
  const handleDownloadSqlSchema = () => {
    const sqlContent = `-- SQL Schema for Niskala Wedding
CREATE TABLE IF NOT EXISTS public.wedding_configs (
  id TEXT PRIMARY KEY DEFAULT 'default',
  config_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wedding_guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  category TEXT DEFAULT 'Umum',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL,
  guest_count INTEGER DEFAULT 1,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.wedding_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access configs" ON public.wedding_configs FOR ALL USING (true);
CREATE POLICY "Public full access guests" ON public.wedding_guests FOR ALL USING (true);
CREATE POLICY "Public full access rsvps" ON public.wedding_rsvps FOR ALL USING (true);
`;
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E8DFD3] dark:border-[#28352F]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToInvitation}
              className="p-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] hover:border-[#B89047] transition-colors cursor-pointer"
              title="Kembali ke Undangan"
            >
              <ArrowLeft className="w-4 h-4 text-[#B89047]" />
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B89047] font-semibold block">
                Panel Administrator Master
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
                Ubah Seluruh Isi Undangan Online
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Project Switcher Dropdown */}
            {projects && projects.length > 0 && onSelectProject && (
              <div className="flex items-center gap-2 bg-white dark:bg-[#1A221F] px-3 py-1.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] shadow-2xs">
                <FolderOpen className="w-3.5 h-3.5 text-[#B89047] shrink-0" />
                <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94] hidden sm:inline">Projek:</span>
                <select
                  value={activeProjectSlug}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden cursor-pointer max-w-[160px] truncate"
                >
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug} className="dark:bg-[#1A221F] text-black dark:text-white">
                      {p.title} (?u={p.slug})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-[#B89047] text-white text-[10px] font-semibold hover:bg-[#A37E38] transition-colors cursor-pointer shrink-0"
                  title="Tambah projek undangan klien baru"
                >
                  + Baru
                </button>
              </div>
            )}

            <button
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all cursor-pointer font-semibold"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Semua Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#EFE8DD] dark:bg-[#1A221F] rounded-2xl mb-8 overflow-x-auto shadow-2xs">
          {[
            { id: 'projects', label: `📁 0. Projek Klien (${projects.length})`, icon: Layers },
            { id: 'couple', label: '1. Mempelai & Desain', icon: Users },
            { id: 'events', label: '2. Waktu & Lokasi Acara', icon: Calendar },
            { id: 'story', label: '3. Kisah Cinta', icon: Heart },
            { id: 'gallery', label: '4. Galeri Foto', icon: Image },
            { id: 'gifts', label: '5. Rekening & Amplop', icon: CreditCard },
            { id: 'music', label: '6. Musik Latar', icon: Disc },
            { id: 'rsvps', label: `7. RSVP & Tamu (${rsvps.length})`, icon: Settings },
            { id: 'supabase', label: '8. Supabase Database', icon: Database },
            { id: 'vercel', label: '9. Hosting Vercel', icon: Cloud },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
                    : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B89047]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Project Workspace Indicator Banner (Shown on edit tabs) */}
        {activeTab !== 'projects' && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-6 rounded-2xl bg-gradient-to-r from-[#B89047]/10 via-[#FAF7F2] to-[#FAF7F2] dark:from-[#B89047]/15 dark:via-[#1A221F] dark:to-[#1A221F] border border-[#B89047]/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#8C7A6B] dark:text-[#A89E94]">Sedang Mengedit Projek:</span>
              <strong className="text-[#25201C] dark:text-[#FAF7F2] font-serif-luxury text-sm">
                {formData.groom.nickName} &amp; {formData.bride.nickName}
              </strong>
              <span className="font-mono text-[11px] text-[#B89047] bg-[#B89047]/10 px-2 py-0.5 rounded-md font-semibold">
                ?u={activeProjectSlug}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('projects')}
                className="px-3 py-1 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] hover:border-[#B89047] text-[#25201C] dark:text-[#FAF7F2] font-medium transition-colors cursor-pointer"
              >
                Lihat Semua Projek
              </button>
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="px-3 py-1 rounded-lg bg-[#B89047] text-white font-medium hover:bg-[#A37E38] transition-colors cursor-pointer"
              >
                + Tambah Projek
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 0: MANAJEMEN PROJEK KLIEN */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <ProjectManagerTab
            projects={projects}
            activeSlug={activeProjectSlug}
            onSelectProject={(slug) => {
              if (onSelectProject) onSelectProject(slug);
              setActiveTab('couple');
            }}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            onRefreshProjects={onRefreshProjects || (() => {})}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 1: MEMPELAI, KUTIPAN & AKSES KLIEN */}
        {/* ========================================================================= */}
        {activeTab === 'couple' && (
          <div className="space-y-6 max-w-4xl text-xs">
            {/* 1. Client Portal Access & Secret Passcode Management */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border-2 border-[#B89047]/40 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#B89047]" />
                    Pengaturan Sandi &amp; Tautan Portal Klien (Pengantin)
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5 text-xs">
                    Admin membuat sandi di sini, lalu bagikan tautan ini ke klien pengantin agar mereka dapat mengelola daftar tamu &amp; pesan WhatsApp.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#B89047]/10 text-[#B89047] border border-[#B89047]/20 self-start sm:self-auto shrink-0">
                  🔒 Rahasia (Tidak Tampil di Web Tamu)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2]">
                    Sandi / Kode Akses Klien (Dibuat &amp; Diatur oleh Admin)
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                    <input
                      type={showClientPasscode ? 'text' : 'password'}
                      value={formData.clientPasscode || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, clientPasscode: e.target.value })
                      }
                      placeholder="Masukkan kode akses klien..."
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] font-mono text-xs text-[#25201C] dark:text-[#FAF7F2]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientPasscode(!showClientPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white cursor-pointer"
                      title={showClientPasscode ? 'Sembunyikan' : 'Tampilkan sandi'}
                    >
                      {showClientPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-1">
                    *Klik tombol <strong>"Simpan Perubahan"</strong> di atas setelah mengubah kode sandi ini.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const clientUrl = `${window.location.origin}/?u=${activeProjectSlug}&portal=client`;
                      navigator.clipboard.writeText(clientUrl);
                      setCopiedClientLink(true);
                      setTimeout(() => setCopiedClientLink(false), 2500);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] hover:border-[#B89047] text-[#25201C] dark:text-[#FAF7F2] font-medium transition-colors cursor-pointer text-xs"
                  >
                    {copiedClientLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#B89047]" />}
                    <span>{copiedClientLink ? 'Tautan Tersalin!' : 'Salin Tautan Portal Klien'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const clientUrl = `${window.location.origin}/?u=${activeProjectSlug}&portal=client`;
                      const clientPass = formData.clientPasscode || 'mayaarya2026';
                      const msg = `Halo ${formData.groom.nickName} & ${formData.bride.nickName}!\n\nBerikut tautan portal khusus untuk mengelola daftar nama tamu undangan, membuat link personal, dan memantau RSVP pernikahan kalian:\n👉 ${clientUrl}\n\n🔑 Kode Akses Masuk: ${clientPass}\n\n(Mohon simpan dan jaga kerahasiaan kode akses ini agar tidak dibagikan kepada tamu undangan).`;
                      navigator.clipboard.writeText(msg);
                      setCopiedClientMessage(true);
                      setTimeout(() => setCopiedClientMessage(false), 2500);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B89047] to-[#A37E38] text-white font-medium hover:opacity-95 transition-opacity cursor-pointer text-xs"
                  >
                    {copiedClientMessage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedClientMessage ? 'Pesan WA Tersalin!' : 'Salin Format Pesan WhatsApp untuk Klien'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Template Selector Card for this active project */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-[#B89047]" />
                    Pilihan Template Tampilan Undangan Klien Ini
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5 text-xs">
                    Pilih gaya visual undangan untuk klien ini. Template mengubah bingkai foto, aksen ornamen, warna sampul amplop, dan tipografi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TEMPLATE_LIST.map((tpl) => {
                  const isSelected = (formData.templateId || 'javanese-royal') === tpl.id;
                  return (
                    <button
                      type="button"
                      key={tpl.id}
                      onClick={() => {
                        let newColor = formData.colorTheme;
                        if (tpl.id === 'islamic-emerald') newColor = 'emerald';
                        else if (tpl.id === 'modern-minimalist') newColor = 'slate';
                        else if (tpl.id === 'rustic-botanical') newColor = 'emerald';
                        else newColor = 'gold';

                        setFormData({
                          ...formData,
                          templateId: tpl.id,
                          colorTheme: newColor,
                        });
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#B89047] bg-[#B89047]/10 dark:bg-[#B89047]/20 ring-2 ring-[#B89047]/40 shadow-xs'
                          : 'border-[#E2D5C3] dark:border-[#2C3833] bg-white dark:bg-[#141A17] hover:border-[#B89047]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-semibold text-[#8C7A6B] dark:text-[#A89E94]">
                            {tpl.badge}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#B89047] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <strong className="block text-xs font-bold text-[#25201C] dark:text-[#FAF7F2] mb-1">
                          {tpl.name}
                        </strong>
                        <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#E8DFD3]/60 dark:border-[#2C3833]/60">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: tpl.accentColor }}
                        />
                        <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] truncate">
                          {tpl.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Foto Sampul Pembuka Undangan (Opening Envelope Cover) */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border-2 border-[#C5A059]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Foto Sampul Pembuka Undangan (Cover Layar Tamu)
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5 text-xs">
                    Foto kedua mempelai yang tampil di amplop layar pembuka sebelum tamu menekan tombol "Buka Undangan".
                  </p>
                </div>
                {isGoogleDriveUrl(formData.openingCoverPhotoUrl || '') && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    ✓ Google Drive Aktif
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-32 h-40 rounded-t-full rounded-b-xl overflow-hidden border-2 border-[#C5A059]/50 shadow-md bg-slate-100 dark:bg-black/30 shrink-0">
                  <img
                    src={formatImageUrl(
                      formData.openingCoverPhotoUrl || formData.heroImageUrl || formData.gallery[0]?.url,
                      '/src/assets/images/hero_wedding_couple_1790610979338.jpg'
                    )}
                    alt="Pratinjau Sampul Pembuka"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="block font-medium">Tautan URL Foto Sampul (Google Drive / Direct Link)</label>
                  <input
                    type="text"
                    value={formData.openingCoverPhotoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, openingCoverPhotoUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                  />
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-[#8C7A6B] dark:text-[#A89E94]">Opsi Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, openingCoverPhotoUrl: formData.heroImageUrl || '' })}
                      className="px-2 py-1 rounded bg-[#EFE8DD] dark:bg-[#232F2A] hover:bg-[#E5DCCF] text-[#5C5046] dark:text-[#D1C3B3] text-[10px] cursor-pointer"
                    >
                      Gunakan Foto Hero
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, openingCoverPhotoUrl: formData.groom.photoUrl })}
                      className="px-2 py-1 rounded bg-[#EFE8DD] dark:bg-[#232F2A] hover:bg-[#E5DCCF] text-[#5C5046] dark:text-[#D1C3B3] text-[10px] cursor-pointer"
                    >
                      Foto Pria
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, openingCoverPhotoUrl: formData.bride.photoUrl })}
                      className="px-2 py-1 rounded bg-[#EFE8DD] dark:bg-[#232F2A] hover:bg-[#E5DCCF] text-[#5C5046] dark:text-[#D1C3B3] text-[10px] cursor-pointer"
                    >
                      Foto Wanita
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94]">
                    💡 Mendukung link Google Drive (pastikan disetel publik: "Siapa saja yang memiliki link").
                  </p>

                  {/* Ratio & Scale Settings */}
                  <div className="pt-3 border-t border-[#E8DFD3] dark:border-[#2C3833] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Rasio Foto Sampul */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                        <Crop className="w-3.5 h-3.5 text-[#B89047]" />
                        Rasio Bingkai Foto Sampul:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { key: 'arched', label: 'Lengkung Kubah' },
                          { key: '1:1', label: 'Kotak (1:1)' },
                          { key: '3:4', label: 'Potret (3:4)' },
                          { key: '4:5', label: 'Potret (4:5)' },
                          { key: '2:3', label: 'Potret (2:3)' },
                          { key: 'circle', label: 'Lingkaran' },
                        ].map((r) => (
                          <button
                            key={r.key}
                            type="button"
                            onClick={() => setFormData({ ...formData, openingCoverRatio: r.key as any })}
                            className={`px-2 py-1 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                              (formData.openingCoverRatio || 'arched') === r.key
                                ? 'bg-[#851C28] text-white border-[#851C28] font-semibold shadow-xs'
                                : 'border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#1A221F] text-[#4A3F36] dark:text-[#D1C3B3] hover:border-[#851C28]'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Skala Foto Sampul */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                        <span className="flex items-center gap-1.5">
                          <ZoomIn className="w-3.5 h-3.5 text-[#B89047]" />
                          Skala Foto Sampul (Zoom):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#851C28] dark:text-[#E8808D] font-mono font-bold">
                            {formData.openingCoverScale || 100}%
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, openingCoverScale: 100 })}
                            className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 cursor-pointer"
                          >
                            Reset 100%
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="150"
                        step="2"
                        value={formData.openingCoverScale || 100}
                        onChange={(e) =>
                          setFormData({ ...formData, openingCoverScale: Number(e.target.value) })
                        }
                        className="w-full accent-[#851C28] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[#8C7A6B] dark:text-[#A89E94]">
                        <span>Perkecil (70%)</span>
                        <span>Normal (100%)</span>
                        <span>Perbesar (150%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Groom Section */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                Data Mempelai Pria (Groom)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nama Lengkap &amp; Gelar</label>
                  <input
                    type="text"
                    value={formData.groom.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, groom: { ...formData.groom, fullName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.groom.nickName}
                    onChange={(e) =>
                      setFormData({ ...formData, groom: { ...formData.groom, nickName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={formData.groom.fatherName}
                    onChange={(e) =>
                      setFormData({ ...formData, groom: { ...formData.groom, fatherName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={formData.groom.motherName}
                    onChange={(e) =>
                      setFormData({ ...formData, groom: { ...formData.groom, motherName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Urutan Anak (contoh: Putra Pertama dari)</label>
                  <input
                    type="text"
                    value={formData.groom.childOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, groom: { ...formData.groom, childOrder: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Akun Instagram (tanpa @)</label>
                  <input
                    type="text"
                    value={formData.groom.instagramHandle || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, groom: { ...formData.groom, instagramHandle: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium">URL Foto Mempelai Pria</label>
                  {isGoogleDriveUrl(formData.groom.photoUrl) && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Link Google Drive Terdeteksi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#D9CEBF] dark:border-[#2F3D36] bg-slate-100 dark:bg-black/30 shrink-0">
                    <img
                      src={formatImageUrl(formData.groom.photoUrl, '/src/assets/images/groom_portrait_1790611004426.jpg')}
                      alt="Preview Foto Pria"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.groom.photoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, groom: { ...formData.groom, photoUrl: e.target.value } })
                      }
                      placeholder="Tempel link Google Drive atau URL foto..."
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-1">
                      💡 Bisa tautan Google Drive (contoh: <code>drive.google.com/file/d/.../view</code>). Pastikan setelan file: <em>Siapa saja yang memiliki link</em>.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Deskripsi Singkat / Bio Pria</label>
                <input
                  type="text"
                  value={formData.groom.bio || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, groom: { ...formData.groom, bio: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                />
              </div>
            </div>

            {/* Bride Section */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                Data Mempelai Wanita (Bride)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nama Lengkap &amp; Gelar</label>
                  <input
                    type="text"
                    value={formData.bride.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, bride: { ...formData.bride, fullName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.bride.nickName}
                    onChange={(e) =>
                      setFormData({ ...formData, bride: { ...formData.bride, nickName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={formData.bride.fatherName}
                    onChange={(e) =>
                      setFormData({ ...formData, bride: { ...formData.bride, fatherName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={formData.bride.motherName}
                    onChange={(e) =>
                      setFormData({ ...formData, bride: { ...formData.bride, motherName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Urutan Anak (contoh: Putri Kedua dari)</label>
                  <input
                    type="text"
                    value={formData.bride.childOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, bride: { ...formData.bride, childOrder: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Akun Instagram (tanpa @)</label>
                  <input
                    type="text"
                    value={formData.bride.instagramHandle || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bride: { ...formData.bride, instagramHandle: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium">URL Foto Mempelai Wanita</label>
                  {isGoogleDriveUrl(formData.bride.photoUrl) && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Link Google Drive Terdeteksi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#D9CEBF] dark:border-[#2F3D36] bg-slate-100 dark:bg-black/30 shrink-0">
                    <img
                      src={formatImageUrl(formData.bride.photoUrl, '/src/assets/images/bride_portrait_1790611016646.jpg')}
                      alt="Preview Foto Wanita"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.bride.photoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, bride: { ...formData.bride, photoUrl: e.target.value } })
                      }
                      placeholder="Tempel link Google Drive atau URL foto..."
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-1">
                      💡 Bisa tautan Google Drive (contoh: <code>drive.google.com/file/d/.../view</code>). Pastikan setelan file: <em>Siapa saja yang memiliki link</em>.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Deskripsi Singkat / Bio Wanita</label>
                <input
                  type="text"
                  value={formData.bride.bio || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bride: { ...formData.bride, bio: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                />
              </div>
            </div>

            {/* Couple Photo Framing & Scale Settings */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border-2 border-[#C5A059]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <Crop className="w-4 h-4" />
                    Pengaturan Bingkai &amp; Skala Foto Kedua Mempelai
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5 text-xs">
                    Tampilan rasio bingkai dan tingkat perbesaran (zoom) foto mempelai pria &amp; wanita pada halaman utama.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#B89047]/15 text-[#B89047]">
                  Mempelai Pria &amp; Wanita
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                {/* Rasio Foto Mempelai */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5 text-[#B89047]" />
                    Rasio Bingkai Foto Mempelai:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {[
                      { key: 'arched', label: 'Lengkung' },
                      { key: 'portrait', label: 'Potret 3:4' },
                      { key: '4:5', label: 'Potret 4:5' },
                      { key: 'square', label: 'Kotak 1:1' },
                      { key: 'circle', label: 'Bulat' },
                    ].map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, couplePhotoRatio: r.key as any })}
                        className={`px-2 py-1.5 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                          (formData.couplePhotoRatio || 'arched') === r.key
                            ? 'bg-[#851C28] text-white border-[#851C28] font-semibold shadow-xs'
                            : 'border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#1A221F] text-[#4A3F36] dark:text-[#D1C3B3] hover:border-[#851C28]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skala Foto Mempelai */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                    <span className="flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-[#B89047]" />
                      Skala Foto Mempelai (Zoom):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#851C28] dark:text-[#E8808D] font-mono font-bold text-xs">
                        {formData.couplePhotoScale || 100}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, couplePhotoScale: 100 })}
                        className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 cursor-pointer"
                      >
                        Reset 100%
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="150"
                    step="2"
                    value={formData.couplePhotoScale || 100}
                    onChange={(e) =>
                      setFormData({ ...formData, couplePhotoScale: Number(e.target.value) })
                    }
                    className="w-full accent-[#851C28] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#8C7A6B] dark:text-[#A89E94]">
                    <span>Perkecil (70%)</span>
                    <span>Normal (100%)</span>
                    <span>Perbesar (150%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Quote */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider">
                Kutipan Doa / Ayat Suci
              </h3>
              <div>
                <label className="block font-medium mb-1">Teks Doa / Ayat</label>
                <textarea
                  rows={3}
                  value={formData.quote.text}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: { ...formData.quote, text: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Sumber Ayat / Referensi</label>
                <input
                  type="text"
                  value={formData.quote.source}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: { ...formData.quote, source: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WAKTU & LOKASI ACARA */}
        {/* ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6 max-w-4xl text-xs">
            {formData.events.map((event, idx) => (
              <div
                key={event.id}
                className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4"
              >
                <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center justify-between">
                  <span>{event.title} ({event.id})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Judul Acara</label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Subjudul / Deskripsi Acara</label>
                    <input
                      type="text"
                      value={event.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].subtitle = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Tanggal Terbaca</label>
                    <input
                      type="text"
                      value={event.dateFormatted}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].dateFormatted = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Jam Mulai (HH:mm)</label>
                    <input
                      type="text"
                      value={event.startTime}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].startTime = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Jam Selesai (HH:mm)</label>
                    <input
                      type="text"
                      value={event.endTime}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].endTime = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Nama Gedung / Lokasi</label>
                    <input
                      type="text"
                      value={event.venueName}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].venueName = e.target.value;
                        updated[idx].mapsEmbedUrl = formatGoogleMapsEmbedUrl(updated[idx].mapsDirectUrl, updated[idx].venueName, updated[idx].venueAddress);
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Dresscode Acara</label>
                    <input
                      type="text"
                      value={event.dressCode || ''}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx].dressCode = e.target.value;
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={event.venueAddress}
                    onChange={(e) => {
                      const updated = [...formData.events];
                      updated[idx].venueAddress = e.target.value;
                      updated[idx].mapsEmbedUrl = formatGoogleMapsEmbedUrl(updated[idx].mapsDirectUrl, updated[idx].venueName, updated[idx].venueAddress);
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium">Tautan Google Maps / Alamat Lokasi</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.events];
                          const targetLocation = `${updated[idx].venueName} ${updated[idx].venueAddress}`.trim();
                          const newDirect = `https://maps.google.com/?q=${encodeURIComponent(targetLocation)}`;
                          updated[idx].mapsDirectUrl = newDirect;
                          updated[idx].mapsEmbedUrl = formatGoogleMapsEmbedUrl('', updated[idx].venueName, updated[idx].venueAddress);
                          setFormData({ ...formData, events: updated });
                        }}
                        className="text-[10px] text-[#B89047] hover:underline font-semibold cursor-pointer"
                        title="Perbarui peta otomatis sesuai Nama & Alamat Gedung di atas"
                      >
                        🔄 Sinkronkan ke Lokasi Acara Ini
                      </button>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Auto-sync</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={event.mapsDirectUrl}
                    placeholder="https://maps.app.goo.gl/... atau nama gedung & alamat"
                    onChange={(e) => {
                      const updated = [...formData.events];
                      const val = e.target.value;
                      updated[idx].mapsDirectUrl = val;
                      updated[idx].mapsEmbedUrl = formatGoogleMapsEmbedUrl(val, updated[idx].venueName, updated[idx].venueAddress);
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-1">
                    Bisa berupa tautan share Google Maps (maps.app.goo.gl), tautan google.com/maps, maupun nama lokasi.
                  </p>

                  {/* Live mini preview of map inside Admin */}
                  <div className="mt-2.5 rounded-xl overflow-hidden border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#EFE9E0] dark:bg-[#18201D]">
                    <div className="p-1.5 bg-[#E8DFD3]/60 dark:bg-[#202924] text-[10px] text-[#736458] dark:text-[#A49A8F] flex items-center justify-between">
                      <span>Pratinjau Peta Acara: {event.title}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">● Tersinkron</span>
                    </div>
                    <div className="h-32 w-full">
                      <iframe
                        title={`Peta ${event.title}`}
                        src={formatGoogleMapsEmbedUrl(event.mapsEmbedUrl || event.mapsDirectUrl, event.venueName, event.venueAddress)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KISAH CINTA */}
        {/* ========================================================================= */}
        {activeTab === 'story' && (
          <div className="space-y-6 max-w-4xl text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#8C7A6B] dark:text-[#A89E94]">
                Kelola bab dan tonggak bersejarah dalam kisah cinta kedua mempelai.
              </p>
              <button
                type="button"
                onClick={() => {
                  const newItem: LoveStoryItem = {
                    id: String(Date.now()),
                    year: 'Tahun 2026',
                    title: 'Babak Baru Bersama',
                    description: 'Tuliskan deskripsi momen bahagia...',
                  };
                  setFormData({ ...formData, loveStory: [...formData.loveStory, newItem] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B89047] text-white font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Momen</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.loveStory.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#B89047]">Momen #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.loveStory.filter((_, i) => i !== idx);
                        setFormData({ ...formData, loveStory: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Waktu / Tahun (contoh: September 2020)</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const updated = [...formData.loveStory];
                          updated[idx].year = e.target.value;
                          setFormData({ ...formData, loveStory: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Judul Momen</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...formData.loveStory];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, loveStory: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Cerita / Kisah</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...formData.loveStory];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, loveStory: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GALERI FOTO & LATAR BELAKANG */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 max-w-4xl text-xs">
            {/* Google Drive Informational Tip Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#B89047] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-[#B89047] block mb-0.5 font-semibold">
                  Mendukung Tautan Langsung &amp; Google Drive
                </strong>
                <p className="text-[#6C5E53] dark:text-[#B4AAA0]">
                  Anda dapat menyalin tautan berbagi (*share link*) file foto dari Google Drive, URL gambar online, atau aset lokal.
                  <strong> Catatan penting:</strong> Pastikan setelan berbagi di Google Drive telah diubah menjadi <em>"Siapa saja yang memiliki link" (Anyone with the link) → "Pelihat" (Viewer)</em>.
                </p>
              </div>
            </div>

            {/* 1. Background / Hero Cover Image Manager */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Foto Latar Belakang Utama (Hero Background)
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5">
                    Foto beresolusi tinggi yang tampil di bagian paling atas halaman undangan utama.
                  </p>
                </div>
                {isGoogleDriveUrl(formData.heroImageUrl || '') && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    ✓ Google Drive Aktif
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-[#D9CEBF] dark:border-[#2F3D36] bg-slate-100 dark:bg-black/30 shrink-0">
                  <img
                    src={formatImageUrl(
                      formData.heroImageUrl || formData.gallery[0]?.url,
                      '/src/assets/images/hero_wedding_couple_1790610979338.jpg'
                    )}
                    alt="Preview Foto Latar Belakang"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="block font-medium">Tautan URL Foto Latar Belakang (Google Drive / Direct Link)</label>
                  <input
                    type="text"
                    value={formData.heroImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94]">
                    Jika dikosongkan, sistem akan otomatis menggunakan foto pertama dari album galeri di bawah.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Display, Size, Ratio & Animation Settings */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border-2 border-[#C5A059]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Pengaturan Ukuran, Rasio &amp; Animasi Galeri Foto
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5 text-xs">
                    Atur ukuran kartu foto, aspek rasio, dan efek animasi bergerak halus dari kanan ke kiri dengan fade masuk &amp; fade keluar di akhir.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#B89047]/15 text-[#B89047]">
                  Album Foto
                </span>
              </div>

              {/* Animasi Bergerak Reel Kanan-ke-Kiri Switcher */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-xs text-[#851C28] dark:text-[#E8808D] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    Animasi Bergerak Kanan ke Kiri (Fade Masuk &amp; Fade Keluar)
                  </span>
                  <p className="text-[11px] text-[#6C5E53] dark:text-[#B4AAA0] mt-0.5">
                    Foto bergerak horizontal kontinu dari kanan ke kiri dengan fade halus di sisi masuk dan sisi keluar.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[#EFE8DD] dark:bg-[#232F2A] p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, galleryAnimationEnabled: true })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      formData.galleryAnimationEnabled !== false
                        ? 'bg-[#851C28] text-white shadow-xs font-semibold'
                        : 'text-[#6C5E53] dark:text-[#A79D93]'
                    }`}
                  >
                    ✓ Aktif (Reel Bergerak)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, galleryAnimationEnabled: false })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      formData.galleryAnimationEnabled === false
                        ? 'bg-[#851C28] text-white shadow-xs font-semibold'
                        : 'text-[#6C5E53] dark:text-[#A79D93]'
                    }`}
                  >
                    Grid Kisi-kisi
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Ukuran Foto di Album */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#B89047]" />
                    Ukuran Foto di Album:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'small', label: 'Kecil', desc: 'Kompak' },
                      { key: 'medium', label: 'Sedang', desc: 'Standar' },
                      { key: 'large', label: 'Besar', desc: 'Luas' },
                    ].map((sz) => (
                      <button
                        key={sz.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, galleryPhotoSize: sz.key as any })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          (formData.galleryPhotoSize || 'medium') === sz.key
                            ? 'bg-[#B89047] text-white border-[#B89047] font-semibold shadow-xs'
                            : 'border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#1A221F] text-[#4A3F36] dark:text-[#D1C3B3]'
                        }`}
                      >
                        <span className="block text-xs font-bold">{sz.label}</span>
                        <span className="block text-[9px] opacity-80">{sz.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rasio Foto di Album */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5 text-[#B89047]" />
                    Rasio Kartu Foto Album:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: '4:5', label: '4:5' },
                      { key: 'square', label: '1:1 (Kotak)' },
                      { key: '4:3', label: '4:3' },
                      { key: '16:9', label: '16:9' },
                      { key: '3:2', label: '3:2' },
                      { key: 'portrait', label: '3:4' },
                    ].map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, galleryRatio: r.key as any })}
                        className={`px-2 py-1.5 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                          (formData.galleryRatio || '4:5') === r.key
                                ? 'bg-[#851C28] text-white border-[#851C28] font-semibold shadow-xs'
                                : 'border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#1A221F] text-[#4A3F36] dark:text-[#D1C3B3]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kecepatan Animasi Reel Bergerak */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#B89047]" />
                    Kecepatan Animasi Reel Bergerak (Kanan ke Kiri):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'slow', label: 'Lambat', desc: '48 detik (Elegan & Halus)' },
                      { key: 'normal', label: 'Sedang', desc: '30 detik (Standar Harmonis)' },
                      { key: 'fast', label: 'Cepat', desc: '18 detik (Dinamis Aktif)' },
                    ].map((sp) => (
                      <button
                        key={sp.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, galleryAnimationSpeed: sp.key as any })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          (formData.galleryAnimationSpeed || 'normal') === sp.key
                            ? 'bg-[#C5A059] text-white border-[#C5A059] font-semibold shadow-xs'
                            : 'border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#1A221F] text-[#4A3F36] dark:text-[#D1C3B3]'
                        }`}
                      >
                        <span className="block text-xs font-bold">{sp.label}</span>
                        <span className="block text-[9px] opacity-80">{sp.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview of Gallery with Selected Size & Ratio & Animation */}
              <div className="pt-3 border-t border-[#E8DFD3] dark:border-[#2C3833]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-semibold text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#B89047]" />
                    Pratinjau Langsung Tampilan Galeri Foto:
                  </span>
                  <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] bg-[#EFE8DD] dark:bg-[#232F2A] px-2 py-0.5 rounded-md">
                    Ukuran: <strong className="text-[#851C28] dark:text-[#E8808D]">{formData.galleryPhotoSize || 'medium'}</strong> · Rasio: <strong className="text-[#851C28] dark:text-[#E8808D]">{formData.galleryRatio || '4:5'}</strong> · Animasi: <strong className="text-[#851C28] dark:text-[#E8808D]">{formData.galleryAnimationEnabled !== false ? `Reel (${formData.galleryAnimationSpeed || 'normal'})` : 'Grid'}</strong>
                  </span>
                </div>

                <div className="relative w-full overflow-hidden rounded-2xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#ECE3D5]/40 dark:bg-[#151C19] p-3">
                  {/* Left & Right gradient fade masks */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAF7F2] dark:from-[#1A221F] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAF7F2] dark:from-[#1A221F] to-transparent z-10 pointer-events-none" />

                  {formData.galleryAnimationEnabled !== false ? (
                    <div
                      className="animate-marquee-rtl flex items-center gap-3"
                      style={{
                        animationDuration: formData.galleryAnimationSpeed === 'slow' ? '48s' : formData.galleryAnimationSpeed === 'fast' ? '18s' : '30s',
                      }}
                    >
                      {[...formData.gallery, ...formData.gallery].map((photo, i) => {
                        const hClass = formData.galleryPhotoSize === 'small' ? 'h-28' : formData.galleryPhotoSize === 'large' ? 'h-48' : 'h-36';
                        const rClass = formData.galleryRatio === 'square' ? 'aspect-square' : formData.galleryRatio === '16:9' ? 'aspect-video' : formData.galleryRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[4/5]';
                        return (
                          <div key={i} className={`${hClass} ${rClass} rounded-xl overflow-hidden shrink-0 border border-[#C5A059]/40 shadow-xs bg-black/10`}>
                            <img src={formatImageUrl(photo.url)} alt={photo.caption} className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {formData.gallery.slice(0, 4).map((photo, i) => {
                        const rClass = formData.galleryRatio === 'square' ? 'aspect-square' : formData.galleryRatio === '16:9' ? 'aspect-video' : formData.galleryRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[4/5]';
                        return (
                          <div key={i} className={`${rClass} rounded-xl overflow-hidden border border-[#C5A059]/40 shadow-xs bg-black/10`}>
                            <img src={formatImageUrl(photo.url)} alt={photo.caption} className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Photo Album / Gallery List */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                  Album Galeri Foto Pernikahan ({formData.gallery.length} Foto)
                </h3>
                <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-0.5">
                  Foto-foto yang tampil dalam tata letak Bento interaktif &amp; Lightbox layar penuh.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newPhoto: GalleryItem = {
                    id: `g-${Date.now()}`,
                    url: 'https://drive.google.com/file/d/sample/view',
                    caption: 'Momen penuh kehangatan bersama.',
                    category: 'prewedding',
                  };
                  setFormData({ ...formData, gallery: [...formData.gallery, newPhoto] });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B89047] text-white font-medium cursor-pointer hover:bg-[#A37E38] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Foto Album</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.gallery.map((photo, idx) => {
                const isDrive = isGoogleDriveUrl(photo.url);

                return (
                  <div
                    key={photo.id}
                    className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-3"
                  >
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/30 relative">
                      <img
                        src={formatImageUrl(
                          photo.url,
                          '/src/assets/images/gallery_wedding_moments_1790611031670.jpg'
                        )}
                        alt={photo.caption}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== '/src/assets/images/gallery_wedding_moments_1790611031670.jpg') {
                            target.src = '/src/assets/images/gallery_wedding_moments_1790611031670.jpg';
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                      {isDrive && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-600 text-white shadow-xs">
                          Google Drive
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-medium">URL Foto (Google Drive / Link Gambar)</label>
                        <span className="text-[10px] text-[#8C7A6B]">Foto #{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={photo.url}
                        onChange={(e) => {
                          const updated = [...formData.gallery];
                          updated[idx].url = e.target.value;
                          setFormData({ ...formData, gallery: updated });
                        }}
                        placeholder="https://drive.google.com/file/d/.../view"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                      />
                    </div>
                  <div>
                    <label className="block font-medium mb-1">Keterangan / Caption</label>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const updated = [...formData.gallery];
                        updated[idx].caption = e.target.value;
                        setFormData({ ...formData, gallery: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.gallery.filter((_, i) => i !== idx);
                        setFormData({ ...formData, gallery: updated });
                      }}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Foto</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: REKENING & AMPLOP */}
        {/* ========================================================================= */}
        {activeTab === 'gifts' && (
          <div className="space-y-6 max-w-4xl text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#8C7A6B] dark:text-[#A89E94]">
                Kelola nomor rekening bank dan alamat pengiriman kado fisik.
              </p>
              <button
                type="button"
                onClick={() => {
                  const newBank: BankAccount = {
                    id: `bank-${Date.now()}`,
                    bankName: 'Bank BCA',
                    accountNumber: '1234567890',
                    accountHolder: formData.groom.nickName,
                  };
                  setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, newBank] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B89047] text-white font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Rekening</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.bankAccounts.map((bank, idx) => (
                <div
                  key={bank.id}
                  className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                >
                  <div>
                    <label className="block font-medium mb-1">Nama Bank</label>
                    <input
                      type="text"
                      value={bank.bankName}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx].bankName = e.target.value;
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      value={bank.accountNumber}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx].accountNumber = e.target.value;
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      value={bank.accountHolder}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx].accountHolder = e.target.value;
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                    />
                  </div>
                  <div className="flex justify-end pt-4 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.bankAccounts.filter((_, i) => i !== idx);
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                      title="Hapus Rekening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Physical Gift Address */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider">
                Alamat Pengiriman Kado Fisik
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    value={formData.physicalGift.recipientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        physicalGift: { ...formData.physicalGift, recipientName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formData.physicalGift.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        physicalGift: { ...formData.physicalGift, phoneNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={formData.physicalGift.fullAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      physicalGift: { ...formData.physicalGift, fullAddress: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MUSIK LATAR BELAKANG */}
        {/* ========================================================================= */}
        {activeTab === 'music' && (
          <div className="space-y-6 max-w-4xl text-xs">
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <h3 className="font-semibold text-sm text-[#B89047] uppercase tracking-wider flex items-center gap-2">
                    <Disc className="w-4 h-4" />
                    Pilihan Melodi Latar Undangan (Background Music)
                  </h3>
                  <p className="text-[#8C7A6B] dark:text-[#A89E94] mt-1 text-xs">
                    Pilih aransemen melodi sakral yang akan otomatis berputar saat tamu menekan tombol "Buka Undangan".
                  </p>
                </div>
              </div>

              {/* Preset Track Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {AVAILABLE_WEDDING_TRACKS.map((track) => {
                  const isSelected = (formData.selectedTrackId || 'canon_in_d') === track.id;
                  const isPlaying = previewPlayingId === track.id;

                  const handlePreview = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (isPlaying) {
                      weddingMusicEngine.stop();
                      setPreviewPlayingId(null);
                    } else {
                      weddingMusicEngine.setTrack(track.id, track.id === 'custom_url' ? formData.customAudioUrl : undefined);
                      weddingMusicEngine.start();
                      setPreviewPlayingId(track.id);
                    }
                  };

                  const handleSelectThis = () => {
                    setFormData({
                      ...formData,
                      musicTitle: track.title,
                      musicArtist: track.artist,
                      selectedTrackId: track.id,
                    });
                    weddingMusicEngine.setTrack(track.id, track.id === 'custom_url' ? formData.customAudioUrl : undefined);
                  };

                  return (
                    <div
                      key={track.id}
                      onClick={handleSelectThis}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white dark:bg-[#232D28] border-[#B89047] shadow-sm ring-2 ring-[#B89047]/30'
                          : 'bg-[#F9F5EF]/60 dark:bg-[#161B19]/60 border-[#E8DFD3] dark:border-[#2C3833] hover:bg-white dark:hover:bg-[#1E2622]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h4 className="font-serif-luxury text-base font-bold text-[#2C2724] dark:text-[#F3EEEA]">
                            {track.title}
                          </h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B89047] text-white">
                              Terpilih
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#7B6E62] dark:text-[#A79D93] mb-2 font-medium">
                          {track.artist}
                        </p>
                        <p className="text-xs text-[#8C7E72] dark:text-[#8E9B94] leading-relaxed">
                          {track.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E8DFD3]/60 dark:border-[#2C3833]/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handlePreview}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isPlaying
                              ? 'bg-amber-600 text-white'
                              : 'bg-[#FAF7F2] dark:bg-[#141A17] border border-[#D9CEBF] dark:border-[#2F3D36] text-[#2C2724] dark:text-[#F3EEEA] hover:border-[#B89047]'
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3 h-3 fill-current" />
                              <span>Jeda Uji Dengar</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Uji Dengar</span>
                            </>
                          )}
                        </button>
                        <span className="text-[11px] text-[#8C7E72] dark:text-[#8E9B94] tabular-nums">
                          {track.durationFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Audio URL input if custom is chosen */}
              {(formData.selectedTrackId === 'custom_url') && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-[#B89047] flex items-center gap-1.5">
                      <span>🔗</span> Tautan Musik Kustom (Google Drive atau URL MP3)
                    </label>
                    {isGoogleDriveUrl(formData.customAudioUrl || '') ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3" /> Google Drive Terdeteksi
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white">
                        Google Drive Otomatis Didukung
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="url"
                      value={formData.customAudioUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customAudioUrl: e.target.value,
                        })
                      }
                      placeholder="Tempel tautan Google Drive (https://drive.google.com/file/d/...) atau URL MP3"
                      className="flex-1 px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.customAudioUrl) {
                          weddingMusicEngine.setTrack('custom_url', formData.customAudioUrl);
                          weddingMusicEngine.start();
                        }
                      }}
                      className="px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl transition-all cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Uji Putar</span>
                    </button>
                  </div>

                  {extractGoogleDriveFileId(formData.customAudioUrl || '') && (
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                      <span>Google Drive File ID: <code className="font-mono font-semibold">{extractGoogleDriveFileId(formData.customAudioUrl || '')}</code></span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Auto-convert streaming</span>
                    </div>
                  )}

                  <div className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94] space-y-1 bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833]">
                    <p>
                      💡 <strong>Cara Pakai Google Drive:</strong> Upload lagu MP3 ke Google Drive &gt; Bagikan dengan akses <em>"Siapa saja yang memiliki link" (Anyone with the link)</em> &gt; Salin tautan dan tempel di sini.
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      *Sistem otomatis mengonversi link Google Drive menjadi audio streaming langsung tanpa perlu hosting file sendiri.
                    </p>
                  </div>
                </div>
              )}

              {/* Label Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8DFD3] dark:border-[#2C3833]">
                <div>
                  <label className="block font-medium mb-1">Judul Musik (Ditampilkan pada Pemutar)</label>
                  <input
                    type="text"
                    value={formData.musicTitle}
                    onChange={(e) => setFormData({ ...formData, musicTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nama Musisi / Artis</label>
                  <input
                    type="text"
                    value={formData.musicArtist}
                    onChange={(e) => setFormData({ ...formData, musicArtist: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: KELOLA RSVP & BUKU TAMU */}
        {/* ========================================================================= */}
        {activeTab === 'rsvps' && (
          <div className="space-y-6 max-w-5xl text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#8C7A6B] dark:text-[#A89E94]">
                Semua konfirmasi kehadiran dan ucapan yang masuk dari tamu undangan.
              </p>
              <span className="font-semibold text-xs text-[#B89047]">Total: {rsvps.length} Konfirmasi</span>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] overflow-hidden shadow-xs">
              <div className="divide-y divide-[#EADFCF] dark:divide-[#28352F]">
                {rsvps.length === 0 ? (
                  <div className="p-12 text-center text-[#8C7A6B]">Belum ada data RSVP masuk.</div>
                ) : (
                  rsvps.map((r) => (
                    <div key={r.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                            {r.guestName}
                          </h4>
                          <span className="text-[11px] text-[#8C7A6B]">
                            · {r.attendance === 'hadir' ? `Hadir (${r.guestCount} Tamu)` : 'Berhalangan'}
                          </span>
                        </div>
                        <p className="text-[#4E4238] dark:text-[#D1C3B3] leading-relaxed">
                          "{r.message}"
                        </p>
                        <span className="text-[10px] text-[#8C7A6B] font-mono">
                          {new Date(r.createdAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteRsvp(r.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        title="Hapus RSVP / Ucapan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SUPABASE DATABASE */}
        {/* ========================================================================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 max-w-4xl text-xs">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                Penyimpanan Database Supabase Terintegrasi
              </div>
              <p className="leading-relaxed">
                Aplikasi ini mendukung penyimpanan *real-time* ke database PostgreSQL Supabase untuk menyimpan seluruh konfigurasi undangan, daftar tamu klien, dan data RSVP tamu secara permanen di *cloud*.
              </p>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-4">
              <h3 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                Kredensial Proyek Supabase Anda
              </h3>
              <div>
                <label className="block font-medium mb-1">
                  Project URL (contoh: https://xyzcompany.supabase.co)
                </label>
                <input
                  type="text"
                  value={supabaseCreds.url}
                  onChange={(e) => setSupabaseCreds({ ...supabaseCreds, url: e.target.value })}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Anon / Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseCreds.anonKey}
                  onChange={(e) => setSupabaseCreds({ ...supabaseCreds, anonKey: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono"
                />
              </div>

              {/* Status Message */}
              {supabaseStatus.message && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
                    supabaseStatus.isOk
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{supabaseStatus.message}</span>
                </div>
              )}

              {syncFeedback && (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 text-xs">
                  {syncFeedback}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={supabaseStatus.testing}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-[#B89047] text-[#B89047] hover:bg-[#B89047]/10 transition-colors cursor-pointer"
                >
                  {supabaseStatus.testing ? 'Menguji Koneksi...' : 'Uji Koneksi Supabase'}
                </button>
                <button
                  type="button"
                  onClick={handleSyncToSupabase}
                  disabled={isSyncingToSupabase}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  {isSyncingToSupabase ? 'Menyinkronkan...' : 'Sinkronkan Data ke Supabase Sekarang'}
                </button>
              </div>
            </div>

            {/* SQL Migration Script Download */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#B89047]" />
                    Script Pembuatan Tabel Database Supabase
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                    Jalankan script ini 1x di menu <strong>SQL Editor</strong> pada dashboard Supabase Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSqlSchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] hover:border-[#B89047] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#B89047]" />
                  <span>Unduh supabase_schema.sql</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: HOSTING VERCEL */}
        {/* ========================================================================= */}
        {activeTab === 'vercel' && (
          <div className="space-y-6 max-w-4xl text-xs">
            <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200">
              <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                <Cloud className="w-4 h-4 text-sky-600" />
                Panduan Publikasi Hosting di Vercel
              </div>
              <p className="leading-relaxed">
                Website undangan pernikahan ini telah dilengkapi file konfigurasi <code>vercel.json</code> yang optimal dengan SPA routing rewrites dan SSL otomatis, siap di-deploy secara gratis di Vercel dalam 1 menit!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-2">
                <span className="font-semibold text-sm text-[#B89047]">Langkah 1: Upload ke GitHub</span>
                <p className="text-[#6C5E53] dark:text-[#A79D93] leading-relaxed">
                  Unggah repository kode ini ke akun GitHub Anda (bisa Private atau Public).
                </p>
              </div>

              <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-2">
                <span className="font-semibold text-sm text-[#B89047]">Langkah 2: Import ke Vercel</span>
                <p className="text-[#6C5E53] dark:text-[#A79D93] leading-relaxed">
                  Buka <strong>vercel.com</strong> &gt; Add New &gt; Project &gt; Pilih repo GitHub Anda.
                </p>
              </div>

              <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-2">
                <span className="font-semibold text-sm text-[#B89047]">Langkah 3: Masukkan Environment Variable</span>
                <p className="text-[#6C5E53] dark:text-[#A79D93] leading-relaxed">
                  Di pengaturan Environment Variables Vercel, tambahkan:
                  <br />
                  <code className="text-[11px] font-mono text-[#B89047]">VITE_SUPABASE_URL</code>
                  <br />
                  <code className="text-[11px] font-mono text-[#B89047]">VITE_SUPABASE_ANON_KEY</code>
                </p>
              </div>

              <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-2">
                <span className="font-semibold text-sm text-[#B89047]">Langkah 4: Hubungkan Domain Kustom</span>
                <p className="text-[#6C5E53] dark:text-[#A79D93] leading-relaxed">
                  Buka Project Settings &gt; Domains &gt; Tambahkan nama domain Anda (misal <code>aryamaya.id</code> atau <code>aryamaya.my.id</code>). Arahkan DNS CNAME ke <code>cname.vercel-dns.com</code>.
                </p>
              </div>
            </div>

            {/* vercel.json preview */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-5 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-2">
              <span className="font-semibold text-sm">File vercel.json Sudah Dibuat Otomatis di Root Proyek:</span>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[11px] font-mono">
{`{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Modal Buat Projek Baru */}
        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onProjectCreated={(newSlug) => {
            if (onRefreshProjects) onRefreshProjects();
            if (onSelectProject) onSelectProject(newSlug);
            setActiveTab('couple');
          }}
        />

      </div>
    </div>
  );
};
