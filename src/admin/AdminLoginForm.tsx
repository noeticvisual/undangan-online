import React, { useEffect, useState } from 'react';
import { KeyRound, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AdminLoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'checking' | 'setup' | 'login'>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth?action=status')
      .then((r) => (r.ok ? r.json() : { configured: true }))
      .then((data) => setMode(data?.configured ? 'login' : 'setup'))
      .catch(() => setMode('login'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'setup') {
      if (password.length < 8) {
        setError('Password minimal 8 karakter.');
        return;
      }
      if (password !== confirm) {
        setError('Konfirmasi password tidak sama.');
        return;
      }
    }
    if (!password) {
      setError('Password wajib diisi.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/auth?action=${mode === 'setup' ? 'setup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          setMode('login');
          setError('Admin sudah terdaftar. Silakan masuk.');
          return;
        }
        throw new Error(data.error || 'Terjadi kesalahan.');
      }
      if (mode === 'setup') {
        // Auto login after setup
        const loginRes = await fetch('/api/auth?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        if (!loginRes.ok) throw new Error('Setup berhasil, silakan masuk manual.');
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#121615]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-flex p-3.5 rounded-2xl bg-[#B89047]/15 text-[#E6CA65] mb-4">
            <ShieldCheck className="w-7 h-7" />
          </span>
          <h1 className="font-serif-luxury text-3xl text-[#FAF7F2] font-semibold mb-1">Dashboard Admin</h1>
          <p className="text-xs text-[#A89E94]">
            {mode === 'setup'
              ? 'Pertama kali? Buat password admin untuk mengamankan dashboard.'
              : 'Masukkan password admin untuk mengelola undangan.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1A221F] rounded-2xl border border-[#2C3833] p-6 sm:p-8 shadow-2xl space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[#D1C3B3] mb-1.5">Password Admin</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'setup' ? 'Minimal 8 karakter' : 'Password Anda'}
                autoFocus
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-[#141A17] border border-[#2F3D36] text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
              />
            </div>
          </div>

          {mode === 'setup' && (
            <div>
              <label className="block text-xs font-medium text-[#D1C3B3] mb-1.5">Ulangi Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-[#141A17] border border-[#2F3D36] text-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#B89047]/50"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-xl px-3 py-2.5">{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl transition-all cursor-pointer disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{mode === 'setup' ? 'Buat Password & Masuk' : 'Masuk'}</span>
          </button>
        </form>

        <p className="text-center text-[11px] text-[#8C7A6B] mt-6">
          Niskala Wedding — Panel Penyelenggara
        </p>
      </div>
    </div>
  );
};
