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
} from 'lucide-react';
import {
  WeddingConfig,
  RSVPRecord,
  WeddingEvent,
  LoveStoryItem,
  BankAccount,
  GalleryItem,
  SupabaseConfig,
} from '../types/wedding';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  supabaseWeddingService,
} from '../services/supabase';

interface AdminDashboardProps {
  config: WeddingConfig;
  rsvps: RSVPRecord[];
  onSaveConfig: (newConfig: WeddingConfig) => void;
  onResetDefault: () => void;
  onDeleteRsvp: (id: string) => void;
  onBackToInvitation: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  rsvps,
  onSaveConfig,
  onResetDefault,
  onDeleteRsvp,
  onBackToInvitation,
}) => {
  const [activeTab, setActiveTab] = useState<
    'couple' | 'events' | 'story' | 'gallery' | 'gifts' | 'rsvps' | 'supabase' | 'vercel'
  >('couple');

  // Working copy of config
  const [formData, setFormData] = useState<WeddingConfig>(config);
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

          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all cursor-pointer"
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
            { id: 'couple', label: '1. Mempelai & Kutipan', icon: Users },
            { id: 'events', label: '2. Waktu & Lokasi Acara', icon: Calendar },
            { id: 'story', label: '3. Kisah Cinta', icon: Heart },
            { id: 'gallery', label: '4. Galeri Foto', icon: Image },
            { id: 'gifts', label: '5. Rekening & Amplop', icon: CreditCard },
            { id: 'rsvps', label: `6. RSVP & Tamu (${rsvps.length})`, icon: Settings },
            { id: 'supabase', label: '7. Supabase Database', icon: Database },
            { id: 'vercel', label: '8. Hosting Vercel', icon: Cloud },
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

        {/* ========================================================================= */}
        {/* TAB 1: MEMPELAI & KUTIPAN */}
        {/* ========================================================================= */}
        {activeTab === 'couple' && (
          <div className="space-y-6 max-w-4xl text-xs">
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
                <label className="block font-medium mb-1">URL Foto Mempelai Pria</label>
                <input
                  type="text"
                  value={formData.groom.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, groom: { ...formData.groom, photoUrl: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                />
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
                <label className="block font-medium mb-1">URL Foto Mempelai Wanita</label>
                <input
                  type="text"
                  value={formData.bride.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, bride: { ...formData.bride, photoUrl: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                />
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
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Tautan Langsung Google Maps</label>
                  <input
                    type="text"
                    value={event.mapsDirectUrl}
                    onChange={(e) => {
                      const updated = [...formData.events];
                      updated[idx].mapsDirectUrl = e.target.value;
                      setFormData({ ...formData, events: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] font-mono text-[11px]"
                  />
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
        {/* TAB 4: GALERI FOTO */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 max-w-4xl text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#8C7A6B] dark:text-[#A89E94]">
                Kelola daftar foto prewedding dan momen bahagia yang ditampilkan di galeri Bento.
              </p>
              <button
                type="button"
                onClick={() => {
                  const newPhoto: GalleryItem = {
                    id: `g-${Date.now()}`,
                    url: '/src/assets/images/hero_wedding_couple_1790610979338.jpg',
                    caption: 'Momen penuh kehangatan bersama.',
                    category: 'prewedding',
                  };
                  setFormData({ ...formData, gallery: [...formData.gallery, newPhoto] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B89047] text-white font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Foto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.gallery.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs space-y-3"
                >
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/30">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">URL Foto</label>
                    <input
                      type="text"
                      value={photo.url}
                      onChange={(e) => {
                        const updated = [...formData.gallery];
                        updated[idx].url = e.target.value;
                        setFormData({ ...formData, gallery: updated });
                      }}
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
              ))}
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
        {/* TAB 6: KELOLA RSVP & BUKU TAMU */}
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

      </div>
    </div>
  );
};
