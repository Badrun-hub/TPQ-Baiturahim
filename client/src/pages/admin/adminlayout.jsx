import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Users, CalendarCheck, Wallet, LayoutDashboard, 
  Menu, X, LogOut, Image as ImageIcon, Trophy, 
  Settings, ChevronRight, Moon, Sun, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Data Santri', path: '/admin/santri' },
  { icon: CalendarCheck, label: 'Absensi', path: '/admin/absensi' },
  { icon: Wallet, label: 'Keuangan', path: '/admin/keuangan' },
  { icon: ImageIcon, label: 'Galeri', path: '/admin/galeri' },
  { icon: Trophy, label: 'Prestasi', path: '/admin/prestasi' },
  { icon: Settings, label: 'Kelola Admin', path: '/admin/admins' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden shadow-lg shadow-blue-500/20 border border-slate-100 dark:border-slate-800">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-white leading-tight text-sm">TPQ Baiturahim</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.username}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Administrator</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                title="Lihat Website"
              >
                <Home className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center p-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 lg:hidden text-slate-500 dark:text-slate-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              {navItems.find(item => location.pathname === item.path)?.label || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
