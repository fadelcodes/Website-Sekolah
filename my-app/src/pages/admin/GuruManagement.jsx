import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Mail, Phone, BookOpen } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { api } from '../../services/api'
import DataTable from '../../components/dashboard/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function GuruManagement() {
  const { guru, setGuru, loading } = useDataStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuru, setEditingGuru] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    email: '',
    telepon: '',
    mapel: '',
    alamat: '',
  })

  useRealtime('guru', setGuru)

  const guruColumns = [
    { key: 'nip', header: 'NIP' },
    { key: 'nama', header: 'Nama Guru' },
    { key: 'mapel', header: 'Mata Pelajaran' },
    { key: 'email', header: 'Email' },
    { key: 'telepon', header: 'Telepon', render: (value) => value || '-' },
    { key: 'created_at', header: 'Tanggal Bergabung', render: (value) => 
      new Date(value).toLocaleDateString('id-ID')
    },
  ]

  const filteredGuru = guru.filter(guru =>
    guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guru.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guru.mapel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (guru) => {
    setEditingGuru(guru)
    setFormData({
      nip: guru.nip || '',
      nama: guru.nama || '',
      email: guru.email || '',
      telepon: guru.telepon || '',
      mapel: guru.mapel || '',
      alamat: guru.alamat || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (guru) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus guru ${guru.nama}?`)) {
      try {
        const { error } = await api.delete('guru', guru.id)
        if (error) throw error
        toast.success('Guru berhasil dihapus')
      } catch (error) {
        toast.error('Gagal menghapus guru')
      }
    }
  }

  const handleAdd = () => {
    setEditingGuru(null)
    setFormData({
      nip: '',
      nama: '',
      email: '',
      telepon: '',
      mapel: '',
      alamat: '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingGuru) {
        // Update guru
        const { error } = await api.update('guru', editingGuru.id, formData)
        if (error) throw error
        toast.success('Data guru berhasil diperbarui')
      } else {
        // Add new guru
        const { error } = await api.create('guru', {
          ...formData,
          user_id: null, // akan diisi setelah membuat user
        })
        if (error) throw error
        toast.success('Guru baru berhasil ditambahkan')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(editingGuru ? 'Gagal memperbarui data guru' : 'Gagal menambahkan guru')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading && guru.length === 0) {
    return <LoadingSpinner text="Memuat data guru..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Guru</h1>
          <p className="text-gray-600">Kelola data guru dan pengajar</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Guru
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
              <p className="text-sm font-medium text-gray-600">Total Guru</p>
              <p className="text-2xl font-bold text-gray-900">{guru.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mata Pelajaran</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(guru.map(g => g.mapel))].length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Guru Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{guru.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Kelas</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
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
                placeholder="Cari guru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Menampilkan {filteredGuru.length} dari {guru.length} guru
            </div>
          </div>
        </div>

        <DataTable
          data={filteredGuru}
          columns={guruColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </motion.div>

      {/* Modal Add/Edit Guru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="NIP"
              value={formData.nip}
              onChange={(e) => handleInputChange('nip', e.target.value)}
              placeholder="Masukkan NIP"
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
              placeholder="email@sekolah.sch.id"
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

          <Input
            label="Mata Pelajaran"
            value={formData.mapel}
            onChange={(e) => handleInputChange('mapel', e.target.value)}
            placeholder="Contoh: Matematika, Bahasa Indonesia"
            required
          />

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
              {editingGuru ? 'Update Data' : 'Tambah Guru'}
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

export default GuruManagement