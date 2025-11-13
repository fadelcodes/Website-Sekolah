import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, Eye, AlertTriangle } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function PengumumanGuru() {
  const { user } = useAuth()
  const { pengumuman, setPengumuman, loading } = useDataStore()
  const [selectedPengumuman, setSelectedPengumuman] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useRealtime('pengumuman', setPengumuman)

  // Filter pengumuman yang relevan untuk guru
  const pengumumanRelevan = pengumuman.filter(p => 
    p.target === 'guru' || p.target === 'semua'
  )

  const handleViewPengumuman = (pengumuman) => {
    setSelectedPengumuman(pengumuman)
    setIsModalOpen(true)
  }

  if (loading && pengumuman.length === 0) {
    return <LoadingSpinner text="Memuat pengumuman..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Pengumuman</h1>
          <p className="text-gray-600">Informasi dan pengumuman dari sekolah</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Bell className="w-4 h-4" />
          <span>{pengumumanRelevan.length} Pengumuman</span>
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
              <p className="text-sm font-medium text-gray-600">Total Pengumuman</p>
              <p className="text-2xl font-bold text-gray-900">{pengumumanRelevan.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Penting</p>
              <p className="text-2xl font-bold text-gray-900">
                {pengumumanRelevan.filter(p => p.penting).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">
                {pengumumanRelevan.filter(p => {
                  const created = new Date(p.created_at)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daftar Pengumuman */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {pengumumanRelevan.length > 0 ? (
          pengumumanRelevan
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((pengumuman, index) => (
              <motion.div
                key={pengumuman.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer hover:shadow-md transition-all ${
                  pengumuman.penting 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => handleViewPengumuman(pengumuman)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {pengumuman.penting && (
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                    )}
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        pengumuman.penting ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        {pengumuman.judul}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(pengumuman.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          Untuk: {pengumuman.target}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Lihat</span>
                  </div>
                </div>
                
                <p className={`line-clamp-2 ${
                  pengumuman.penting ? 'text-red-700' : 'text-gray-700'
                }`}>
                  {pengumuman.isi}
                </p>
              </motion.div>
            ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Ada Pengumuman</h3>
            <p className="text-gray-600">
              Tidak ada pengumuman untuk Anda saat ini.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal View Pengumuman */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPengumuman?.judul}
        size="lg"
      >
        {selectedPengumuman && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(selectedPengumuman.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {selectedPengumuman.penting && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 rounded-full">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span className="text-red-700 text-xs font-medium">Penting</span>
                </div>
              )}
              <div className="capitalize">
                Untuk: {selectedPengumuman.target}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedPengumuman.isi}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PengumumanGuru