import React from 'react';

/**
 * Clean, minimalist curved Rumah Gadang roof (Gonjong) line art
 * Simple elegan silhouette with gentle soft floating animation
 */
export const GonjongRoof: React.FC<{ className?: string; color?: string; animated?: boolean }> = ({
  className = 'w-24 h-7',
  color = '#C5A059',
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${animated ? 'animate-float-soft' : ''} transition-all duration-700`}
  >
    <defs>
      <linearGradient id="gonjongGold" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="50%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Center Horn Line */}
    <path
      d="M100 4 C97 18 90 26 78 30 C64 35 40 37 15 39 L185 39 C160 37 136 35 122 30 C110 26 103 18 100 4 Z"
      stroke="url(#gonjongGold)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.06"
    />
    {/* Left Spire Horn */}
    <path
      d="M26 8 C32 20 38 27 50 32 C38 35 24 36 10 38 L65 38 C58 33 50 28 44 20 C38 14 32 8 26 8 Z"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      fill={color}
      fillOpacity="0.04"
    />
    {/* Right Spire Horn */}
    <path
      d="M174 8 C168 20 162 27 150 32 C162 35 176 36 190 38 L135 38 C142 33 150 28 156 20 C162 14 168 8 174 8 Z"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      fill={color}
      fillOpacity="0.04"
    />
    {/* Horizontal Baseline & Pucuak Accents */}
    <line x1="12" y1="42" x2="188" y2="42" stroke={color} strokeWidth="0.9" strokeOpacity="0.45" strokeDasharray="3 3" />
    <circle cx="100" cy="46" r="1.5" fill={color} className="animate-pulse" />
    <circle cx="80" cy="46" r="1" fill={color} opacity="0.6" />
    <circle cx="120" cy="46" r="1" fill={color} opacity="0.6" />
  </svg>
);

/**
 * Minangkabau Suntiang Gadang Crown Icon (Refined Minimalist Line Art)
 * Simple elegan with breathing gentle animation
 */
export const SuntiangCrown: React.FC<{ className?: string; color?: string; animated?: boolean }> = ({
  className = 'w-9 h-9',
  color = '#C5A059',
  animated = true,
}) => (
  <svg
    viewBox="0 0 80 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${animated ? 'animate-breathe' : ''} transition-all duration-500`}
  >
    {/* Top Pinnacle Flower with sweet twinkle */}
    <circle cx="40" cy="8" r="2.4" fill={color} className="animate-twinkle" />
    <path d="M40 10.5 L40 15" stroke={color} strokeWidth="1.2" strokeLinecap="round" />

    {/* Upper Tier Radiating Fan */}
    <path
      d="M40 15 C33 21 24 25 16 32 C26 33 34 35 40 38 C46 35 54 33 64 32 C56 25 47 21 40 15 Z"
      stroke={color}
      strokeWidth="1.3"
      fill={color}
      fillOpacity="0.09"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Middle Tier Blossoms */}
    <circle cx="28" cy="24" r="1.4" fill={color} />
    <circle cx="52" cy="24" r="1.4" fill={color} />
    <circle cx="40" cy="22" r="1.6" fill={color} />

    {/* Forehead Band (Lilik Suntiang) */}
    <path
      d="M16 46 Q40 51 64 46"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M20 49.5 Q40 54 60 49.5"
      stroke={color}
      strokeWidth="0.9"
      strokeOpacity="0.6"
      strokeLinecap="round"
    />

    {/* Gentle Hanging Ornaments (Kote-Kote) with sway */}
    <circle cx="18" cy="54" r="1.4" fill={color} />
    <circle cx="18" cy="58" r="1" fill={color} opacity="0.7" />
    <circle cx="62" cy="54" r="1.4" fill={color} />
    <circle cx="62" cy="58" r="1" fill={color} opacity="0.7" />
  </svg>
);

/**
 * Pucuak Rabuang (Bamboo shoot) minimalist ornamental divider
 * Simple, sweet, and refined
 */
export const PucuakRabuangDivider: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-4',
  color = '#C5A059',
}) => (
  <div className={`flex items-center justify-center gap-2 overflow-hidden py-1 ${className}`}>
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent" />
    <div className="flex items-center gap-2 text-[9px] tracking-widest text-[#C5A059] select-none opacity-85">
      <span className="transform -scale-x-100 opacity-60">▲</span>
      <span className="text-[10px] text-[#851C28] dark:text-[#E8808D] font-bold animate-twinkle">✦</span>
      <span className="text-[11px] opacity-90">◆</span>
      <span className="text-[10px] text-[#851C28] dark:text-[#E8808D] font-bold animate-twinkle">✦</span>
      <span className="opacity-60">▲</span>
    </div>
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent" />
  </div>
);

/**
 * Traditional Minang Carano / Dulang Emas Motif
 */
export const CaranoMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-7 h-7',
  color = '#C5A059',
}) => (
  <svg
    viewBox="0 0 50 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform duration-300 hover:rotate-3`}
  >
    {/* Oval Rim */}
    <ellipse cx="25" cy="10" rx="18" ry="4" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.08" />
    {/* Cup Bowl */}
    <path
      d="M7 10 Q25 15 43 10 L39 21 Q25 24 11 21 Z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.06"
    />
    {/* Pedestal Stand */}
    <path
      d="M20 21 L16 30 L34 30 L30 21"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Delicate Songket Corner Flourish
 * Simple elegan corner border motif
 */
export const SongketCorner: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#C5A059',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} opacity-40 hover:opacity-80 transition-opacity duration-300`}
  >
    <path d="M2 30 V6 C2 3.79 3.79 2 6 2 H30" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 30 V10 C6 7.79 7.79 6 10 6 H30" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
    <circle cx="12" cy="12" r="1.5" fill={color} className="animate-twinkle" />
  </svg>
);

