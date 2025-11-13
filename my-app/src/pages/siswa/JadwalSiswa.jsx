import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Filter } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { HARI } from '../../utils/constants'

function JadwalSiswa() {
  const { user } = useAuth()
  const { jadwal, siswa, setJadwal, loading } = useDataStore()
  const [filterHari, setFilterHari] = useState('')

  useRealtime('jadwal', setJadwal)
  useRealtime('siswa', () => {})

  // Dapatkan kelas siswa
  const siswaData = siswa.find(s => s.user_id === user?.id)
  const kelasSiswa = siswaData?.kelas_id

  // Dapatkan jadwal untuk kelas siswa
  const jadwalSiswa = jadwal.filter(j => j.kelas_id === kelasSiswa)

  // Kelompokkan jadwal per hari
  const jadwalPerHari = HARI.map(hari => ({
    hari,
    jadwal: jadwalSiswa.filter(j => j.hari === hari)
  }))

  const jadwalTampil = filterHari 
    ? jadwalPerHari.filter(j => j.hari === filterHari)
    : jadwalPerHari

  // Hari ini
  const hariIni = new Date().getDay()
  const hariMap = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' }
  const hariIniNama = hariMap[hariIni]

  useEffect(() => {
    if (!filterHari && hariIniNama) {
      setFilterHari(hariIniNama)
    }
  }, [filterHari, hariIniNama])

  if (loading && jadwal.length === 0) {
    return <LoadingSpinner text="Memuat jadwal pelajaran..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Pelajaran</h1>
          <p className="text-gray-600">Jadwal pelajaran kelas Anda</p>
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

      {/* Jadwal Hari Ini */}
      {hariIniNama && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-xl border border-blue-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Jadwal Hari Ini</h3>
              <p className="text-blue-600">{hariIniNama}</p>
            </div>
          </div>

          {jadwalSiswa.filter(j => j.hari === hariIniNama).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jadwalSiswa
                .filter(j => j.hari === hariIniNama)
                .sort((a, b) => a.jam.localeCompare(b.jam))
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{item.mapel}</h4>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.jam}</p>
                    <p className="text-xs text-gray-500">Guru: {item.guru_id}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-blue-700">Tidak ada pelajaran hari ini</p>
          )}
        </motion.div>
      )}

      {/* Jadwal Lengkap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {jadwalTampil.map(({ hari, jadwal: jadwalHari }) => (
          <motion.div
            key={hari}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${
              hari === hariIniNama ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div className={`px-6 py-4 ${
              hari === hariIniNama ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{hari}</h3>
                {hari === hariIniNama && (
                  <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs text-white">
                    Hari Ini
                  </span>
                )}
              </div>
              <p className="text-gray-200 text-sm">
                {jadwalHari.length} jam pelajaran
              </p>
            </div>

            <div className="p-6 space-y-3">
              {jadwalHari.length > 0 ? (
                jadwalHari
                  .sort((a, b) => a.jam.localeCompare(b.jam))
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.mapel}</h4>
                        <p className="text-sm text-gray-600">{item.guru_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{item.jam}</p>
                        <p className="text-xs text-gray-500">Ruangan</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Tidak ada jadwal</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!kelasSiswa && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Belum Terdaftar di Kelas</h3>
          <p className="text-gray-600">
            Anda belum terdaftar di kelas manapun. Hubungi wali kelas atau administrator.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default JadwalSiswa