import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';
import {
  loadStoredProjects,
  saveStoredProjects,
  loadStoredRsvps,
  saveStoredRsvps,
  proxyAudioStream,
} from './server-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Health check endpoints for Cloud Run & load balancers
const healthHandler = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    time: new Date().toISOString(),
    port: PORT,
  });
};

app.get('/health', healthHandler);
app.get('/healthz', healthHandler);
app.get('/api/health', healthHandler);

// Audio proxy endpoint for Google Drive & external MP3s
app.get('/api/audio-proxy', (req: Request, res: Response) => {
  proxyAudioStream(req, res);
});
app.get('/api/drive-audio', (req: Request, res: Response) => {
  proxyAudioStream(req, res);
});

// Projects API endpoints
app.get('/api/projects', (req: Request, res: Response) => {
  const projects = loadStoredProjects();
  res.json({ projects });
});

app.get('/api/projects/:slug', (req: Request, res: Response) => {
  const slug = ((req.params.slug as string) || '').toLowerCase().trim();
  const projects = loadStoredProjects();
  const found = projects.find((p: any) => p.slug.toLowerCase() === slug);
  if (found) {
    res.json({ project: found });
  } else {
    res.status(404).json({ error: 'Proyek tidak ditemukan' });
  }
});

app.post('/api/projects', (req: Request, res: Response) => {
  try {
    const project = req.body;
    if (!project || !project.slug) {
      return res.status(400).json({ error: 'Data proyek atau slug tidak valid' });
    }

    const projects = loadStoredProjects();
    const existingIndex = projects.findIndex(
      (p: any) => p.id === project.id || p.slug.toLowerCase() === project.slug.toLowerCase()
    );

    if (existingIndex >= 0) {
      projects[existingIndex] = {
        ...projects[existingIndex],
        ...project,
        updatedAt: new Date().toISOString(),
      };
    } else {
      projects.unshift({
        ...project,
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    saveStoredProjects(projects);
    res.json({ success: true, project });
  } catch (err) {
    console.error('Gagal menyimpan proyek:', err);
    res.status(500).json({ error: 'Gagal menyimpan proyek di server' });
  }
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let projects = loadStoredProjects();
    projects = projects.filter((p: any) => p.id !== id && p.slug !== id);
    saveStoredProjects(projects);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus proyek' });
  }
});

// RSVP API endpoints
app.get('/api/rsvp', (req: Request, res: Response) => {
  const rsvps = loadStoredRsvps();
  res.json({ rsvps });
});

app.post('/api/rsvp', (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (data && typeof data === 'object') {
      const rsvps = loadStoredRsvps();
      rsvps.unshift({ ...data, id: data.id || `rsvp-${Date.now()}` });
      saveStoredRsvps(rsvps);
      res.json({ success: true, count: rsvps.length });
    } else {
      res.status(400).json({ error: 'Payload harus berupa JSON' });
    }
  } catch {
    res.status(500).json({ error: 'Gagal menyimpan data RSVP' });
  }
});

// Ensure production bundle exists
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('[Production Server] dist/index.html tidak ditemukan. Menjalankan vite build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('[Production Server] Build berhasil disiapkan.');
  } catch (err) {
    console.error('[Production Server] Build otomatis gagal:', err);
  }
}

// Serve production static assets from dist/
if (fs.existsSync(distPath)) {
  app.use(
    express.static(distPath, {
      maxAge: '1h',
    })
  );
}

// SPA fallback for all remaining GET routes
app.get('*', (req: Request, res: Response) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Aplikasi sedang menyiapkan berkas produksi. Harap muat ulang beberapa saat lagi.');
  }
});

// Start listening
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Production Server] Siap melayani pada http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Production Server] SIGTERM diterima, menutup server secara aman...');
  server.close(() => {
    process.exit(0);
  });
});
