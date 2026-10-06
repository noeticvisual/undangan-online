import React, { useState } from 'react';
import { Gift, CreditCard, Copy, Check, MapPin, Package } from 'lucide-react';
import { WeddingConfig, BankAccount } from '../types/wedding';
import { PucuakRabuangDivider, SongketCorner } from './MinangOrnaments';
import { FadeIn } from './FadeIn';

interface GiftRegistrySectionProps {
  config: WeddingConfig;
}

export const GiftRegistrySection: React.FC<GiftRegistrySectionProps> = ({ config }) => {
  const isMinang = config.templateId === 'minang-royal';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

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
    <section id="hadiah" className="py-22 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EEE5D8] via-[#FFFDF6] to-[#F4EBDC] dark:from-[#131916] dark:via-[#161D1A] dark:to-[#121615] transition-colors relative overflow-hidden">
      {/* Royal golden silk ambient glow */}
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#C5A059]/8 dark:bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#851C28]/4 dark:bg-[#851C28]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn direction="up" delay={50}>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#851C28] dark:text-[#E8808D] block mb-2">
              Tanda Kasih
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-3">
              Amplop Digital &amp; Kado Pernikahan
            </h2>
            {isMinang ? (
              <PucuakRabuangDivider className="w-52 mx-auto mb-4 opacity-80" color="#C5A059" />
            ) : (
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
            )}
            <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
              Doa restu Anda merupakan karunia yang paling berharga bagi kami. Namun jika memberi adalah ungkapan kasih, fitur berikut disediakan untuk mempermudah niat tulus Anda.
            </p>
          </FadeIn>
        </div>

        {/* Bank Transfer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {config.bankAccounts.map((account, idx) => {
            const isCopied = copiedId === account.id;

            return (
              <FadeIn key={account.id} direction="up" delay={idx * 150 + 100} className="h-full">
                <div
                  className={`h-full bg-white/95 dark:bg-[#1A221F] rounded-3xl p-6 sm:p-7 border shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden flex flex-col justify-between sheen-effect ${
                    isMinang
                      ? 'border-[#C5A059]/30 hover:border-[#C5A059]'
                      : 'border-[#E8DFD3] dark:border-[#2C3833]'
                  }`}
                >
                  {/* Songket corner */}
                  {isMinang && (
                    <>
                      <div className="absolute top-2 left-2">
                        <SongketCorner className="w-4 h-4" color="#C5A059" />
                      </div>
                      <div className="absolute top-2 right-2 rotate-90">
                        <SongketCorner className="w-4 h-4" color="#C5A059" />
                      </div>
                    </>
                  )}

                  {/* Chip decoration */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#C5A059]" />
                      <span className="font-semibold text-sm text-[#25201C] dark:text-[#FAF7F2]">
                        {account.bankName}
                      </span>
                    </div>
                    {/* Subtle ATM Card Chip aesthetic */}
                    <div className="w-10 h-7 rounded-sm bg-[#D5C2A5]/30 border border-[#C5A059]/40 flex items-center justify-center">
                      <div className="w-6 h-4 border border-[#C5A059]/50 rounded-xs" />
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
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isMinang
                        ? 'bg-[#851C28]/10 text-[#851C28] dark:text-[#E8808D] hover:bg-[#851C28] hover:text-white border border-[#C5A059]/30'
                        : 'bg-[#EFE8DD] dark:bg-[#232F2A] text-[#25201C] dark:text-[#FAF7F2] hover:bg-[#E5DBCF]'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 animate-scale" />
                        <span>Nomor Rekening Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Nomor Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Physical Gift Delivery Card */}
        {config.physicalGift && config.physicalGift.recipientName && (
          <FadeIn direction="up" delay={250}>
            <div className="max-w-xl mx-auto bg-white/95 dark:bg-[#1A221F] rounded-3xl p-6 sm:p-7 border border-[#C5A059]/30 hover:border-[#C5A059] shadow-xs hover:shadow-lg transition-all duration-500 flex flex-col justify-between sheen-effect">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Package className="w-5 h-5 text-[#C5A059]" />
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
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copiedAddress
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#FFFDF9] dark:bg-[#232F2A] text-[#851C28] dark:text-[#E8808D] border border-[#C5A059]/40 hover:bg-[#851C28]/10'
                }`}
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Alamat Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span>Salin Alamat Pengiriman</span>
                  </>
                )}
              </button>
            </div>
          </FadeIn>
        )}

      </div>
    </section>
  );
};
