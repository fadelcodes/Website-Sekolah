import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Filter } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { HARI } from '../../utils/constants'

function JadwalGuru() {
  const { user } = useAuth()
  const { jadwal, kelas, setJadwal, loading } = useDataStore()
  const [filterHari, setFilterHari] = useState('')

  useRealtime('jadwal', setJadwal)
  useRealtime('kelas', () => {})

  // Dapatkan jadwal guru ini
  const jadwalGuru = jadwal.filter(j => j.guru_id === user?.id)

  // Kelompokkan jadwal per hari
  const jadwalPerHari = HARI.map(hari => ({
    hari,
    jadwal: jadwalGuru.filter(j => j.hari === hari)
  }))

  const jadwalTampil = filterHari 
    ? jadwalPerHari.filter(j => j.hari === filterHari)
    : jadwalPerHari

  if (loading && jadwal.length === 0) {
    return <LoadingSpinner text="Memuat jadwal mengajar..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Mengajar</h1>
          <p className="text-gray-600">Jadwal pelajaran yang Anda ajar</p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterHari}
            onChange={(e) => setFilterHari(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Hari</option>
            {HARI.map(hari => (
              <option key={hari} value={hari}>{hari}</option>
            ))}
          </select>
        </div>
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
              <p className="text-sm font-medium text-gray-600">Total Jam</p>
              <p className="text-2xl font-bold text-gray-900">{jadwalGuru.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Diajar</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(jadwalGuru.map(j => j.kelas_id))].length}
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
              <p className="text-sm font-medium text-gray-600">Mata Pelajaran</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(jadwalGuru.map(j => j.mapel))].length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hari Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(jadwalGuru.map(j => j.hari))].length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Jadwal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jadwalTampil.map(({ hari, jadwal: jadwalHari }) => (
          <motion.div
            key={hari}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-blue-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">{hari}</h3>
              <p className="text-blue-100 text-sm">
                {jadwalHari.length} jam pelajaran
              </p>
            </div>

            <div className="p-6 space-y-4">
              {jadwalHari.length > 0 ? (
                jadwalHari
                  .sort((a, b) => a.jam.localeCompare(b.jam))
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.mapel}</h4>
                        <p className="text-sm text-gray-600">{item.kelas_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{item.jam}</p>
                        <p className="text-xs text-gray-500">Ruangan</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada jadwal</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {jadwalGuru.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Ada Jadwal</h3>
          <p className="text-gray-600">
            Anda belum memiliki jadwal mengajar. Hubungi administrator untuk mengatur jadwal.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default JadwalGuru