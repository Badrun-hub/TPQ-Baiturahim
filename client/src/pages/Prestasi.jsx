import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Filter, Search, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, Skeleton, Badge, Input } from '../components/ui';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

const tingkatColors = {
  Kecamatan: 'primary',
  Kabupaten: 'success',
  Provinsi: 'warning',
  Nasional: 'danger',
};

const peringkatEmoji = { 'Juara 1': '🥇', 'Juara 2': '🥈', 'Juara 3': '🥉', 'Harapan': '🏅' };

export default function Prestasi() {
  const [prestasi, setPrestasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTingkat, setActiveTingkat] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/prestasi');
        setPrestasi(res.data);
      } catch (err) {
        console.error('Failed to fetch prestasi', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tingkatOptions = ['Semua', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional'];
  
  const filtered = prestasi.filter(p => {
    const matchTingkat = activeTingkat === 'Semua' || p.tingkat === activeTingkat;
    const matchSearch = (p.judul?.toLowerCase().includes(search.toLowerCase()) || false) || 
                       (p.nama?.toLowerCase().includes(search.toLowerCase()) || false) ||
                       (p.lomba?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchTingkat && matchSearch;
  });

  return (
    <PageLayout>
      <Helmet>
        <title>Prestasi Santri - TPQ Baiturrahim Lombok Timur</title>
        <meta name="description" content="Daftar prestasi dan pencapaian santri TPQ Baiturrahim Lombok Timur dalam berbagai perlombaan keagamaan, tahfidz, dan tilawah." />
      </Helmet>
      <div className="pt-8 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-amber-50/50 dark:from-slate-900 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">Pencapaian</span>
              <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-white mt-3 mb-6">Prestasi Santri</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Setiap piala dan sertifikat adalah bukti dedikasi santri kami dalam mengejar ilmu dan keberkahan Al-Qur'an.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 border-b border-slate-100 dark:border-slate-800 sticky top-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar flex-1">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                {tingkatOptions.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTingkat(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTingkat === t
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="w-full md:w-80">
                <Input 
                  placeholder="Cari prestasi, nama, atau lomba..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-3xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Belum ada data prestasi ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 4) * 0.05 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-16 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4 sm:p-0">
                            <span className="text-4xl">{peringkatEmoji[p.peringkat] || '🏆'}</span>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">
                                {p.judul}
                              </h3>
                              <Badge variant={tingkatColors[p.tingkat] || 'default'}>
                                {p.tingkat}
                              </Badge>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{p.lomba}</p>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{p.nama}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <Medal className="w-4 h-4" />
                                <span>{p.peringkat}</span>
                              </div>
                              <div className="text-sm text-slate-400 ml-auto">
                                Tahun {p.tahun}
                              </div>
                            </div>
                            {p.deskripsi && (
                              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 border-t border-slate-100 dark:border-slate-800 pt-3 italic">
                                "{p.deskripsi}"
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Hall of Fame */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Star className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Terus Berkarya</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Prestasi bukanlah akhir, melainkan awal dari tanggung jawab untuk terus menyebarkan kebaikan dan ilmu Al-Qur'an.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}