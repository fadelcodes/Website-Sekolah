import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, Calendar, Bell, Clock, CheckCircle } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import CardStat from '../../components/dashboard/CardStat'
import DataTable from '../../components/dashboard/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function DashboardGuru() {
  const { user } = useAuth()
  const { 
    jadwal, absensi, pengumuman, nilai,
    setJadwal, setAbsensi, setPengumuman, setNilai,
    loading 
  } = useDataStore()

  const [guruData, setGuruData] = useState({
    totalKelas: 0,
    totalSiswa: 0,
    rataNilai: 0,
    jadwalHariIni: [],
    absensiTerakhir: [],
  })

  // Realtime subscriptions
  useRealtime('jadwal', setJadwal)
  useRealtime('absensi', setAbsensi)
  useRealtime('pengumuman', setPengumuman)
  useRealtime('nilai', setNilai)

  useEffect(() => {
    if (!user) return

    // Filter data untuk guru ini
    const jadwalGuru = jadwal.filter(j => j.guru_id === user.id)
    const kelasUnik = [...new Set(jadwalGuru.map(j => j.kelas_id))]
    
    // Hitung statistik
    const totalSiswa = 0 // Akan dihitung dari data siswa per kelas
    const nilaiGuru = nilai.filter(n => 
      jadwalGuru.some(j => j.mapel === n.mapel)
    )
    const rataNilai = nilaiGuru.length > 0 
      ? nilaiGuru.reduce((sum, n) => sum + n.nilai, 0) / nilaiGuru.length 
      : 0

    // Jadwal hari ini
    const hariIni = new Date().getDay() // 0=Minggu, 1=Senin, etc.
    const hariMap = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' }
    const jadwalHariIni = jadwalGuru.filter(j => j.hari === hariMap[hariIni])

    // Absensi terakhir
    const absensiTerakhir = absensi
      .filter(a => {
        const jadwalItem = jadwalGuru.find(j => j.kelas_id === a.kelas_id)
        return jadwalItem
      })
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .slice(0, 5)

    setGuruData({
      totalKelas: kelasUnik.length,
      totalSiswa,
      rataNilai: Math.round(rataNilai * 10) / 10,
      jadwalHariIni,
      absensiTerakhir,
    })
  }, [user, jadwal, absensi, nilai])

  const absensiColumns = [
    { key: 'siswa_id', header: 'Siswa', render: (value) => `Siswa ${value}` },
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
  ]

  if (loading && jadwal.length === 0) {
    return <LoadingSpinner text="Memuat dashboard guru..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
          <p className="text-gray-600">Selamat datang, {user?.nama}</p>
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
          title="Total Kelas Diajar"
          value={guruData.totalKelas}
          icon={Users}
          color="blue"
        />
        <CardStat
          title="Siswa Aktif"
          value={guruData.totalSiswa}
          icon={BookOpen}
          color="green"
        />
        <CardStat
          title="Rata-rata Nilai"
          value={guruData.rataNilai}
          icon={CheckCircle}
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
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {guruData.jadwalHariIni.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{item.mapel}</h4>
                  <p className="text-sm text-gray-600">Kelas {item.kelas_id}</p>
                </div>
                <span className="text-sm text-gray-500">{item.jam}</span>
              </div>
            ))}
            {guruData.jadwalHariIni.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Tidak ada jadwal mengajar hari ini
              </p>
            )}
          </div>
        </motion.div>

        {/* Pengumuman */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pengumuman Terbaru</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {pengumuman.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800">{item.judul}</h4>
                <p className="text-sm text-blue-600 truncate">{item.isi}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
            {pengumuman.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Belum ada pengumuman
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Absensi Terakhir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Absensi Terakhir
          </h3>
          <DataTable
            data={guruData.absensiTerakhir}
            columns={absensiColumns}
            searchable={true}
            pagination={false}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardGuru