import React, { useEffect, useMemo, useState } from 'react';
import {
  Link2, Copy, Check, Trash2, Plus, Loader2, Users, ExternalLink, MessageCircle, Download,
} from 'lucide-react';

interface GuestRow {
  id: number;
  name: string;
  slug: string;
  note: string;
  category: string;
  invitationCount: number;
  maxSurat: number;
  isOpen: boolean;
  openedAt: string | null;
  createdAt: string;
}

export const LinkGeneratorPanel: React.FC = () => {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('tamu');
  const [invitationCount, setInvitationCount] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const loadGuests = () => {
    setLoading(true);
    fetch('/api/guests')
      .then((r) => (r.ok ? r.json() : { guests: [] }))
      .then((data) => setGuests(data?.guests ?? []))
      .catch(() => setError('Gagal memuat daftar tamu.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadGuests, []);

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Nama tamu wajib diisi.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), note: note.trim(), category, invitationCount }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menambah tamu.');
      setName('');
      setNote('');
      setInvitationCount(1);
      loadGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah tamu.');
    } finally {
      setBusy(false);
    }
  };

  const addBulk = async () => {
    setError('');
    const names = bulkText
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) {
      setError('Tulis minimal satu nama (satu nama per baris).');
      return;
    }
    setBusy(true);
    try {
      for (const n of names) {
        const res = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: n, note: '', category, invitationCount: 1 }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Gagal menambah: ${n}`);
        }
      }
      setBulkText('');
      setShowBulk(false);
      loadGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah tamu.');
    } finally {
      setBusy(false);
    }
  };

  const removeGuest = async (slug: string) => {
    if (!window.confirm('Hapus tamu ini beserta link undangannya?')) return;
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

  const exportCsv = () => {
    const header = 'Nama,Kategori,Link Undangan,Sudah Dibuka';
    const rows = guests.map((g) => `"${g.name}","${g.category}","${linkFor(g.slug)}","${g.isOpen ? 'Ya' : 'Belum'}"`);
    const csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent([header, ...rows].join('\n'));
    const a = document.createElement('a');
    a.href = csv;
    a.download = `link-tamu-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const stats = useMemo(
    () => ({
      total: guests.length,
      opened: guests.filter((g) => g.isOpen).length,
    }),
    [guests],
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="p-4 rounded-xl bg-white dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833]">
          <span className="block text-2xl font-serif-luxury font-bold">{stats.total}</span>
          <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94] flex items-center gap-1">
            <Users className="w-3 h-3" /> Total Tamu
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833]">
          <span className="block text-2xl font-serif-luxury font-bold text-emerald-600 dark:text-emerald-400">{stats.opened}</span>
          <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">Sudah Membuka Undangan</span>
        </div>
      </div>

      {/* Add form */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#B89047]" /> Tambah Tamu &amp; Buat Link
          </h3>
          <button
            type="button"
            onClick={() => setShowBulk((v) => !v)}
            className="text-[11px] text-[#8C7A6B] hover:text-[#B89047] font-medium cursor-pointer"
          >
            {showBulk ? 'Mode Satu Nama' : 'Mode Banyak Nama'}
          </button>
        </div>

        {showBulk ? (
          <div className="space-y-3">
            <textarea
              rows={6}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={'Satu nama per baris, contoh:\nBudi Santoso & Keluarga\ndr. Anisa Wijaya\nRombongan SMA 3'}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#F3EEEA] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
            />
            <button
              type="button"
              onClick={addBulk}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-xl cursor-pointer disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Buat {bulkText.split('\n').filter((n) => n.trim()).length || 0} Link Sekaligus
            </button>
          </div>
        ) : (
          <form onSubmit={addGuest} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">Nama Tamu</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso & Keluarga"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#F3EEEA] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#F3EEEA]"
              >
                <option value="tamu">Tamu</option>
                <option value="keluarga">Keluarga</option>
                <option value="teman">Teman</option>
                <option value="rekan">Rekan Kerja</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-xl cursor-pointer disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Buat Link
            </button>
          </form>
        )}

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>

      {/* Guest list */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1A221F] border border-[#E8DFD3] dark:border-[#2C3833]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-[#B89047]" /> Daftar Link Undangan
          </h3>
          {guests.length > 0 && (
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C7A6B] hover:text-[#B89047] cursor-pointer"
            >
              <Download className="w-3 h-3" /> Unduh CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-6 h-6 text-[#B89047] animate-spin" />
          </div>
        ) : guests.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#8C7A6B] dark:text-[#A89E94]">
            Belum ada tamu. Tambahkan nama tamu di atas untuk membuat link undangan personal.
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
                    <span className="text-sm font-semibold text-[#25201C] dark:text-[#FAF7F2] truncate">{g.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-[#EFE8DD] dark:bg-[#232F2A] text-[#8C7A6B]">{g.category}</span>
                    {g.isOpen && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        Dibuka
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">
                    <code className="truncate">{linkFor(g.slug)}</code>
                  </div>
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
                    title="Pratinjau undangan"
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
                    title="Hapus tamu"
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

      {/* Client handoff note */}
      <div className="p-4 rounded-xl bg-[#B89047]/10 border border-[#B89047]/30 text-xs text-[#7A5B22] dark:text-[#E2C799] leading-relaxed">
        <strong className="font-semibold">Cara memberikan ke klien:</strong> setelah seluruh isi undangan final, bagikan
        alamat <code className="font-mono">/klien</code> kepada klien. Klien hanya dapat menambah nama tamu dan menyalin
        link undangan — tidak bisa mengubah isi undangan. <code className="font-mono">/kelola</code> dan
        <code className="font-mono"> /admin</code> tetap khusus untuk Anda (admin).
      </div>
    </div>
  );
};
