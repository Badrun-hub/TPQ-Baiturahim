import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Navigation, MessageSquare, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, Button, Input, Textarea } from '../components/ui';
import { Helmet } from 'react-helmet-async';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Kontak() {
  const [formData, setFormData] = useState({ nama: '', email: '', subjek: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi pengiriman formulir
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ nama: '', email: '', subjek: '', pesan: '' });
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mapEmbedUrl = "https://maps.google.com/maps?q=TPQ%20Baiturrahim%20Kalijaga%20Baru%20Lombok%20Timur&t=&z=16&ie=UTF8&iwloc=&output=embed";
  const routeUrl = "https://maps.app.goo.gl/jf56mK5yHTihbAB58";
  const whatsappUrl = "https://wa.me/6287700147309?text=Assalamu%27alaikum%2C%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20santri%20baru%20TPQ%20Baiturrahim.";

  return (
    <PageLayout>
      <Helmet>
        <title>Hubungi Kami - TPQ Baiturrahim Lombok Timur</title>
        <meta name="description" content="Hubungi pengelola TPQ Baiturrahim Lombok Timur di Kalijaga Baru. Dapatkan info pendaftaran, jadwal belajar, dan rute lokasi Google Maps kami." />
      </Helmet>

      <div className="overflow-x-hidden min-h-screen">
        {/* Banner Section */}
        <section className="relative py-20 bg-gradient-to-b from-blue-50/50 dark:from-slate-900 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 24 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">Hubungi Kami</span>
              <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-white mt-3 mb-6">Kontak TPQ Baiturrahim</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
                Wali santri, masyarakat, atau instansi yang ingin berdiskusi mengenai pendaftaran, program belajar, atau infaq dapat menghubungi kami di bawah ini.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info & Interactive Map Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Direct Contacts */}
              <motion.div variants={fadeUp} className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Informasi Kontak</h2>
                
                {/* Contacts Cards */}
                <div className="space-y-4">
                  {[
                    { 
                      icon: MapPin, 
                      title: 'Alamat Lembaga', 
                      text: 'Jl. Kalpataru, Lendang Bunga Selatan, Kalijaga Baru, Kec. Lenek, Lombok Timur, Nusa Tenggara Barat' 
                    },
                    { 
                      icon: Phone, 
                      title: 'WhatsApp Pengelola', 
                      text: '+62 877-0014-7309', 
                      action: whatsappUrl,
                      actionLabel: 'Chat Sekarang'
                    },
                    { 
                      icon: Mail, 
                      title: 'Email Resmi', 
                      text: 'ubadar696@gmail.com' 
                    },
                    { 
                      icon: Clock, 
                      title: 'Jam Operasional & Belajar', 
                      text: 'Senin - Sabtu: 16:00 - 17:30 WITA (Mengaji Sore) & Ba\'da Maghrib (Bimbingan Hafalan)' 
                    },
                  ].map((item, idx) => (
                    <Card key={idx} className="border border-slate-100 dark:border-slate-800/80 shadow-none hover:shadow-md transition-all duration-300">
                      <CardContent className="p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.text}</p>
                          {item.action && (
                            <a 
                              href={item.action} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-green-500 hover:text-green-600 font-bold mt-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {item.actionLabel}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Middle Column: Contact Form */}
              <motion.div variants={fadeUp} className="lg:col-span-1">
                <Card className="h-full border border-slate-100 dark:border-slate-800/80 shadow-none p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Kirim Pertanyaan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Punya pertanyaan seputar TPQ kami? Kirimkan pesan Anda di bawah ini.</p>
                  
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Pesan Terkirim!</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Terima kasih telah menghubungi kami. Kami akan merespon pesan Anda secepatnya.</p>
                      </div>
                      <Button variant="secondary" onClick={() => setSubmitted(false)}>Kirim Pesan Lagi</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        label="Nama Lengkap"
                        name="nama"
                        placeholder="Masukkan nama Anda"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Subjek"
                        name="subjek"
                        placeholder="Contoh: Info Pendaftaran"
                        value={formData.subjek}
                        onChange={handleInputChange}
                        required
                      />
                      <Textarea
                        label="Pesan Anda"
                        name="pesan"
                        rows={4}
                        placeholder="Tuliskan pesan Anda di sini..."
                        value={formData.pesan}
                        onChange={handleInputChange}
                        required
                      />
                      <Button 
                        type="submit" 
                        className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                      >
                        {loading ? 'Mengirim...' : (
                          <>
                            <Send className="w-4 h-4" />
                            Kirim Pesan
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </Card>
              </motion.div>

              {/* Right Column: Google Maps & Directions */}
              <motion.div variants={fadeUp} className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Lokasi Kami</h2>
                <Card className="overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-none flex flex-col h-[calc(100%-48px)]">
                  {/* Google Maps Iframe */}
                  <div className="relative w-full h-[250px] sm:h-[300px] lg:flex-1 bg-slate-100 dark:bg-slate-800">
                    <iframe 
                      title="Peta Lokasi TPQ Baiturrahim Lombok Timur"
                      src={mapEmbedUrl}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  
                  {/* Direction Button Card Footer */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-white block">TPQ Baiturrahim</span>
                        Kalijaga Baru, Lendang Bunga Selatan, Kec. Lenek, Kabupaten Lombok Timur, NTB.
                      </div>
                    </div>
                    
                    <a 
                      href={routeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      <Navigation className="w-4 h-4 fill-current" />
                      Buka Rute di Google Maps
                    </a>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
