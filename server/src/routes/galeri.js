import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../lib/cloudinary.js';

const router = Router();


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

    const imageUrl = file.path;

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
