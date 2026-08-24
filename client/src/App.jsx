import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Galeri from './pages/Galeri';
import Prestasi from './pages/Prestasi';
import Keuangan from './pages/Keuangan';
import Kontak from './pages/Kontak';

// Admin pages
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import SantriAdmin from './pages/admin/SantriAdmin';
import AbsensiAdmin from './pages/admin/AbsensiAdmin';
import KeuanganAdmin from './pages/admin/KeuanganAdmin';
import GaleriAdmin from './pages/admin/GaleriAdmin';
import PrestasiAdmin from './pages/admin/PrestasiAdmin';
import AdminManagement from './pages/admin/AdminManagement';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/prestasi" element={<Prestasi />} />
            <Route path="/keuangan" element={<Keuangan />} />
            <Route path="/kontak" element={<Kontak />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/santri" element={<ProtectedRoute><SantriAdmin /></ProtectedRoute>} />
            <Route path="/admin/absensi" element={<ProtectedRoute><AbsensiAdmin /></ProtectedRoute>} />
            <Route path="/admin/keuangan" element={<ProtectedRoute><KeuanganAdmin /></ProtectedRoute>} />
            <Route path="/admin/galeri" element={<ProtectedRoute><GaleriAdmin /></ProtectedRoute>} />
            <Route path="/admin/prestasi" element={<ProtectedRoute><PrestasiAdmin /></ProtectedRoute>} />
            <Route path="/admin/admins" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
