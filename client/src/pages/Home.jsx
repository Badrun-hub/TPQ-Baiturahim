import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, BookOpen, Users, Trophy, Heart, ArrowRight, Star, Target, Eye, Clock, MapPin, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ParticleCanvas from '../components/particles/ParticleCanvas';
import { Card, CardContent } from '../components/ui';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const sejarah = [
  { tahun: '2011', peristiwa: 'TPQ Baiturrahim didirikan oleh tokoh masyarakat setempat dengan 10 santri pertama.' },
  { tahun: '2015', peristiwa: 'Pengembangan fasilitas dan penambahan tenaga pengajar profesional.' },
  { tahun: '2018', peristiwa: 'Peresmian kurikulum terintegrasi antara Al-Qur\'an dan pembinaan akhlak.' },
  { tahun: '2021', peristiwa: 'Adaptasi metode pembelajaran modern dan digitalisasi administrasi santri.' },
  { tahun: '2024', peristiwa: 'Kini melayani puluhan santri aktif dengan berbagai prestasi membanggakan.' },
];

const pengajar = [
  { nama: 'Ustadz Rahman S.Pd', peran: 'Pembina TPQ', spesialisasi: 'Tahfidz Al-Qur\'an', foto: '/pengajar/Rahman.jpg' },
  { nama: 'Ustadz M Sadir S.Pd', peran: 'Pembina TPQ', spesialisasi: 'Karakter Islami', foto: '/pengajar/Sadir.jpg' },
  { nama: 'Ustadz Fatoni Yusro S.pd', peran: 'Kepala TPQ', spesialisasi: 'Tahfidz Al-Qur\'an', foto: '/pengajar/yusro.jpg' },
  { nama: 'Ustadz Badarudin', peran: 'Sekretaris TPQ | Developer', spesialisasi: 'Tahfidz Al-Qur\'an', foto: '/pengajar/badrun.jpg' },
  { nama: 'Ustadz Amrizal', peran: 'Anggota TPQ', spesialisasi: 'Tahfidz Al-Qur\'an', foto: '/pengajar/Amrizal.jpg' },
  { nama: 'Ustadzah Asmawati', peran: 'Anggota TPQ', spesialisasi: 'Metode Tilawati', foto: '/pengajar/Asmawati.jpg' },
  { nama: 'Ustadzah Sakdian', peran: 'Bendahara TPQ', spesialisasi: 'Karakter Islami', foto: '/pengajar/Sakdiah.jpg' },
  { nama: 'Ustadz Apriliana', peran: 'Anggota TPQ', spesialisasi: 'Tajwid & Makhraj', foto: '/pengajar/Apriliana.jpg' },
  { nama: 'Ustadzah Andayani', peran: 'Anggota TPQ', spesialisasi: 'Karakter Islami', foto: '/pengajar/Andayani.jpg' },
];

