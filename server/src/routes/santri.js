import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all santri (public)
router.get('/', async (req, res) => {
  try {
    const { search, kelas } = req.query;
    const where = {};
    
    if (search) {
      where.nama = { contains: search };
    }
    if (kelas) {
      where.kelas = kelas;
    }

    const santri = await prisma.santri.findMany({
      where,
      orderBy: { nama: 'asc' }
    });
    res.json(santri);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get santri by id
router.get('/:id', async (req, res) => {
  try {
    const santri = await prisma.santri.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        absensi: { orderBy: { tanggal: 'desc' }, take: 30 },
        keuangan: { orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }] }
      }
    });
    
    if (!santri) {
      return res.status(404).json({ error: 'Santri tidak ditemukan' });
    }

    res.json(santri);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Create santri (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nama, kelas, alamat, noHp } = req.body;
    
    if (!nama || !kelas) {
      return res.status(400).json({ error: 'Nama dan kelas wajib diisi' });
    }

    const santri = await prisma.santri.create({
      data: { nama, kelas, alamat: alamat || '', noHp: noHp || '' }
    });

    res.status(201).json(santri);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Update santri (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nama, kelas, alamat, noHp } = req.body;
    
    const santri = await prisma.santri.update({
      where: { id: parseInt(req.params.id) },
      data: { nama, kelas, alamat, noHp }
    });

    res.json(santri);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Santri tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Delete santri (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.santri.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Santri berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Santri tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get stats (public)
router.get('/stats/summary', async (req, res) => {
  try {
    const totalSantri = await prisma.santri.count();
    const kelasList = await prisma.santri.groupBy({
      by: ['kelas'],
      _count: { id: true }
    });

    res.json({ totalSantri, kelasList });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

export default router;
