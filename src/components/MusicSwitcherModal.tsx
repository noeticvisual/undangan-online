import React, { useState } from 'react';
import { X, Play, Pause, Volume2, Music, Check, Radio, Disc, Sparkles } from 'lucide-react';
import { MusicTrack, WeddingConfig } from '../types/wedding';
import { AVAILABLE_WEDDING_TRACKS, weddingMusicEngine } from '../services/audioPlayer';

interface MusicSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onUpdateConfig?: (newConfig: WeddingConfig) => void;
}

export const MusicSwitcherModal: React.FC<MusicSwitcherModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(() =>
    weddingMusicEngine.getCurrentTrack()
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(() =>
    weddingMusicEngine.getStatus()
  );
  const [volume, setVolume] = useState<number>(() =>
    weddingMusicEngine.getVolume()
  );
  const [customUrlInput, setCustomUrlInput] = useState<string>(() =>
    weddingMusicEngine.getCustomUrl() || config.customAudioUrl || ''
  );
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Sync state with engine
  React.useEffect(() => {
    const unsubscribe = weddingMusicEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      const track = AVAILABLE_WEDDING_TRACKS.find((t) => t.id === state.trackId);
      if (track) setCurrentTrack(track);
      setVolume(state.volume);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleSelectTrack = (track: MusicTrack) => {
    weddingMusicEngine.setTrack(track.id, track.id === 'custom_url' ? customUrlInput : undefined);
    setCurrentTrack(track);

    // If audio is paused, start playing when selecting
    if (!weddingMusicEngine.getStatus()) {
      weddingMusicEngine.start();
    }
  };

  const handleTogglePlay = () => {
    const newState = weddingMusicEngine.toggle();
    setIsPlaying(newState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    weddingMusicEngine.setVolume(val);
  };

  const handleSaveAsDefault = () => {
    if (onUpdateConfig) {
      const updated: WeddingConfig = {
        ...config,
        musicTitle: currentTrack.title,
        musicArtist: currentTrack.artist,
        selectedTrackId: currentTrack.id,
        customAudioUrl: currentTrack.id === 'custom_url' ? customUrlInput : config.customAudioUrl,
      };
      onUpdateConfig(updated);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    weddingMusicEngine.setTrack('custom_url', customUrlInput.trim());
    if (!weddingMusicEngine.getStatus()) {
      weddingMusicEngine.start();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#1C221F] rounded-2xl shadow-2xl border border-[#E8DFD3] dark:border-[#2C3833] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E8DFD3] dark:border-[#2C3833] flex items-center justify-between bg-[#F4EFE6]/60 dark:bg-[#161B19]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B89047]/10 dark:bg-[#B89047]/20 flex items-center justify-center text-[#B89047]">
              <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#2C2724] dark:text-[#F3EEEA]">
                Pilih Musik Latar Undangan
              </h2>
              <p className="text-xs text-[#7B6E62] dark:text-[#9EA8A3]">
                Atur alunan melodi pernikahan sakral &amp; romantis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7B6E62] dark:text-[#9EA8A3] hover:text-[#2C2724] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Currently Active Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#B89047]/10 via-[#FAF7F2] to-[#B89047]/10 dark:from-[#B89047]/15 dark:via-[#1C221F] dark:to-[#B89047]/15 border border-[#B89047]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={handleTogglePlay}
                className="w-12 h-12 rounded-full bg-[#B89047] hover:bg-[#A37E38] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
                title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B89047]">
                    Sedang Diputar
                  </span>
                  {isPlaying && (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-1 bg-[#B89047] h-full animate-pulse rounded-full" />
                      <span className="w-1 bg-[#B89047] h-2/3 animate-bounce rounded-full" />
                      <span className="w-1 bg-[#B89047] h-4/5 animate-pulse rounded-full" />
                      <span className="w-1 bg-[#B89047] h-1/2 animate-bounce rounded-full" />
                    </div>
                  )}
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#2C2724] dark:text-[#F3EEEA] truncate">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-[#7B6E62] dark:text-[#A79D93] truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2.5 w-full sm:w-44 shrink-0 bg-white/60 dark:bg-black/20 px-3 py-2 rounded-lg border border-[#E8DFD3] dark:border-[#2C3833]">
              <Volume2 className="w-4 h-4 text-[#7B6E62] dark:text-[#A79D93] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#B89047] cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
              <span className="text-[11px] font-medium text-[#7B6E62] dark:text-[#A79D93] w-7 text-right tabular-nums">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Track Catalog List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7B6E62] dark:text-[#A79D93]">
                Daftar Pilihan Melodi Latar
              </h4>
              <span className="text-xs text-[#B89047] font-medium">
                {AVAILABLE_WEDDING_TRACKS.length} Koleksi Suasana
              </span>
            </div>

            <div className="space-y-2.5">
              {AVAILABLE_WEDDING_TRACKS.map((track) => {
                const isSelected = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-white dark:bg-[#232D28] border-[#B89047] shadow-sm ring-1 ring-[#B89047]/40'
                        : 'bg-[#F9F5EF]/70 dark:bg-[#1A221F]/70 border-[#E8DFD3] dark:border-[#2C3833] hover:bg-white dark:hover:bg-[#212B26]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#B89047] text-white'
                            : 'bg-[#EFE8DD] dark:bg-[#28352F] text-[#7B6E62] dark:text-[#A79D93]'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif-luxury text-base font-semibold text-[#2C2724] dark:text-[#F3EEEA]">
                            {track.title}
                          </h5>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B89047]/15 text-[#B89047] border border-[#B89047]/30">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7B6E62] dark:text-[#A79D93] mt-0.5">
                          {track.artist}
                        </p>
                        <p className="text-xs text-[#8C7E72] dark:text-[#8E9B94] mt-1.5 leading-relaxed">
                          {track.description}
                        </p>

                        {/* Custom URL Input Field if custom is selected */}
                        {track.id === 'custom_url' && isSelected && (
                          <form
                            onSubmit={handleApplyCustomUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                          >
                            <input
                              type="url"
                              value={customUrlInput}
                              onChange={(e) => setCustomUrlInput(e.target.value)}
                              placeholder="Masukkan tautan langsung MP3 (https://.../lagu.mp3)"
                              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#D9CEBF] dark:border-[#35433C] bg-white dark:bg-[#161B19] text-[#2C2724] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B89047]"
                            />
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#B89047] hover:bg-[#A37E38] rounded-lg transition-colors cursor-pointer shrink-0"
                            >
                              Terapkan
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#8C7E72] dark:text-[#8E9B94] tabular-nums">
                        {track.durationFormatted}
                      </span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#B89047]" />
                      ) : (
                        <Radio className="w-4 h-4 text-[#C4B7A6] dark:text-[#4A5952]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E8DFD3] dark:border-[#2C3833] bg-[#F4EFE6]/60 dark:bg-[#161B19]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#7B6E62] dark:text-[#A79D93]">
            {saveToast ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Musik default undangan berhasil diperbarui!
              </span>
            ) : (
              <span>Musik akan berputar otomatis saat tamu menekan "Buka Undangan".</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onUpdateConfig && (
              <button
                onClick={handleSaveAsDefault}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simpan Musik Default</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#2C2724] dark:text-[#F3EEEA] bg-white dark:bg-[#232D28] hover:bg-[#F3EDE2] dark:hover:bg-[#2B3832] border border-[#E8DFD3] dark:border-[#2C3833] rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
