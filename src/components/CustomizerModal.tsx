import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Save, Download, Server, Globe, Check } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

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
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'gifts' | 'hosting'>('couple');
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
            { id: 'events', label: '2. Waktu & Lokasi' },
            { id: 'gifts', label: '3. Rekening & Hadiah' },
            { id: 'hosting', label: '4. Domain & Hosting' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#151C19] text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
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

          {/* TAB 2: EVENTS & VENUES */}
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
