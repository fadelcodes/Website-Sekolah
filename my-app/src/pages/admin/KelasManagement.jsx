import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Users, UserCheck } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { api } from '../../services/api'
import DataTable from '../../components/dashboard/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function KelasManagement() {
  const { kelas, guru, siswa, setKelas, loading } = useDataStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKelas, setEditingKelas] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nama: '',
    wali_id: '',
    kapasitas: 32,
    tahun_ajaran: '2024/2025',
  })

  useRealtime('kelas', setKelas)
  useRealtime('guru', () => {}) // Subscribe to guru changes

  const kelasColumns = [
    { key: 'nama', header: 'Nama Kelas' },
    { key: 'wali_id', header: 'Wali Kelas', render: (value) => 
      guru.find(g => g.id === value)?.nama || '-'
    },
    { key: 'kapasitas', header: 'Kapasitas' },
    { key: 'tahun_ajaran', header: 'Tahun Ajaran' },
    { key: 'siswa_count', header: 'Jumlah Siswa', render: (value, row) => 
      `${siswa.filter(s => s.kelas_id === row.id).length} siswa`
    },
    { key: 'created_at', header: 'Dibuat', render: (value) => 
      new Date(value).toLocaleDateString('id-ID')
    },
  ]

  const kelasWithStats = kelas.map(k => ({
    ...k,
    siswa_count: siswa.filter(s => s.kelas_id === k.id).length
  }))

  const filteredKelas = kelasWithStats.filter(kelas =>
    kelas.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guru.find(g => g.id === kelas.wali_id)?.nama || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (kelas) => {
    setEditingKelas(kelas)
    setFormData({
      nama: kelas.nama || '',
      wali_id: kelas.wali_id || '',
      kapasitas: kelas.kapasitas || 32,
      tahun_ajaran: kelas.tahun_ajaran || '2024/2025',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (kelas) => {
    // Check if kelas has students
    const siswaInKelas = siswa.filter(s => s.kelas_id === kelas.id)
    if (siswaInKelas.length > 0) {
      toast.error(`Tidak dapat menghapus kelas ${kelas.nama} karena masih memiliki ${siswaInKelas.length} siswa`)
      return
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus kelas ${kelas.nama}?`)) {
      try {
        const { error } = await api.delete('kelas', kelas.id)
        if (error) throw error
        toast.success('Kelas berhasil dihapus')
      } catch (error) {
        toast.error('Gagal menghapus kelas')
      }
    }
  }

  const handleAdd = () => {
    setEditingKelas(null)
    setFormData({
      nama: '',
      wali_id: '',
      kapasitas: 32,
      tahun_ajaran: '2024/2025',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingKelas) {
        // Update kelas
        const { error } = await api.update('kelas', editingKelas.id, formData)
        if (error) throw error
        toast.success('Data kelas berhasil diperbarui')
      } else {
        // Add new kelas
        const { error } = await api.create('kelas', formData)
        if (error) throw error
        toast.success('Kelas baru berhasil ditambahkan')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(editingKelas ? 'Gagal memperbarui data kelas' : 'Gagal menambahkan kelas')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading && kelas.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
          <p className="text-gray-600">Kelola data kelas dan wali kelas</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kelas
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kelas</p>
              <p className="text-2xl font-bold text-gray-900">{kelas.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-gray-900">{siswa.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Siswa/Kelas</p>
              <p className="text-2xl font-bold text-gray-900">
                {kelas.length > 0 ? Math.round(siswa.length / kelas.length) : 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wali Kelas Terisi</p>
              <p className="text-2xl font-bold text-gray-900">
                {kelas.filter(k => k.wali_id).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Menampilkan {filteredKelas.length} dari {kelas.length} kelas
            </div>
          </div>
        </div>

        <DataTable
          data={filteredKelas}
          columns={kelasColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </motion.div>

      {/* Modal Add/Edit Kelas */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingKelas ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Kelas"
            value={formData.nama}
            onChange={(e) => handleInputChange('nama', e.target.value)}
            placeholder="Contoh: 7A, 8B, 9C"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wali Kelas
            </label>
            <select
              value={formData.wali_id}
              onChange={(e) => handleInputChange('wali_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Wali Kelas (Opsional)</option>
              {guru.map(g => (
                <option key={g.id} value={g.id}>{g.nama} - {g.mapel}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kapasitas"
              type="number"
              value={formData.kapasitas}
              onChange={(e) => handleInputChange('kapasitas', parseInt(e.target.value))}
              min="1"
              max="40"
            />
            <Input
              label="Tahun Ajaran"
              value={formData.tahun_ajaran}
              onChange={(e) => handleInputChange('tahun_ajaran', e.target.value)}
              placeholder="2024/2025"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingKelas ? 'Update Data' : 'Tambah Kelas'}
            </Button>
            <Button 
              variant="secondary" 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default KelasManagement