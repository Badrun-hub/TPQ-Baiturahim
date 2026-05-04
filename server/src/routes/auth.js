import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    
    if (!admin) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, nama: admin.nama, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: { id: admin.id, username: admin.username, nama: admin.nama, role: admin.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get current admin info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, nama: true, role: true, createdAt: true }
    });
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin tidak ditemukan' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// List all admins (protected)
router.get('/admins', authMiddleware, async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, username: true, nama: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Register new admin (protected - only existing admins can create new ones)
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { username, password, nama, role } = req.body;
    
    if (!username || !password || !nama) {
      return res.status(400).json({ error: 'Username, password, dan nama wajib diisi' });
    }

    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        nama,
        role: role || 'admin'
      },
      select: { id: true, username: true, nama: true, role: true, createdAt: true }
    });

    res.status(201).json(admin);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Update admin (protected)
router.put('/admins/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, nama, role } = req.body;
    
    const data = {};
    if (username) data.username = username;
    if (nama) data.nama = nama;
    if (role) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data,
      select: { id: true, username: true, nama: true, role: true, createdAt: true }
    });

    res.json(admin);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Admin tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Delete admin (protected)
router.delete('/admins/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri' });
    }

    await prisma.admin.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Admin berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Admin tidak ditemukan' });
    }
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

export default router;
