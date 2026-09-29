import React, { useState } from 'react';
import { X, Lock, Users, Shield, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { AppViewMode } from '../types/wedding';

interface AccessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: AppViewMode) => void;
}

export const AccessLoginModal: React.FC<AccessLoginModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'client' | 'admin'>('client');
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedTarget === 'client') {
      // Default PIN: klien123 or direct
      if (pinInput.trim() === 'klien123' || pinInput.trim() === '1234' || pinInput.trim() === '') {
        onSelectRole('client');
        onClose();
        setPinInput('');
      } else {
        setErrorMessage('PIN Klien salah. Gunakan default: klien123');
      }
    } else if (selectedTarget === 'admin') {
      // Default PIN: admin123
      if (pinInput.trim() === 'admin123' || pinInput.trim() === 'admin') {
        onSelectRole('admin');
        onClose();
        setPinInput('');
      } else {
        setErrorMessage('PIN Admin salah. Gunakan default: admin123');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#1A221F] rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-2xl p-6 sm:p-7 text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-5 h-5 text-[#B89047]" />
          <h3 className="font-serif-luxury text-2xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
            Akses Masuk Khusus
          </h3>
        </div>
        <p className="text-[#8C7A6B] dark:text-[#A89E94] mb-6">
          Pilih portal yang ingin Anda akses (khusus Calon Pengantin atau Administrator).
        </p>

        {/* Role Segmented Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setSelectedTarget('client');
              setErrorMessage('');
            }}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              selectedTarget === 'client'
                ? 'border-[#B89047] bg-[#B89047]/10 text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
                : 'border-[#E2D5C3] dark:border-[#2C3833] text-[#736458] dark:text-[#A79D93]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-4 h-4 text-[#B89047]" />
              {selectedTarget === 'client' && <span className="w-2 h-2 rounded-full bg-[#B89047]" />}
            </div>
            <strong className="block text-xs font-semibold">Portal Klien</strong>
            <span className="text-[10px] text-[#8C7A6B] dark:text-[#8E9B94]">Buat nama tamu &amp; kirim WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTarget('admin');
              setErrorMessage('');
            }}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              selectedTarget === 'admin'
                ? 'border-[#B89047] bg-[#B89047]/10 text-[#25201C] dark:text-[#FAF7F2] shadow-xs'
                : 'border-[#E2D5C3] dark:border-[#2C3833] text-[#736458] dark:text-[#A79D93]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-4 h-4 text-[#B89047]" />
              {selectedTarget === 'admin' && <span className="w-2 h-2 rounded-full bg-[#B89047]" />}
            </div>
            <strong className="block text-xs font-semibold">Panel Admin</strong>
            <span className="text-[10px] text-[#8C7A6B] dark:text-[#8E9B94]">Ubah seluruh isi web, Supabase &amp; Vercel</span>
          </button>
        </div>

        {/* Form Login PIN */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Masukkan PIN Keamanan ({selectedTarget === 'client' ? 'Default: klien123' : 'Default: admin123'})
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={selectedTarget === 'client' ? 'klien123' : 'admin123'}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Masuk ke {selectedTarget === 'client' ? 'Portal Klien' : 'Panel Admin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
