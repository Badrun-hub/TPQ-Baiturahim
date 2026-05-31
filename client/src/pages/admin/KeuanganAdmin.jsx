import { useEffect, useState } from 'react';
import AdminLayout from './adminlayout';
import { Plus, Search, Edit2, Trash2, Wallet, Filter, CheckCircle, Clock } from 'lucide-react';
import { Button, Input, Table, Badge, Dialog, Select, Card, CardContent } from '../../components/ui';
import api from '../../utils/api';
import { formatRupiah, namaBulan } from '../../utils/format';

export default function KeuanganAdmin() {
  const [data, setData] = useState([]);
  const [santri, setSantri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [limit, setLimit] = useState('10');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ santriId: '', bulan: new Date().getMonth() + 1, tahun: new Date().getFullYear(), jumlah: 30000, status: 'Belum Lunas', catatan: '' });

  useEffect(() => {
    fetchData();
    fetchSantri();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/keuangan');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setLoading(false);
  };

  const fetchSantri = async () => {
    try {
      const res = await api.get('/santri');
      setSantri(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setSantri([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, santriId: parseInt(formData.santriId), bulan: parseInt(formData.bulan), tahun: parseInt(formData.tahun), jumlah: parseInt(formData.jumlah) };
      if (editingId) {
        await api.put(`/keuangan/${editingId}`, payload);
      } else {
        await api.post('/keuangan', payload);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ santriId: '', bulan: new Date().getMonth() + 1, tahun: new Date().getFullYear(), jumlah: 30000, status: 'Belum Lunas', catatan: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      santriId: item.santriId,
      bulan: item.bulan,
      tahun: item.tahun,
      jumlah: item.jumlah,
      status: item.status,
      catatan: item.catatan || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data pembayaran ini?')) {
      try {
        await api.delete(`/keuangan/${id}`);
        fetchData();
      } catch (e) { console.error(e); }
    }
  };

  const filtered = data.filter(item => {
    const matchesSearch = item.santri?.nama?.toLowerCase().includes(search.toLowerCase());
    const matchesBulan = filterBulan === '' || item.bulan === parseInt(filterBulan);
    const matchesTahun = filterTahun === '' || item.tahun === parseInt(filterTahun);
    return matchesSearch && matchesBulan && matchesTahun;
  });

  const displayedData = limit === 'semua' ? filtered : filtered.slice(0, parseInt(limit));

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Keuangan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manajemen pembayaran SPP santri</p>
        </div>
        <Button onClick={() => { setEditingId(null); setShowModal(true); }}>
          <Plus className="w-4 h-4" /> Catat Pembayaran
        </Button>
      </div>


      <Card className="mb-6">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Cari nama santri..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={filterBulan}
            onChange={e => setFilterBulan(e.target.value)}
          >
            <option value="">Semua Bulan</option>
            {namaBulan.slice(1).map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
          </Select>
          <Select
            value={filterTahun}
            onChange={e => setFilterTahun(e.target.value)}
          >
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select
            value={limit}
            onChange={e => setLimit(e.target.value)}
          >
            <option value="5">Tampilkan 5</option>
            <option value="10">Tampilkan 10</option>
            <option value="50">Tampilkan 50</option>
            <option value="semua">Tampilkan Semua</option>
          </Select>
        </CardContent>
      </Card>

      <Table
        headers={[
          { label: 'Nama Santri' },
          { label: 'Bulan & Tahun' },
          { label: 'Jumlah' },
          { label: 'Status' },
          { label: 'Aksi', className: 'text-right' }
        ]}
      >
        {loading ? (
          <tr><td colSpan="5" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
        ) : displayedData.length === 0 ? (
          <tr><td colSpan="5" className="text-center py-12 text-slate-400">Tidak ada data pembayaran.</td></tr>
        ) : (
          displayedData.map(item => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">
                {item.santri?.nama}
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                {namaBulan[item.bulan]} {item.tahun}
              </td>
              <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">
                {formatRupiah(item.jumlah)}
              </td>
              <td className="px-5 py-4">
                <Badge variant={item.status === 'Lunas' ? 'success' : 'warning'}>
                  {item.status}
                </Badge>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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
        title={editingId ? 'Edit Pembayaran' : 'Catat Pembayaran Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Pilih Santri"
            value={formData.santriId}
            onChange={e => setFormData({ ...formData, santriId: e.target.value })}
            required
          >
            <option value="">-- Pilih Santri --</option>
            {santri.map(s => <option key={s.id} value={s.id}>{s.nama} ({s.kelas})</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Bulan"
              value={formData.bulan}
              onChange={e => setFormData({ ...formData, bulan: e.target.value })}
            >
              {namaBulan.slice(1).map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
            </Select>
            <Select
              label="Tahun"
              value={formData.tahun}
              onChange={e => setFormData({ ...formData, tahun: e.target.value })}
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>

          <Input
            label="Jumlah Pembayaran (Rp)"
            type="number"
            value={formData.jumlah}
            onChange={e => setFormData({ ...formData, jumlah: e.target.value })}
            required
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <option>Lunas</option>
            <option>Belum Lunas</option>
          </Select>

          <Input
            label="Catatan"
            placeholder="Contoh: Titip ke wali"
            value={formData.catatan}
            onChange={e => setFormData({ ...formData, catatan: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Catat Pembayaran'}</Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
