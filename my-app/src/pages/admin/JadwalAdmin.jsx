import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Clock, Users } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import DataTable from '../../components/dashboard/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { HARI, JAM_PELAJARAN } from '../../utils/constants'

function JadwalAdmin() {
  const { jadwal, setJadwal, loading } = useDataStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useRealtime('jadwal', setJadwal)

  const jadwalColumns = [
    { key: 'hari', header: 'Hari' },
    { key: 'jam', header: 'Jam' },
    { key: 'mapel', header: 'Mata Pelajaran' },
    { key: 'guru_id', header: 'Guru', render: (value) => `Guru ${value}` },
    { key: 'kelas_id', header: 'Kelas' },
  ]

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item) => {
    console.log('Delete jadwal:', item)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  if (loading && jadwal.length === 0) {
    return <LoadingSpinner text="Memuat data jadwal..." />
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Jadwal</h1>
          <p className="text-gray-600">Kelola jadwal pelajaran semua kelas</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jadwal
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={jadwal}
          columns={jadwalColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={true}
          pagination={true}
          pageSize={10}
        />
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Jadwal' : 'Tambah Jadwal'}
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hari
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {HARI.map(hari => (
                  <option key={hari} value={hari}>{hari}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jam Pelajaran
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {JAM_PELAJARAN.map(jam => (
                  <option key={jam} value={jam}>{jam}</option>
                ))}
              </select>
            </div>
          </div>

          <Input label="Mata Pelajaran" placeholder="Pilih mata pelajaran" />
          <Input label="Guru" placeholder="Pilih guru" />
          <Input label="Kelas" placeholder="Pilih kelas" />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingItem ? 'Update' : 'Simpan'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </form>
      </Modal>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">{jadwal.length}</h3>
          <p className="text-gray-600">Total Jadwal</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {[...new Set(jadwal.map(j => j.kelas_id))].length}
          </h3>
          <p className="text-gray-600">Kelas Terjadwal</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {[...new Set(jadwal.map(j => j.guru_id))].length}
          </h3>
          <p className="text-gray-600">Guru Mengajar</p>
        </div>
      </motion.div>
    </div>
  )
}

export default JadwalAdmin