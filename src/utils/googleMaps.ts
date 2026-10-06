/**
 * Google Maps Embed & Link Utility
 * Converts any Google Maps direct link, share link, iframe embed, or venue address
 * into a valid, responsive Google Maps Embed iframe URL.
 */

export function isJakartaPlaceholder(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('plataran') ||
    lower.includes('menteng') ||
    lower.includes('0x2e69f4305bc84f09') ||
    lower.includes('plataran+menteng') ||
    lower.includes('plataran%20menteng') ||
    (lower.includes('jakarta') && lower.includes('cokroaminoto'))
  );
}

export function extractMapsQuery(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If iframe embed code was pasted, extract src
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // If already an official embed URL and not the placeholder
  if (trimmed.includes('/maps/embed') && !isJakartaPlaceholder(trimmed)) {
    return trimmed;
  }

  // Short links cannot be embedded directly in an iframe due to X-Frame-Options.
  // Return null so formatGoogleMapsEmbedUrl can construct an embed using venue name/address
  if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
    return null;
  }

  // Check ?q= parameter
  try {
    const urlObj = new URL(trimmed);
    const q = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
    if (q && !isJakartaPlaceholder(q)) return q;

    // Place path: /maps/place/VENUE_NAME/
    const placeMatch = urlObj.pathname.match(/\/place\/([^/@]+)/);
    if (placeMatch && placeMatch[1]) {
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      if (!isJakartaPlaceholder(decoded)) {
        return decoded;
      }
    }

    // Coordinates: /@lat,lng
    const coordsMatch = urlObj.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch && coordsMatch[1] && coordsMatch[2]) {
      return `${coordsMatch[1]},${coordsMatch[2]}`;
    }
  } catch {
    // If not a valid full URL and not a placeholder, treat as text query
    if (!isJakartaPlaceholder(trimmed) && !trimmed.startsWith('http')) {
      return trimmed;
    }
  }

  return null;
}

export function formatGoogleMapsEmbedUrl(
  inputUrlOrEmbed: string | undefined,
  venueName?: string,
  venueAddress?: string
): string {
  const trimmed = (inputUrlOrEmbed || '').trim();
  const venueIsJakarta = isJakartaPlaceholder(venueName) || isJakartaPlaceholder(venueAddress);

  // If the input is the Jakarta placeholder but the actual venue is NOT Jakarta Plataran,
  // ignore the input completely and build embed from the venue name & address!
  const shouldIgnoreInput = !venueIsJakarta && isJakartaPlaceholder(trimmed);

  if (trimmed && !shouldIgnoreInput) {
    // 1. If iframe tag was pasted, extract src
    const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1] && !isJakartaPlaceholder(iframeMatch[1])) {
      return iframeMatch[1];
    }

    // 2. Already an official embed URL
    if (trimmed.includes('/maps/embed') && !isJakartaPlaceholder(trimmed)) {
      return trimmed;
    }

    // 3. Extract query or coordinates from direct map links
    const extractedQuery = extractMapsQuery(trimmed);
    if (extractedQuery) {
      if (extractedQuery.startsWith('http://') || extractedQuery.startsWith('https://')) {
        return extractedQuery;
      }
      return `https://maps.google.com/maps?q=${encodeURIComponent(extractedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // 4. Primary Sync: Build directly from venue name and venue address!
  // This guarantees 100% synchronization with the actual event location entered by client/admin.
  const cleanVenue = (venueName || '')
    .replace(/Grand\s+Ballroom\s+&?\s*Garden\s+Paviliun\s*-\s*Plataran\s+Menteng/gi, '')
    .replace(/The\s+Botanical\s+Glasshouse\s*-\s*Plataran\s+Menteng/gi, '')
    .trim();

  const cleanAddress = (venueAddress || '')
    .replace(/Jl\.\s*H\.O\.S\.\s*Cokroaminoto\s*No\.42,\s*Menteng,\s*Kec\.\s*Menteng,\s*Kota\s*Jakarta\s*Pusat,\s*10350/gi, '')
    .trim();

  const parts = [cleanVenue || venueName, cleanAddress || venueAddress].filter(Boolean);
  const locationQuery = parts.join(', ').trim();

  if (locationQuery && (!isJakartaPlaceholder(locationQuery) || venueIsJakarta)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  if (venueName && (!isJakartaPlaceholder(venueName) || venueIsJakarta)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(venueName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // 5. Ultimate fallback if venue is not provided
  return `https://maps.google.com/maps?q=Lokasi+Acara+Pernikahan&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
