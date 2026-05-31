import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, DollarSign, CheckCircle, Clock, Info, Filter } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, Table, Skeleton, Badge, Input, Select } from '../components/ui';
import api from '../utils/api';
import { formatRupiah, namaBulan } from '../utils/format';
import { Helmet } from 'react-helmet-async';

export default function Keuangan() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ totalTagihan: 0, totalLunas: 0, totalBelumLunas: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [filterStatus, setFilterStatus] = useState('');
  const [limit, setLimit] = useState('10');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          tahun: filterTahun,
        };
        if (search) params.search = search;
        if (filterBulan) params.bulan = filterBulan;
        if (filterStatus) params.status = filterStatus;

        const [dataRes, summaryRes] = await Promise.all([
          api.get('/keuangan', { params }),
          api.get('/keuangan/summary', { params: { tahun: filterTahun } })
        ]);
        setData(dataRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Failed to fetch financial data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, filterBulan, filterTahun, filterStatus]);

  const stats = [
    { label: 'Total Tagihan', value: formatRupiah(summary.totalTagihan), icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Sudah Lunas', value: formatRupiah(summary.totalLunas), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Belum Bayar', value: formatRupiah(summary.totalBelumLunas), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <PageLayout>
      <Helmet>
        <title>Informasi Keuangan & SPP - TPQ Baiturrahim Lombok Timur</title>
        <meta name="description" content="Transparansi informasi keuangan dan status pembayaran SPP santri TPQ Baiturrahim Lombok Timur." />
      </Helmet>
      <div className="pt-8 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-green-50/50 dark:from-slate-900 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-green-600 dark:text-green-400 font-bold tracking-widest uppercase text-sm">Transparansi</span>
              <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-white mt-3 mb-6">Informasi Keuangan</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Akses terbuka untuk memantau status pembayaran SPP santri sebagai wujud akuntabilitas pengelolaan TPQ Baiturrahim.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Cards */}
        {/* <section className="py-8 px-4 -mt-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="shadow-lg shadow-slate-200/50 dark:shadow-none">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                        <s.icon className={`w-6 h-6 ${s.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label} ({filterTahun})</p>
                        <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Filters */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[240px]">
                  <Input
                    label="Cari Nama Santri"
                    placeholder="Masukkan nama santri..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-40">
                  <Select label="Bulan" value={filterBulan} onChange={e => setFilterBulan(e.target.value)}>
                    <option value="">Semua Bulan</option>
                    {namaBulan.slice(1).map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
                  </Select>
                </div>
                <div className="w-full sm:w-32">
                  <Select label="Tahun" value={filterTahun} onChange={e => setFilterTahun(e.target.value)}>
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </Select>
                </div>
                <div className="w-full sm:w-40">
                  <Select label="Status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Semua Status</option>
                    <option>Lunas</option>
                    <option>Belum Lunas</option>
                  </Select>
                </div>
                <div className="w-full sm:w-40">
                  <Select label="Tampilkan" value={limit} onChange={e => setLimit(e.target.value)}>
                    <option value="5">5 Data</option>
                    <option value="10">10 Data</option>
                    <option value="50">50 Data</option>
                    <option value="semua">Semua</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <Info className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Tidak ada data pembayaran ditemukan.</p>
              </div>
            ) : (
              <Table
                headers={[
                  { label: 'Nama Santri' },
                  { label: 'Kelas' },
                  { label: 'Bulan & Tahun' },
                  { label: 'Jumlah' },
                  { label: 'Status' },
                  { label: 'Catatan', className: 'hidden md:table-cell' }
                ]}
              >
                {data.slice(0, limit === 'semua' ? data.length : parseInt(limit)).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">
                      {item.santri?.nama}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {item.santri?.kelas}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {namaBulan[item.bulan]} {item.tahun}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">
                      {formatRupiah(item.jumlah)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={item.status === 'Lunas' ? 'success' : 'warning'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell italic">
                      {item.catatan || '-'}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>
        </section>

        {/* Info Box */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Informasi Pembayaran</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Pembayaran SPP dapat dilakukan langsung melalui bendahara TPQ setiap hari efektif. Mohon pastikan untuk meminta bukti cetak pembayaran kepada petugas setelah melakukan transaksi. Data di website ini akan diperbarui maksimal 1x24 jam setelah pembayaran diterima.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
