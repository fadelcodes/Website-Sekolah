import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Save, BookOpen, ClipboardCheck, Filter } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import { useAutosave } from '../../hooks/useAutosave'
import { api } from '../../services/api'
import DataTable from '../../components/dashboard/DataTable'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function NilaiAbsensiGuru() {
  const { user } = useAuth()
  const { jadwal, siswa, nilai, absensi, setNilai, setAbsensi, loading } = useDataStore()
  const [activeTab, setActiveTab] = useState('nilai')
  const [selectedKelas, setSelectedKelas] = useState('')
  const [selectedMapel, setSelectedMapel] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useRealtime('nilai', setNilai)
  useRealtime('absensi', setAbsensi)
  useRealtime('jadwal', () => {})
  useRealtime('siswa', () => {})

  // Dapatkan kelas dan mapel yang diajar
  const jadwalGuru = jadwal.filter(j => j.guru_id === user?.id)
  const kelasDiajar = [...new Set(jadwalGuru.map(j => j.kelas_id))]
  const mapelDiajar = [...new Set(jadwalGuru.map(j => j.mapel))]

  const kelasList = kelasDiajar
  const siswaKelas = selectedKelas ? siswa.filter(s => s.kelas_id === selectedKelas) : []

  // Autosave untuk nilai
  const { updateData: updateNilai, manualSave: saveNilai, isSaving: savingNilai } = useAutosave('nilai')

  const nilaiColumns = [
    { key: 'nama', header: 'Nama Siswa', render: (_, row) => 
      siswa.find(s => s.id === row.siswa_id)?.nama || 'Siswa'
    },
    { key: 'nilai', header: 'Nilai', render: (value, row) => (
      <Input
        type="number"
        min="0"
        max="100"
        value={value || ''}
        onChange={(e) => handleNilaiChange(row.id, parseInt(e.target.value) || 0)}
        className="w-20"
      />
    )},
    { key: 'semester', header: 'Semester', render: (value, row) => (
      <select
        value={value || '1'}
        onChange={(e) => handleSemesterChange(row.id, e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    )},
    { key: 'created_at', header: 'Terakhir Diupdate', render: (value) => 
      value ? new Date(value).toLocaleDateString('id-ID') : 'Belum ada'
    },
  ]

  const absensiColumns = [
    { key: 'nama', header: 'Nama Siswa', render: (_, row) => 
      siswa.find(s => s.id === row.siswa_id)?.nama || 'Siswa'
    },
    { key: 'tanggal', header: 'Tanggal', render: (value) => 
      new Date(value).toLocaleDateString('id-ID')
    },
    { key: 'status', header: 'Status', render: (value, row) => (
      <select
        value={value}
        onChange={(e) => handleAbsensiChange(row.id, e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="hadir">Hadir</option>
        <option value="sakit">Sakit</option>
        <option value="izin">Izin</option>
        <option value="alpha">Alpha</option>
      </select>
    )},
    { key: 'keterangan', header: 'Keterangan', render: (value, row) => (
      <Input
        value={value || ''}
        onChange={(e) => handleKeteranganChange(row.id, e.target.value)}
        placeholder="Keterangan..."
        className="w-32"
      />
    )},
  ]

  const handleNilaiChange = (nilaiId, newNilai) => {
    const updatedNilai = nilai.map(n => 
      n.id === nilaiId ? { ...n, nilai: newNilai } : n
    )
    setNilai(updatedNilai)
    // Simpan ke database
    api.update('nilai', nilaiId, { nilai: newNilai })
  }

  const handleSemesterChange = (nilaiId, newSemester) => {
    const updatedNilai = nilai.map(n => 
      n.id === nilaiId ? { ...n, semester: newSemester } : n
    )
    setNilai(updatedNilai)
    api.update('nilai', nilaiId, { semester: newSemester })
  }

  const handleAbsensiChange = (absensiId, newStatus) => {
    const updatedAbsensi = absensi.map(a => 
      a.id === absensiId ? { ...a, status: newStatus } : a
    )
    setAbsensi(updatedAbsensi)
    api.update('absensi', absensiId, { status: newStatus })
  }

  const handleKeteranganChange = (absensiId, newKeterangan) => {
    const updatedAbsensi = absensi.map(a => 
      a.id === absensiId ? { ...a, keterangan: newKeterangan } : a
    )
    setAbsensi(updatedAbsensi)
    api.update('absensi', absensiId, { keterangan: newKeterangan })
  }

  const handleTambahNilai = () => {
    if (!selectedKelas || !selectedMapel) {
      toast.error('Pilih kelas dan mata pelajaran terlebih dahulu')
      return
    }
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleTambahAbsensi = () => {
    if (!selectedKelas) {
      toast.error('Pilih kelas terlebih dahulu')
      return
    }
    
    const today = new Date().toISOString().split('T')[0]
    const absensiHariIni = absensi.filter(a => 
      a.tanggal === today && siswaKelas.some(s => s.id === a.siswa_id)
    )

    if (absensiHariIni.length > 0) {
      toast.error('Absensi untuk hari ini sudah ada')
      return
    }

    // Buat absensi untuk semua siswa di kelas
    siswaKelas.forEach(async (siswa) => {
      try {
        await api.create('absensi', {
          siswa_id: siswa.id,
          tanggal: today,
          status: 'hadir',
          keterangan: ''
        })
      } catch (error) {
        console.error('Gagal membuat absensi:', error)
      }
    })

    toast.success('Absensi hari ini berhasil dibuat')
  }

  const getDataForTable = () => {
    if (activeTab === 'nilai') {
      return nilai.filter(n => 
        n.mapel === selectedMapel && 
        siswaKelas.some(s => s.id === n.siswa_id)
      )
    } else {
      return absensi.filter(a => 
        siswaKelas.some(s => s.id === a.siswa_id)
      ).slice(0, 20) // Batasi untuk performa
    }
  }

  useEffect(() => {
    if (mapelDiajar.length > 0 && !selectedMapel) {
      setSelectedMapel(mapelDiajar[0])
    }
  }, [mapelDiajar, selectedMapel])

  if (loading && jadwal.length === 0) {
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
          <p className="text-gray-600">Input nilai dan absensi siswa</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'nilai' && (
            <Button onClick={handleTambahNilai}>
              <Plus className="w-4 h-4 mr-2" />
              Input Nilai
            </Button>
          )}
          {activeTab === 'absensi' && (
            <Button onClick={handleTambahAbsensi}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Absensi
            </Button>
          )}
          {savingNilai && (
            <Button variant="secondary" disabled>
              <Save className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </Button>
          )}
        </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kelas</option>
                {kelasList.map(kelasId => {
                  const kelasData = jadwalGuru.find(j => j.kelas_id === kelasId)
                  return kelasData ? (
                    <option key={kelasId} value={kelasId}>
                      {kelasData.kelas_id}
                    </option>
                  ) : null
                })}
              </select>
            </div>

            {activeTab === 'nilai' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={selectedMapel}
                  onChange={(e) => setSelectedMapel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Mapel</option>
                  {mapelDiajar.map(mapel => (
                    <option key={mapel} value={mapel}>{mapel}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      {selectedKelas && (activeTab === 'absensi' || selectedMapel) ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataTable
            data={getDataForTable()}
            columns={activeTab === 'nilai' ? nilaiColumns : absensiColumns}
            searchable={false}
            pagination={true}
            pageSize={10}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pilih Kelas {activeTab === 'nilai' ? 'dan Mata Pelajaran' : ''}
          </h3>
          <p className="text-gray-600">
            Silakan pilih kelas {activeTab === 'nilai' ? 'dan mata pelajaran' : ''} untuk melihat data
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {nilai.filter(n => jadwalGuru.some(j => j.mapel === n.mapel)).length}
          </h3>
          <p className="text-gray-600">Total Nilai</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <ClipboardCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {absensi.filter(a => 
              siswaKelas.some(s => s.id === a.siswa_id)
            ).length}
          </h3>
          <p className="text-gray-600">Data Absensi</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 font-bold">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {absensi.filter(a => 
              a.status === 'hadir' && 
              siswaKelas.some(s => s.id === a.siswa_id)
            ).length}
          </h3>
          <p className="text-gray-600">Kehadiran</p>
        </div>
      </motion.div>
    </div>
  )
}

export default NilaiAbsensiGuru