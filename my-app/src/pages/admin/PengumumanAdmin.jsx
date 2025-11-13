import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Bell, Calendar } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import DataTable from '../../components/dashboard/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function PengumumanAdmin() {
  const { user } = useAuth()
  const { pengumuman, setPengumuman, loading } = useDataStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editingPengumuman, setEditingPengumuman] = useState(null)
  const [viewingPengumuman, setViewingPengumuman] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    target: 'semua', // semua, guru, siswa
    penting: false,
  })

  useRealtime('pengumuman', setPengumuman)

  const pengumumanColumns = [
    { key: 'judul', header: 'Judul' },
    { key: 'isi', header: 'Isi', render: (value) => (
      <span className="truncate max-w-xs block">{value}</span>
    )},
    { key: 'target', header: 'Target', render: (value) => (
      <span className="capitalize">{value}</span>
    )},
    { key: 'penting', header: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value ? 'Penting' : 'Biasa'}
      </span>
    )},
    { key: 'created_at', header: 'Tanggal', render: (value) => 
      new Date(value).toLocaleDateString('id-ID')
    },
    { key: 'actions', header: 'Aksi', render: (_, row) => (
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="small"
          onClick={() => handleView(row)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => handleEdit(row)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => handleDelete(row)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )},
  ]

  const filteredPengumuman = pengumuman.filter(p =>
    p.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.isi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (pengumuman) => {
    setEditingPengumuman(pengumuman)
    setFormData({
      judul: pengumuman.judul || '',
      isi: pengumuman.isi || '',
      target: pengumuman.target || 'semua',
      penting: pengumuman.penting || false,
    })
    setIsModalOpen(true)
  }

  const handleView = (pengumuman) => {
    setViewingPengumuman(pengumuman)
    setViewModalOpen(true)
  }

  const handleDelete = async (pengumuman) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengumuman "${pengumuman.judul}"?`)) {
      try {
        const { error } = await api.delete('pengumuman', pengumuman.id)
        if (error) throw error
        toast.success('Pengumuman berhasil dihapus')
      } catch (error) {
        toast.error('Gagal menghapus pengumuman')
      }
    }
  }

  const handleAdd = () => {
    setEditingPengumuman(null)
    setFormData({
      judul: '',
      isi: '',
      target: 'semua',
      penting: false,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.judul.trim() || !formData.isi.trim()) {
      toast.error('Judul dan isi pengumuman harus diisi')
      return
    }

    try {
      const pengumumanData = {
        ...formData,
        dibuat_oleh: user?.id,
      }

      if (editingPengumuman) {
        // Update pengumuman
        const { error } = await api.update('pengumuman', editingPengumuman.id, pengumumanData)
        if (error) throw error
        toast.success('Pengumuman berhasil diperbarui')
      } else {
        // Add new pengumuman
        const { error } = await api.create('pengumuman', pengumumanData)
        if (error) throw error
        toast.success('Pengumuman baru berhasil ditambahkan')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(editingPengumuman ? 'Gagal memperbarui pengumuman' : 'Gagal menambahkan pengumuman')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading && pengumuman.length === 0) {
    return <LoadingSpinner text="Memuat data pengumuman..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengumuman</h1>
          <p className="text-gray-600">Buat dan kelola pengumuman sekolah</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Pengumuman
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
              <p className="text-sm font-medium text-gray-600">Total Pengumuman</p>
              <p className="text-2xl font-bold text-gray-900">{pengumuman.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pengumuman Penting</p>
              <p className="text-2xl font-bold text-gray-900">
                {pengumuman.filter(p => p.penting).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Untuk Siswa</p>
              <p className="text-2xl font-bold text-gray-900">
                {pengumuman.filter(p => p.target === 'siswa').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Untuk Guru</p>
              <p className="text-2xl font-bold text-gray-900">
                {pengumuman.filter(p => p.target === 'guru').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
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
                placeholder="Cari pengumuman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Menampilkan {filteredPengumuman.length} dari {pengumuman.length} pengumuman
            </div>
          </div>
        </div>

        <DataTable
          data={filteredPengumuman}
          columns={pengumumanColumns}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </motion.div>

      {/* Modal Add/Edit Pengumuman */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPengumuman ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Pengumuman"
            value={formData.judul}
            onChange={(e) => handleInputChange('judul', e.target.value)}
            placeholder="Masukkan judul pengumuman"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Pengumuman
            </label>
            <textarea
              value={formData.isi}
              onChange={(e) => handleInputChange('isi', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Tulis isi pengumuman di sini..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Pengumuman
              </label>
              <select
                value={formData.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="semua">Semua Pengguna</option>
                <option value="guru">Guru Saja</option>
                <option value="siswa">Siswa Saja</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="penting"
                checked={formData.penting}
                onChange={(e) => handleInputChange('penting', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="penting" className="text-sm font-medium text-gray-700">
                Tandai sebagai penting
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingPengumuman ? 'Update Pengumuman' : 'Buat Pengumuman'}
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

      {/* Modal View Pengumuman */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={viewingPengumuman?.judul}
        size="lg"
      >
        {viewingPengumuman && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(viewingPengumuman.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                viewingPengumuman.penting ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {viewingPengumuman.penting ? 'Penting' : 'Biasa'}
              </div>
              <div className="capitalize">
                Untuk: {viewingPengumuman.target}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {viewingPengumuman.isi}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PengumumanAdmin