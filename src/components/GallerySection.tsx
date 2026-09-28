import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types/wedding';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index);
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

  return (
    <section id="galeri" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4EFEA] dark:bg-[#151C19] transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] dark:text-[#A89E94] block mb-2">
            Momen Abadi
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#25201C] dark:text-[#FAF7F2] font-normal mb-4">
            Galeri Foto Bahagia
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B89047] to-transparent mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-[#6C5E53] dark:text-[#B4AAA0] leading-relaxed">
            Setiap jepretan lensa merekam cinta, kehangatan, dan janji suci kami untuk menua bersama.
          </p>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((photo, index) => {
            // Give first photo a wider presence if on large screen
            const isFeatured = index === 0;

            return (
              <div
                key={photo.id || index}
                onClick={() => handleOpenLightbox(index)}
                className={`group relative overflow-hidden rounded-2xl bg-[#E8DFD3] dark:bg-[#202B26] cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 ${
                  isFeatured ? 'sm:col-span-2 lg:col-span-2 aspect-16/10' : 'aspect-4/3'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-[#EAD7B2] font-medium flex items-center gap-1.5 mb-1">
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
            );
          })}
        </div>

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
                src={gallery[activePhotoIndex].url}
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
