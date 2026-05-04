import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './adminlayout';
import { Plus, Edit2, Trash2, Trophy, Search, Star, Medal } from 'lucide-react';
import { Button, Input, Table, Badge, Dialog, Select, Card, CardContent } from '../../components/ui';
import api from '../../utils/api';

export default function PrestasiAdmin() {
  const [prestasi, setPrestasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ judul: '', nama: '', lomba: '', tingkat: 'Kecamatan', peringkat: 'Juara 1', tahun: new Date().getFullYear(), deskripsi: '' });

  useEffect(() => {
    fetchPrestasi();
  }, []);

  const fetchPrestasi = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prestasi');
      setPrestasi(Array.isArray(res.data) ? res.data : []);
    } catch (e) { 
      console.error(e); 
      setPrestasi([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, tahun: parseInt(formData.tahun) };
      if (editingId) {
        await api.put(`/prestasi/${editingId}`, payload);
      } else {
        await api.post('/prestasi', payload);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ judul: '', nama: '', lomba: '', tingkat: 'Kecamatan', peringkat: 'Juara 1', tahun: new Date().getFullYear(), deskripsi: '' });
      fetchPrestasi();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({ 
      judul: p.judul, 
      nama: p.nama, 
      lomba: p.lomba, 
      tingkat: p.tingkat, 
      peringkat: p.peringkat, 
      tahun: p.tahun, 
      deskripsi: p.deskripsi || '' 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data prestasi ini?')) {
      try {
        await api.delete(`/prestasi/${id}`);
        fetchPrestasi();
      } catch (e) { console.error(e); }
    }
  };

  const filtered = prestasi.filter(p => 
    (p.judul?.toLowerCase().includes(search.toLowerCase()) || false) || 
    (p.nama?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (p.lomba?.toLowerCase().includes(search.toLowerCase()) || false)
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Prestasi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daftar pencapaian santri TPQ Baiturahim</p>
        </div>
        <Button onClick={() => { setEditingId(null); setShowModal(true); }}>
          <Plus className="w-4 h-4" /> Tambah Prestasi
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              className="pl-10" 
              placeholder="Cari judul, nama santri, atau lomba..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Table 
        headers={[
          { label: 'Prestasi' },
          { label: 'Nama Santri' },
          { label: 'Tingkat' },
          { label: 'Peringkat' },
          { label: 'Aksi', className: 'text-right' }
        ]}
      >
        {loading ? (
          <tr><td colSpan="5" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
        ) : filtered.length === 0 ? (
          <tr><td colSpan="5" className="text-center py-12 text-slate-400">Tidak ada data prestasi ditemukan.</td></tr>
        ) : (
          filtered.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white leading-tight">{p.judul}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.lomba}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                {p.nama}
              </td>
              <td className="px-5 py-4">
                <Badge variant={p.tingkat === 'Nasional' ? 'danger' : p.tingkat === 'Provinsi' ? 'warning' : 'primary'}>
                  {p.tingkat}
                </Badge>
              </td>
              <td className="px-5 py-4 text-sm text-slate-500">
                {p.peringkat}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(p)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Judul Prestasi" 
            placeholder="Contoh: Juara 1 Lomba Adzan" 
            value={formData.judul}
            onChange={e => setFormData({ ...formData, judul: e.target.value })}
            required
          />
          <Input 
            label="Nama Santri" 
            placeholder="Masukkan nama santri" 
            value={formData.nama}
            onChange={e => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <Input 
            label="Nama Lomba" 
            placeholder="Contoh: Festival Anak Sholeh" 
            value={formData.lomba}
            onChange={e => setFormData({ ...formData, lomba: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Tingkat" 
              value={formData.tingkat}
              onChange={e => setFormData({ ...formData, tingkat: e.target.value })}
            >
              <option>Kecamatan</option>
              <option>Kabupaten</option>
              <option>Provinsi</option>
              <option>Nasional</option>
            </Select>
            <Select 
              label="Peringkat" 
              value={formData.peringkat}
              onChange={e => setFormData({ ...formData, peringkat: e.target.value })}
            >
              <option>Juara 1</option>
              <option>Juara 2</option>
              <option>Juara 3</option>
              <option>Harapan 1</option>
              <option>Harapan 2</option>
              <option>Harapan 3</option>
              <option>Peserta Terbaik</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Tahun" 
              type="number"
              value={formData.tahun}
              onChange={e => setFormData({ ...formData, tahun: e.target.value })}
              required
            />
          </div>
          <Input 
            label="Deskripsi / Catatan" 
            placeholder="Opsional" 
            value={formData.deskripsi}
            onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambah Prestasi'}</Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
