import React, { useState } from 'react';
import { X, QrCode, Download, Check, Sparkles, UserCheck } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface DigitalPassModalProps {
  config: WeddingConfig;
  guestName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  config,
  guestName,
  isOpen,
  onClose,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Generate deterministic pass code from guest name
  const passId = `WED-${Math.abs(
    (guestName || 'VIP').split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .slice(0, 6)}`;

  const handleDownloadTicket = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl p-6 sm:p-7 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pass Header */}
        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-[#B89047] font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kartu Akses Tamu Undangan</span>
        </div>

        <h3 className="font-serif-luxury text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2] mb-1">
          {config.groom.nickName} &amp; {config.bride.nickName}
        </h3>
        <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-5">
          {config.events[0]?.dateFormatted}
        </p>

        {/* QR Code Graphic Frame */}
        <div className="bg-white p-5 rounded-2xl shadow-inner border border-[#E2D6C5] inline-block mx-auto mb-4">
          <svg
            width="170"
            height="170"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            {/* Background */}
            <rect width="100" height="100" fill="white" />
            
            {/* 3 Corner Finder Targets */}
            <rect x="8" y="8" width="26" height="26" stroke="#1A2421" strokeWidth="4" fill="none" rx="3" />
            <rect x="14" y="14" width="14" height="14" fill="#1A2421" />

            <rect x="66" y="8" width="26" height="26" stroke="#1A2421" strokeWidth="4" fill="none" rx="3" />
            <rect x="72" y="14" width="14" height="14" fill="#1A2421" />

            <rect x="8" y="66" width="26" height="26" stroke="#1A2421" strokeWidth="4" fill="none" rx="3" />
            <rect x="14" y="72" width="14" height="14" fill="#1A2421" />

            {/* Pattern data pixels */}
            <rect x="42" y="12" width="8" height="8" fill="#B89047" />
            <rect x="52" y="12" width="6" height="6" fill="#1A2421" />
            <rect x="40" y="24" width="8" height="8" fill="#1A2421" />
            <rect x="50" y="24" width="8" height="8" fill="#B89047" />

            {/* Middle decorative heart logo in QR */}
            <rect x="40" y="40" width="20" height="20" fill="#FAF7F2" stroke="#B89047" strokeWidth="1.5" rx="4" />
            <path
              d="M50 54 C45 50 43 46 45 44 C47 42 49 43 50 45 C51 43 53 42 55 44 C57 46 55 50 50 54 Z"
              fill="#B89047"
            />

            {/* Bottom patterns */}
            <rect x="42" y="68" width="8" height="8" fill="#1A2421" />
            <rect x="54" y="68" width="6" height="6" fill="#B89047" />
            <rect x="68" y="42" width="8" height="8" fill="#1A2421" />
            <rect x="80" y="44" width="10" height="10" fill="#B89047" />
            <rect x="68" y="70" width="10" height="10" fill="#1A2421" />
            <rect x="82" y="70" width="8" height="8" fill="#1A2421" />
            <rect x="74" y="82" width="14" height="8" fill="#B89047" />
          </svg>
        </div>

        {/* Guest Metadata Card */}
        <div className="bg-[#EFE8DD] dark:bg-[#232F2A] rounded-xl p-3.5 mb-5 text-left text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">Nama Tamu:</span>
            <span className="font-mono text-[11px] text-[#B89047] font-semibold">{passId}</span>
          </div>
          <strong className="block text-sm text-[#25201C] dark:text-[#FAF7F2] font-semibold truncate">
            {guestName || 'Tamu Undangan Terhormat'}
          </strong>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#5C5046] dark:text-[#BFAF9E]">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tunjukkan QR ini pada meja penerima tamu acara</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadTicket}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Kartu Akses Siap Ditunjukkan</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Simpan Kartu QR Tamu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
