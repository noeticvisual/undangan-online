import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Link,
  Calendar,
  Lock,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Palette,
  LayoutTemplate,
  Image as ImageIcon,
} from 'lucide-react';
import { InvitationTemplateId, ColorThemeKey } from '../types/wedding';
import { TEMPLATE_LIST } from '../data/templateThemes';
import { projectManager } from '../services/projectManager';
import { formatImageUrl, isGoogleDriveUrl } from '../utils/googleDrive';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newSlug: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [groomName, setGroomName] = useState('');
  const [groomNick, setGroomNick] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideNick, setBrideNick] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [weddingDate, setWeddingDate] = useState('2026-11-20');
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplateId>('javanese-royal');
  const [colorTheme, setColorTheme] = useState<ColorThemeKey>('gold');
  const [clientPasscode, setClientPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [openingCoverPhotoUrl, setOpeningCoverPhotoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-generate slug and passcode when nicknames change
  useEffect(() => {
    if (!isSlugManual && (groomNick || brideNick)) {
      const generated = projectManager.generateSlug(`${groomNick} ${brideNick}`);
      setSlug(generated);
    }
  }, [groomNick, brideNick, isSlugManual]);

  useEffect(() => {
    if (groomNick || brideNick) {
      const cleanGroom = groomNick.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanBride = brideNick.toLowerCase().replace(/[^a-z0-9]/g, '');
      setClientPasscode(`${cleanGroom}${cleanBride}2026`);
    }
  }, [groomNick, brideNick]);

  if (!isOpen) return null;

  const isSlugValid = slug.length >= 3;
  const isSlugFree = isSlugValid && projectManager.isSlugAvailable(slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!groomNick.trim() || !brideNick.trim()) {
      setErrorMsg('Mohon isi nama panggilan mempelai pria dan wanita.');
      return;
    }

    if (!slug.trim() || !isSlugFree) {
      setErrorMsg('Slug link URL tidak valid atau sudah digunakan oleh klien lain.');
      return;
    }

    if (!clientPasscode.trim()) {
      setErrorMsg('Mohon isi kode sandi akses untuk portal klien.');
      return;
    }

    try {
      const newProj = projectManager.createProject({
        title: `Pernikahan ${groomNick.trim()} & ${brideNick.trim()}`,
        slug: slug.trim(),
        templateId: selectedTemplate,
        groomName: groomName.trim() || groomNick.trim(),
        groomNick: groomNick.trim(),
        brideName: brideName.trim() || brideNick.trim(),
        brideNick: brideNick.trim(),
        weddingDateISO: `${weddingDate}T08:00:00+07:00`,
        clientPasscode: clientPasscode.trim(),
        colorTheme: colorTheme,
        openingCoverPhotoUrl: openingCoverPhotoUrl.trim(),
      });

      onProjectCreated(newProj.slug);
      onClose();
    } catch {
      setErrorMsg('Gagal membuat projek baru. Silakan coba lagi.');
    }
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://undangan.domain';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl p-6 sm:p-7 text-xs my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DFD3] dark:border-[#2C3833]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B89047] block mb-1">
              Manajemen Multi-Klien Niskala
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#B89047]" />
              Tambah Projek Undangan Klien Baru
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Mempelai */}
          <div className="bg-white dark:bg-[#141A17] p-4 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] space-y-3">
            <h3 className="font-semibold text-xs text-[#B89047] uppercase tracking-wider">
              1. Identitas Pasangan Mempelai
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2]">
                  Panggilan Pria <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Dimas"
                  value={groomNick}
                  onChange={(e) => setGroomNick(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2]">
                  Nama Lengkap &amp; Gelar Pria
                </label>
                <input
                  type="text"
                  placeholder="Misal: Dimas Aditya, S.Kom."
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2]">
                  Panggilan Wanita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Anita"
                  value={brideNick}
                  onChange={(e) => setBrideNick(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2]">
                  Nama Lengkap &amp; Gelar Wanita
                </label>
                <input
                  type="text"
                  placeholder="Misal: Anita Larasati, S.M."
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>
            </div>

            {/* Foto Sampul Pembuka (Cover Layar Tamu) */}
            <div className="pt-2 border-t border-[#E8DFD3] dark:border-[#2C3833]">
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B89047]" />
                  <span>Foto Sampul Pembuka Undangan (Cover Layar Tamu - Opsional)</span>
                </label>
                {isGoogleDriveUrl(openingCoverPhotoUrl) && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    ✓ Google Drive
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                {openingCoverPhotoUrl && (
                  <div className="w-9 h-11 rounded-md overflow-hidden border border-[#D9CEBF] dark:border-[#2F3D36] shrink-0 bg-slate-100">
                    <img
                      src={formatImageUrl(openingCoverPhotoUrl, '/src/assets/images/hero_wedding_couple_1790610979338.jpg')}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={openingCoverPhotoUrl}
                  onChange={(e) => setOpeningCoverPhotoUrl(e.target.value)}
                  placeholder="Tempel link Google Drive atau URL foto kedua mempelai..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2] font-mono text-[11px]"
                />
              </div>
              <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-1">
                Foto ini yang akan muncul di amplop pertama saat tamu membuka link. Bisa juga diubah nanti oleh klien atau admin.
              </p>
            </div>
          </div>

          {/* Section: URL Slug & Isolasi Data */}
          <div className="bg-white dark:bg-[#141A17] p-4 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#B89047] uppercase tracking-wider flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />
                2. Tautan Unik Projek Klien (Tanpa Tabrakan)
              </h3>
              {slug && (
                <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                  isSlugFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'
                }`}>
                  {isSlugFree ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {isSlugFree ? 'Link Tersedia' : 'Sudah Dipakai Klien Lain'}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#8C7A6B] bg-[#EFE8DD] dark:bg-[#202925] px-2.5 py-2 rounded-l-xl border border-r-0 border-[#D9CEBF] dark:border-[#2F3D36] shrink-0">
                  {originUrl}/?u=
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(projectManager.generateSlug(e.target.value));
                    setIsSlugManual(true);
                  }}
                  placeholder="dimas-anita"
                  className="w-full px-3 py-2 rounded-r-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] font-mono text-xs text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>
              <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-1.5">
                *Setiap klien memiliki tautan unik sendiri. Daftar tamu, RSVP, dan sandi akan 100% terisolasi tanpa tercampur klien lain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B89047]" />
                  Tanggal Acara Utama
                </label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#B89047]" />
                  Kode Sandi Portal Klien Ini
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    value={clientPasscode}
                    onChange={(e) => setClientPasscode(e.target.value)}
                    placeholder="dimasanita2026"
                    className="w-full pl-3 pr-9 py-2 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] font-mono text-xs text-[#25201C] dark:text-[#FAF7F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Template Visual Desain */}
          <div className="bg-white dark:bg-[#141A17] p-4 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] space-y-3">
            <h3 className="font-semibold text-xs text-[#B89047] uppercase tracking-wider flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5" />
              3. Pilih Template Tampilan Desain Undangan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {TEMPLATE_LIST.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    type="button"
                    key={tpl.id}
                    onClick={() => {
                      setSelectedTemplate(tpl.id);
                      if (tpl.id === 'islamic-emerald') setColorTheme('emerald');
                      else if (tpl.id === 'modern-minimalist') setColorTheme('slate');
                      else if (tpl.id === 'rustic-botanical') setColorTheme('emerald');
                      else setColorTheme('gold');
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[#B89047] bg-[#B89047]/10 dark:bg-[#B89047]/15 ring-2 ring-[#B89047]/30 shadow-xs'
                        : 'border-[#E2D5C3] dark:border-[#2C3833] hover:border-[#B89047]/60 bg-[#FAF7F2]/60 dark:bg-[#1A221F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-[#8C7A6B] dark:text-[#A89E94]">
                          {tpl.badge}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#B89047] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
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

                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#E8DFD3]/60 dark:border-[#2C3833]/60">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: tpl.accentColor }}
                      />
                      <span className="text-[9px] text-[#8C7A6B] dark:text-[#A89E94] truncate">
                        {tpl.tagline}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Color Accent Picker */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-[#25201C] dark:text-[#FAF7F2] flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#B89047]" />
                Sentuhan Warna Aksen:
              </span>
              {(['gold', 'emerald', 'rose', 'slate'] as ColorThemeKey[]).map((thm) => (
                <button
                  type="button"
                  key={thm}
                  onClick={() => setColorTheme(thm)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium capitalize cursor-pointer transition-all ${
                    colorTheme === thm
                      ? 'border-[#B89047] bg-[#B89047] text-white'
                      : 'border-[#D9CEBF] dark:border-[#2F3D36] text-[#736458] dark:text-[#A79D93]'
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E8DFD3] dark:border-[#2C3833]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isSlugFree}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Projek &amp; Buka Ruang Kerja</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
