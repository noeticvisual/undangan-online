import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send, Globe } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface ShareModalProps {
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
  projectSlug?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ config, isOpen, onClose, projectSlug }) => {
  const [recipientName, setRecipientName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFullText, setCopiedFullText] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://niskala-wedding.com';
  const slugQuery = projectSlug ? `u=${encodeURIComponent(projectSlug)}` : '';
  const toQuery = recipientName.trim() ? `to=${encodeURIComponent(recipientName.trim())}` : '';
  const portalQuery = 'portal=guest';
  const queryString = [slugQuery, toQuery, portalQuery].filter(Boolean).join('&');
  const shareableUrl = `${origin}/?${queryString}`;

  const eventsText = config.events
    .map((ev, i) => {
      const title = ev.title || (i === 0 ? 'Akad Nikah' : 'Resepsi Pernikahan');
      return `📅 *${title}*
Hari/Tanggal: ${ev.dateFormatted}
Waktu: Pukul ${ev.startTime} - ${ev.endTime} ${ev.timezone}
Tempat: ${ev.venueName}
Alamat: ${ev.venueAddress}`;
    })
    .join('\n\n');

  const messageTemplate = `Kepada Yth.
${recipientName.trim() || 'Bapak/Ibu/Saudara/i'}

Assalamu’alaikum Warahmatullahi Wabarakatuh / Salam Sejahtera,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan memberikan doa restu pada pernikahan kami:

*${config.groom.fullName}* & *${config.bride.fullName}*

Rangkaian Acara:

${eventsText}

Informasi lengkap dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan digital kami:

${shareableUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih.
Wassalamu’alaikum Warahmatullahi Wabarakatuh

Salam hangat,
${config.groom.nickName} & ${config.bride.nickName} sekeluarga`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyFullText = () => {
    navigator.clipboard.writeText(messageTemplate);
    setCopiedFullText(true);
    setTimeout(() => setCopiedFullText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageTemplate)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(`Undangan Pernikahan ${config.groom.nickName} & ${config.bride.nickName}`)}`;
    window.open(tgUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-[#B89047]" />
          <h3 className="font-serif-luxury text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
            Bagikan Undangan
          </h3>
        </div>
        <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-6">
          Kirim undangan dengan tautan personalisasi sesuai nama tamu yang dituju.
        </p>

        {/* Input Target Guest Name */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#4A3F36] dark:text-[#D1C3B3] mb-1.5">
            Nama Tamu yang Dituju (Opsional)
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Contoh: dr. Bambang & Ibu"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
          />
        </div>

        {/* Generated Shareable Link */}
        <div className="p-3 bg-[#EFE8DD] dark:bg-[#232F2A] rounded-xl mb-5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Globe className="w-4 h-4 text-[#B89047] shrink-0" />
            <span className="font-mono text-[11px] text-[#4A3F36] dark:text-[#D1C3B3] truncate">
              {shareableUrl}
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-white dark:bg-[#151C19] border border-[#D9CEBF] dark:border-[#2F3D36] text-[#25201C] dark:text-white shrink-0 hover:border-[#B89047] transition-colors cursor-pointer"
            title="Salin Tautan Saja"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Action Buttons for Sharing */}
        <div className="space-y-2.5 mb-5">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim via WhatsApp</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Bagikan ke Telegram</span>
          </button>

          <button
            onClick={handleCopyFullText}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#1A221F] text-[#25201C] dark:text-[#FAF7F2] hover:border-[#B89047] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedFullText ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Format Pesan Lengkap Berhasil Disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#B89047]" />
                <span>Salin Seluruh Format Pesan &amp; Tautan</span>
              </>
            )}
          </button>
        </div>

        {/* Preview snippet */}
        <div className="p-3 bg-[#FAF7F2] dark:bg-[#141A17] rounded-xl border border-[#EBE1D4] dark:border-[#28352F] text-[11px] text-[#736458] dark:text-[#9EA8A3] max-h-32 overflow-y-auto whitespace-pre-wrap font-sans">
          {messageTemplate}
        </div>

      </div>
    </div>
  );
};
