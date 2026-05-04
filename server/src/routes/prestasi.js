import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { tingkat, tahun } = req.query;
    const where = {};
    if (tingkat) where.tingkat = tingkat;
    if (tahun) where.tahun = parseInt(tahun);
    const prestasi = await prisma.prestasi.findMany({ where, orderBy: { tahun: 'desc' } });
    res.json(prestasi);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { judul, nama, lomba, tingkat, peringkat, tahun, deskripsi } = req.body;
    if (!judul || !nama || !lomba || !tingkat || !peringkat || !tahun) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }
    const prestasi = await prisma.prestasi.create({
      data: { judul, nama, lomba, tingkat, peringkat, tahun: parseInt(tahun), deskripsi: deskripsi || '' }
    });
    res.status(201).json(prestasi);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { judul, nama, lomba, tingkat, peringkat, tahun, deskripsi } = req.body;
    const prestasi = await prisma.prestasi.update({
      where: { id: parseInt(req.params.id) },
      data: { judul, nama, lomba, tingkat, peringkat, tahun: tahun ? parseInt(tahun) : undefined, deskripsi }
    });
    res.json(prestasi);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.prestasi.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

export default router;
