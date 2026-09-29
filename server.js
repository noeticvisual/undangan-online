import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory RSVP storage fallback
const inMemoryRsvps = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    port: PORT,
  });
});

// RSVP API
app.get('/api/rsvp', (req, res) => {
  res.json({ rsvps: inMemoryRsvps });
});

app.post('/api/rsvp', (req, res) => {
  try {
    const data = req.body;
    inMemoryRsvps.unshift(data);
    res.json({ success: true, count: inMemoryRsvps.length });
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

// Serve production static assets from dist/
const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist is not yet built
  app.get('*', (req, res) => {
    res.send('Aplikasi sedang memproses build. Harap refresh kembali beberapa saat lagi.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
