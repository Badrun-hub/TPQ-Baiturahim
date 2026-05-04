import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../components/ui';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <Card className="shadow-xl shadow-blue-500/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden shadow-xl shadow-blue-500/20 border-2 border-white dark:border-slate-800">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Panel</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">TPQ Baiturahim</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                icon={<User className="w-4 h-4" />}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}