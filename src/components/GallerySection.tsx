import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Film, LayoutGrid, Sliders, Play, Pause, Zap } from 'lucide-react';
import { GalleryItem, WeddingConfig } from '../types/wedding';
import { formatImageUrl } from '../utils/googleDrive';
import { PucuakRabuangDivider } from './MinangOrnaments';
import { FadeIn } from './FadeIn';

interface GallerySectionProps {
  gallery: GalleryItem[];
  config?: WeddingConfig;
  onUpdateConfig?: (newConfig: WeddingConfig) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, config, onUpdateConfig }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Gallery view mode: animated moving marquee reel (default) or static grid
  const [displayMode, setDisplayMode] = useState<'reel' | 'grid'>(() => {
    return config?.galleryAnimationEnabled === false ? 'grid' : 'reel';
  });

  // Play / Pause state for interactive animation control
  const [isAnimationPaused, setIsAnimationPaused] = useState<boolean>(false);

  // Animation speed: slow (48s), normal (32s), fast (18s)
  const [animSpeed, setAnimSpeed] = useState<'slow' | 'normal' | 'fast'>(() => {
    return config?.galleryAnimationSpeed || 'normal';
  });

  // Photo size state: small | medium | large
  const [photoSize, setPhotoSize] = useState<'small' | 'medium' | 'large'>(() => {
    return config?.galleryPhotoSize || 'medium';
  });

  // Photo aspect ratio: '4:5' | 'square' | '4:3' | '16:9' | '3:2'
  const [photoRatio, setPhotoRatio] = useState<string>(() => {
    return config?.galleryRatio || '4:5';
  });

  // Keep in sync with config updates if changed outside
  useEffect(() => {
    if (config?.galleryPhotoSize) setPhotoSize(config.galleryPhotoSize);
    if (config?.galleryRatio) setPhotoRatio(config.galleryRatio);
    if (config?.galleryAnimationSpeed) setAnimSpeed(config.galleryAnimationSpeed);
    if (config?.galleryAnimationEnabled !== undefined) {
      setDisplayMode(config.galleryAnimationEnabled ? 'reel' : 'grid');
    }
  }, [config?.galleryPhotoSize, config?.galleryRatio, config?.galleryAnimationEnabled, config?.galleryAnimationSpeed]);

  const handleToggleDisplayMode = (mode: 'reel' | 'grid') => {
    setDisplayMode(mode);
    if (config && onUpdateConfig) {
      onUpdateConfig({ ...config, galleryAnimationEnabled: mode === 'reel' });
    }
  };

  const handleUpdateSize = (size: 'small' | 'medium' | 'large') => {
    setPhotoSize(size);
    if (config && onUpdateConfig) {
      onUpdateConfig({ ...config, galleryPhotoSize: size });
    }
  };

  const handleUpdateRatio = (ratio: string) => {
    setPhotoRatio(ratio);
    if (config && onUpdateConfig) {
      onUpdateConfig({ ...config, galleryRatio: ratio as any });
    }
  };

  const handleUpdateSpeed = (speed: 'slow' | 'normal' | 'fast') => {
    setAnimSpeed(speed);
    if (config && onUpdateConfig) {
      onUpdateConfig({ ...config, galleryAnimationSpeed: speed });
    }
  };

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index % gallery.length);
  };

  const handleCloseLightbox = () => {
    setActivePhotoIndex(null);
  };

  const handleNextPhoto = useCallback(() => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => ((prev ?? 0) + 1) % gallery.length);
    }
  }, [activePhotoIndex, gallery.length]);

  const handlePrevPhoto = useCallback(() => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => ((prev ?? 0) - 1 + gallery.length) % gallery.length);
    }
  }, [activePhotoIndex, gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, handleNextPhoto, handlePrevPhoto]);

  // Dimension classes based on size & ratio
  const reelHeightClasses: Record<string, string> = {
    small: 'h-48 sm:h-56',
    medium: 'h-64 sm:h-76',
    large: 'h-80 sm:h-96',
  };

  const ratioAspectClasses: Record<string, string> = {
    '4:5': 'aspect-[4/5]',
    'square': 'aspect-square',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    'portrait': 'aspect-[3/4]',
  };

  const gridColsClasses: Record<string, string> = {
    small: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4',
    medium: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    large: 'grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8',
  };

  const currentHeightClass = reelHeightClasses[photoSize] || 'h-64 sm:h-76';
  const currentRatioClass = ratioAspectClasses[photoRatio] || 'aspect-[4/5]';

  // Multiplied array for seamless right-to-left infinite marquee drift
  const marqueeList = gallery.length < 8 ? [...gallery, ...gallery, ...gallery, ...gallery] : [...gallery, ...gallery];

  return (
    <section id="galeri" className="py-22 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#ECE3D5] via-[#F4EEE6] to-[#EAE0D2] dark:from-[#121815] dark:via-[#141A17] dark:to-[#131916] transition-colors relative overflow-hidden">
      {/* Soft studio ambient light */}
      <div className="absolute top-1/4 -right-16 w-80 h-80 bg-[#C5A059]/6 dark:bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-16 w-80 h-80 bg-[#851C28]/4 dark:bg-[#851C28]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <FadeIn direction="up" delay={50}>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#851C28] dark:text-[#E8808D] block mb-2">
              Momen Abadi
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-3">
              Galeri Foto Bahagia
            </h2>
            <PucuakRabuangDivider className="w-52 mx-auto mb-4 opacity-80" color="#C5A059" />
            <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
              Setiap jepretan lensa merekam cinta, kehangatan, dan janji suci kami untuk menua bersama.
            </p>
          </FadeIn>
        </div>

        {/* Gallery Interactive Control Toolbar: Mode Display, Ukuran Foto, Rasio & Animasi */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3.5 rounded-2xl bg-white/80 dark:bg-[#1A221F]/80 backdrop-blur-md border border-[#E0D5C3] dark:border-[#2C3833] shadow-xs text-xs">
          
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#EFE8DD] dark:bg-[#151C19] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleToggleDisplayMode('reel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                displayMode === 'reel'
                  ? 'bg-white dark:bg-[#232F2A] text-[#851C28] dark:text-[#E8808D] shadow-xs font-semibold'
                  : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C] dark:hover:text-white'
              }`}
              title="Animasi bergerak dari kanan ke kiri dengan efek fade halus"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Animasi Reel Bergerak</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleDisplayMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                displayMode === 'grid'
                  ? 'bg-white dark:bg-[#232F2A] text-[#851C28] dark:text-[#E8808D] shadow-xs font-semibold'
                  : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C] dark:hover:text-white'
              }`}
              title="Tampilkan tata letak album foto kisi-kisi"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid Album</span>
            </button>
          </div>

          {/* Animasi Play / Pause & Kecepatan Controls (When in Reel Mode) */}
          {displayMode === 'reel' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAnimationPaused(!isAnimationPaused)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                  isAnimationPaused
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 hover:bg-emerald-600/20'
                }`}
                title={isAnimationPaused ? 'Lanjutkan Animasi Bergerak' : 'Jeda Animasi Sementara'}
              >
                {isAnimationPaused ? (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Lanjutkan Animasi</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Jeda Animasi</span>
                  </>
                )}
              </button>

              {/* Speed Switcher */}
              <div className="flex items-center gap-1 bg-[#EFE8DD] dark:bg-[#151C19] p-0.5 rounded-lg text-[11px]">
                {[
                  { key: 'slow', label: 'Lambat' },
                  { key: 'normal', label: 'Sedang' },
                  { key: 'fast', label: 'Cepat' },
                ].map((sp) => (
                  <button
                    key={sp.key}
                    type="button"
                    onClick={() => handleUpdateSpeed(sp.key as any)}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      animSpeed === sp.key
                        ? 'bg-[#C5A059] text-white font-semibold shadow-xs'
                        : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C] dark:hover:text-white'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ukuran Foto Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#736458] dark:text-[#A79D93] flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#B89047]" />
              Ukuran:
            </span>
            <div className="flex items-center gap-1 bg-[#EFE8DD] dark:bg-[#151C19] p-0.5 rounded-lg text-[11px]">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleUpdateSize(sz)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all cursor-pointer ${
                    photoSize === sz
                      ? 'bg-[#B89047] text-white font-semibold shadow-xs'
                      : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C] dark:hover:text-white'
                  }`}
                >
                  {sz === 'small' ? 'Kecil' : sz === 'medium' ? 'Sedang' : 'Besar'}
                </button>
              ))}
            </div>
          </div>

          {/* Rasio Foto Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#736458] dark:text-[#A79D93]">
              Rasio:
            </span>
            <div className="flex items-center gap-1 bg-[#EFE8DD] dark:bg-[#151C19] p-0.5 rounded-lg text-[11px]">
              {[
                { key: '4:5', label: '4:5' },
                { key: 'square', label: '1:1' },
                { key: '4:3', label: '4:3' },
                { key: '16:9', label: '16:9' },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleUpdateRatio(r.key)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    photoRatio === r.key
                      ? 'bg-[#851C28] text-white font-semibold shadow-xs'
                      : 'text-[#6C5E53] dark:text-[#A79D93] hover:text-[#25201C] dark:hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODE 1: ANIMASI REEL BERGERAK DARI KANAN KE KIRI + FADE MASUK & FADE KELUAR */}
        {/* ========================================================================= */}
        {displayMode === 'reel' ? (
          <div className="relative w-full overflow-hidden py-3 group">
            {/* Fade Keluar di Sisi Kiri (Exit Fade Mask) */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-r from-[#ECE3D5] via-[#ECE3D5]/90 to-transparent dark:from-[#121815] dark:via-[#121815]/90 z-20 pointer-events-none" />

            {/* Fade Masuk di Sisi Kanan (Entrance Fade Mask) */}
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-l from-[#EAE0D2] via-[#EAE0D2]/90 to-transparent dark:from-[#131916] dark:via-[#131916]/90 z-20 pointer-events-none" />

            {/* Continuous Marquee Track Moving Right to Left */}
            <div
              className="animate-marquee-rtl flex items-center gap-4 sm:gap-6 py-2"
              style={{
                animationDuration: animSpeed === 'slow' ? '48s' : animSpeed === 'fast' ? '18s' : '30s',
                animationPlayState: isAnimationPaused ? 'paused' : undefined,
              }}
            >
              {marqueeList.map((photo, index) => {
                const originalIndex = index % gallery.length;

                return (
                  <div
                    key={`${photo.id || originalIndex}-${index}`}
                    onClick={() => handleOpenLightbox(originalIndex)}
                    className={`relative ${currentHeightClass} ${currentRatioClass} shrink-0 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-[#C5A059]/30 hover:border-[#C5A059] bg-[#E8DFD3] dark:bg-[#1C2621] cursor-pointer transition-all duration-500 hover:scale-103 group/item`}
                  >
                    <img
                      src={formatImageUrl(photo.url)}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover/item:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay with caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-white pointer-events-none">
                      <span className="text-[10px] uppercase tracking-wider text-[#EAD7B2] font-semibold flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-[#EAD7B2]" />
                        Buka Foto Penuh
                      </span>
                      <p className="text-xs sm:text-sm font-light text-slate-100 leading-snug line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>

                    {/* Expand icon */}
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-[#8C7A6B] dark:text-[#A89E94] mt-3 italic flex items-center justify-center gap-1.5">
              <span>● Gerakkan kursor ke foto untuk menjeda animasi · Klik foto untuk memperbesar</span>
            </p>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE 2: RESPONSIVE GRID ALBUM VIEW                                        */
          /* ========================================================================= */
          <div className={`grid ${gridColsClasses[photoSize] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'}`}>
            {gallery.map((photo, index) => {
              return (
                <FadeIn
                  key={photo.id || index}
                  direction="up"
                  delay={(index % 3) * 100 + 50}
                >
                  <div
                    onClick={() => handleOpenLightbox(index)}
                    className={`group relative overflow-hidden rounded-3xl bg-[#E8DFD3] dark:bg-[#202B26] cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border border-[#C5A059]/25 hover:border-[#C5A059] ${currentRatioClass}`}
                  >
                    <img
                      src={formatImageUrl(photo.url)}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Hover overlay with caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                      <span className="text-[11px] uppercase tracking-wider text-[#EAD7B2] font-semibold flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-[#EAD7B2]" />
                        Lihat Foto Penuh
                      </span>
                      <p className="text-xs sm:text-sm font-light text-slate-100 leading-snug">
                        {photo.caption}
                      </p>
                    </div>

                    {/* Corner expand icon */}
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* Lightbox Modal */}
        {activePhotoIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
            {/* Top Bar with counter & close */}
            <div className="absolute top-4 inset-x-4 max-w-6xl mx-auto flex items-center justify-between text-white z-10">
              <span className="text-xs font-mono tracking-widest text-[#E6CA65] tabular-nums">
                {activePhotoIndex + 1} / {gallery.length}
              </span>
              <button
                onClick={handleCloseLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Tutup Galeri (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10 cursor-pointer"
              title="Foto Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div
              className="max-w-5xl max-h-[82vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={formatImageUrl(gallery[activePhotoIndex].url)}
                alt={gallery[activePhotoIndex].caption}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl transition-all"
              />
              <p className="mt-4 text-center text-xs sm:text-sm text-slate-200 font-light max-w-lg">
                {gallery[activePhotoIndex].caption}
              </p>
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10 cursor-pointer"
              title="Foto Selanjutnya (Panah Kanan)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
