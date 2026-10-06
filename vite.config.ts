import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {
  loadStoredProjects,
  saveStoredProjects,
  loadStoredRsvps,
  saveStoredRsvps,
  proxyAudioStream,
} from './server-api.js';

function weddingBackendApiPlugin(): Plugin {
  return {
    name: 'wedding-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url || '/', 'http://localhost:3000');
        const pathname = parsedUrl.pathname;

        if (pathname === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
          return;
        }

        // Audio proxy
        if ((pathname === '/api/audio-proxy' || pathname === '/api/drive-audio') && req.method === 'GET') {
          const queryObj: Record<string, string> = {};
          parsedUrl.searchParams.forEach((val, key) => {
            queryObj[key] = val;
          });
          (req as any).query = queryObj;
          await proxyAudioStream(req, res);
          return;
        }

        // Projects API
        if (pathname === '/api/projects' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          const projects = loadStoredProjects();
          res.end(JSON.stringify({ projects }));
          return;
        }

        if (pathname.startsWith('/api/projects/') && req.method === 'GET') {
          const slug = pathname.replace('/api/projects/', '').toLowerCase().trim();
          res.setHeader('Content-Type', 'application/json');
          const projects = loadStoredProjects();
          const found = projects.find((p: any) => p.slug.toLowerCase() === slug);
          if (found) {
            res.end(JSON.stringify({ project: found }));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Proyek tidak ditemukan' }));
          }
          return;
        }

        if (pathname === '/api/projects' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const project = JSON.parse(body);
              if (!project || !project.slug) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Data proyek tidak valid' }));
                return;
              }
              const projects = loadStoredProjects();
              const idx = projects.findIndex(
                (p: any) => p.id === project.id || p.slug.toLowerCase() === project.slug.toLowerCase()
              );
              if (idx >= 0) {
                projects[idx] = { ...projects[idx], ...project, updatedAt: new Date().toISOString() };
              } else {
                projects.unshift({
                  ...project,
                  createdAt: project.createdAt || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
              }
              saveStoredProjects(projects);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, project }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            }
          });
          return;
        }

        if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
          const id = pathname.replace('/api/projects/', '');
          let projects = loadStoredProjects();
          projects = projects.filter((p: any) => p.id !== id && p.slug !== id);
          saveStoredProjects(projects);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // RSVP API
        if (pathname === '/api/rsvp' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          const rsvps = loadStoredRsvps();
          res.end(JSON.stringify({ rsvps }));
          return;
        }

        if (pathname === '/api/rsvp' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const rsvps = loadStoredRsvps();
              rsvps.unshift({ ...data, id: data.id || `rsvp-${Date.now()}` });
              saveStoredRsvps(rsvps);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: rsvps.length }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  return {
    plugins: [react(), tailwindcss(), weddingBackendApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 2500,
      outDir: 'dist',
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: port,
      allowedHosts: true as const,
    },
  };
});