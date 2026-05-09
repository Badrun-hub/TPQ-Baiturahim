import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-blue-500/10">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-800 dark:text-white">TPQ </span>
                <span className="text-lg font-bold gradient-text">Baiturahim</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Taman Pendidikan Al-Qur'an Baiturahim Lombok Timur merupakan lembaga pendidikan Islam yang berdedikasi
              dalam membentuk generasi Qur'ani yang berakhlak mulia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Navigasi</h3>
            <div className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/galeri', label: 'Galeri' },
                { to: '/prestasi', label: 'Prestasi' },
                { to: '/keuangan', label: 'Keuangan' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Kontak</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Jl. kalpataru 01, Lendang Bunga Setan, Kalijaga Baru, Lombok Timur</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <Phone className="w-4 h-4 shrink-0" />
                <a
                  href="https://wa.me/6287700147309?text=Halo%20TPQ%20Baiturahim%2C%20saya%20menghubungi%20dari%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  +62 877-0014-7309
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>tpq.baiturahim@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Senin - Sabtu, 18:10 - 19:20 WITA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} TPQ Baiturahim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
