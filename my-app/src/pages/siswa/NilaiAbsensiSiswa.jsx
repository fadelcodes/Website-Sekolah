import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardCheck, Award, TrendingUp, BarChart3 } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import DataTable from '../../components/dashboard/DataTable'
import CardStat from '../../components/dashboard/CardStat'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function NilaiAbsensiSiswa() {
  const { user } = useAuth()
  const { nilai, absensi, setNilai, setAbsensi, loading } = useDataStore()
  const [activeTab, setActiveTab] = useState('nilai')

  useRealtime('nilai', setNilai)
  useRealtime('absensi', setAbsensi)

  // Filter data untuk siswa ini
  const nilaiSiswa = nilai.filter(n => n.siswa_id === user?.id)
  const absensiSiswa = absensi.filter(a => a.siswa_id === user?.id)

  // Hitung statistik
  const rataRataNilai = nilaiSiswa.length > 0 
    ? nilaiSiswa.reduce((sum, n) => sum + n.nilai, 0) / nilaiSiswa.length 
    : 0

  const totalHadir = absensiSiswa.filter(a => a.status === 'hadir').length
  const totalTidakHadir = absensiSiswa.filter(a => a.status !== 'hadir').length
  const persentaseHadir = absensiSiswa.length > 0 
    ? Math.round((totalHadir / absensiSiswa.length) * 100)
    : 0

  const nilaiColumns = [
    { key: 'mapel', header: 'Mata Pelajaran' },
    { key: 'nilai', header: 'Nilai', render: (value) => (
      <span className={`font-semibold text-lg ${
        value >= 85 ? 'text-green-600' :
        value >= 75 ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {value}
      </span>
    )},
    { key: 'semester', header: 'Semester' },
    { key: 'keterangan', header: 'Keterangan', render: (value) => value || '-' },
    { key: 'created_at', header: 'Tanggal', render: (value) => 
      new Date(value).toLocaleDateString('id-ID')
    },
  ]

  const absensiColumns = [
    { key: 'tanggal', header: 'Tanggal', render: (value) => 
      new Date(value).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    { key: 'status', header: 'Status', render: (value) => (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
    return <LoadingSpinner text="Memuat data nilai dan absensi..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Nilai & Absensi</h1>
          <p className="text-gray-600">Lihat nilai dan riwayat absensi Anda</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('nilai')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'nilai'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Nilai</span>
          </button>
          <button
            onClick={() => setActiveTab('absensi')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'absensi'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Absensi</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <CardStat
          title="Rata-rata Nilai"
          value={Math.round(rataRataNilai * 10) / 10}
          change={5.2}
          icon={Award}
          color="blue"
        />
        <CardStat
          title="Total Hadir"
          value={totalHadir}
          icon={ClipboardCheck}
          color="green"
        />
        <CardStat
          title="Tidak Hadir"
          value={totalTidakHadir}
          icon={TrendingUp}
          color="orange"
        />
        <CardStat
          title="Persentase Hadir"
          value={`${persentaseHadir}%`}
          icon={BarChart3}
          color="purple"
        />
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {activeTab === 'nilai' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Daftar Nilai</h3>
              <p className="text-gray-600">
                {nilaiSiswa.length} nilai tercatat
              </p>
            </div>
            <DataTable
              data={nilaiSiswa}
              columns={nilaiColumns}
              searchable={true}
              pagination={true}
              pageSize={10}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Riwayat Absensi</h3>
              <p className="text-gray-600">
                {absensiSiswa.length} catatan absensi
              </p>
            </div>
            <DataTable
              data={absensiSiswa.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))}
              columns={absensiColumns}
              searchable={true}
              pagination={true}
              pageSize={10}
            />
          </div>
        )}
      </motion.div>

      {/* Chart Section */}
      {activeTab === 'nilai' && nilaiSiswa.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Nilai</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nilaiSiswa.slice(0, 6).map((nilai, index) => (
              <div key={nilai.id} className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-20 h-20">
                    <div className="w-full h-full rounded-full border-4 border-gray-200 relative">
                      <div
                        className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500"
                        style={{
                          clipPath: `inset(0 0 ${100 - nilai.nilai}% 0)`
                        }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{nilai.nilai}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">{nilai.mapel}</p>
                <p className="text-xs text-gray-600">Semester {nilai.semester}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'nilai' && nilaiSiswa.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Ada Nilai</h3>
          <p className="text-gray-600">
            Nilai Anda akan muncul di sini setelah guru menginputnya.
          </p>
        </motion.div>
      )}

      {activeTab === 'absensi' && absensiSiswa.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Ada Absensi</h3>
          <p className="text-gray-600">
            Riwayat absensi Anda akan muncul di sini.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default NilaiAbsensiSiswa