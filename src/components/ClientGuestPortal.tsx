import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  MessageCircle,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Filter,
  Sparkles,
  Layers,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';
import { WeddingConfig, GuestItem, RSVPRecord } from '../types/wedding';

interface ClientGuestPortalProps {
  config: WeddingConfig;
  guests: GuestItem[];
  rsvps: RSVPRecord[];
  onAddGuest: (guest: Omit<GuestItem, 'id' | 'createdAt'>) => void;
  onBulkAddGuests: (names: string[], category: string) => void;
  onDeleteGuest: (id: string) => void;
  onBackToInvitation: () => void;
}

export const ClientGuestPortal: React.FC<ClientGuestPortalProps> = ({
  config,
  guests,
  rsvps,
  onAddGuest,
  onBulkAddGuests,
  onDeleteGuest,
  onBackToInvitation,
}) => {
  // Add single guest state
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCategory, setSingleCategory] = useState('Keluarga');
  const [singleNotes, setSingleNotes] = useState('');

  // Bulk add state
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Sahabat');

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Copy states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://niskala-wedding.com';

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;

    onAddGuest({
      name: singleName.trim(),
      phone: singlePhone.trim(),
      category: singleCategory,
      notes: singleNotes.trim(),
    });

    setSingleName('');
    setSinglePhone('');
    setSingleNotes('');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = bulkText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) return;

    onBulkAddGuests(names, bulkCategory);
    setBulkText('');
    setIsBulkMode(false);
  };

  const getGuestInvitationLink = (name: string) => {
    return `${baseUrl}?to=${encodeURIComponent(name.trim())}`;
  };

  const getWhatsAppMessage = (guest: GuestItem) => {
    const inviteLink = getGuestInvitationLink(guest.name);
    return `Kepada Yth.
${guest.name}

Assalamu’alaikum Warahmatullahi Wabarakatuh / Salam Sejahtera,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada hari pernikahan kami:

*${config.groom.fullName}* & *${config.bride.fullName}*

Hari/Tanggal: ${config.events[0]?.dateFormatted}
Waktu: Pukul ${config.events[0]?.startTime} - ${config.events[0]?.endTime} ${config.events[0]?.timezone}
Tempat: ${config.events[0]?.venueName}

Informasi lengkap mengenai acara dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan online berikut:
${inviteLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih banyak.
Salam hangat dari kami berdua,
${config.groom.nickName} & ${config.bride.nickName} sekeluarga`;
  };

  const handleCopyLink = (guest: GuestItem) => {
    const link = getGuestInvitationLink(guest.name);
    navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyMessage = (guest: GuestItem) => {
    const msg = getWhatsAppMessage(guest);
    navigator.clipboard.writeText(msg);
    setCopiedMessageId(guest.id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSendWhatsApp = (guest: GuestItem) => {
    const msg = getWhatsAppMessage(guest);
    let cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Find RSVP status for this guest
  const getGuestRsvp = (name: string) => {
    const cleanName = name.toLowerCase().trim();
    return rsvps.find((r) => r.guestName.toLowerCase().includes(cleanName) || cleanName.includes(r.guestName.toLowerCase()));
  };

  // Filter list
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || (g.phone || '').includes(searchQuery);
    const matchesCat = categoryFilter === 'Semua' || g.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Stats
  const totalGuests = guests.length;
  const attendedCount = guests.filter((g) => getGuestRsvp(g.name)?.attendance === 'hadir').length;
  const notAttendedCount = guests.filter((g) => getGuestRsvp(g.name)?.attendance === 'tidak_hadir').length;
  const pendingCount = totalGuests - attendedCount - notAttendedCount;

  const handleExportCsv = () => {
    const headers = ['Nama Tamu,Kategori,Nomor Telepon,Status RSVP,Jumlah Tamu Hadir,Link Undangan'];
    const rows = guests.map((g) => {
      const rsvp = getGuestRsvp(g.name);
      const rsvpStatus = rsvp ? (rsvp.attendance === 'hadir' ? 'Hadir' : 'Berhalangan') : 'Belum Konfirmasi';
      const guestCount = rsvp ? rsvp.guestCount : 0;
      const link = getGuestInvitationLink(g.name);
      return `"${g.name}","${g.category || 'Umum'}","${g.phone || ''}","${rsvpStatus}","${guestCount}","${link}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Daftar_Tamu_${config.groom.nickName}_${config.bride.nickName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              title="Lihat Tampilan Undangan"
            >
              <ArrowLeft className="w-4 h-4 text-[#B89047]" />
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B89047] font-semibold block">
                Portal Klien Pengantin
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
                Manajemen Tamu Undangan · {config.groom.nickName} &amp; {config.bride.nickName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] hover:border-[#B89047] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B89047]" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={onBackToInvitation}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#B89047] hover:bg-[#A37E38] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Website Undangan</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
            <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-1">Total Tamu Terdaftar</span>
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#25201C] dark:text-[#FAF7F2] tabular-nums">
              {totalGuests}
            </span>
          </div>
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 block mb-1">Konfirmasi Hadir</span>
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {attendedCount}
            </span>
          </div>
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
            <span className="text-xs text-amber-700 dark:text-amber-400 block mb-1">Berhalangan</span>
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {notAttendedCount}
            </span>
          </div>
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
            <span className="text-xs text-[#8C7A6B] dark:text-[#A89E94] block mb-1">Belum Konfirmasi</span>
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#8C7A6B] dark:text-[#A89E94] tabular-nums">
              {pendingCount}
            </span>
          </div>
        </div>

        {/* Content Layout: Left Form (Create Guests), Right Guest List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Tambah Tamu (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
              
              {/* Toggle Single / Bulk */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EADFCF] dark:border-[#28352F] mb-5">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#B89047]" />
                  <h3 className="font-semibold text-sm">
                    {isBulkMode ? 'Input Banyak Tamu Sekaligus' : 'Tambah Tamu Undangan'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBulkMode(!isBulkMode)}
                  className="text-xs text-[#B89047] hover:underline font-medium cursor-pointer"
                >
                  {isBulkMode ? 'Mode Satuan' : 'Mode Banyak (Bulk)'}
                </button>
              </div>

              {!isBulkMode ? (
                // Single Guest Form
                <form onSubmit={handleSingleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                      Nama Tamu / Pasangan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={singleName}
                      onChange={(e) => setSingleName(e.target.value)}
                      placeholder="Contoh: dr. Bambang & Ibu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                      Nomor WhatsApp / HP (Opsional)
                    </label>
                    <input
                      type="text"
                      value={singlePhone}
                      onChange={(e) => setSinglePhone(e.target.value)}
                      placeholder="08123456789 atau +62812..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                      Kategori Tamu
                    </label>
                    <select
                      value={singleCategory}
                      onChange={(e) => setSingleCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                    >
                      <option value="Keluarga">Keluarga</option>
                      <option value="Sahabat">Sahabat</option>
                      <option value="VIP">VIP</option>
                      <option value="Rekan Kerja">Rekan Kerja</option>
                      <option value="Tetangga">Tetangga</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                      Catatan Khusus (Meja / Penginapan)
                    </label>
                    <input
                      type="text"
                      value={singleNotes}
                      onChange={(e) => setSingleNotes(e.target.value)}
                      placeholder="Contoh: Meja VIP A, Kerabat Ibu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Simpan &amp; Buat Tautan Undangan</span>
                  </button>
                </form>
              ) : (
                // Bulk Guests Form
                <form onSubmit={handleBulkSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                      Daftar Nama (Satu nama per baris)
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder={`Bpk. Irfan Prasetyo & Istri\ndr. Sarah Nabilah\nRahmat Ramadhan\nIbu Desi Ratnasari`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                      Kategori untuk Semua Nama Ini
                    </label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                    >
                      <option value="Sahabat">Sahabat</option>
                      <option value="Keluarga">Keluarga</option>
                      <option value="Rekan Kerja">Rekan Kerja</option>
                      <option value="VIP">VIP</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Tambahkan Semua Nama Tamu</span>
                  </button>
                </form>
              )}

            </div>

            {/* Quick Tips for Client */}
            <div className="p-4 rounded-2xl bg-[#EFE8DD] dark:bg-[#1A221F] border border-[#E2D6C5] dark:border-[#2C3833] text-xs">
              <span className="font-semibold text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#B89047]" />
                Petunjuk Kirim Undangan Klien
              </span>
              <ul className="space-y-1.5 text-[#6C5E53] dark:text-[#A79D93] text-[11px] list-disc pl-4">
                <li>Klik tombol WhatsApp di samping nama tamu untuk membuka chat dengan template undangan personal.</li>
                <li>Tautan undangan otomatis membawa nama tamu di halaman pembuka &amp; kartu QR Check-in.</li>
                <li>Tamu hanya bisa melihat undangan &amp; mengisi form RSVP (tidak bisa mengubah data website).</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Daftar Tamu & Link Generator (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-4 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tamu atau nomor HP..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Sahabat">Sahabat</option>
                  <option value="VIP">VIP</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Tetangga">Tetangga</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>
            </div>

            {/* Guest Cards / Table */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#EADFCF] dark:border-[#28352F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#B89047]" />
                  <h3 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                    Daftar Tamu Terdaftar ({filteredGuests.length})
                  </h3>
                </div>
              </div>

              {filteredGuests.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#8C7A6B] dark:text-[#A89E94]">
                  Belum ada tamu yang sesuai dengan pencarian. Silakan tambahkan nama tamu pada formulir di sebelah kiri.
                </div>
              ) : (
                <div className="divide-y divide-[#EADFCF] dark:divide-[#28352F]">
                  {filteredGuests.map((guest) => {
                    const rsvp = getGuestRsvp(guest.name);
                    const link = getGuestInvitationLink(guest.name);
                    const isCopied = copiedId === guest.id;
                    const isMsgCopied = copiedMessageId === guest.id;

                    return (
                      <div
                        key={guest.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 dark:hover:bg-[#171F1B] transition-colors"
                      >
                        {/* Guest Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                              {guest.name}
                            </h4>
                            {/* Zero-Pill unboxed status */}
                            <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">
                              · {guest.category || 'Umum'}
                            </span>
                          </div>

                          {/* RSVP status badge */}
                          <div className="flex items-center gap-2 text-xs">
                            {rsvp ? (
                              rsvp.attendance === 'hadir' ? (
                                <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Pasti Hadir ({rsvp.guestCount} Tamu)
                                </span>
                              ) : (
                                <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1 text-[11px]">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Berhalangan
                                </span>
                              )
                            ) : (
                              <span className="text-[#8C7A6B] dark:text-[#A89E94] flex items-center gap-1 text-[11px]">
                                <Clock className="w-3.5 h-3.5" />
                                Belum Konfirmasi RSVP
                              </span>
                            )}
                            {guest.phone && (
                              <>
                                <span className="text-[#D9CEBF] dark:text-[#3B4A43]">·</span>
                                <span className="font-mono text-[11px] text-[#6C5E53] dark:text-[#B4AAA0]">
                                  {guest.phone}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Link snippet */}
                          <p className="font-mono text-[11px] text-[#8C7A6B] dark:text-[#8E9B94] truncate max-w-sm sm:max-w-md">
                            {link}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Send WhatsApp */}
                          <button
                            onClick={() => handleSendWhatsApp(guest)}
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="Kirim Pesan WhatsApp Langsung"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="p-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] hover:border-[#B89047] text-xs transition-colors cursor-pointer"
                            title="Salin Tautan Khusus Tamu"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#B89047]" />}
                          </button>

                          {/* Copy Message Text */}
                          <button
                            onClick={() => handleCopyMessage(guest)}
                            className="p-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] hover:border-[#B89047] text-xs transition-colors cursor-pointer"
                            title="Salin Seluruh Teks Undangan"
                          >
                            {isMsgCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5 text-[#B89047]" />}
                          </button>

                          {/* Delete guest */}
                          <button
                            onClick={() => onDeleteGuest(guest.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Hapus Tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
