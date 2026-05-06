import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import santriRoutes from './routes/santri.js';
import absensiRoutes from './routes/absensi.js';
import keuanganRoutes from './routes/keuangan.js';
import galeriRoutes from './routes/galeri.js';
import prestasiRoutes from './routes/prestasi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: [
    'https://tpq-baiturahim.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/santri', santriRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/prestasi', prestasiRoutes);

// Health check (penting untuk Railway)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Hanya jalankan server jika tidak di Vercel/Production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
