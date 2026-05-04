import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get absensi with filters (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { tanggal, bulan, tahun, santriId } = req.query;
    const where = {};

    if (tanggal) {
      where.tanggal = tanggal;
    } else if (bulan && tahun) {
      const monthStr = bulan.toString().padStart(2, '0');
      where.tanggal = {
        startsWith: `${tahun}-${monthStr}`
      };
    }

    if (santriId) {
      where.santriId = parseInt(santriId);
    }

    const absensi = await prisma.absensi.findMany({
      where,
      include: { santri: { select: { id: true, nama: true, kelas: true } } },
      orderBy: [{ tanggal: 'desc' }, { santri: { nama: 'asc' } }]
    });

    res.json(absensi);
  } catch (error) {
    console.error('Get absensi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Save single absensi (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { santriId, tanggal, status } = req.body;

    if (!santriId || !tanggal || !status) {
      return res.status(400).json({ error: 'santriId, tanggal, dan status wajib diisi' });
    }

    const absensi = await prisma.absensi.upsert({
      where: {
        santriId_tanggal: {
          santriId: parseInt(santriId),
          tanggal: tanggal
        }
      },
      update: { status },
      create: {
        santriId: parseInt(santriId),
        tanggal: tanggal,
        status: status
      }
    });

    res.json(absensi);
  } catch (error) {
    console.error('Save absensi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Bulk save absensi for a date (protected)
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { tanggal, data } = req.body;
    // data = [{ santriId, status }]

    if (!tanggal || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Tanggal dan data absensi wajib diisi' });
    }

    // Upsert each record
    const results = await Promise.all(
      data.map(item =>
        prisma.absensi.upsert({
          where: {
            santriId_tanggal: {
              santriId: item.santriId,
              tanggal: tanggal
            }
          },
          update: { status: item.status },
          create: {
            santriId: item.santriId,
            tanggal: tanggal,
            status: item.status
          }
        })
      )
    );

    res.json({ message: 'Absensi berhasil disimpan', count: results.length });
  } catch (error) {
    console.error('Bulk absensi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Update single absensi (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const absensi = await prisma.absensi.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { santri: { select: { id: true, nama: true, kelas: true } } }
    });

    res.json(absensi);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Absensi tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get monthly recap (protected)
router.get('/rekap', authMiddleware, async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    
    if (!bulan || !tahun) {
      return res.status(400).json({ error: 'Bulan dan tahun wajib diisi' });
    }

    const monthStr = bulan.toString().padStart(2, '0');
    const prefix = `${tahun}-${monthStr}`;

    const santriList = await prisma.santri.findMany({
      orderBy: { nama: 'asc' },
      include: {
        absensi: {
          where: {
            tanggal: { startsWith: prefix }
          }
        }
      }
    });

    const rekap = santriList.map(s => {
      const total = s.absensi.length;
      const hadir = s.absensi.filter(a => a.status === 'Hadir').length;
      const izin = s.absensi.filter(a => a.status === 'Izin').length;
      const sakit = s.absensi.filter(a => a.status === 'Sakit').length;
      const alpha = s.absensi.filter(a => a.status === 'Alpha').length;

      return {
        santriId: s.id,
        nama: s.nama,
        kelas: s.kelas,
        total,
        hadir,
        izin,
        sakit,
        alpha,
        persentase: total > 0 ? Math.round((hadir / total) * 100) : 0
      };
    });

    res.json(rekap);
  } catch (error) {
    console.error('Rekap error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

export default router;
