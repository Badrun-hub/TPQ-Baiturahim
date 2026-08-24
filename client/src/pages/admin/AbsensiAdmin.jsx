import { useEffect, useState, useRef } from 'react';
import AdminLayout from './adminlayout';
import { Calendar as CalendarIcon, Check, X, AlertCircle, ChevronLeft, ChevronRight, UserCheck, FileSpreadsheet, QrCode, Camera } from 'lucide-react';
import { Button, Table, Badge, Card, CardContent, Input, Select } from '../../components/ui';
import api from '../../utils/api';
import { daftarKelas } from '../../utils/format';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { exportAbsensiToExcel } from '../../utils/excelExport';
import { Html5Qrcode } from 'html5-qrcode';

export default function AbsensiAdmin() {
  const [santri, setSantri] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [filterKelas, setFilterKelas] = useState('');

  // QR Code Scanner States
  const [showScanner, setShowScanner] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScannedSantri, setLastScannedSantri] = useState(null);
  const [scanFeedbackMsg, setScanFeedbackMsg] = useState('');
  const [scanCooldown, setScanCooldown] = useState(false);

  const qrScannerRef = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(err => console.error("Scanner cleanup error", err));
      }
    };
  }, []);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    if (cooldownRef.current) return;

    if (!decodedText.startsWith('TPQ-SANTRI-')) {
      setScanFeedbackMsg('QR Code tidak valid.');
      return;
    }

    const santriId = parseInt(decodedText.split('-')[2]);
    if (isNaN(santriId)) {
      setScanFeedbackMsg('Format ID Santri salah.');
      return;
    }

    const found = santri.find(s => s.id === santriId);
    if (!found) {
      setScanFeedbackMsg('Santri tidak ditemukan di database.');
      return;
    }

    const record = absensi.find(a => a.santriId === santriId);
    const currentStatus = record ? record.status : null;
    
    if (currentStatus === 'Hadir') {
      playBeep();
      setLastScannedSantri(found);
      setScanFeedbackMsg(`${found.nama} sudah tercatat Hadir hari ini.`);
      cooldownRef.current = true;
      setScanCooldown(true);
      setTimeout(() => {
        cooldownRef.current = false;
        setScanCooldown(false);
      }, 2500);
      return;
    }

    cooldownRef.current = true;
    setScanCooldown(true);
    playBeep();
    setLastScannedSantri(found);
    setScanFeedbackMsg(`Mencatat kehadiran ${found.nama}...`);

    try {
      await api.post('/absensi', {
        santriId,
        tanggal,
        status: 'Hadir'
      });
      setScanFeedbackMsg(`Sukses: ${found.nama} (${found.kelas}) - Hadir`);
      fetchData();
    } catch (err) {
      console.error(err);
      setScanFeedbackMsg(`Gagal menyimpan absensi untuk ${found.nama}`);
    } finally {
      setTimeout(() => {
        cooldownRef.current = false;
        setScanCooldown(false);
      }, 2500);
    }
  };

  const startScanning = async (cameraId) => {
    if (qrScannerRef.current) {
      await stopScanning();
    }

    const targetCameraId = cameraId || selectedCameraId;
    if (!targetCameraId) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    try {
      await html5QrCode.start(
        targetCameraId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 }
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore scanner constant errors
        }
      );
      setScanning(true);
      qrScannerRef.current = html5QrCode;
    } catch (err) {
      console.error("Unable to start scanner", err);
      setScanFeedbackMsg("Gagal mengaktifkan kamera. Pastikan izin kamera diberikan.");
    }
  };

  const stopScanning = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      } finally {
        setScanning(false);
        qrScannerRef.current = null;
      }
    }
  };

  const handleToggleScanner = async () => {
    if (showScanner) {
      await stopScanning();
      setShowScanner(false);
      setLastScannedSantri(null);
      setScanFeedbackMsg('');
    } else {
      setShowScanner(true);
      setScanFeedbackMsg('Menginisialisasi kamera...');
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment') || d.label.toLowerCase().includes('rear'));
          const defaultCameraId = backCamera ? backCamera.id : devices[0].id;
          setSelectedCameraId(defaultCameraId);
          
          setTimeout(() => {
            startScanning(defaultCameraId);
          }, 200);
        } else {
          setScanFeedbackMsg("Kamera tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error getting cameras", err);
        setScanFeedbackMsg("Gagal mengakses kamera. Silakan periksa izin kamera.");
      }
    }
  };

  const handleCameraChange = async (cameraId) => {
    setSelectedCameraId(cameraId);
    if (scanning) {
      await startScanning(cameraId);
    }
  };

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

  const handleExportExcel = () => {
    exportAbsensiToExcel(filteredSantri, absensi, tanggal, filterKelas);
  };

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
          <Button
            variant="outline"
            onClick={handleToggleScanner}
            className={`border-blue-200 dark:border-blue-800 transition-all ${
              showScanner 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 border-none' 
                : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
            }`}
            title="Scan Absensi via QR Code"
          >
            <QrCode className="w-4 h-4" />
            <span>Mode Scanner QR</span>
          </Button>
          <Button variant="outline" onClick={handleExportExcel} disabled={loading || filteredSantri.length === 0} title="Export Absensi ke Excel">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
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

      {/* Conditionally Render QR Scanner */}
      {showScanner && (
        <Card className="mb-8 overflow-hidden border-2 border-blue-500/25 shadow-lg shadow-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Absensi via QR Code</h3>
                  <p className="text-xs text-slate-500">Arahkan kartu QR Code santri ke arah kamera</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleScanner}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Tutup Scanner
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Camera Screen */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Camera selector */}
                <div className="w-full flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-400 shrink-0" />
                  <Select
                    value={selectedCameraId}
                    onChange={(e) => handleCameraChange(e.target.value)}
                    className="w-full text-xs font-semibold"
                    disabled={scanning && cameras.length <= 1}
                  >
                    {cameras.length === 0 ? (
                      <option value="">Mencari Kamera...</option>
                    ) : (
                      cameras.map(c => (
                        <option key={c.id} value={c.id}>{c.label || `Kamera ${cameras.indexOf(c) + 1}`}</option>
                      ))
                    )}
                  </Select>
                  <Button 
                    size="sm" 
                    onClick={scanning ? stopScanning : () => startScanning()}
                    disabled={cameras.length === 0}
                    className={scanning ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                  >
                    {scanning ? 'Pause' : 'Start'}
                  </Button>
                </div>

                {/* Reader Window */}
                <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <div id="qr-reader" className="w-full h-full object-cover"></div>
                  {/* Overlay scanning reticle */}
                  {scanning && (
                    <div className="absolute inset-0 border-[3px] border-blue-500/40 rounded-2xl pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-dashed border-blue-400 animate-pulse rounded-lg" />
                    </div>
                  )}
                  {!scanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white p-4 text-center">
                      <QrCode className="w-12 h-12 text-slate-500 mb-2" />
                      <span className="text-xs font-semibold text-slate-400">Scanner Kamera Mati</span>
                      <Button size="sm" variant="secondary" className="mt-4" onClick={() => startScanning()}>Aktifkan Kamera</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Scan Result & Last Checked-in */}
              <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-8 pt-6 md:pt-0">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Status Pemindaian</h4>
                  
                  {/* Status Box */}
                  <div className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all duration-300 ${
                    scanFeedbackMsg.startsWith('Sukses') ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400' :
                    scanFeedbackMsg.startsWith('Gagal') || scanFeedbackMsg.includes('tidak valid') || scanFeedbackMsg.includes('salah') ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400' :
                    scanFeedbackMsg ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400' :
                    'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}>
                    {scanFeedbackMsg || 'Menunggu QR Code santri didekatkan...'}
                  </div>

                  {/* Scanned Student Info Card */}
                  {lastScannedSantri && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-zoom-in">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-extrabold text-lg shrink-0">
                          {lastScannedSantri.nama.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-800 dark:text-white truncate text-base">{lastScannedSantri.nama}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Kelas: {lastScannedSantri.kelas}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 text-xs">
                        <span className="text-slate-400">Status Absen</span>
                        <Badge variant="success">Hadir</Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-400 mt-6 md:mt-0 font-medium">
                  * Sistem memiliki jeda 2.5 detik untuk setiap scan agar menghindari pencatatan ganda.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
