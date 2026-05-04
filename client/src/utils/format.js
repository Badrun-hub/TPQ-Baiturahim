export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export const namaBulan = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const daftarKelas = [
  'Tingkat 1', 'Tingkat 2', 'Tingkat 3',
  'Al-Qur\'an 1', 'Al-Qur\'an 2'
];

export const formatTanggal = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const statusColors = {
  'Hadir': 'badge-hadir',
  'Izin': 'badge-izin',
  'Sakit': 'badge-sakit',
  'Alpha': 'badge-alpha',
  'Lunas': 'badge-lunas',
  'Belum Lunas': 'badge-belum',
};

export const getTodayString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};
