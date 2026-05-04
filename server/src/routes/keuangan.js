import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get keuangan with filters (public)
router.get('/', async (req, res) => {
  try {
    const { bulan, tahun, santriId, status, search } = req.query;
    const where = {};

    if (bulan) where.bulan = parseInt(bulan);
    if (tahun) where.tahun = parseInt(tahun);
    if (santriId) where.santriId = parseInt(santriId);
    if (status) where.status = status;
    if (search) {
      where.santri = { nama: { contains: search } };
    }

    const keuangan = await prisma.keuangan.findMany({
      where,
      include: { santri: { select: { id: true, nama: true, kelas: true } } },
      orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }, { santri: { nama: 'asc' } }]
    });

    res.json(keuangan);
  } catch (error) {
    console.error('Get keuangan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get yearly summary (public)
router.get('/summary', async (req, res) => {
  try {
    const { tahun } = req.query;
    const where = {};
    if (tahun) where.tahun = parseInt(tahun);

    const all = await prisma.keuangan.findMany({ where });
    
    const totalTagihan = all.reduce((sum, k) => sum + k.jumlah, 0);
    const totalLunas = all.filter(k => k.status === 'Lunas').reduce((sum, k) => sum + k.jumlah, 0);
    const totalBelumLunas = totalTagihan - totalLunas;
    const jumlahLunas = all.filter(k => k.status === 'Lunas').length;
    const jumlahBelumLunas = all.filter(k => k.status !== 'Lunas').length;

    res.json({
      totalTagihan,
      totalLunas,
      totalBelumLunas,
      jumlahLunas,
      jumlahBelumLunas,
      totalEntri: all.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Create keuangan (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { santriId, bulan, tahun, jumlah, status, catatan } = req.body;
    
    if (!santriId || !bulan || !tahun || jumlah === undefined) {
      return res.status(400).json({ error: 'Data keuangan tidak lengkap' });
    }

    const keuangan = await prisma.keuangan.create({
      data: {
        santriId: parseInt(santriId),
        bulan: parseInt(bulan),
        tahun: parseInt(tahun),
        jumlah: parseInt(jumlah),
        status: status || 'Belum Lunas',
        catatan: catatan || ''
      },
      include: { santri: { select: { id: true, nama: true, kelas: true } } }
    });

    res.status(201).json(keuangan);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Data keuangan untuk santri, bulan, dan tahun ini sudah ada' });
    }
    console.error('Create keuangan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Update keuangan (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { santriId, bulan, tahun, jumlah, status, catatan } = req.body;
    
    const data = {};
    if (santriId) data.santriId = parseInt(santriId);
    if (bulan) data.bulan = parseInt(bulan);
    if (tahun) data.tahun = parseInt(tahun);
    if (jumlah !== undefined) data.jumlah = parseInt(jumlah);
    if (status) data.status = status;
    if (catatan !== undefined) data.catatan = catatan;

    const keuangan = await prisma.keuangan.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { santri: { select: { id: true, nama: true, kelas: true } } }
    });

    res.json(keuangan);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Data keuangan tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Delete keuangan (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.keuangan.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Data keuangan berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Data keuangan tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

export default router;
