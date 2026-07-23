import { useEffect, useState } from 'react';
import AdminLayout from './adminlayout';
import { Plus, Search, Edit2, Trash2, UserPlus, Filter, X, FileSpreadsheet } from 'lucide-react';
import { Button, Input, Table, Badge, Dialog, Select, Card, CardContent } from '../../components/ui';
import api from '../../utils/api';
import { daftarKelas } from '../../utils/format';
import { exportSantriToExcel } from '../../utils/excelExport';

export default function SantriAdmin() {
  const [santri, setSantri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama: '', kelas: '', alamat: '', noHp: '' });

  const uniqueKelas = daftarKelas;

  useEffect(() => {
    fetchSantri();
  }, []);

  const fetchSantri = async () => {
    setLoading(true);
    try {
      const res = await api.get('/santri');
      setSantri(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setSantri([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/santri/${editingId}`, formData);
      } else {
        await api.post('/santri', formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ nama: '', kelas: '', alamat: '', noHp: '' });
      fetchSantri();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setFormData({ nama: s.nama, kelas: s.kelas, alamat: s.alamat || '', noHp: s.noHp || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data santri ini?')) {
      try {
        await api.delete(`/santri/${id}`);
        fetchSantri();
      } catch (e) { console.error(e); }
    }
  };

  const filtered = santri.filter(s =>
    (s.nama?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (s.kelas?.toLowerCase().includes(search.toLowerCase()) || false)
  );

  const handleExportExcel = () => {
    exportSantriToExcel(filtered, search);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Santri</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total {santri.length} santri terdaftar</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleExportExcel} disabled={loading || santri.length === 0} title="Export Data Santri ke Excel">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
          <Button onClick={() => { setEditingId(null); setFormData({ nama: '', kelas: '', alamat: '', noHp: '' }); setShowModal(true); }}>
            <UserPlus className="w-4 h-4" /> Tambah Santri
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Cari nama santri atau kelas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </CardContent>
      </Card>

      <Table
        headers={[
          { label: 'Nama Lengkap' },
          { label: 'Kelas' },
          { label: 'No. HP Wali' },
          { label: 'Alamat', className: 'hidden md:table-cell' },
          { label: 'Aksi', className: 'text-right' }
        ]}
      >
        {loading ? (
          <tr><td colSpan="5" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
        ) : filtered.length === 0 ? (
          <tr><td colSpan="5" className="text-center py-12 text-slate-400">Tidak ada data santri ditemukan.</td></tr>
        ) : (
          filtered.map(s => (
            <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {s.nama.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{s.nama}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <Badge variant="primary">{s.kelas}</Badge>
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm">
                {s.noHp || '-'}
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm hidden md:table-cell max-w-xs truncate">
                {s.alamat || '-'}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(s)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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
        title={editingId ? 'Edit Data Santri' : 'Tambah Santri Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={formData.nama}
            onChange={e => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <Select
            label="Kelas"
            value={formData.kelas}
            onChange={e => setFormData({ ...formData, kelas: e.target.value })}
            required
          >
            <option value="">-- Pilih Kelas --</option>
            {uniqueKelas.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </Select>
          <Input
            label="No. HP Wali"
            placeholder="Contoh: 08123456789"
            value={formData.noHp}
            onChange={e => setFormData({ ...formData, noHp: e.target.value })}
          />
          <Input
            label="Alamat"
            placeholder="Masukkan alamat lengkap"
            value={formData.alamat}
            onChange={e => setFormData({ ...formData, alamat: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambah Santri'}</Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
