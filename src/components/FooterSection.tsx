import React from 'react';
import { Heart, ArrowUp, MessageCircle } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface FooterSectionProps {
  config: WeddingConfig;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ config }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#FAF7F2] dark:bg-[#121615] border-t border-[#E8DFD3] dark:border-[#242D28] pt-16 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8 text-center transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Monogram / Title */}
        <span className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-semibold block mb-2">
          {config.groom.nickName} &amp; {config.bride.nickName}
        </span>
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] dark:text-[#A89E94] mb-8">
          {config.events[0]?.dateFormatted}
        </p>

        {/* Thank You Note */}
        <p className="text-xs sm:text-sm text-[#5D5046] dark:text-[#BFAF9E] max-w-lg mx-auto leading-relaxed mb-8">
          Atas kehadiran dan doa restu yang tulus dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih yang sebesar-besarnya. Semoga kebaikan senantiasa menyertai kita semua.
        </p>

        {/* Family names */}
        <div className="text-xs text-[#7A6B5F] dark:text-[#A89E94] mb-12">
          <span className="block font-medium text-[#25201C] dark:text-[#FAF7F2] mb-1">
            Keluarga Besar
          </span>
          <span>{config.groom.fatherName} &amp; {config.groom.motherName}</span>
          <br />
          <span>{config.bride.fatherName} &amp; {config.bride.motherName}</span>
        </div>

        {/* Organizer Contacts */}
        <div className="bg-[#F4EFEA] dark:bg-[#1A221F] rounded-2xl p-6 border border-[#E8DFD3] dark:border-[#2C3833] max-w-xl mx-auto mb-10 text-left">
          <h4 className="text-xs font-semibold text-[#25201C] dark:text-[#FAF7F2] uppercase tracking-wider mb-4 text-center">
            Narahubung &amp; Bantuan Acara (Contact Person)
          </h4>
          <div className="space-y-3">
            {config.organizerContacts.map((contact, idx) => {
              const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
              const waLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=Halo%20${encodeURIComponent(contact.name)},%20saya%20ingin%20bertanya%20mengenai%20acara%20pernikahan%20${encodeURIComponent(config.groom.nickName + ' & ' + config.bride.nickName)}`;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#141A17] border border-[#E2D5C3] dark:border-[#28352F]"
                >
                  <div>
                    <span className="font-semibold text-[#25201C] dark:text-[#FAF7F2] block">
                      {contact.name}
                    </span>
                    <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">
                      {contact.role}
                    </span>
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll To Top */}
        <div className="flex items-center justify-center gap-4 text-xs text-[#8C7A6B] dark:text-[#A89E94] mb-8">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[#B89047] transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C7A6B] dark:text-[#8E9B94]">
          <span>Dirancang dengan cinta</span>
          <Heart className="w-3 h-3 text-[#B89047] fill-current" />
          <span>untuk Pernikahan {config.groom.nickName} &amp; {config.bride.nickName}</span>
        </div>

      </div>
    </footer>
  );
};
