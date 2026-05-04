import { useEffect, useState } from 'react';
import AdminLayout from './adminlayout';
import { Users, CalendarCheck, Wallet, Trophy, TrendingUp, ArrowRight, Star, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Skeleton } from '../../components/ui';
import { formatRupiah } from '../../utils/format';
import api from '../../utils/api';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({ santri: 0, absensiHariIni: 0, totalAbsensi: 0, keuanganBelum: 0, totalPrestasi: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [santriRes, absensiRes, keuanganRes, prestasiRes] = await Promise.all([
          api.get('/santri'),
          api.get('/absensi', { params: { tanggal: today } }),
          api.get('/keuangan/summary', { params: { tahun: new Date().getFullYear() } }),
          api.get('/prestasi'),
        ]);
        setStats({
          santri: Array.isArray(santriRes.data) ? santriRes.data.length : 0,
          absensiHariIni: Array.isArray(absensiRes.data) ? absensiRes.data.filter(a => a.status === 'Hadir').length : 0,
          totalAbsensi: Array.isArray(absensiRes.data) ? absensiRes.data.length : 0,
          keuanganBelum: keuanganRes.data?.totalBelumLunas || 0,
          totalPrestasi: Array.isArray(prestasiRes.data) ? prestasiRes.data.length : 0,
        });
      } catch (e) { 
        console.error(e); 
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Santri', value: stats.santri, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', link: '/admin/santri' },
    { title: 'Hadir Hari Ini', value: `${stats.absensiHariIni}/${stats.totalAbsensi}`, icon: CalendarCheck, color: 'text-green-500', bg: 'bg-green-500/10', link: '/admin/absensi' },
    { title: 'Piutang SPP', value: formatRupiah(stats.keuanganBelum), icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10', link: '/admin/keuangan' },
    { title: 'Total Prestasi', value: stats.totalPrestasi, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10', link: '/admin/prestasi' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Status terkini operasional TPQ Baiturahim</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={card.link} className="block group">
                <Card className="hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    {loading ? (
                      <Skeleton className="h-8 w-20 mb-1" />
                    ) : (
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold uppercase tracking-wider">{card.title}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" /> Aktifitas Cepat
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {[
                  { title: 'Input Absensi', desc: 'Catat kehadiran santri hari ini', icon: CalendarCheck, to: '/admin/absensi', color: 'bg-green-500' },
                  { title: 'Data Keuangan', desc: 'Kelola pembayaran SPP bulanan', icon: Wallet, to: '/admin/keuangan', color: 'bg-blue-500' },
                  { title: 'Manajemen Santri', desc: 'Tambah atau edit data santri', icon: Users, to: '/admin/santri', color: 'bg-purple-500' },
                  { title: 'Update Galeri', desc: 'Upload foto dokumentasi kegiatan', icon: ImageIcon, to: '/admin/galeri', color: 'bg-amber-500' },
                ].map((action, i) => (
                  <Link 
                    key={i} 
                    to={action.to} 
                    className={`p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i < 2 ? 'border-b' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shrink-0 shadow-lg shadow-current/20`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">{action.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12">
              <Star className="w-40 h-40" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" /> Prestasi Terkini
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Pantau terus perkembangan dan pencapaian santri kita untuk memotivasi yang lainnya.
              </p>
              <Link to="/admin/prestasi" className="inline-flex items-center gap-2 text-white font-bold text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
                Kelola Prestasi <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">Informasi Sistem</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Versi Aplikasi</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">v2.0.1</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Database</span>
                  <span className="font-bold text-green-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> SQLite Connected
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}