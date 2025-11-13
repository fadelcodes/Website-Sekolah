import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { api } from '../../services/api'
import DataTable from '../../components/dashboard/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function SiswaManagement() {
  const { siswa, kelas, setSiswa, loading } = useDataStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSiswa, setEditingSiswa] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    email: '',
    telepon: '',
    kelas_id: '',
    alamat: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
  })

  useRealtime('siswa', setSiswa)
  useRealtime('kelas', () => {}) // Subscribe to kelas changes

  const siswaColumns = [
    { key: 'nis', header: 'NIS' },
    { key: 'nama', header: 'Nama Siswa' },
    { key: 'kelas_id', header: 'Kelas', render: (value) => 
      kelas.find(k => k.id === value)?.nama || value
    },
    { key: 'email', header: 'Email' },
    { key: 'jenis_kelamin', header: 'Jenis Kelamin', render: (value) => 
      value === 'L' ? 'Laki-laki' : value === 'P' ? 'Perempuan' : '-'
    },
    { key: 'created_at', header: 'Tanggal Daftar', render: (value) => 
      new Date(value).toLocaleDateString('id-ID')
    },
  ]

  const filteredSiswa = siswa.filter(siswa =>
    siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siswa.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kelas.find(k => k.id === siswa.kelas_id)?.nama || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (siswa) => {
    setEditingSiswa(siswa)
    setFormData({
      nis: siswa.nis || '',
      nama: siswa.nama || '',
      email: siswa.email || '',
      telepon: siswa.telepon || '',
      kelas_id: siswa.kelas_id || '',
      alamat: siswa.alamat || '',
      tanggal_lahir: siswa.tanggal_lahir || '',
      jenis_kelamin: siswa.jenis_kelamin || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (siswa) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus siswa ${siswa.nama}?`)) {
      try {
        const { error } = await api.delete('siswa', siswa.id)
        if (error) throw error
        toast.success('Siswa berhasil dihapus')
      } catch (error) {
        toast.error('Gagal menghapus siswa')
      }
    }
  }

  const handleAdd = () => {
    setEditingSiswa(null)
    setFormData({
      nis: '',
      nama: '',
      email: '',
      telepon: '',
      kelas_id: '',
      alamat: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingSiswa) {
        // Update siswa
        const { error } = await api.update('siswa', editingSiswa.id, formData)
        if (error) throw error
        toast.success('Data siswa berhasil diperbarui')
      } else {
        // Add new siswa
        const { error } = await api.create('siswa', {
          ...formData,
          user_id: null, // akan diisi setelah membuat user
        })
        if (error) throw error
        toast.success('Siswa baru berhasil ditambahkan')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(editingSiswa ? 'Gagal memperbarui data siswa' : 'Gagal menambahkan siswa')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading && siswa.length === 0) {
    return <LoadingSpinner text="Memuat data siswa..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Siswa</h1>
          <p className="text-gray-600">Kelola data siswa dan peserta didik</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Siswa
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
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-gray-900">{siswa.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siswa Laki-laki</p>
              <p className="text-2xl font-bold text-gray-900">
                {siswa.filter(s => s.jenis_kelamin === 'L').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siswa Perempuan</p>
              <p className="text-2xl font-bold text-gray-900">
                {siswa.filter(s => s.jenis_kelamin === 'P').length}
              </p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <MapPin className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Terisi</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(siswa.map(s => s.kelas_id))].length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
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
                placeholder="Cari siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Menampilkan {filteredSiswa.length} dari {siswa.length} siswa
            </div>
          </div>
        </div>

        <DataTable
          data={filteredSiswa}
          columns={siswaColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </motion.div>

      {/* Modal Add/Edit Siswa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="NIS"
              value={formData.nis}
              onChange={(e) => handleInputChange('nis', e.target.value)}
              placeholder="Masukkan NIS"
              required
            />
            <Input
              label="Nama Lengkap"
              value={formData.nama}
              onChange={(e) => handleInputChange('nama', e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@siswa.sch.id"
              icon={Mail}
              required
            />
            <Input
              label="Telepon"
              value={formData.telepon}
              onChange={(e) => handleInputChange('telepon', e.target.value)}
              placeholder="08xxxxxxxxxx"
              icon={Phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas
              </label>
              <select
                value={formData.kelas_id}
                onChange={(e) => handleInputChange('kelas_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Kelas</option>
                {kelas.map(k => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <select
                value={formData.jenis_kelamin}
                onChange={(e) => handleInputChange('jenis_kelamin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
            />
          </div>

          <Input
            label="Alamat"
            value={formData.alamat}
            onChange={(e) => handleInputChange('alamat', e.target.value)}
            placeholder="Masukkan alamat lengkap"
            as="textarea"
            rows={3}
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingSiswa ? 'Update Data' : 'Tambah Siswa'}
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

export default SiswaManagement