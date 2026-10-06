/**
 * Google Drive Image Helper Utility
 * Converts any Google Drive sharing / viewer URL into a direct-rendering image CDN URL.
 *
 * Supported formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 */

export function extractGoogleDriveFileId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // Pattern 1: /file/d/FILE_ID
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: id=FILE_ID query parameter
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Pattern 3: googleusercontent.com/d/FILE_ID
  const matchUserContent = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (matchUserContent && matchUserContent[1]) return matchUserContent[1];

  return null;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('googleusercontent.com/d/');
}

/**
 * Transforms any Google Drive URL into a high-res direct image stream URL.
 * If the URL is already standard (e.g. Unsplash, Cloudinary, Imgur, Supabase Storage, local asset),
 * it returns the clean original URL without alteration.
 */
export function formatImageUrl(url: string | undefined, defaultFallback = ''): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return defaultFallback;
  }

  const trimmed = url.trim();

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    // Official Google CDN direct image access endpoint (no cookie wall, high bandwidth)
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

/**
 * Alternative Google thumbnail URL for instant high-speed low-latency rendering
 */
export function formatGoogleDriveThumbnailUrl(url: string | undefined, size = 1600): string {
  if (!url) return '';
  const driveId = extractGoogleDriveFileId(url);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${size}`;
  }
  return formatImageUrl(url);
}

/**
 * Transforms any Google Drive URL or direct link into a streaming-compatible audio URL.
 * Works seamlessly with:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - Regular direct MP3 / AAC / OGG URLs
 */
export function formatAudioUrl(url: string | undefined): string {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const trimmed = url.trim();
  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `/api/audio-proxy?url=${encodeURIComponent(trimmed)}`;
  }
  return trimmed;
}

/**
 * Returns prioritized array of streaming endpoints for a Google Drive audio ID
 */
export function getGoogleDriveAudioCandidates(url: string | undefined): string[] {
  if (!url || typeof url !== 'string' || !url.trim()) return [];
  const trimmed = url.trim();
  const driveId = extractGoogleDriveFileId(trimmed);
  if (!driveId) {
    return [
      trimmed,
      `/api/audio-proxy?url=${encodeURIComponent(trimmed)}`,
    ];
  }

  return [
    `/api/audio-proxy?url=${encodeURIComponent(trimmed)}`,
    `/api/drive-audio?id=${driveId}`,
    `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`,
    `https://docs.google.com/uc?export=download&id=${driveId}&confirm=t`,
  ];
}

