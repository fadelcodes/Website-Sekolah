import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, BookOpen, Eye, Filter } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import DataTable from '../../components/dashboard/DataTable'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function KelasSiswa() {
  const { user } = useAuth()
  const { jadwal, siswa, kelas, setJadwal, setSiswa, setKelas, loading } = useDataStore()
  const [selectedKelas, setSelectedKelas] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSiswa, setSelectedSiswa] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useRealtime('jadwal', setJadwal)
  useRealtime('siswa', setSiswa)
  useRealtime('kelas', setKelas)

  // Dapatkan kelas yang diajar oleh guru ini
  const kelasDiajar = jadwal
    .filter(j => j.guru_id === user?.id)
    .map(j => j.kelas_id)
    .filter((value, index, self) => self.indexOf(value) === index)

  const kelasList = kelas.filter(k => kelasDiajar.includes(k.id))

  // Dapatkan siswa dari kelas yang dipilih
  const siswaKelas = selectedKelas 
    ? siswa.filter(s => s.kelas_id === selectedKelas)
    : []

  const filteredSiswa = siswaKelas.filter(siswa =>
    siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siswa.nis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const siswaColumns = [
    { key: 'nis', header: 'NIS' },
    { key: 'nama', header: 'Nama Siswa' },
    { key: 'email', header: 'Email' },
    { key: 'jenis_kelamin', header: 'JK', render: (value) => 
      value === 'L' ? 'Laki-laki' : value === 'P' ? 'Perempuan' : '-'
    },
    { key: 'actions', header: 'Aksi', render: (_, row) => (
      <Button
        variant="secondary"
        size="small"
        onClick={() => handleViewSiswa(row)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    )},
  ]

  const handleViewSiswa = (siswa) => {
    setSelectedSiswa(siswa)
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (kelasList.length > 0 && !selectedKelas) {
      setSelectedKelas(kelasList[0].id)
    }
  }, [kelasList, selectedKelas])

  if (loading && jadwal.length === 0) {
    return <LoadingSpinner text="Memuat data kelas..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Kelas & Siswa</h1>
          <p className="text-gray-600">Lihat daftar siswa per kelas yang Anda ajar</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kelas Diajar</p>
              <p className="text-2xl font-bold text-gray-900">{kelasList.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-gray-900">
                {siswa.filter(s => kelasDiajar.includes(s.kelas_id)).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata per Kelas</p>
              <p className="text-2xl font-bold text-gray-900">
                {kelasList.length > 0 
                  ? Math.round(siswa.filter(s => kelasDiajar.includes(s.kelas_id)).length / kelasList.length)
                  : 0
                }
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kelas Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Pilih Kelas</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{kelasList.length} Kelas Diajar</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kelasList.map(kelasItem => (
            <button
              key={kelasItem.id}
              onClick={() => setSelectedKelas(kelasItem.id)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                selectedKelas === kelasItem.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{kelasItem.nama}</div>
              <div className="text-sm text-gray-600">
                {siswa.filter(s => s.kelas_id === kelasItem.id).length} Siswa
              </div>
            </button>
          ))}
        </div>

        {kelasList.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Kelas</h3>
            <p className="text-gray-600">Anda belum ditugaskan mengajar kelas apapun.</p>
          </div>
        )}
      </motion.div>

      {/* Daftar Siswa */}
      {selectedKelas && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Daftar Siswa - {kelas.find(k => k.id === selectedKelas)?.nama}
                </h3>
                <p className="text-gray-600">
                  {siswaKelas.length} siswa dalam kelas ini
                </p>
              </div>
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

          <DataTable
            data={filteredSiswa}
            columns={siswaColumns}
            searchable={false}
            pagination={true}
            pageSize={10}
          />
        </motion.div>
      )}

      {/* Modal Detail Siswa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detail Siswa"
        size="md"
      >
        {selectedSiswa && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIS</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSiswa.nis}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSiswa.nama}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSiswa.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSiswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kelas</label>
              <p className="mt-1 text-sm text-gray-900">
                {kelas.find(k => k.id === selectedSiswa.kelas_id)?.nama || '-'}
              </p>
            </div>

            {selectedSiswa.alamat && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSiswa.alamat}</p>
              </div>
            )}

            {selectedSiswa.telepon && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Telepon</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSiswa.telepon}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default KelasSiswa