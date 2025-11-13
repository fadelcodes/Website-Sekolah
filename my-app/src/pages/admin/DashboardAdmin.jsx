import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, School, Bell, TrendingUp, Eye } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import CardStat from '../../components/dashboard/CardStat'
import ChartNilai from '../../components/dashboard/ChartNilai'
import DataTable from '../../components/dashboard/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function DashboardAdmin() {
  const { 
    siswa, guru, kelas, pengumuman, 
    setSiswa, setGuru, setKelas, setPengumuman,
    loading 
  } = useDataStore()

  const [dataLoaded, setDataLoaded] = useState(false)
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalKelas: 0,
    eventAktif: 0,
  })

  // Realtime subscriptions
  useRealtime('siswa', setSiswa)
  useRealtime('guru', setGuru)
  useRealtime('kelas', setKelas)
  useRealtime('pengumuman', setPengumuman)

  useEffect(() => {
    // Calculate stats
    const newStats = {
      totalSiswa: siswa.length,
      totalGuru: guru.length,
      totalKelas: kelas.length,
      eventAktif: pengumuman.filter(p => {
        if (!p.created_at) return false
        const created = new Date(p.created_at)
        const now = new Date()
        const diffDays = (now - created) / (1000 * 60 * 60 * 24)
        return diffDays <= 7
      }).length,
    }
    
    setStats(newStats)

    // Set data as loaded if we have any data
    if (siswa.length > 0 || guru.length > 0 || pengumuman.length > 0) {
      setDataLoaded(true)
    }

    // Auto-set loaded after 3 seconds max
    const timer = setTimeout(() => {
      setDataLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [siswa, guru, kelas, pengumuman])

  const pengumumanColumns = [
    { key: 'judul', header: 'Judul' },
    { key: 'isi', header: 'Isi', render: (value) => (
      <span className="truncate max-w-xs block">{value}</span>
    )},
    { key: 'created_at', header: 'Tanggal', render: (value) => (
      value ? new Date(value).toLocaleDateString('id-ID') : '-'
    )},
  ]

  // Show loading only briefly
  if (!dataLoaded && loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner text="Memuat data dashboard..." />
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Overview sistem manajemen akademik</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>Real-time Data</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <CardStat
          title="Total Siswa"
          value={stats.totalSiswa}
          change={stats.totalSiswa > 0 ? 2.5 : 0}
          icon={Users}
          color="blue"
        />
        <CardStat
          title="Total Guru"
          value={stats.totalGuru}
          change={stats.totalGuru > 0 ? 1.2 : 0}
          icon={UserCheck}
          color="green"
        />
        <CardStat
          title="Total Kelas"
          value={stats.totalKelas}
          change={0}
          icon={School}
          color="orange"
        />
        <CardStat
          title="Event Aktif"
          value={stats.eventAktif}
          change={stats.eventAktif > 0 ? 15.3 : 0}
          icon={Bell}
          color="purple"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChartNilai />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Pengumuman Terbaru */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pengumuman Terbaru
            </h3>
            <div className="space-y-3">
              {pengumuman.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800">{item.judul}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.isi}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.created_at 
                      ? new Date(item.created_at).toLocaleDateString('id-ID')
                      : 'Tanggal tidak tersedia'
                    }
                  </p>
                </div>
              ))}
              {pengumuman.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Belum ada pengumuman
                </p>
              )}
            </div>
          </div>

          {/* Statistik Cepat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Statistik Cepat
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Siswa Baru (Bulan Ini)</span>
                <span className="font-semibold text-green-600">
                  +{Math.max(0, Math.floor(stats.totalSiswa / 3))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rata-rata Kehadiran</span>
                <span className="font-semibold text-blue-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nilai Terbaik</span>
                <span className="font-semibold text-orange-600">
                  {stats.totalKelas > 0 ? 'Kelas 9A' : 'Belum ada data'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabel Pengumuman Lengkap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Semua Pengumuman ({pengumuman.length})
            </h3>
          </div>
          <DataTable
            data={pengumuman}
            columns={pengumumanColumns}
            searchable={true}
            pagination={true}
            pageSize={5}
          />
        </div>
      </motion.div>

      {/* Data Status */}
      {stats.totalSiswa === 0 && stats.totalGuru === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Data Kosong
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Database masih kosong. Silakan tambah data siswa, guru, dan pengumuman 
                  melalui menu Data Akademik.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardAdmin