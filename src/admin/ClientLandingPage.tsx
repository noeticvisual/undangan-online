import React, { useEffect, useState } from 'react';
import {
  Mail, Plus, Copy, Check, Trash2, Loader2, ExternalLink, MessageCircle, Users, Lock, Heart,
} from 'lucide-react';

interface GuestRow {
  id: number;
  name: string;
  slug: string;
  category: string;
  isOpen: boolean;
  createdAt: string;
}

export const ClientLandingPage: React.FC = () => {
  const [authState, setAuthState] = useState<'checking' | 'locked' | 'ready'>('checking');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);

  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const loadGuests = () => {
    fetch('/api/guests')
      .then((r) => (r.ok ? r.json() : { guests: [] }))
      .then((data) => {
        setGuests(data?.guests ?? []);
        setAuthState('ready');
      })
      .catch(() => setAuthState('locked'));
  };

  useEffect(() => {
    // Check session: /api/guests requires admin OR client session
    fetch('/api/guests')
      .then((r) => {
        if (r.status === 401) {
          setAuthState('locked');
          return { guests: [] };
        }
        return r.json();
      })
      .then((data) => {
        if (data?.guests) {
          setGuests(data.guests);
          setAuthState('ready');
        }
      })
      .catch(() => setAuthState('locked'));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Password salah.');
      }
      loadGuests();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Password salah.');
    } finally {
      setBusy(false);
    }
  };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Nama tamu wajib diisi.');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), note: '', category: 'tamu', invitationCount: 1 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menambah tamu.');
      setName('');
      loadGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah tamu.');
    } finally {
      setAdding(false);
    }
  };

  const removeGuest = async (slug: string) => {
    if (!window.confirm('Hapus tamu ini?')) return;
    await fetch(`/api/guests?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' }).catch(() => undefined);
    loadGuests();
  };

  const linkFor = (slug: string) => `${origin}/?tamu=${slug}`;

  const copyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(slug));
    } catch {
      // clipboard unavailable
    }
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const waLink = (g: GuestRow) => {
    const text = `Kepada Yth. ${g.name},\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami. Silakan buka undangan berikut:\n\n${linkFor(g.slug)}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121615]">
        <Loader2 className="w-8 h-8 text-[#B89047] animate-spin" />
      </div>
    );
  }

  if (authState === 'locked') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#121615]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="inline-flex p-3.5 rounded-2xl bg-[#B89047]/15 text-[#E6CA65] mb-4">
              <Mail className="w-7 h-7" />
            </span>
            <h1 className="font-serif-luxury text-3xl text-[#FAF7F2] font-semibold mb-1">Portal Klien</h1>
            <p className="text-xs text-[#A89E94]">Masukkan password dari penyelenggara untuk mengisi nama tamu undangan.</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#1A221F] rounded-2xl border border-[#2C3833] p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password klien / admin"
                autoFocus
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-[#141A17] border border-[#2F3D36] text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
            </div>
            {loginError && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-xl px-3 py-2.5">{loginError}</div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-xl transition-all cursor-pointer disabled:opacity-60"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Masuk Portal Klien</span>
            </button>
          </form>
          <p className="text-center text-[11px] text-[#8C7A6B] mt-6 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-[#B89047] fill-current" /> Niskala Wedding
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFEA] dark:bg-[#121615] text-[#2C2724] dark:text-[#F3EEEA] transition-colors">
      <header className="bg-[#FAF7F2]/95 dark:bg-[#1A221F]/95 backdrop-blur-md border-b border-[#E8DFD3] dark:border-[#242D28]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#B89047]/10 text-[#B89047]">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-serif-luxury text-xl font-semibold leading-tight">Portal Klien — Daftar Tamu</h1>
              <p className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">
                Isi nama tamu, lalu salin atau kirim link undangan personal.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Add guest */}
        <form
          onSubmit={addGuest}
          className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833] grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">Nama Tamu yang Diundang</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso & Keluarga"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#F3EEEA] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-xl cursor-pointer disabled:opacity-60"
          >
            {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Tambah &amp; Buat Link
          </button>
          {error && <p className="text-xs text-red-500 sm:col-span-2">{error}</p>}
        </form>

        {/* Guest list */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833]">
          <h3 className="font-semibold text-sm flex items-center gap-1.5 mb-4">
            <Users className="w-4 h-4 text-[#B89047]" /> Daftar Tamu ({guests.length})
          </h3>

          {guests.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#8C7A6B] dark:text-[#A89E94]">
              Belum ada tamu. Tambahkan nama tamu pertama Anda di atas.
            </div>
          ) : (
            <div className="space-y-2.5">
              {guests.map((g) => (
                <div
                  key={g.slug}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141A17] border border-[#EBE1D4] dark:border-[#28352F]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold truncate">{g.name}</span>
                      {g.isOpen && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                          Dibuka
                        </span>
                      )}
                    </div>
                    <code className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] truncate mt-1">{linkFor(g.slug)}</code>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={waLink(g)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Kirim via WhatsApp"
                      className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <a
                      href={linkFor(g.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Pratinjau"
                      className="p-2 rounded-lg text-[#8C7A6B] hover:text-[#B89047] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copyLink(g.slug)}
                      title="Salin link"
                      className="p-2 rounded-lg text-[#B89047] hover:bg-[#B89047]/10 transition-colors cursor-pointer"
                    >
                      {copiedSlug === g.slug ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGuest(g.slug)}
                      title="Hapus"
                      className="p-2 rounded-lg text-[#8C7A6B] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">
          Halaman ini hanya untuk mengelola nama tamu. Perubahan isi undangan dilakukan oleh penyelenggara.
        </p>
      </main>
    </div>
  );
};
