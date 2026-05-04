import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './adminlayout';
import { Plus, Trash2, Image as ImageIcon, Upload, Link as LinkIcon, Search, X } from 'lucide-react';
import { Button, Input, Card, CardContent, Dialog, Badge, Select } from '../../components/ui';
import api from '../../utils/api';

export default function GaleriAdmin() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ judul: '', kategori: 'Kegiatan', tahun: new Date().getFullYear(), deskripsi: '' });

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    setLoading(true);
    try {
      const res = await api.get('/galeri');
      setGaleri(Array.isArray(res.data) ? res.data : []);
    } catch (e) { 
      console.error(e); 
      setGaleri([]);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Pilih foto terlebih dahulu');

    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('kategori', formData.kategori);
    data.append('tahun', formData.tahun);
    data.append('deskripsi', formData.deskripsi);
    data.append('image', file);

    try {
      await api.post('/galeri', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModal(false);
      setFile(null);
      setPreview(null);
      setFormData({ judul: '', kategori: 'Kegiatan', tahun: new Date().getFullYear(), deskripsi: '' });
      fetchGaleri();
    } catch (e) { 
      console.error(e); 
      alert('Gagal mengunggah foto: ' + (e.response?.data?.error || e.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus foto ini dari galeri?')) {
      try {
        await api.delete(`/galeri/${id}`);
        fetchGaleri();
      } catch (e) { console.error(e); }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Galeri Media</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dokumentasi kegiatan TPQ Baiturahim</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Tambah Foto
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />)}
        </div>
      ) : galeri.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Belum ada foto di galeri. Klik tombol "Tambah Foto" untuk memulai.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="group overflow-hidden">
                <div className="relative aspect-video">
                  <img src={item.imageUrl} alt={item.judul} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">{item.judul}</h3>
                    <Badge>{item.kategori}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Tahun {item.tahun}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        title="Tambah Foto Galeri"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Judul Foto" 
            placeholder="Masukkan judul foto" 
            value={formData.judul}
            onChange={e => setFormData({ ...formData, judul: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Kategori" 
              value={formData.kategori}
              onChange={e => setFormData({ ...formData, kategori: e.target.value })}
            >
              <option>Kegiatan</option>
              <option>Fasilitas</option>
              <option>Prestasi</option>
              <option>Lainnya</option>
            </Select>
            <Input 
              label="Tahun" 
              type="number"
              value={formData.tahun}
              onChange={e => setFormData({ ...formData, tahun: e.target.value })}
              required
            />
          </div>
          <Input 
            label="Pilih Foto" 
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            icon={<Upload className="w-4 h-4" />}
          />
          <Input 
            label="Deskripsi Singkat" 
            placeholder="Opsional" 
            value={formData.deskripsi}
            onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
          />
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase mb-2">Preview</p>
            {preview ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                Belum ada foto dipilih
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit">Upload ke Galeri</Button>
          </div>
        </form>
      </Dialog>
    </AdminLayout>
  );
}