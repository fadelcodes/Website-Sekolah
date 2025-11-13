import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardCheck, Download, Filter } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import DataTable from '../../components/dashboard/DataTable'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function NilaiAbsensiAdmin() {
  const { nilai, absensi, setNilai, setAbsensi, loading } = useDataStore()
  const [activeTab, setActiveTab] = useState('nilai')
  const [filterKelas, setFilterKelas] = useState('')
  const [filterSemester, setFilterSemester] = useState('')

  useRealtime('nilai', setNilai)
  useRealtime('absensi', setAbsensi)

  const nilaiColumns = [
    { key: 'siswa_id', header: 'Siswa', render: (value) => `Siswa ${value}` },
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
    { key: 'keterangan', header: 'Keterangan', render: (value) => value || '-' },
  ]

  const getFilteredData = () => {
    let data = activeTab === 'nilai' ? nilai : absensi
    
    // Apply filters here based on filterKelas and filterSemester
    // This is a simplified version - you'd need to join with siswa table for proper filtering
    
    return data
  }

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
          <p className="text-gray-600">Monitor nilai dan kehadiran siswa</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Laporan
        </Button>
      </motion.div>

      {/* Tabs & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Tabs */}
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              placeholder="Filter Kelas"
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full sm:w-40"
            />
            {activeTab === 'nilai' && (
              <Input
                placeholder="Semester"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="w-full sm:w-32"
              />
            )}
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={getFilteredData()}
          columns={activeTab === 'nilai' ? nilaiColumns : absensiColumns}
          searchable={true}
          pagination={true}
          pageSize={10}
        />
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">{nilai.length}</h3>
          <p className="text-gray-600">Total Nilai</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <ClipboardCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">{absensi.length}</h3>
          <p className="text-gray-600">Total Absensi</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 font-bold">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {absensi.filter(a => a.status === 'hadir').length}
          </h3>
          <p className="text-gray-600">Kehadiran</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-600 font-bold">✗</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {absensi.filter(a => a.status !== 'hadir').length}
          </h3>
          <p className="text-gray-600">Tidak Hadir</p>
        </div>
      </motion.div>
    </div>
  )
}

export default NilaiAbsensiAdmin