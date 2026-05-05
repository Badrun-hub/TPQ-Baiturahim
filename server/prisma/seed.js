import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword, nama: 'Administrator', role: 'admin' }
  });
  console.log('✅ Admin created (admin / admin123)');

  // Create santri
  const santriData = [
    { nama: 'Ahmad Fauzi', kelas: 'Iqra 1', alamat: 'Jl. Masjid No. 1', noHp: '081234567890' },
    { nama: 'Siti Aisyah', kelas: 'Iqra 2', alamat: 'Jl. Pesantren No. 5', noHp: '081234567891' },
    { nama: 'Muhammad Rizki', kelas: 'Iqra 3', alamat: 'Jl. Surau No. 3', noHp: '081234567892' },
    { nama: 'Fatimah Zahra', kelas: 'Al-Quran 1', alamat: 'Jl. Musholla No. 7', noHp: '081234567893' },
    { nama: 'Abdullah Rahman', kelas: 'Al-Quran 1', alamat: 'Jl. Langgar No. 2', noHp: '081234567894' },
    { nama: 'Khadijah Nur', kelas: 'Al-Quran 2', alamat: 'Jl. Merdeka No. 10', noHp: '081234567895' },
    { nama: 'Umar Hasan', kelas: 'Iqra 1', alamat: 'Jl. Pahlawan No. 4', noHp: '081234567896' },
    { nama: 'Zainab Putri', kelas: 'Iqra 2', alamat: 'Jl. Dahlia No. 8', noHp: '081234567897' },
    { nama: 'Bilal Akbar', kelas: 'Iqra 3', alamat: 'Jl. Kenanga No. 6', noHp: '081234567898' },
    { nama: 'Maryam Salsabila', kelas: 'Al-Quran 1', alamat: 'Jl. Melati No. 9', noHp: '081234567899' },
    { nama: 'Yusuf Hakim', kelas: 'Al-Quran 2', alamat: 'Jl. Anggrek No. 11', noHp: '081234567800' },
    { nama: 'Hafidz Ilham', kelas: 'Iqra 1', alamat: 'Jl. Flamboyan No. 12', noHp: '081234567801' },
    { nama: 'Aisyah Rahmah', kelas: 'Iqra 2', alamat: 'Jl. Mawar No. 13', noHp: '081234567802' },
    { nama: 'Ibrahim Fajar', kelas: 'Al-Quran 1', alamat: 'Jl. Teratai No. 14', noHp: '081234567803' },
    { nama: 'Safiya Amina', kelas: 'Al-Quran 2', alamat: 'Jl. Cempaka No. 15', noHp: '081234567804' },
  ];

  for (const s of santriData) {
    await prisma.santri.upsert({
      where: { id: santriData.indexOf(s) + 1 },
      update: {},
      create: s
    });
  }
  console.log(`✅ ${santriData.length} santri created`);

  // Create keuangan data
  const santriList = await prisma.santri.findMany();
  const statuses = ['Lunas', 'Belum Lunas'];
  
  for (const santri of santriList) {
    for (let bulan = 1; bulan <= 4; bulan++) {
      await prisma.keuangan.upsert({
        where: { santriId_bulan_tahun: { santriId: santri.id, bulan, tahun: 2026 } },
        update: {},
        create: {
          santriId: santri.id,
          bulan,
          tahun: 2026,
          jumlah: 150000,
          status: bulan <= 3 ? 'Lunas' : statuses[Math.floor(Math.random() * 2)],
          catatan: bulan <= 3 ? '' : 'SPP bulan berjalan'
        }
      });
    }
  }
  console.log('✅ Keuangan data created');

  // Create absensi data for the last 7 days
  const statusAbsensi = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Izin', 'Sakit', 'Alpha'];
  const today = new Date();
  
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    if (date.getDay() === 0) continue; // Skip Sunday
    const tanggal = date.toISOString().split('T')[0];

    for (const santri of santriList) {
      const status = statusAbsensi[Math.floor(Math.random() * statusAbsensi.length)];
      await prisma.absensi.upsert({
        where: { santriId_tanggal: { santriId: santri.id, tanggal } },
        update: {},
        create: { santriId: santri.id, tanggal, status }
      });
    }
  }
  console.log('✅ Absensi data created');

  // Create galeri data
  const galeriData = [
    { judul: 'Wisuda Santri 2025', deskripsi: 'Acara wisuda santri yang telah khatam Al-Quran', kategori: 'Wisuda', imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c8df?w=800', tahun: 2025 },
    { judul: 'Lomba Hafalan Juz 30', deskripsi: 'Kompetisi hafalan Juz Amma antar santri', kategori: 'Lomba', imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800', tahun: 2025 },
    { judul: 'Peringatan Maulid Nabi', deskripsi: 'Kegiatan peringatan Maulid Nabi Muhammad SAW', kategori: 'Kegiatan', imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800', tahun: 2025 },
    { judul: 'Belajar Mengaji Bersama', deskripsi: 'Suasana belajar mengaji di TPQ Baiturahim', kategori: 'Kegiatan', imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800', tahun: 2026 },
    { judul: 'Pesantren Kilat Ramadhan', deskripsi: 'Kegiatan pesantren kilat di bulan Ramadhan', kategori: 'Kegiatan', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', tahun: 2026 },
    { judul: 'Santunan Anak Yatim', deskripsi: 'Pembagian santunan untuk anak yatim', kategori: 'Sosial', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', tahun: 2026 },
  ];

  for (const g of galeriData) {
    await prisma.galeri.create({ data: g });
  }
  console.log('✅ Galeri data created');

  // Create prestasi data
  const prestasiData = [
    { judul: 'Juara 1 MTQ Tingkat Kecamatan', nama: 'Ahmad Fauzi', lomba: 'Musabaqah Tilawatil Quran', tingkat: 'Kecamatan', peringkat: 'Juara 1', tahun: 2025 },
    { judul: 'Juara 2 Hafalan Juz 30', nama: 'Fatimah Zahra', lomba: 'Lomba Hafalan Juz Amma', tingkat: 'Kabupaten', peringkat: 'Juara 2', tahun: 2025 },
    { judul: 'Juara 3 Kaligrafi', nama: 'Khadijah Nur', lomba: 'Lomba Kaligrafi Islam', tingkat: 'Kecamatan', peringkat: 'Juara 3', tahun: 2025 },
    { judul: 'Juara 1 Ceramah Anak', nama: 'Abdullah Rahman', lomba: 'Lomba Ceramah Anak', tingkat: 'Kabupaten', peringkat: 'Juara 1', tahun: 2026 },
    { judul: 'Juara Harapan Adzan', nama: 'Bilal Akbar', lomba: 'Lomba Adzan', tingkat: 'Provinsi', peringkat: 'Harapan', tahun: 2026 },
  ];

  for (const p of prestasiData) {
    await prisma.prestasi.create({ data: p });
  }
  console.log('✅ Prestasi data created');

  console.log('\n🎉 Seeding completed!');
  console.log('📋 Login: admin / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
