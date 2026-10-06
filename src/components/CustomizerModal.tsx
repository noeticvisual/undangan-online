import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Save, Download, Server, Globe, Check, Image, Sparkles, Film, LayoutGrid, SlidersHorizontal, ZoomIn, ZoomOut, Crop, Users, Zap } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { formatImageUrl, isGoogleDriveUrl } from '../utils/googleDrive';

interface CustomizerModalProps {
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: WeddingConfig) => void;
  onResetDefault: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'couple' | 'photos' | 'events' | 'gifts' | 'hosting'>('couple');
  const [formData, setFormData] = useState<WeddingConfig>(config);
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wedding-config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EADFCF] dark:border-[#28352F] mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#B89047]" />
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
                Pengaturan Kustomisasi Undangan
              </h3>
              <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94]">
                Sesuaikan nama pasangan, tanggal, lokasi, rekening, dan panduan hosting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Segmented control) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFE8DD] dark:bg-[#232F2A] rounded-xl mb-6 shrink-0 overflow-x-auto">
          {[
            { id: 'couple', label: '1. Pasangan' },
            { id: 'photos', label: '2. Skala & Rasio Foto' },
            { id: 'events', label: '3. Waktu & Lokasi' },
            { id: 'gifts', label: '4. Rekening & Hadiah' },
            { id: 'hosting', label: '5. Domain & Hosting' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#151C19] text-[#25201C] dark:text-[#FAF7F2] shadow-xs font-semibold'
                  : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5 text-xs">
          
          {/* TAB 1: COUPLE & DATE */}
          {activeTab === 'couple' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                    Nama Lengkap Mempelai Pria
                  </label>
                  <input
                    type="text"
                    value={formData.groom.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groom: { ...formData.groom, fullName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                    Nama Panggilan Pria
                  </label>
                  <input
                    type="text"
                    value={formData.groom.nickName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groom: { ...formData.groom, nickName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                    Nama Lengkap Mempelai Wanita
                  </label>
                  <input
                    type="text"
                    value={formData.bride.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bride: { ...formData.bride, fullName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                    Nama Panggilan Wanita
                  </label>
                  <input
                    type="text"
                    value={formData.bride.nickName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bride: { ...formData.bride, nickName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                  />
                </div>
              </div>

              {/* Photo URLs with Google Drive Support */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <span className="font-semibold text-[#B89047] flex items-center gap-1.5 text-xs">
                  <Image className="w-3.5 h-3.5" />
                  Pengaturan Foto (Mendukung Tautan Google Drive)
                </span>

                {/* Opening Cover Envelope Photo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#4A3F36] dark:text-[#D1C3B3]">
                      Foto Sampul Pembuka Undangan (Cover Layar Tamu)
                    </label>
                    {isGoogleDriveUrl(formData.openingCoverPhotoUrl || '') && (
                      <span className="text-[10px] text-emerald-600 font-medium">✓ Google Drive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-12 rounded-lg overflow-hidden border border-[#D9CEBF] bg-slate-100 shrink-0">
                      <img
                        src={formatImageUrl(
                          formData.openingCoverPhotoUrl || formData.heroImageUrl || formData.gallery[0]?.url,
                          '/src/assets/images/hero_wedding_couple_1790610979338.jpg'
                        )}
                        alt="Cover preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.openingCoverPhotoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, openingCoverPhotoUrl: e.target.value })}
                      placeholder="Tempel link Google Drive atau URL foto sampul..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Hero Background */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#4A3F36] dark:text-[#D1C3B3]">
                      Foto Latar Belakang Utama (Hero Background)
                    </label>
                    {isGoogleDriveUrl(formData.heroImageUrl || '') && (
                      <span className="text-[10px] text-emerald-600 font-medium">✓ Google Drive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D9CEBF] bg-slate-100 shrink-0">
                      <img
                        src={formatImageUrl(formData.heroImageUrl || formData.gallery[0]?.url, '/src/assets/images/hero_wedding_couple_1790610979338.jpg')}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.heroImageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                      placeholder="Tempel link Google Drive atau URL foto..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Groom Photo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#4A3F36] dark:text-[#D1C3B3]">
                      Foto Mempelai Pria ({formData.groom.nickName})
                    </label>
                    {isGoogleDriveUrl(formData.groom.photoUrl) && (
                      <span className="text-[10px] text-emerald-600 font-medium">✓ Google Drive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D9CEBF] bg-slate-100 shrink-0">
                      <img
                        src={formatImageUrl(formData.groom.photoUrl, '/src/assets/images/groom_portrait_1790611004426.jpg')}
                        alt="Groom preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.groom.photoUrl}
                      onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, photoUrl: e.target.value } })}
                      placeholder="Tempel link Google Drive..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Bride Photo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#4A3F36] dark:text-[#D1C3B3]">
                      Foto Mempelai Wanita ({formData.bride.nickName})
                    </label>
                    {isGoogleDriveUrl(formData.bride.photoUrl) && (
                      <span className="text-[10px] text-emerald-600 font-medium">✓ Google Drive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D9CEBF] bg-slate-100 shrink-0">
                      <img
                        src={formatImageUrl(formData.bride.photoUrl, '/src/assets/images/bride_portrait_1790611016646.jpg')}
                        alt="Bride preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.bride.photoUrl}
                      onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, photoUrl: e.target.value } })}
                      placeholder="Tempel link Google Drive..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] font-mono text-[11px]"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94]">
                  💡 <strong>Tips:</strong> Pastikan izin file Google Drive Anda telah diatur ke <em>"Siapa saja yang memiliki link" (Pelihat)</em>.
                </p>
              </div>

              <div>
                <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                  Tanggal &amp; Waktu Acara ISO (Format: YYYY-MM-DDTHH:mm:ss+07:00)
                </label>
                <input
                  type="text"
                  value={formData.eventDateISO}
                  onChange={(e) => setFormData({ ...formData, eventDateISO: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                  Kutipan Doa / Ayat Suci
                </label>
                <textarea
                  rows={2}
                  value={formData.quote.text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quote: { ...formData.quote, text: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2]"
                />
              </div>
            </div>
          )}

          {/* TAB: PHOTO SCALE, RATIO & ALBUM ANIMATION */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              {/* SECTION 1: FOTO SAMPUL PEMBUKA */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#C5A059]/40 bg-[#FAF7F2] dark:bg-[#141A17] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-[#B89047]" />
                    <h4 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                      1. Foto Sampul Pembuka Undangan (Cover Layar Tamu)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B89047]/15 text-[#B89047] font-semibold">
                    Cover Amplop
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Live Mini Preview */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-[#D9CEBF] dark:border-[#2F3D36]">
                    <div
                      className={`overflow-hidden border-2 border-[#C5A059] shadow-md transition-all duration-300 ${
                        formData.openingCoverRatio === '1:1'
                          ? 'w-24 h-24 rounded-2xl'
                          : formData.openingCoverRatio === '3:4'
                          ? 'w-20 h-28 rounded-2xl'
                          : formData.openingCoverRatio === '4:5'
                          ? 'w-20 h-26 rounded-2xl'
                          : formData.openingCoverRatio === '2:3'
                          ? 'w-18 h-28 rounded-2xl'
                          : formData.openingCoverRatio === 'circle'
                          ? 'w-24 h-24 rounded-full'
                          : 'w-20 h-26 rounded-t-full rounded-b-xl'
                      }`}
                    >
                      <img
                        src={formatImageUrl(
                          formData.openingCoverPhotoUrl || formData.heroImageUrl || formData.gallery[0]?.url,
                          '/src/assets/images/hero_wedding_couple_1790610979338.jpg'
                        )}
                        alt="Preview Cover"
                        style={{ transform: `scale(${(formData.openingCoverScale || 100) / 100})` }}
                        className="w-full h-full object-cover object-top transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-2 font-medium">
                      Pratinjau ({formData.openingCoverRatio || 'arched'}) · {formData.openingCoverScale || 100}%
                    </span>
                  </div>

                  {/* Ratio & Scale Controls */}
                  <div className="md:col-span-2 space-y-3">
                    {/* Ratio selection */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                        <Crop className="w-3 h-3 text-[#B89047]" />
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
                            className={`px-2 py-1.5 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
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

                    {/* Scale slider */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                        <span className="flex items-center gap-1.5">
                          <ZoomIn className="w-3 h-3 text-[#B89047]" />
                          Skala Foto (Zoom):
                        </span>
                        <div className="flex items-center gap-2">
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

              {/* SECTION 2: FOTO KEDUA MEMPELAI */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#C5A059]/40 bg-[#FAF7F2] dark:bg-[#141A17] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#B89047]" />
                    <h4 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                      2. Foto Kedua Mempelai (Pria &amp; Wanita)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B89047]/15 text-[#B89047] font-semibold">
                    Halaman Mempelai
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Live Mini Preview Groom & Bride */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-[#D9CEBF] dark:border-[#2F3D36]">
                    <div className="flex items-center gap-2">
                      <div
                        className={`overflow-hidden border-2 border-[#C5A059] shadow-md transition-all duration-300 ${
                          formData.couplePhotoRatio === 'square'
                            ? 'w-16 h-16 rounded-xl'
                            : formData.couplePhotoRatio === 'portrait'
                            ? 'w-14 h-20 rounded-xl'
                            : formData.couplePhotoRatio === '4:5'
                            ? 'w-14 h-18 rounded-xl'
                            : formData.couplePhotoRatio === 'circle'
                            ? 'w-16 h-16 rounded-full'
                            : 'w-14 h-19 rounded-t-full rounded-b-lg'
                        }`}
                      >
                        <img
                          src={formatImageUrl(
                            formData.groom.photoUrl,
                            '/src/assets/images/groom_portrait_1790611004426.jpg'
                          )}
                          alt="Groom"
                          style={{ transform: `scale(${(formData.couplePhotoScale || 100) / 100})` }}
                          className="w-full h-full object-cover object-top transition-transform duration-300"
                        />
                      </div>
                      <div
                        className={`overflow-hidden border-2 border-[#C5A059] shadow-md transition-all duration-300 ${
                          formData.couplePhotoRatio === 'square'
                            ? 'w-16 h-16 rounded-xl'
                            : formData.couplePhotoRatio === 'portrait'
                            ? 'w-14 h-20 rounded-xl'
                            : formData.couplePhotoRatio === '4:5'
                            ? 'w-14 h-18 rounded-xl'
                            : formData.couplePhotoRatio === 'circle'
                            ? 'w-16 h-16 rounded-full'
                            : 'w-14 h-19 rounded-t-full rounded-b-lg'
                        }`}
                      >
                        <img
                          src={formatImageUrl(
                            formData.bride.photoUrl,
                            '/src/assets/images/bride_portrait_1790611016646.jpg'
                          )}
                          alt="Bride"
                          style={{ transform: `scale(${(formData.couplePhotoScale || 100) / 100})` }}
                          className="w-full h-full object-cover object-top transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] mt-2 font-medium">
                      Pria &amp; Wanita ({formData.couplePhotoRatio || 'arched'}) · {formData.couplePhotoScale || 100}%
                    </span>
                  </div>

                  {/* Ratio & Scale Controls */}
                  <div className="md:col-span-2 space-y-3">
                    {/* Ratio selection */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                        <Crop className="w-3 h-3 text-[#B89047]" />
                        Rasio Bingkai Foto Mempelai:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {[
                          { key: 'arched', label: 'Lengkung Kubah' },
                          { key: 'portrait', label: 'Potret (3:4)' },
                          { key: '4:5', label: 'Potret (4:5)' },
                          { key: 'square', label: 'Kotak (1:1)' },
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

                    {/* Scale slider */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1">
                        <span className="flex items-center gap-1.5">
                          <ZoomIn className="w-3 h-3 text-[#B89047]" />
                          Skala Foto Mempelai (Zoom):
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#851C28] dark:text-[#E8808D] font-mono font-bold">
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
              </div>

              {/* SECTION 3: ALBUM GALERI FOTO */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#C5A059]/40 bg-[#FAF7F2] dark:bg-[#141A17] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2C3833]">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#B89047]" />
                    <h4 className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                      3. Album Galeri Foto (Ukuran, Rasio &amp; Animasi Bergerak)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B89047]/15 text-[#B89047] font-semibold">
                    Galeri Foto
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Animasi Bergerak Reel Kanan-ke-Kiri Switcher */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-xs text-[#851C28] dark:text-[#E8808D] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        Animasi Bergerak Kanan ke Kiri (Fade Masuk &amp; Fade Keluar)
                      </span>
                      <p className="text-[11px] text-[#6C5E53] dark:text-[#B4AAA0] mt-0.5">
                        Foto bergerak halus secara horizontal dengan efek fade-in di sisi kanan dan fade-out di sisi kiri.
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Ukuran Foto di Album */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3 h-3 text-[#B89047]" />
                        Ukuran Foto di Album:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { key: 'small', label: 'Kecil', desc: 'Kompak' },
                          { key: 'medium', label: 'Sedang', desc: 'Standar' },
                          { key: 'large', label: 'Besar', desc: 'Luas' },
                        ].map((sz) => (
                          <button
                            key={sz.key}
                            type="button"
                            onClick={() => setFormData({ ...formData, galleryPhotoSize: sz.key as any })}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
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
                      <label className="block text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                        <Crop className="w-3 h-3 text-[#B89047]" />
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

                    {/* Kecepatan Animasi Reel */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-[#B89047]" />
                        Kecepatan Animasi Bergerak:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { key: 'slow', label: 'Lambat', desc: '48 detik' },
                          { key: 'normal', label: 'Sedang', desc: '30 detik' },
                          { key: 'fast', label: 'Cepat', desc: '18 detik' },
                        ].map((sp) => (
                          <button
                            key={sp.key}
                            type="button"
                            onClick={() => setFormData({ ...formData, galleryAnimationSpeed: sp.key as any })}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
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

                  {/* Mini Preview of Moving Gallery Reel */}
                  <div className="pt-3 border-t border-[#E8DFD3] dark:border-[#2C3833]">
                    <div className="flex items-center justify-between mb-2 text-[11px]">
                      <span className="font-semibold text-[#25201C] dark:text-[#FAF7F2]">Pratinjau Animasi Album:</span>
                      <span className="text-[#8C7A6B] dark:text-[#A89E94]">
                        {formData.galleryPhotoSize || 'medium'} · {formData.galleryRatio || '4:5'} · {formData.galleryAnimationEnabled !== false ? `Reel (${formData.galleryAnimationSpeed || 'normal'})` : 'Grid'}
                      </span>
                    </div>
                    <div className="relative w-full overflow-hidden rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-black/5 dark:bg-black/20 p-2">
                      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white dark:from-[#1A221F] to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white dark:from-[#1A221F] to-transparent z-10 pointer-events-none" />
                      {formData.galleryAnimationEnabled !== false ? (
                        <div
                          className="animate-marquee-rtl flex items-center gap-2"
                          style={{
                            animationDuration: formData.galleryAnimationSpeed === 'slow' ? '48s' : formData.galleryAnimationSpeed === 'fast' ? '18s' : '30s',
                          }}
                        >
                          {[...formData.gallery, ...formData.gallery].map((photo, i) => {
                            const hClass = formData.galleryPhotoSize === 'small' ? 'h-20' : formData.galleryPhotoSize === 'large' ? 'h-32' : 'h-24';
                            const rClass = formData.galleryRatio === 'square' ? 'aspect-square' : formData.galleryRatio === '16:9' ? 'aspect-video' : formData.galleryRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[4/5]';
                            return (
                              <div key={i} className={`${hClass} ${rClass} rounded-lg overflow-hidden shrink-0 border border-[#C5A059]/40 bg-black/10`}>
                                <img src={formatImageUrl(photo.url)} alt={photo.caption} className="w-full h-full object-cover" />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-1.5">
                          {formData.gallery.slice(0, 4).map((photo, i) => {
                            const rClass = formData.galleryRatio === 'square' ? 'aspect-square' : formData.galleryRatio === '16:9' ? 'aspect-video' : formData.galleryRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[4/5]';
                            return (
                              <div key={i} className={`${rClass} rounded-lg overflow-hidden border border-[#C5A059]/40 bg-black/10`}>
                                <img src={formatImageUrl(photo.url)} alt={photo.caption} className="w-full h-full object-cover" />
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
          )}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {formData.events.map((ev, idx) => (
                <div key={ev.id} className="p-4 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#141A17]">
                  <h4 className="font-semibold text-sm text-[#B89047] mb-2">{ev.title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mb-0.5">Tanggal Terbaca</label>
                      <input
                        type="text"
                        value={ev.dateFormatted}
                        onChange={(e) => {
                          const updated = [...formData.events];
                          updated[idx] = { ...updated[idx], dateFormatted: e.target.value };
                          setFormData({ ...formData, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mb-0.5">Nama Tempat/Gedung</label>
                      <input
                        type="text"
                        value={ev.venueName}
                        onChange={(e) => {
                          const updated = [...formData.events];
                          updated[idx] = { ...updated[idx], venueName: e.target.value };
                          setFormData({ ...formData, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mb-0.5">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={ev.venueAddress}
                      onChange={(e) => {
                        const updated = [...formData.events];
                        updated[idx] = { ...updated[idx], venueAddress: e.target.value };
                        setFormData({ ...formData, events: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BANK ACCOUNTS & GIFTS */}
          {activeTab === 'gifts' && (
            <div className="space-y-4">
              <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94]">
                Ubah informasi rekening bank tujuan amplop digital.
              </p>
              {formData.bankAccounts.map((acc, idx) => (
                <div key={acc.id} className="p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#141A17] grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mb-0.5">Nama Bank</label>
                    <input
                      type="text"
                      value={acc.bankName}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx] = { ...updated[idx], bankName: e.target.value };
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="w-full px-2 py-1.5 rounded-md border text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mb-0.5">Nomor Rekening</label>
                    <input
                      type="text"
                      value={acc.accountNumber}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx] = { ...updated[idx], accountNumber: e.target.value };
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="w-full px-2 py-1.5 rounded-md border text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mb-0.5">Nama Pemilik</label>
                    <input
                      type="text"
                      value={acc.accountHolder}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx] = { ...updated[idx], accountHolder: e.target.value };
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="w-full px-2 py-1.5 rounded-md border text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: DOMAIN & HOSTING RECOMMENDATIONS */}
          {activeTab === 'hosting' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[#785E2F] dark:text-[#F3DEB0]">
                <h4 className="font-semibold text-sm flex items-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-[#B89047]" />
                  Rekomendasi Domain &amp; Hosting Undangan Online
                </h4>
                <p className="text-xs leading-relaxed">
                  Panduan praktis untuk mempublikasikan website undangan ini ke internet dengan domain pernikahan kustom (contoh: <code>aryamaya.com</code> atau <code>arya-maya.my.id</code>).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#141A17]">
                  <strong className="block text-[#25201C] dark:text-[#FAF7F2] font-semibold mb-1">
                    1. Rekomendasi Hosting (Gratis &amp; Cepat)
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-[#6C5E53] dark:text-[#B4AAA0]">
                    <li><strong>Vercel</strong>: Cukup import repository GitHub, auto-deploy dalam 1 menit dengan HTTPS gratis.</li>
                    <li><strong>Cloudflare Pages</strong>: CDN global super cepat tanpa batasan bandwidth.</li>
                    <li><strong>Netlify</strong>: Dukungan form dan preview branch instan.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#141A17]">
                  <strong className="block text-[#25201C] dark:text-[#FAF7F2] font-semibold mb-1">
                    2. Saran Domain Kustom Pernikahan
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-[#6C5E53] dark:text-[#B4AAA0]">
                    <li><strong>.my.id / .id</strong>: Terjangkau (mulai Rp12.000/tahun di Niagahoster, Domainesia, atau Rumahweb).</li>
                    <li><strong>.love / .wedding</strong>: Ekstensi tematik romantis internasional.</li>
                    <li><strong>Format Nama</strong>: <code>namapria-namawanita.id</code> atau <code>theweddingof-aryamaya.com</code>.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E8DFD3] dark:border-[#2C3833] bg-[#FAF7F2] dark:bg-[#141A17]">
                <strong className="block text-[#25201C] dark:text-[#FAF7F2] font-semibold mb-1">
                  3. Langkah Pengaturan DNS Domain
                </strong>
                <p className="text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed text-[11px]">
                  Di registrar domain Anda, buat <code>CNAME record</code> untuk <code>@</code> atau <code>www</code> yang mengarah ke <code>cname.vercel-dns.com</code>. Sertifikat SSL otomatis aktif dalam hitungan menit.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#EADFCF] dark:border-[#28352F] mt-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7C6E61] dark:text-[#A89E94] hover:text-red-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7C6E61] dark:text-[#A89E94] hover:text-[#B89047] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6C5E53] dark:text-[#A89E94] hover:bg-[#EFE8DD] dark:hover:bg-[#232F2A] rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {saveToast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
