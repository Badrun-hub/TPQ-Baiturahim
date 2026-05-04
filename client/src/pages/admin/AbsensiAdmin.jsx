import { useEffect, useState } from 'react';
import AdminLayout from './adminlayout';
import { Calendar as CalendarIcon, Check, X, AlertCircle, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { Button, Table, Badge, Card, CardContent, Input, Select } from '../../components/ui';
import api from '../../utils/api';
import { daftarKelas } from '../../utils/format';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AbsensiAdmin() {
  const [santri, setSantri] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [filterKelas, setFilterKelas] = useState('');

  useEffect(() => {
    fetchData();
  }, [tanggal]);

  useEffect(() => {
    if (santri.length > 0 && !filterKelas) {
      setFilterKelas(daftarKelas[0]);
    }
  }, [santri]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [santriRes, absensiRes] = await Promise.all([
        api.get('/santri'),
        api.get('/absensi', { params: { tanggal } })
      ]);
      setSantri(Array.isArray(santriRes.data) ? santriRes.data : []);
      setAbsensi(Array.isArray(absensiRes.data) ? absensiRes.data : []);
    } catch (e) { 
      console.error(e); 
      setSantri([]);
      setAbsensi([]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (santriId, newStatus) => {
    setTogglingId(santriId);
    try {
      await api.post('/absensi/bulk', {
        tanggal,
        data: [{ santriId, status: newStatus }]
      });
      await fetchData();
    } catch (e) { 
      console.error(e); 
      alert('Gagal menyimpan absensi: ' + (e.response?.data?.error || e.message));
    } finally {
      setTogglingId(null);
    }
  };

  const getStatus = (santriId) => {
    const record = absensi.find(a => a.santriId === santriId);
    return record ? record.status : null;
  };

  const hadirCount = absensi.filter(a => a.status === 'Hadir').length;
  const kelasList = daftarKelas;
  const filteredSantri = santri.filter(s => !filterKelas || s.kelas === filterKelas);
  const progress = filteredSantri.length > 0 ? (filteredSantri.filter(s => getStatus(s.id) === 'Hadir').length / filteredSantri.length) * 100 : 0;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Absensi Harian</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {format(new Date(tanggal), 'EEEE, d MMMM yyyy', { locale: id })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select 
            value={filterKelas} 
            onChange={e => setFilterKelas(e.target.value)}
            className="w-40"
          >
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => {
              const d = new Date(tanggal);
              d.setDate(d.getDate() - 1);
              setTanggal(d.toISOString().split('T')[0]);
            }}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="relative">
              <Input 
                type="date" 
                value={tanggal} 
                onChange={e => setTanggal(e.target.value)}
                className="w-44"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => {
              const d = new Date(tanggal);
              d.setDate(d.getDate() + 1);
              setTanggal(d.toISOString().split('T')[0]);
            }}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-4 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-700" 
                  style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
                />
               <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">Presensi {filterKelas}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {filteredSantri.filter(s => getStatus(s.id) === 'Hadir').length} dari {filteredSantri.length} hadir
              </p>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Hadir</span>
                <span className="font-bold">{hadirCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Izin</span>
                <span className="font-bold">{absensi.filter(a => a.status === 'Izin').length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Alpha</span>
                <span className="font-bold">{absensi.filter(a => a.status === 'Alpha').length}</span>
              </div>
              <div className="flex justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Belum Tercatat</span>
                <span className="font-bold">{santri.length - absensi.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Table 
            headers={[
              { label: 'Nama Santri' },
              { label: 'Kelas', className: 'hidden sm:table-cell' },
              { label: 'Status Kehadiran' },
              { label: 'Aksi', className: 'text-center' }
            ]}
          >
            {loading ? (
              <tr><td colSpan="4" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
            ) : filteredSantri.map(s => {
              const status = getStatus(s.id);
              return (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">
                    {s.nama}
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                    {s.kelas}
                  </td>
                  <td className="px-5 py-4">
                    {status ? (
                      <Badge variant={status === 'Hadir' ? 'success' : status === 'Izin' || status === 'Sakit' ? 'warning' : 'danger'}>
                        {status}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belum diisi</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Select
                      value={status || ''}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      disabled={togglingId === s.id}
                      className={`h-10 text-xs font-bold !py-0 !rounded-xl min-w-[130px] border-2 transition-all ${
                        status === 'Hadir' ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/30' :
                        status === 'Izin' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/30' :
                        status === 'Sakit' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-500/30' :
                        status === 'Alpha' ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/30' :
                        'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <option value="" className="text-slate-500">-- Pilih Status --</option>
                      <option value="Hadir" className="text-green-600 font-bold">🟢 Hadir</option>
                      <option value="Izin" className="text-blue-600 font-bold">🔵 Izin</option>
                      <option value="Sakit" className="text-amber-600 font-bold">🟡 Sakit</option>
                      <option value="Alpha" className="text-red-600 font-bold">🔴 Alpha</option>
                    </Select>
                  </td>
                </tr>
              );
            })}
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
