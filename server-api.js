import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const RSVPS_FILE = path.join(DATA_DIR, 'rsvps.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

export function loadStoredProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const content = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('[API] Error reading projects.json:', err);
  }
  return [];
}

export function saveStoredProjects(projects) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[API] Error writing projects.json:', err);
    return false;
  }
}

export function loadStoredRsvps() {
  try {
    if (fs.existsSync(RSVPS_FILE)) {
      const content = fs.readFileSync(RSVPS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveStoredRsvps(rsvps) {
  try {
    fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
    return true;
  } catch {}
  return false;
}

export function extractDriveFileId(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  const m1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  const m3 = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (m3) return m3[1];
  return null;
}

export async function proxyAudioStream(req, res) {
  const urlParam = req.query?.url || '';
  const idParam = req.query?.id || '';
  const rawUrl = Array.isArray(urlParam) ? urlParam[0] : urlParam;
  const rawId = Array.isArray(idParam) ? idParam[0] : idParam;

  const driveId = rawId || extractDriveFileId(rawUrl);

  let targetUrl = '';
  if (driveId) {
    targetUrl = `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`;
  } else if (rawUrl) {
    targetUrl = rawUrl;
  } else {
    res.statusCode = 400;
    return res.end('Parameter url atau id diperlukan');
  }

  try {
    const fetchHeaders = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: '*/*',
    };

    let response = await fetch(targetUrl, { headers: fetchHeaders, redirect: 'follow' });

    // Secondary fallback for Google Drive uc?export endpoint if first was blocked
    if (!response.ok && driveId) {
      const fallbackUrl = `https://docs.google.com/uc?export=download&id=${driveId}&confirm=t`;
      response = await fetch(fallbackUrl, { headers: fetchHeaders, redirect: 'follow' });
    }

    if (!response.ok) {
      res.statusCode = response.status || 502;
      return res.end('Gagal memutar audio dari tautan yang diberikan');
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const cleanContentType = contentType.includes('text/html') ? 'audio/mpeg' : contentType;

    res.setHeader('Content-Type', cleanContentType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    const arrayBuffer = await response.arrayBuffer();
    res.statusCode = 200;
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('[AudioProxy] Stream error:', err);
    res.statusCode = 500;
    res.end('Error proxying audio stream');
  }
}
