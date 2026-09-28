import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck, LogOut, Save, Check, Loader2, Heart, Users, CalendarDays,
  BookHeart, Wallet, ImageIcon, Phone, LayoutDashboard, Link2, Download,
} from 'lucide-react';
import { WeddingConfig, WeddingEvent, LoveStoryItem, BankAccount, GalleryItem } from '../types/wedding';
import { DEFAULT_WEDDING_CONFIG } from '../data/defaultWeddingData';
import {
  ASSET_LIBRARY, CardFrame, createBankAccount, createDefaultEvent, createLoveStoryItem,
  deepClone, FIELD_STYLES, LABEL_STYLES, SelectField, TextField,
} from './adminShared';
import { AdminLoginForm } from './AdminLoginForm';
import { LinkGeneratorPanel } from './LinkGeneratorPanel';

type TabId = 'mempelai' | 'acara' | 'kisah' | 'galeri' | 'amplop' | 'kontak' | 'tamu';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'mempelai', label: 'Mempelai', icon: Heart },
  { id: 'acara', label: 'Acara', icon: CalendarDays },
  { id: 'kisah', label: 'Kisah Cinta', icon: BookHeart },
  { id: 'galeri', label: 'Galeri', icon: ImageIcon },
  { id: 'amplop', label: 'Amplop & Hadiah', icon: Wallet },
  { id: 'kontak', label: 'Narahubung', icon: Phone },
  { id: 'tamu', label: 'Link Tamu', icon: Link2 },
];