export default function Home() {
  const [statsData, setStatsData] = useState({ totalSantri: 0, totalPrestasi: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [santriRes, prestasiRes] = await Promise.all([
          api.get('/santri/stats/summary'),
          api.get('/prestasi')
        ]);
        setStatsData({
          totalSantri: santriRes.data.totalSantri,
          totalPrestasi: prestasiRes.data.length
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: Users, label: 'Santri Aktif', value: `${statsData.totalSantri}+` },
    { icon: BookOpen, label: 'Kelas', value: '8' },
    { icon: Trophy, label: 'Prestasi', value: `${statsData.totalPrestasi}+` },
    { icon: Heart, label: 'Tahun Berdiri', value: '15' },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "TPQ Baiturrahim Lombok Timur",
    "description": "Lembaga pendidikan Al-Qur'an terpercaya di Kalijaga Baru, Lombok Timur.",
    "url": "https://tpq-baiturahim.vercel.app/",
    "logo": "https://tpq-baiturahim.vercel.app/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Kalpataru, Lendang Bunga Selatan",
      "addressLocality": "Kalijaga Baru",
      "addressRegion": "Lombok Timur",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+6287700147309",
      "contactType": "customer service"
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>TPQ Baiturrahim Lombok Timur - Membentuk Generasi Qur'ani</title>
        <meta name="description" content="TPQ Baiturrahim Lombok Timur adalah lembaga pendidikan Al-Qur'an terpercaya di Kalijaga Baru yang fokus pada pembentukan generasi Qur'ani yang berakhlak mulia." />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <div className="overflow-x-hidden">
        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
          {/* Particle Canvas */}
          <div className="absolute inset-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
            <ParticleCanvas />
          </div>

          {/* Ghost Arabic Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 dark:opacity-10">
            <span className="font-serif text-[20vw] font-bold text-slate-300 dark:text-slate-800 leading-none">
              إقرأ
            </span>
          </div>

          {/* Hero Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20 sm:pt-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              TPQ Baiturrahim Lombok Timur
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-bold text-4xl sm:text-6xl lg:text-7xl text-slate-800 dark:text-white mb-4 sm:mb-6 leading-tight">
              Membangun <span className="gradient-text">Generasi</span> Qur'ani
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              TPQ Baiturrahim — tempat terbaik bagi putra-putri Anda untuk menemukan keindahan Al-Qur'an dan membangun fondasi iman yang kokoh.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <a
                href="#tentang-kami"
                className="group relative px-8 py-3.5 sm:py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                Tentang Kami
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <Link
                to="/galeri"
                className="px-8 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                Lihat Galeri
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
          >
            <span className="text-[10px] tracking-widest uppercase font-bold">Scroll Down</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="font-bold text-3xl text-slate-800 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section id="tentang-kami" className="py-24 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Tentang Kami</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mt-3">Visi & Misi</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full border-none bg-blue-50/50 dark:bg-slate-900 shadow-none p-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Eye className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Visi</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
                    "Menjadi lembaga pendidikan Al-Qur'an unggulan yang melahirkan generasi Qur'ani berakhlak mulia, cerdas, dan mandiri."
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full border-none bg-green-50/50 dark:bg-slate-900 shadow-none p-8">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Misi</h3>
                  <ul className="space-y-4">
                    {[
                      'Menyelenggarakan pembelajaran Al-Qur\'an dengan metode efektif',
                      'Membina karakter santri berdasarkan nilai-nilai akhlakul karimah',
                      'Mengembangkan potensi santri dalam bidang tilawah dan tahfidz',
                      'Menjalin kolaborasi harmonis dengan orang tua santri'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROGRAM HIGHLIGHT */}
        <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">Program Kami</span>
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mt-3 mb-6 leading-tight">Pendidikan Al-Qur'an dengan Metode Modern</h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                  Sejak berdiri, TPQ Baiturrahim berkomitmen memberikan pengajaran Al-Qur'an yang efektif bagi anak-anak. Kami menggabungkan metode tradisional yang kuat dengan pendekatan interaktif.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Pembelajaran Iqra & Al-Qur\'an', 'Tahfidz Juz Amma', 'Pembinaan Akhlakul Karimah', 'Persiapan Lomba Keagamaan'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <Check className="w-4 h-4" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xl">
                    <img
                      src="/home.jpg"
                      alt="Santri belajar Al-Qur'an"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-3xl bg-blue-500/10 -z-10 blur-2xl" />
                  <div className="absolute -top-6 -right-6 w-40 h-40 rounded-3xl bg-green-500/10 -z-10 blur-2xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sejarah Timeline */}
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Perjalanan Kami</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mt-3">Sejarah Singkat</h2>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-12">
                {sejarah.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 hidden md:block" />
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 -translate-x-1/2 z-10" />
                    <div className="flex-1 pl-12 md:pl-0">
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <span className="text-blue-500 font-bold">{item.tahun}</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">{item.peristiwa}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tim Pengajar */}
        <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-16">
              <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Tim Pengajar</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mt-3">Ustadz & Ustadzah Kami</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pengajar.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-8">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <img
                          src={p.foto}
                          onError={(e) => { e.target.src = "/avatar-pengajar.svg" }}
                          alt={`Avatar ${p.nama}`}
                          className="w-full h-full object-cover"
                        />

                      </div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white">{p.nama}</h4>
                      <p className="text-blue-500 font-medium text-sm mt-1">{p.peran}</p>
                      <p className="text-slate-500 text-xs mt-3">{p.spesialisasi}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lokasi & Kontak */}
        <section id="lokasi" className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: 'Lokasi Kami', text: 'Jl. Kalpataru, Lendang Bunga Selatan, Kalijaga Baru' },
                { icon: Clock, title: 'Waktu Belajar', text: 'Senin - Sabtu: 18:05 - 19:20' },
                { icon: Users, title: 'Pendaftaran', text: 'Hubungi Sekretariat: +62 877-0014-7309', link: 'https://wa.me/6287700147309?text=Halo%20TPQ%20Baiturrahim%2C%20saya%20menghubungi%20dari%20website.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-2">{item.title}</h4>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA crata */}
        <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Star className="w-10 h-10 text-amber-400 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-6">Daftarkan Putra-Putri Anda Sekarang</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
                Bergabunglah bersama keluarga besar TPQ Baiturrahim dan saksikan perkembangan spiritual buah hati Anda.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#lokasi"
                  className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Informasi Pendaftaran
                </a>
                <Link
                  to="/keuangan"
                  className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cek Biaya Bulanan
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function Check({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}