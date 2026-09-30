import React, { useState, useEffect } from 'react';
import { X, Lock, Users, Shield, ArrowRight, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { AppViewMode } from '../types/wedding';

interface AccessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: AppViewMode) => void;
  clientPasscode?: string;
  initialRole?: 'client' | 'admin';
  lockRole?: boolean;
}

export const AccessLoginModal: React.FC<AccessLoginModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  clientPasscode,
  initialRole = 'client',
  lockRole = false,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'client' | 'admin'>(initialRole);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTarget(initialRole);
      setPinInput('');
      setErrorMessage('');
      setShowPassword(false);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedTarget === 'client') {
      const expectedPasscode = (clientPasscode && clientPasscode.trim()) || 'mayaarya2026';
      if (pinInput.trim() === expectedPasscode) {
        onSelectRole('client');
        setPinInput('');
      } else {
        setErrorMessage('Kode akses salah. Silakan tanyakan kode akses kepada admin undangan.');
      }
    } else if (selectedTarget === 'admin') {
      // Admin passcode must be noetic123
      if (pinInput.trim() === 'noetic123') {
        onSelectRole('admin');
        setPinInput('');
      } else {
        setErrorMessage('Kode akses admin salah.');
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
            {selectedTarget === 'admin' ? 'Akses Panel Admin' : 'Akses Portal Klien'}
          </h3>
        </div>
        <p className="text-[#8C7A6B] dark:text-[#A89E94] mb-6">
          {selectedTarget === 'admin'
            ? 'Masukkan kode akses administrator untuk mengelola seluruh data undangan.'
            : 'Masukkan kode akses yang diberikan oleh admin untuk mengelola daftar tamu & RSVP.'}
        </p>

        {/* Role Segmented Buttons (Only shown if lockRole is false) */}
        {!lockRole && (
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
              <span className="text-[10px] text-[#8C7A6B] dark:text-[#8E9B94]">Pengantin &amp; Tamu</span>
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
              <span className="text-[10px] text-[#8C7A6B] dark:text-[#8E9B94]">Master Konfigurasi</span>
            </button>
          </div>
        )}

        {/* Form Login PIN */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-[#25201C] dark:text-[#FAF7F2]">
              Masukkan Kode Akses {selectedTarget === 'client' ? 'Klien (Pengantin)' : 'Admin'}
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan kode akses..."
                autoFocus
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#141A17] text-[#25201C] dark:text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white cursor-pointer"
                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
            className="w-full py-2.5 px-4 text-xs font-medium text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold"
          >
            <span>Masuk ke {selectedTarget === 'client' ? 'Portal Klien' : 'Panel Admin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-[#FAF7F2] transition-colors cursor-pointer text-center"
          >
            ← Kembali ke Undangan Tamu
          </button>
        </form>

      </div>
    </div>
  );
};
