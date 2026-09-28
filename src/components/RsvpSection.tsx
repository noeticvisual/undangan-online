import React, { useState } from 'react';
import { Send, CheckCircle2, XCircle, HelpCircle, MessageSquare, Users, Download, Copy, Check } from 'lucide-react';
import { RSVPRecord } from '../types/wedding';

interface RsvpSectionProps {
  initialGuestName?: string;
  rsvps: RSVPRecord[];
  onAddRsvp: (record: Omit<RSVPRecord, 'id' | 'createdAt'>) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  initialGuestName = '',
  rsvps,
  onAddRsvp,
}) => {
  const [formData, setFormData] = useState({
    guestName: initialGuestName,
    attendance: 'hadir' as 'hadir' | 'tidak_hadir' | 'ragu',
    guestCount: 2,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterAttendance, setFilterAttendance] = useState<'all' | 'hadir' | 'tidak_hadir'>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.guestName.trim()) {
      setErrorMessage('Mohon cantumkan nama lengkap Anda.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Mohon tuliskan sepatah doa atau ucapan selamat.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onAddRsvp({
        guestName: formData.guestName.trim(),
        attendance: formData.attendance,
        guestCount: formData.attendance === 'tidak_hadir' ? 0 : formData.guestCount,
        message: formData.message.trim(),
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData((prev) => ({ ...prev, message: '' }));

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 400);
  };

  // Calculate statistics
  const totalHadir = rsvps.filter((r) => r.attendance === 'hadir').reduce((sum, r) => sum + r.guestCount, 0);
  const totalRespon = rsvps.length;
  const countTidakHadir = rsvps.filter((r) => r.attendance === 'tidak_hadir').length;

  const filteredRsvps = rsvps.filter((item) => {
    if (filterAttendance === 'all') return true;
    return item.attendance === filterAttendance;
  });

  const handleExportCsv = () => {
    const headers = ['ID,Nama Tamu,Kehadiran,Jumlah Tamu,Ucapan,Waktu Konfirmasi'];
    const rows = rsvps.map(
      (r) =>
        `"${r.id}","${r.guestName}","${r.attendance}","${r.guestCount}","${r.message.replace(/"/g, '""')}","${r.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RSVP_Wedding_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const text = `Ringkasan RSVP Pernikahan:\nTotal Respon: ${totalRespon}\nTamu Hadir: ${totalHadir} Orang\nBerhalangan: ${countTidakHadir}\nData diunduh pada: ${new Date().toLocaleString('id-ID')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <section id="rsvp" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2">
          Konfirmasi Kehadiran
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
          Buku Tamu &amp; RSVP
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
          Kirimkan konfirmasi kehadiran serta doa restu terbaik Anda untuk menemani awal lembaran baru kami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: RSVP Form (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-8 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs h-fit">
          <h3 className="font-serif-luxury text-2xl font-semibold text-[#25201C] dark:text-[#FAF7F2] mb-1">
            Formulir RSVP
          </h3>
          <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-6">
            Mohon isi formulir berikut sebelum tanggal 18 Oktober 2026.
          </p>

          {submitSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Terima kasih banyak! Konfirmasi dan doa restu Anda telah berhasil tersimpan.</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="Contoh: dr. Bambang Hermanto & Keluarga"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
            </div>

            {/* Attendance Choice */}
            <div>
              <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-2">
                Konfirmasi Kehadiran <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hadir', label: 'Pasti Hadir', icon: CheckCircle2 },
                  { id: 'tidak_hadir', label: 'Berhalangan', icon: XCircle },
                  { id: 'ragu', label: 'Masih Ragu', icon: HelpCircle },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.attendance === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          attendance: opt.id as 'hadir' | 'tidak_hadir' | 'ragu',
                        })
                      }
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#B89047] bg-[#B89047]/10 text-[#B89047] dark:text-[#E6CA65] shadow-xs'
                          : 'border-[#E2D5C3] dark:border-[#2C3833] text-[#736458] dark:text-[#A79D93] hover:border-[#B89047]/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-[11px] text-center leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Count (if attending) */}
            {formData.attendance !== 'tidak_hadir' && (
              <div>
                <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5">
                  Jumlah Orang yang Akan Hadir
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                  <option value={5}>5 Orang</option>
                </select>
              </div>
            )}

            {/* Message / Wishes */}
            <div>
              <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5">
                Ucapan Doa &amp; Harapan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#B89047] via-[#C9A050] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Konfirmasi & Doa'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Wishing Board / Buku Tamu (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col">
          
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] text-center">
              <span className="block text-lg sm:text-2xl font-serif-luxury font-bold text-[#25201C] dark:text-[#FAF7F2] tabular-nums">
                {totalRespon}
              </span>
              <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">Total Respon</span>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] text-center">
              <span className="block text-lg sm:text-2xl font-serif-luxury font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {totalHadir}
              </span>
              <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">Tamu Hadir</span>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] text-center">
              <span className="block text-lg sm:text-2xl font-serif-luxury font-bold text-[#8C7A6B] dark:text-[#A89E94] tabular-nums">
                {countTidakHadir}
              </span>
              <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">Berhalangan</span>
            </div>
          </div>

          {/* Guestbook Card */}
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-8 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs flex-1 flex flex-col">
            
            {/* Header with interactive filter tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EADFCF] dark:border-[#28352F]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#B89047]" />
                <h3 className="font-serif-luxury text-xl font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                  Untaian Doa &amp; Harapan ({filteredRsvps.length})
                </h3>
              </div>

              {/* Filter Tabs (Interactive buttons) */}
              <div className="flex items-center gap-1 p-1 bg-[#EFE8DD] dark:bg-[#232F2A] rounded-lg">
                <button
                  type="button"
                  onClick={() => setFilterAttendance('all')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    filterAttendance === 'all'
                      ? 'bg-white dark:bg-[#151C19] text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
                      : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C]'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFilterAttendance('hadir')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    filterAttendance === 'hadir'
                      ? 'bg-white dark:bg-[#151C19] text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
                      : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C]'
                  }`}
                >
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setFilterAttendance('tidak_hadir')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    filterAttendance === 'tidak_hadir'
                      ? 'bg-white dark:bg-[#151C19] text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
                      : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C]'
                  }`}
                >
                  Berhalangan
                </button>
              </div>
            </div>

            {/* Wishes Scrollable List */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {filteredRsvps.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#8C7A6B] dark:text-[#A89E94]">
                  Belum ada ucapan pada kategori ini. Jadilah yang pertama memberikan doa restu!
                </div>
              ) : (
                filteredRsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#141B18] border border-[#EBE1D4] dark:border-[#28352F] hover:border-[#B89047]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* Avatar initials */}
                        <div className="w-8 h-8 rounded-full bg-[#EAD7B2] dark:bg-[#2C3833] text-[#7A5B22] dark:text-[#E2C799] flex items-center justify-center text-xs font-semibold">
                          {rsvp.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                            {rsvp.guestName}
                          </h4>
                          {/* Zero-Pill unboxed status metadata */}
                          <div className="flex items-center gap-2 text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">
                            {rsvp.attendance === 'hadir' ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Hadir ({rsvp.guestCount} Tamu)
                              </span>
                            ) : rsvp.attendance === 'tidak_hadir' ? (
                              <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Berhalangan
                              </span>
                            ) : (
                              <span className="text-[#8C7A6B] dark:text-[#A89E94] flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" />
                                Masih Ragu
                              </span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{new Date(rsvp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4E4238] dark:text-[#D1C3B3] leading-relaxed pl-10 whitespace-pre-line">
                      "{rsvp.message}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Organizer Export Bar */}
            <div className="mt-6 pt-4 border-t border-[#EADFCF] dark:border-[#28352F] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#8C7A6B] dark:text-[#A89E94] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#B89047]" />
                Fitur Penyelenggara:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] text-[#4A3F36] dark:text-[#D1C3B3] hover:border-[#B89047] transition-colors cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#B89047]" />}
                  <span>{copiedSummary ? 'Tersalin' : 'Salin Rekap'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFE8DD] dark:bg-[#232F2A] text-[#25201C] dark:text-[#FAF7F2] hover:bg-[#E5DCCF] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#B89047]" />
                  <span>Unduh CSV</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
