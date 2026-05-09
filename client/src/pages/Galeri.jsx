import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Filter, Calendar, X } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Card, Skeleton, Badge, Button, Dialog } from '../components/ui';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

export default function Galeri() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/galeri');
        setGaleri(res.data);
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['Semua', ...new Set(galeri.map(g => g.kategori))];
  const filtered = activeCategory === 'Semua' ? galeri : galeri.filter(g => g.kategori === activeCategory);

  return (
    <PageLayout>
      <Helmet>
        <title>Galeri Kegiatan - TPQ Baiturrahim Lombok Timur</title>
        <meta name="description" content="Lihat dokumentasi kegiatan, prestasi, dan momen berharga santri TPQ Baiturrahim Lombok Timur dalam membangun generasi Qur'ani." />
      </Helmet>
      <div className="pt-8 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-blue-50/50 dark:from-slate-900 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">Dokumentasi</span>
              <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-white mt-3 mb-6">Galeri Kegiatan</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Momen-momen berharga dalam perjalanan belajar, prestasi, dan kebersamaan santri TPQ Baiturrahim.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-slate-100 dark:border-slate-800 sticky top-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-3xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Belum ada foto dalam kategori ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 6) * 0.05 }}
                    onClick={() => setSelectedImage(item)}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden border-none shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.judul}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <div className="text-white">
                            <Badge variant="primary" className="mb-2 bg-blue-500 text-white border-none">
                              {item.kategori}
                            </Badge>
                            <h3 className="font-bold text-lg leading-tight">{item.judul}</h3>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Dialog */}
        <Dialog 
          open={!!selectedImage} 
          onClose={() => setSelectedImage(null)}
          title={selectedImage?.judul}
        >
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.judul} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Tahun {selectedImage.tahun}</span>
                <span className="mx-2">•</span>
                <Badge>{selectedImage.kategori}</Badge>
              </div>
              {selectedImage.deskripsi && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedImage.deskripsi}
                </p>
              )}
              <div className="pt-4 flex justify-end">
                <Button variant="secondary" onClick={() => setSelectedImage(null)}>Tutup</Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </PageLayout>
  );
}
