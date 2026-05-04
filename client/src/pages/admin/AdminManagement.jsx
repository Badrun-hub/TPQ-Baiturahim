import { useEffect, useState } from 'react';
import AdminLayout from './adminlayout';
import { Plus, Pencil, Trash2, Shield, Eye, EyeOff, UserPlus, Search } from 'lucide-react';
import { Button, Input, Table, Badge, Dialog, Card, CardContent, Select } from '../../components/ui';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', nama: '', role: 'admin' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/admins');
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error(err); 
      setAdmins([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ username: '', password: '', nama: '', role: 'admin' });
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ username: a.username, password: '', nama: a.nama, role: a.role });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const data = { username: form.username, nama: form.nama, role: form.role };
        if (form.password) data.password = form.password;
        await api.put(`/auth/admins/${editing.id}`, data);
      } else {
        await api.post('/auth/register', form);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan data admin.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus admin ini?')) {
      try {
        await api.delete(`/auth/admins/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Gagal menghapus admin.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Admin</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tambah dan kelola hak akses panel admin</p>
        </div>
        <Button onClick={openCreate}>
          <UserPlus className="w-4 h-4" /> Tambah Admin
        </Button>
      </div>

      <Table 
        headers={[
          { label: 'Administrator' },
          { label: 'Username' },
          { label: 'Role' },
          { label: 'Aksi', className: 'text-right' }
        ]}
      >
        {loading ? (
          <tr><td colSpan="4" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
        ) : admins.map(a => (
          <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-xs">
                  {a.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white leading-tight">
                    {a.nama}
                    {a.id === user?.id && <span className="ml-2 text-[10px] text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
              @{a.username}
            </td>
            <td className="px-5 py-4">
              <Badge variant="primary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                {a.role}
              </Badge>
            </td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {a.id !== user?.id && (
                  <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Akun Admin' : 'Tambah Admin Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Nama Lengkap" 
            placeholder="Masukkan nama lengkap admin" 
            value={form.nama}
            onChange={e => setForm({ ...form, nama: e.target.value })}
            required
          />
          <Input 
            label="Username" 
            placeholder="Masukkan username unik" 
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <div className="relative">
            <Input 
              label={`Password ${editing ? '(Kosongkan jika tidak diubah)' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter" 
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required={!editing}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Select 
            label="Hak Akses" 
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
          </Select>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Akun'}</Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