export const AdminPage: React.FC = () => {
  const [authState, setAuthState] = useState<'checking' | 'login' | 'ready'>('checking');
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('mempelai');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/auth?action=me').then((r) => (r.ok ? r.json() : { authenticated: false })),
      fetch('/api/wedding-config').then((r) => (r.ok ? r.json() : { config: null })),
    ])
      .then(([me, cfg]) => {
        if (me?.authenticated) {
          setConfig(cfg?.config ?? deepClone(DEFAULT_WEDDING_CONFIG));
          setAuthState('ready');
        } else {
          setAuthState('login');
        }
      })
      .catch(() => setAuthState('login'));
  }, []);

  const handleLoggedIn = () => {
    fetch('/api/wedding-config')
      .then((r) => (r.ok ? r.json() : { config: null }))
      .then((data) => {
        setConfig(data?.config ?? deepClone(DEFAULT_WEDDING_CONFIG));
        setAuthState('ready');
      })
      .catch(() => {
        setConfig(deepClone(DEFAULT_WEDDING_CONFIG));
        setAuthState('ready');
      });
  };

  const handleLogout = async () => {
    await fetch('/api/auth?action=logout', { method: 'POST' }).catch(() => undefined);
    setAuthState('login');
  };

  const handleSave = async () => {
    if (!config) return;
    setSaveState('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/wedding-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Gagal menyimpan.' }));
        throw new Error(data.error || 'Gagal menyimpan.');
      }
      localStorage.setItem('niskala_wedding_config', JSON.stringify(config));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (e) {
      setSaveState('error');
      setSaveError(e instanceof Error ? e.message : 'Gagal menyimpan.');
    }
  };

  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121615]">
        <Loader2 className="w-8 h-8 text-[#B89047] animate-spin" />
      </div>
    );
  }

  if (authState === 'login' || !config) {
    return <AdminLoginForm onSuccess={handleLoggedIn} />;
  }

  const update = (patch: Partial<WeddingConfig>) => setConfig({ ...config, ...patch });

  return (
    <div className="min-h-screen bg-[#F4EFEA] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA] transition-colors">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#1A221F]/95 backdrop-blur-md border-b border-[#E8DFD3] dark:border-[#242D28]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-[#B89047]/10 text-[#B89047]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif-luxury text-lg font-semibold leading-tight truncate">
                Dashboard Admin
              </h1>
              <p className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94] truncate">
                {config.groom.nickName} &amp; {config.bride.nickName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] hover:border-[#B89047] transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Lihat Undangan
            </a>
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar"
              className="p-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] text-[#7C6E61] hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-xl shadow-sm hover:from-[#A88239] hover:to-[#916E2E] transition-all cursor-pointer disabled:opacity-60"
            >
              {saveState === 'saving' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveState === 'saved' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {saveState === 'saving' ? 'Menyimpan...' : saveState === 'saved' ? 'Tersimpan' : 'Publikasikan'}
              </span>
            </button>
          </div>
        </div>
        {saveState === 'error' && (
          <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs px-6 py-2 border-t border-red-200 dark:border-red-900">
            {saveError}
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFE8DD] dark:bg-[#232F2A] rounded-xl mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-[#151C19] text-[#25201C] dark:text-[#FAF7F2] shadow-sm'
                    : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C] dark:hover:text-[#F3EEEA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'mempelai' && <CoupleTab config={config} update={update} />}
        {activeTab === 'acara' && <EventsTab config={config} update={update} />}
        {activeTab === 'kisah' && <StoryTab config={config} update={update} />}
        {activeTab === 'galeri' && <GalleryTab config={config} update={update} />}
        {activeTab === 'amplop' && <GiftTab config={config} update={update} />}
        {activeTab === 'kontak' && <ContactsTab config={config} update={update} />}
        {activeTab === 'tamu' && <LinkGeneratorPanel />}
      </div>
    </div>
  );
};

type TabProps = {
  config: WeddingConfig;
  update: (patch: Partial<WeddingConfig>) => void;
};

function CoupleTab({ config, update }: TabProps) {
  const setPerson = (who: 'groom' | 'bride', patch: Partial<WeddingConfig['groom']>) =>
    update({ [who]: { ...config[who], ...patch } } as Partial<WeddingConfig>);

  return (
    <div className="space-y-5">
      <CardFrame title="Mempelai Pria">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Nama Lengkap (beserta gelar)" value={config.groom.fullName} onChange={(v) => setPerson('groom', { fullName: v })} />
          <TextField label="Nama Panggilan" value={config.groom.nickName} onChange={(v) => setPerson('groom', { nickName: v })} />
          <TextField label="Nama Ayah" value={config.groom.fatherName} onChange={(v) => setPerson('groom', { fatherName: v })} />
          <TextField label="Nama Ibu" value={config.groom.motherName} onChange={(v) => setPerson('groom', { motherName: v })} />
          <TextField label="Anak Ke-" value={config.groom.childOrder} onChange={(v) => setPerson('groom', { childOrder: v })} />
          <TextField label="Instagram (tanpa @)" value={config.groom.instagramHandle ?? ''} onChange={(v) => setPerson('groom', { instagramHandle: v })} />
        </div>
        <TextField label="Bio Singkat" value={config.groom.bio ?? ''} onChange={(v) => setPerson('groom', { bio: v })} multiline rows={2} />
        <AssetPicker label="Foto Mempelai Pria" value={config.groom.photoUrl} onPick={(url) => setPerson('groom', { photoUrl: url })} />
      </CardFrame>

      <CardFrame title="Mempelai Wanita">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Nama Lengkap (beserta gelar)" value={config.bride.fullName} onChange={(v) => setPerson('bride', { fullName: v })} />
          <TextField label="Nama Panggilan" value={config.bride.nickName} onChange={(v) => setPerson('bride', { nickName: v })} />
          <TextField label="Nama Ayah" value={config.bride.fatherName} onChange={(v) => setPerson('bride', { fatherName: v })} />
          <TextField label="Nama Ibu" value={config.bride.motherName} onChange={(v) => setPerson('bride', { motherName: v })} />
          <TextField label="Anak Ke-" value={config.bride.childOrder} onChange={(v) => setPerson('bride', { childOrder: v })} />
          <TextField label="Instagram (tanpa @)" value={config.bride.instagramHandle ?? ''} onChange={(v) => setPerson('bride', { instagramHandle: v })} />
        </div>
        <TextField label="Bio Singkat" value={config.bride.bio ?? ''} onChange={(v) => setPerson('bride', { bio: v })} multiline rows={2} />
        <AssetPicker label="Foto Mempelai Wanita" value={config.bride.photoUrl} onPick={(url) => setPerson('bride', { photoUrl: url })} />
      </CardFrame>

      <CardFrame title="Tanggal & Kutipan">
        <TextField
          label="Tanggal & Waktu Utama (ISO 8601, contoh: 2026-10-24T08:00:00+07:00)"
          value={config.eventDateISO}
          onChange={(v) => update({ eventDateISO: v })}
          mono
        />
        <TextField label="Kutipan / Ayat" value={config.quote.text} onChange={(v) => update({ quote: { ...config.quote, text: v } })} multiline rows={3} />
        <TextField label="Sumber Kutipan" value={config.quote.source} onChange={(v) => update({ quote: { ...config.quote, source: v } })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Judul Musik" value={config.musicTitle} onChange={(v) => update({ musicTitle: v })} />
          <TextField label="Artis Musik" value={config.musicArtist} onChange={(v) => update({ musicArtist: v })} />
        </div>
      </CardFrame>
    </div>
  );
}

function AssetPicker({ label, value, onPick }: { label: string; value: string; onPick: (url: string) => void }) {
  return (
    <div>
      <label className={LABEL_STYLES}>{label}</label>
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#EFE8DD] dark:bg-[#232F2A] shrink-0">
          {value && <img src={value} alt={label} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 space-y-2">
          <input type="text" value={value} onChange={(e) => onPick(e.target.value)} className={`${FIELD_STYLES} font-mono text-[11px]`} placeholder="https://... atau pilih dari galeri bawaan" />
          <div className="flex flex-wrap gap-1.5">
            {ASSET_LIBRARY.map((a) => (
              <button
                key={a.url}
                type="button"
                onClick={() => onPick(a.url)}
                className="px-2 py-1 text-[10px] rounded-md bg-[#EFE8DD] dark:bg-[#232F2A] hover:bg-[#E5DCCF] transition-colors cursor-pointer"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsTab({ config, update }: TabProps) {
  const setEvent = (idx: number, patch: Partial<WeddingEvent>) => {
    const events = config.events.map((ev, i) => (i === idx ? { ...ev, ...patch } : ev));
    update({ events });
  };

  return (
    <div className="space-y-5">
      {config.events.map((ev, idx) => (
        <CardFrame
          key={ev.id}
          title={ev.title || `Acara ${idx + 1}`}
          onRemove={config.events.length > 1 ? () => update({ events: config.events.filter((_, i) => i !== idx) }) : undefined}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="Nama Acara" value={ev.title} onChange={(v) => setEvent(idx, { title: v })} />
            <TextField label="Subjudul" value={ev.subtitle} onChange={(v) => setEvent(idx, { subtitle: v })} />
            <TextField label="Tanggal Terbaca" value={ev.dateFormatted} onChange={(v) => setEvent(idx, { dateFormatted: v })} placeholder="Sabtu, 24 Oktober 2026" />
            <TextField label="Tanggal (YYYY-MM-DD)" value={ev.date} onChange={(v) => setEvent(idx, { date: v })} mono />
            <TextField label="Mulai (HH:mm)" value={ev.startTime} onChange={(v) => setEvent(idx, { startTime: v })} />
            <TextField label="Selesai (HH:mm)" value={ev.endTime} onChange={(v) => setEvent(idx, { endTime: v })} />
            <TextField label="Zona Waktu" value={ev.timezone} onChange={(v) => setEvent(idx, { timezone: v })} />
            <TextField label="Nama Tempat" value={ev.venueName} onChange={(v) => setEvent(idx, { venueName: v })} />
          </div>
          <TextField label="Alamat Lengkap" value={ev.venueAddress} onChange={(v) => setEvent(idx, { venueAddress: v })} multiline rows={2} />
          <TextField label="Link Google Maps (Embed)" value={ev.mapsEmbedUrl} onChange={(v) => setEvent(idx, { mapsEmbedUrl: v })} mono />
          <TextField label="Link Google Maps (Langsung)" value={ev.mapsDirectUrl} onChange={(v) => setEvent(idx, { mapsDirectUrl: v })} mono />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="Dress Code" value={ev.dressCode ?? ''} onChange={(v) => setEvent(idx, { dressCode: v })} />
            <TextField label="Catatan" value={ev.notes ?? ''} onChange={(v) => setEvent(idx, { notes: v })} />
          </div>
        </CardFrame>
      ))}
      <button
        type="button"
        onClick={() => update({ events: [...config.events, createDefaultEvent()] })}
        className="w-full py-2.5 text-xs font-semibold rounded-xl border-2 border-dashed border-[#D9CEBF] dark:border-[#2F3D36] text-[#8C7A6B] hover:border-[#B89047] hover:text-[#B89047] transition-colors cursor-pointer"
      >
        + Tambah Acara
      </button>
    </div>
  );
}

function StoryTab({ config, update }: TabProps) {
  const setItem = (idx: number, patch: Partial<LoveStoryItem>) => {
    const loveStory = config.loveStory.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    update({ loveStory });
  };

  return (
    <div className="space-y-5">
      {config.loveStory.map((story, idx) => (
        <CardFrame
          key={story.id}
          title={story.title || `Babak ${idx + 1}`}
          onRemove={() => update({ loveStory: config.loveStory.filter((_, i) => i !== idx) })}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextField label="Tahun" value={story.year} onChange={(v) => setItem(idx, { year: v })} placeholder="2019" />
            <div className="sm:col-span-2">
              <TextField label="Judul" value={story.title} onChange={(v) => setItem(idx, { title: v })} placeholder="Pertemuan Pertama" />
            </div>
          </div>
          <TextField label="Cerita" value={story.description} onChange={(v) => setItem(idx, { description: v })} multiline rows={3} />
        </CardFrame>
      ))}
      <button
        type="button"
        onClick={() => update({ loveStory: [...config.loveStory, createLoveStoryItem()] })}
        className="w-full py-2.5 text-xs font-semibold rounded-xl border-2 border-dashed border-[#D9CEBF] dark:border-[#2F3D36] text-[#8C7A6B] hover:border-[#B89047] hover:text-[#B89047] transition-colors cursor-pointer"
      >
        + Tambah Babak Cerita
      </button>
    </div>
  );
}

function GalleryTab({ config, update }: TabProps) {
  const setItem = (idx: number, patch: Partial<GalleryItem>) => {
    const gallery = config.gallery.map((g, i) => (i === idx ? { ...g, ...patch } : g));
    update({ gallery });
  };

  return (
    <div className="space-y-5">
      {config.gallery.map((item, idx) => (
        <CardFrame
          key={item.id}
          onRemove={() => update({ gallery: config.gallery.filter((_, i) => i !== idx) })}
        >
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#EFE8DD] dark:bg-[#232F2A] shrink-0">
              {item.url && <img src={item.url} alt={item.caption || 'Galeri'} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 space-y-2">
              <TextField label="URL Gambar" value={item.url} onChange={(v) => setItem(idx, { url: v })} mono />
              <div className="flex flex-wrap gap-1.5">
                {ASSET_LIBRARY.map((a) => (
                  <button
                    key={a.url}
                    type="button"
                    onClick={() => setItem(idx, { url: a.url })}
                    className="px-2 py-1 text-[10px] rounded-md bg-[#EFE8DD] dark:bg-[#232F2A] hover:bg-[#E5DCCF] transition-colors cursor-pointer"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <TextField label="Keterangan" value={item.caption} onChange={(v) => setItem(idx, { caption: v })} />
              <SelectField
                label="Kategori"
                value={item.category}
                onChange={(v) => setItem(idx, { category: v as GalleryItem['category'] })}
                options={[
                  { value: 'prewedding', label: 'Prewedding' },
                  { value: 'ceremony', label: 'Seremoni' },
                  { value: 'venue', label: 'Venue' },
                  { value: 'details', label: 'Detail' },
                ]}
              />
            </div>
          </div>
        </CardFrame>
      ))}
      <button
        type="button"
        onClick={() =>
          update({ gallery: [...config.gallery, { id: `gal-${Date.now()}`, url: ASSET_LIBRARY[0].url, caption: '', category: 'prewedding' }] })
        }
        className="w-full py-2.5 text-xs font-semibold rounded-xl border-2 border-dashed border-[#D9CEBF] dark:border-[#2F3D36] text-[#8C7A6B] hover:border-[#B89047] hover:text-[#B89047] transition-colors cursor-pointer"
      >
        + Tambah Foto
      </button>
    </div>
  );
}

function GiftTab({ config, update }: TabProps) {
  const setBank = (idx: number, patch: Partial<BankAccount>) => {
    const bankAccounts = config.bankAccounts.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    update({ bankAccounts });
  };
  const gift = config.physicalGift;

  return (
    <div className="space-y-5">
      {config.bankAccounts.map((acc, idx) => (
        <CardFrame
          key={acc.id}
          title={acc.bankName || `Rekening ${idx + 1}`}
          onRemove={() => update({ bankAccounts: config.bankAccounts.filter((_, i) => i !== idx) })}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextField label="Nama Bank" value={acc.bankName} onChange={(v) => setBank(idx, { bankName: v })} />
            <TextField label="Nomor Rekening" value={acc.accountNumber} onChange={(v) => setBank(idx, { accountNumber: v })} mono />
            <TextField label="Nama Pemilik" value={acc.accountHolder} onChange={(v) => setBank(idx, { accountHolder: v })} />
          </div>
        </CardFrame>
      ))}
      <button
        type="button"
        onClick={() => update({ bankAccounts: [...config.bankAccounts, createBankAccount()] })}
        className="w-full py-2.5 text-xs font-semibold rounded-xl border-2 border-dashed border-[#D9CEBF] dark:border-[#2F3D36] text-[#8C7A6B] hover:border-[#B89047] hover:text-[#B89047] transition-colors cursor-pointer"
      >
        + Tambah Rekening
      </button>

      <CardFrame title="Alamat Kirim Kado Fisik">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Nama Penerima" value={gift.recipientName} onChange={(v) => update({ physicalGift: { ...gift, recipientName: v } })} />
          <TextField label="Nomor Telepon" value={gift.phoneNumber} onChange={(v) => update({ physicalGift: { ...gift, phoneNumber: v } })} />
        </div>
        <TextField label="Alamat Lengkap" value={gift.fullAddress} onChange={(v) => update({ physicalGift: { ...gift, fullAddress: v } })} multiline rows={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Kota" value={gift.city} onChange={(v) => update({ physicalGift: { ...gift, city: v } })} />
          <TextField label="Kode Pos" value={gift.postalCode} onChange={(v) => update({ physicalGift: { ...gift, postalCode: v } })} />
        </div>
        <TextField label="Catatan" value={gift.notes ?? ''} onChange={(v) => update({ physicalGift: { ...gift, notes: v } })} />
      </CardFrame>
    </div>
  );
}

function ContactsTab({ config, update }: TabProps) {
  const setContact = (idx: number, patch: Partial<WeddingConfig['organizerContacts'][number]>) => {
    const organizerContacts = config.organizerContacts.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    update({ organizerContacts });
  };

  return (
    <div className="space-y-5">
      {config.organizerContacts.map((contact, idx) => (
        <CardFrame
          key={idx}
          title={contact.name || `Narahubung ${idx + 1}`}
          onRemove={() => update({ organizerContacts: config.organizerContacts.filter((_, i) => i !== idx) })}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextField label="Peran" value={contact.role} onChange={(v) => setContact(idx, { role: v })} placeholder="Ketua Panitia" />
            <TextField label="Nama" value={contact.name} onChange={(v) => setContact(idx, { name: v })} />
            <TextField label="Nomor WhatsApp" value={contact.phone} onChange={(v) => setContact(idx, { phone: v })} placeholder="6281234567890" mono />
          </div>
        </CardFrame>
      ))}
      <button
        type="button"
        onClick={() => update({ organizerContacts: [...config.organizerContacts, { role: '', name: '', phone: '' }] })}
        className="w-full py-2.5 text-xs font-semibold rounded-xl border-2 border-dashed border-[#D9CEBF] dark:border-[#2F3D36] text-[#8C7A6B] hover:border-[#B89047] hover:text-[#B89047] transition-colors cursor-pointer"
      >
        + Tambah Narahubung
      </button>
    </div>
  );
}
