// server.js – Express API + static front‑end
import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());                     // allow local dev from any origin
app.use(express.json());             // parse JSON bodies
app.use(express.static('public'));   // serve index.html, main.js, etc.

// ---------- API routes ----------
app.get('/api/overall', async (req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM overall_usage ORDER BY timestamp DESC');
  res.json(rows);
});

app.post('/api/overall', async (req, res) => {
  const { timestamp, total_watts } = req.body;
  if (!timestamp || typeof total_watts !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO overall_usage (timestamp, total_watts) VALUES (?, ?)',
    timestamp,
    total_watts
  );
  res.json({ id: result.lastID });
});

app.get('/api/devices', async (req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM device_usage ORDER BY timestamp DESC');
  res.json(rows);
});

app.post('/api/devices', async (req, res) => {
  const { device_name, timestamp, watts } = req.body;
  if (!device_name || !timestamp || typeof watts !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO device_usage (device_name, timestamp, watts) VALUES (?, ?, ?)',
    device_name,
    timestamp,
    watts
  );
  res.json({ id: result.lastID });
});

// ---------- Fallback ----------
app.use((req, _res) => {
  console.log(`Unhandled request: ${req.method} ${req.path}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`%8=D Server listening on http://localhost:${PORT}`);
});
