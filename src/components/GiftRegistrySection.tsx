import React, { useState } from 'react';
import { Gift, CreditCard, Copy, Check, QrCode, MapPin, Package } from 'lucide-react';
import { WeddingConfig, BankAccount } from '../types/wedding';

interface GiftRegistrySectionProps {
  config: WeddingConfig;
}

export const GiftRegistrySection: React.FC<GiftRegistrySectionProps> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);

  const handleCopyAccount = (account: BankAccount) => {
    navigator.clipboard.writeText(account.accountNumber);
    setCopiedId(account.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAddress = () => {
    const addr = `${config.physicalGift.recipientName}\n${config.physicalGift.fullAddress}, ${config.physicalGift.city} ${config.physicalGift.postalCode}\nTelp: ${config.physicalGift.phoneNumber}`;
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section id="hadiah" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4EFEA] dark:bg-[#151C19] transition-colors">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2">
            Tanda Kasih
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
            Amplop Digital &amp; Kado Pernikahan
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
            Doa restu Anda merupakan karunia yang paling berharga bagi kami. Namun jika memberi adalah ungkapan kasih, fitur berikut disediakan untuk mempermudah niat tulus Anda.
          </p>
        </div>

        {/* Bank Transfer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {config.bankAccounts.map((account) => {
            const isCopied = copiedId === account.id;

            return (
              <div
                key={account.id}
                className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-7 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                {/* Chip decoration */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#B89047]" />
                    <span className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                      {account.bankName}
                    </span>
                  </div>
                  {/* Subtle ATM Card Chip aesthetic */}
                  <div className="w-10 h-7 rounded-sm bg-[#D5C2A5]/40 border border-[#B89047]/40 flex items-center justify-center">
                    <div className="w-6 h-4 border border-[#B89047]/50 rounded-xs" />
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] dark:text-[#A89E94] block mb-1">
                    Nomor Rekening
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#25201C] dark:text-[#FAF7F2] tabular-nums">
                    {account.accountNumber}
                  </div>
                  <span className="text-xs text-[#6B5C50] dark:text-[#BFAF9E] block mt-1 font-medium">
                    a.n. {account.accountHolder}
                  </span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyAccount(account)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#EFE8DD] dark:bg-[#232F2A] text-[#25201C] dark:text-[#FAF7F2] hover:bg-[#E5DBCF]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Nomor Rekening Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#B89047]" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* QRIS & Physical Gift Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* QRIS Fast Pay Card */}
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-7 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <QrCode className="w-5 h-5 text-[#B89047]" />
                <h3 className="text-sm font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                  QRIS Pembayaran Digital
                </h3>
              </div>
              <p className="text-xs text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed mb-6">
                Mendukung semua aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay) serta aplikasi m-Banking Indonesia.
              </p>
            </div>

            <button
              onClick={() => setShowQrisModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-[#FAF7F2] dark:bg-[#1A221F] border border-[#B89047] text-[#B89047] dark:text-[#E2C799] hover:bg-[#B89047]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Tampilkan Kode QRIS</span>
            </button>
          </div>

          {/* Physical Gift Delivery Card */}
          <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-7 border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Package className="w-5 h-5 text-[#B89047]" />
                <h3 className="text-sm font-semibold text-[#25201C] dark:text-[#FAF7F2]">
                  Kirim Kado Fisik
                </h3>
              </div>
              <p className="text-xs text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed mb-2">
                Penerima: <strong className="text-[#25201C] dark:text-[#FAF7F2]">{config.physicalGift.recipientName}</strong>
              </p>
              <p className="text-xs text-[#736458] dark:text-[#A49A8F] leading-relaxed mb-4">
                {config.physicalGift.fullAddress}, {config.physicalGift.city} {config.physicalGift.postalCode}
              </p>
            </div>

            <button
              onClick={handleCopyAddress}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copiedAddress
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#EFE8DD] dark:bg-[#232F2A] text-[#25201C] dark:text-[#FAF7F2] hover:bg-[#E5DBCF]'
              }`}
            >
              {copiedAddress ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Alamat Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-[#B89047]" />
                  <span>Salin Alamat Pengiriman</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* QRIS Modal */}
        {showQrisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl relative">
              <span className="text-xs uppercase tracking-widest text-[#B89047] font-semibold block mb-1">
                QRIS Nasional
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2] mb-4">
                {config.groom.nickName} &amp; {config.bride.nickName}
              </h3>

              {/* QR Code Graphic */}
              <div className="bg-white p-4 rounded-xl shadow-xs inline-block mx-auto mb-4 border border-slate-200">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  {/* Styled clean QR pattern representation */}
                  <rect width="100" height="100" fill="white" />
                  {/* Top-left marker */}
                  <rect x="10" y="10" width="24" height="24" stroke="#1A2421" strokeWidth="4" fill="none" />
                  <rect x="16" y="16" width="12" height="12" fill="#1A2421" />
                  {/* Top-right marker */}
                  <rect x="66" y="10" width="24" height="24" stroke="#1A2421" strokeWidth="4" fill="none" />
                  <rect x="72" y="16" width="12" height="12" fill="#1A2421" />
                  {/* Bottom-left marker */}
                  <rect x="10" y="66" width="24" height="24" stroke="#1A2421" strokeWidth="4" fill="none" />
                  <rect x="16" y="72" width="12" height="12" fill="#1A2421" />
                  {/* Data dots pattern */}
                  <rect x="42" y="14" width="8" height="8" fill="#B89047" />
                  <rect x="42" y="26" width="8" height="8" fill="#1A2421" />
                  <rect x="54" y="20" width="6" height="6" fill="#1A2421" />
                  <rect x="42" y="42" width="16" height="16" fill="#B89047" />
                  <rect x="18" y="44" width="8" height="8" fill="#1A2421" />
                  <rect x="28" y="52" width="6" height="6" fill="#1A2421" />
                  <rect x="68" y="44" width="10" height="10" fill="#1A2421" />
                  <rect x="80" y="56" width="8" height="8" fill="#B89047" />
                  <rect x="46" y="68" width="8" height="8" fill="#1A2421" />
                  <rect x="60" y="74" width="10" height="10" fill="#1A2421" />
                  <rect x="76" y="72" width="12" height="12" fill="#1A2421" />
                </svg>
              </div>

              <p className="text-xs text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed mb-6">
                Scan menggunakan kamera m-Banking atau aplikasi e-wallet apa pun.
              </p>

              <button
                onClick={() => setShowQrisModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-[#25201C] dark:bg-[#2F3D36] hover:bg-black transition-colors cursor-pointer"
              >
                Tutup Tampilan QRIS
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
