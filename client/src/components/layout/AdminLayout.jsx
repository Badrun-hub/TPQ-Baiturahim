import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Users, CalendarCheck, Wallet, Image, Trophy,
  Shield, LogOut, Sun, Moon, BookOpen, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/santri', label: 'Data Santri', icon: Users },
  { to: '/admin/absensi', label: 'Absensi', icon: CalendarCheck },
  { to: '/admin/keuangan', label: 'Keuangan', icon: Wallet },
  { to: '/admin/galeri', label: 'Galeri', icon: Image },
  { to: '/admin/prestasi', label: 'Prestasi', icon: Trophy },
  { to: '/admin/admins', label: 'Kelola Admin', icon: Shield },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">TPQ</span>
              <span className="text-sm font-bold gradient-text ml-1">Baiturahim</span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-slate-800 dark:text-white truncate">{user?.nama}</p>
            <p className="text-xs text-slate-400 truncate">{user?.username}</p>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all w-full"
          >
            {dark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Lihat Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all shadow-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold gradient-text">Admin Panel</span>
          <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
