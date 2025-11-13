import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Bell, Award, Clock, TrendingUp } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import CardStat from '../../components/dashboard/CardStat'
import DataTable from '../../components/dashboard/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function DashboardSiswa() {
  const { user } = useAuth()
  const { 
    nilai, absensi, pengumuman, jadwal,
    setNilai, setAbsensi, setPengumuman, setJadwal,
    loading 
  } = useDataStore()

  const [siswaData, setSiswaData] = useState({
    rataNilai: 0,
    totalHadir: 0,
    totalAbsen: 0,
    jadwalHariIni: [],
    nilaiTerbaru: [],
    pengumumanTerbaru: [],
  })

  // Realtime subscriptions
  useRealtime('nilai', setNilai)
  useRealtime('absensi', setAbsensi)
  useRealtime('pengumuman', setPengumuman)
  useRealtime('jadwal', setJadwal)

  useEffect(() => {
    if (!user) return

    // Filter data untuk siswa ini
    const nilaiSiswa = nilai.filter(n => n.siswa_id === user.id)
    const absensiSiswa = absensi.filter(a => a.siswa_id === user.id)
    
    // Hitung statistik
    const rataNilai = nilaiSiswa.length > 0 
      ? nilaiSiswa.reduce((sum, n) => sum + n.nilai, 0) / nilaiSiswa.length 
      : 0

    const totalHadir = absensiSiswa.filter(a => a.status === 'hadir').length
    const totalAbsen = absensiSiswa.filter(a => a.status !== 'hadir').length

    // Jadwal hari ini (asumsi siswa punya kelas_id di profile)
    const hariIni = new Date().getDay()
    const hariMap = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' }
    const jadwalHariIni = jadwal.filter(j => j.hari === hariMap[hariIni])

    // Nilai terbaru
    const nilaiTerbaru = nilaiSiswa
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)

    // Pengumuman terbaru
    const pengumumanTerbaru = pengumuman.slice(0, 3)

    setSiswaData({
      rataNilai: Math.round(rataNilai * 10) / 10,
      totalHadir,
      totalAbsen,
      jadwalHariIni,
      nilaiTerbaru,
      pengumumanTerbaru,
    })
  }, [user, nilai, absensi, pengumuman, jadwal])

  const nilaiColumns = [
    { key: 'mapel', header: 'Mata Pelajaran' },
    { key: 'nilai', header: 'Nilai', render: (value) => (
      <span className={`font-semibold ${
        value >= 85 ? 'text-green-600' :
        value >= 75 ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {value}
      </span>
    )},
    { key: 'semester', header: 'Semester' },
    { key: 'created_at', header: 'Tanggal', render: (value) => (
      new Date(value).toLocaleDateString('id-ID')
    )},
  ]

  const absensiColumns = [
    { key: 'tanggal', header: 'Tanggal', render: (value) => (
      new Date(value).toLocaleDateString('id-ID')
    )},
    { key: 'status', header: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'hadir' ? 'bg-green-100 text-green-800' :
        value === 'sakit' ? 'bg-yellow-100 text-yellow-800' :
        value === 'izin' ? 'bg-blue-100 text-blue-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'keterangan', header: 'Keterangan', render: (value) => value || '-' },
  ]

  if (loading && nilai.length === 0) {
    return <LoadingSpinner text="Memuat dashboard siswa..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Siswa</h1>
          <p className="text-gray-600">Selamat belajar, {user?.nama}!</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <CardStat
          title="Rata-rata Nilai"
          value={siswaData.rataNilai}
          change={5.2}
          icon={Award}
          color="blue"
        />
        <CardStat
          title="Kehadiran"
          value={siswaData.totalHadir}
          icon={BookOpen}
          color="green"
        />
        <CardStat
          title="Tidak Hadir"
          value={siswaData.totalAbsen}
          icon={Clock}
          color="orange"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Hari Ini */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Jadwal Hari Ini</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {siswaData.jadwalHariIni.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{item.mapel}</h4>
                  <p className="text-sm text-gray-600">Guru {item.guru_id}</p>
                </div>
                <span className="text-sm text-gray-500">{item.jam}</span>
              </div>
            ))}
            {siswaData.jadwalHariIni.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Tidak ada jadwal hari ini
              </p>
            )}
          </div>
        </motion.div>

        {/* Pengumuman Terbaru */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pengumuman</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {siswaData.pengumumanTerbaru.map((item) => (
              <div key={item.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800">{item.judul}</h4>
                <p className="text-sm text-blue-600 line-clamp-2">{item.isi}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
            {siswaData.pengumumanTerbaru.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Belum ada pengumuman
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nilai Terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nilai Terbaru
            </h3>
            <DataTable
              data={siswaData.nilaiTerbaru}
              columns={nilaiColumns}
              searchable={false}
              pagination={false}
            />
          </div>
        </motion.div>

        {/* Riwayat Absensi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Riwayat Absensi
            </h3>
            <DataTable
              data={absensi.filter(a => a.siswa_id === user?.id).slice(0, 5)}
              columns={absensiColumns}
              searchable={false}
              pagination={false}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardSiswa