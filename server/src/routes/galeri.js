import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/galeri';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'galeri-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'), false);
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const { kategori, tahun } = req.query;
    const where = {};
    if (kategori) where.kategori = kategori;
    if (tahun) where.tahun = parseInt(tahun);
    const galeri = await prisma.galeri.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(galeri);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.galeri.groupBy({ by: ['kategori'], _count: { id: true } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori, tahun } = req.body;
    const file = req.file;

    if (!judul || !tahun || !file) {
      return res.status(400).json({ error: 'Data tidak lengkap. Judul, tahun, dan file gambar wajib diisi.' });
    }

    const imageUrl = `/uploads/galeri/${file.filename}`;

    const galeri = await prisma.galeri.create({
      data: { 
        judul, 
        deskripsi: deskripsi || '', 
        kategori: kategori || 'Kegiatan', 
        imageUrl, 
        tahun: parseInt(tahun) 
      }
    });
    res.status(201).json(galeri);
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat mengunggah foto' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { judul, deskripsi, kategori, imageUrl, tahun } = req.body;
    const galeri = await prisma.galeri.update({
      where: { id: parseInt(req.params.id) },
      data: { judul, deskripsi, kategori, imageUrl, tahun: tahun ? parseInt(tahun) : undefined }
    });
    res.json(galeri);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.galeri.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

export default router;
