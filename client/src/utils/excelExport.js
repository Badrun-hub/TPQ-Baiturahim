import * as XLSX from 'xlsx';
import { formatRupiah, namaBulan } from './format';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Calculates auto column widths for Excel worksheet
 * @param {Array<Array<any>>} data 
 * @returns {Array<{wch: number}>}
 */
const getColumnWidths = (data) => {
  const colWidths = [];
  data.forEach(row => {
    row.forEach((val, colIdx) => {
      const cellVal = val !== null && val !== undefined ? String(val) : '';
      const cellLen = cellVal.length;
      if (!colWidths[colIdx] || cellLen > colWidths[colIdx]) {
        colWidths[colIdx] = cellLen;
      }
    });
  });
  // Add padding and set min width
  return colWidths.map(w => ({ wch: Math.max(w + 4, 12) }));
};

/**
 * Helper to download workbook
 */
const downloadWorkbook = (wb, filename) => {
  XLSX.writeFile(wb, filename);
};

/**
 * Export Santri Data to Excel
 */
export const exportSantriToExcel = (santriList, search = '') => {
  const nowStr = format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id });
  
  const rows = [
    ['TPQ BAITURRAHIM'],
    ['LAPORAN DATA SANTRI'],
    [`Tanggal Cetak: ${nowStr}`],
    [`Filter Pencarian: ${search || 'Semua Data'}`],
    [], // Empty row separator
    ['No.', 'Nama Lengkap', 'Kelas', 'No. HP Wali', 'Alamat']
  ];

  santriList.forEach((s, idx) => {
    rows.push([
      idx + 1,
      s.nama || '-',
      s.kelas || '-',
      s.noHp || '-',
      s.alamat || '-'
    ]);
  });

  rows.push([]);
  rows.push(['SUMMARY DATA']);
  rows.push(['Total Santri Terdaftar:', santriList.length]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws['!cols'] = getColumnWidths(rows);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Santri');

  const fileDate = format(new Date(), 'yyyy-MM-dd');
  downloadWorkbook(wb, `Data_Santri_TPQ_Baiturrahim_${fileDate}.xlsx`);
};

/**
 * Export Absensi Data to Excel
 */
export const exportAbsensiToExcel = (santriList, absensiList, tanggal, filterKelas = '') => {
  const formattedDate = format(new Date(tanggal), 'EEEE, d MMMM yyyy', { locale: id });
  const nowStr = format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id });

  const rows = [
    ['TPQ BAITURRAHIM'],
    ['REKAP PRESENSI / ABSENSI SANTRI'],
    [`Tanggal Presensi: ${formattedDate}`],
    [`Filter Kelas: ${filterKelas || 'Semua Kelas'}`],
    [`Tanggal Cetak: ${nowStr}`],
    [], // Empty row separator
    ['No.', 'Nama Santri', 'Kelas', 'Status Kehadiran']
  ];

  let hadirCount = 0;
  let izinCount = 0;
  let sakitCount = 0;
  let alphaCount = 0;
  let belumCount = 0;

  santriList.forEach((s, idx) => {
    const record = absensiList.find(a => a.santriId === s.id);
    const status = record ? record.status : 'Belum diisi';

    if (status === 'Hadir') hadirCount++;
    else if (status === 'Izin') izinCount++;
    else if (status === 'Sakit') sakitCount++;
    else if (status === 'Alpha') alphaCount++;
    else belumCount++;

    rows.push([
      idx + 1,
      s.nama || '-',
      s.kelas || '-',
      status
    ]);
  });

  const totalFiltered = santriList.length;
  const persenHadir = totalFiltered > 0 ? Math.round((hadirCount / totalFiltered) * 100) : 0;

  rows.push([]);
  rows.push(['RINGKASAN PRESENSI']);
  rows.push(['Total Santri:', totalFiltered]);
  rows.push(['Hadir:', hadirCount]);
  rows.push(['Izin:', izinCount]);
  rows.push(['Sakit:', sakitCount]);
  rows.push(['Alpha:', alphaCount]);
  rows.push(['Belum Dicatat:', belumCount]);
  rows.push(['Persentase Kehadiran:', `${persenHadir}%`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = getColumnWidths(rows);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Absensi Santri');

  downloadWorkbook(wb, `Absensi_Santri_TPQ_Baiturrahim_${tanggal}.xlsx`);
};

/**
 * Export Keuangan Data to Excel
 */
export const exportKeuanganToExcel = (keuanganList, filterBulan, filterTahun, search = '') => {
  const nowStr = format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id });
  const bulanText = filterBulan ? namaBulan[parseInt(filterBulan)] : 'Semua Bulan';
  const tahunText = filterTahun || 'Semua Tahun';

  const rows = [
    ['TPQ BAITURRAHIM'],
    ['LAPORAN KEUANGAN & PEMBAYARAN SPP'],
    [`Periode: ${bulanText} ${tahunText}`],
    [`Filter Pencarian: ${search || 'Semua'}`],
    [`Tanggal Cetak: ${nowStr}`],
    [], // Empty row separator
    ['No.', 'Nama Santri', 'Kelas', 'Bulan', 'Tahun', 'Jumlah (Rp)', 'Status', 'Catatan']
  ];

  let totalLunas = 0;
  let totalBelumLunas = 0;
  let countLunas = 0;
  let countBelumLunas = 0;

  keuanganList.forEach((item, idx) => {
    const nominal = item.jumlah || 0;
    if (item.status === 'Lunas') {
      totalLunas += nominal;
      countLunas++;
    } else {
      totalBelumLunas += nominal;
      countBelumLunas++;
    }

    rows.push([
      idx + 1,
      item.santri?.nama || '-',
      item.santri?.kelas || '-',
      namaBulan[item.bulan] || item.bulan,
      item.tahun || '-',
      nominal,
      item.status || 'Belum Lunas',
      item.catatan || '-'
    ]);
  });

  const totalKeseluruhan = totalLunas + totalBelumLunas;

  rows.push([]);
  rows.push(['RINGKASAN KEUANGAN']);
  rows.push(['Total Transaksi:', keuanganList.length]);
  rows.push(['Jumlah Lunas:', countLunas, `Total: ${formatRupiah(totalLunas)}`]);
  rows.push(['Jumlah Belum Lunas:', countBelumLunas, `Total: ${formatRupiah(totalBelumLunas)}`]);
  rows.push(['Total Keseluruhan Nominal:', '', formatRupiah(totalKeseluruhan)]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = getColumnWidths(rows);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');

  const fileDate = format(new Date(), 'yyyy-MM-dd');
  downloadWorkbook(wb, `Laporan_Keuangan_TPQ_Baiturrahim_${bulanText}_${tahunText}_${fileDate}.xlsx`);
};
