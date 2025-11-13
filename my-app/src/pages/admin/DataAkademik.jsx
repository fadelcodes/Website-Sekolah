import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, School, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDataStore } from '../../store/dataStore'
import { useRealtime } from '../../hooks/useRealtime'
import CardStat from '../../components/dashboard/CardStat'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

function DataAkademik() {
  const { siswa, guru, kelas, setSiswa, setGuru, setKelas, loading } = useDataStore()

  useRealtime('siswa', setSiswa)
  useRealtime('guru', setGuru)
  useRealtime('kelas', setKelas)

  const menuItems = [
    {
      title: 'Manajemen Siswa',
      description: 'Kelola data siswa, NIS, dan informasi pribadi',
      icon: Users,
      href: '/admin/siswa',
      count: siswa.length,
      color: 'blue',
    },
    {
      title: 'Manajemen Guru',
      description: 'Kelola data guru, NIP, dan mata pelajaran',
      icon: UserCheck,
      href: '/admin/guru',
      count: guru.length,
      color: 'green',
    },
    {
      title: 'Manajemen Kelas',
      description: 'Kelola data kelas, wali kelas, dan kapasitas',
      icon: School,
      href: '/admin/kelas',
      count: kelas.length,
      color: 'orange',
    },
  ]

  if (loading && siswa.length === 0) {
    return <LoadingSpinner text="Memuat data akademik..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Data Akademik</h1>
          <p className="text-gray-600">Kelola seluruh data akademik sekolah</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <CardStat
          title="Total Siswa"
          value={siswa.length}
          icon={Users}
          color="blue"
        />
        <CardStat
          title="Total Guru"
          value={guru.length}
          icon={UserCheck}
          color="green"
        />
        <CardStat
          title="Total Kelas"
          value={kelas.length}
          icon={School}
          color="orange"
        />
      </motion.div>

      {/* Management Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {menuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Link to={item.href}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${item.color}-100 group-hover:bg-${item.color}-200 transition-colors`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                    {item.count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  <span>Kelola Data</span>
                  <BookOpen className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Data Siswa Diperbarui</h4>
              <p className="text-sm text-gray-600">5 siswa baru ditambahkan</p>
            </div>
            <span className="text-xs text-gray-500">2 jam lalu</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Data Guru Diperbarui</h4>
              <p className="text-sm text-gray-600">1 guru baru bergabung</p>
            </div>
            <span className="text-xs text-gray-500">1 hari lalu</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Kelas Baru Dibuat</h4>
              <p className="text-sm text-gray-600">Kelas 7C telah ditambahkan</p>
            </div>
            <span className="text-xs text-gray-500">3 hari lalu</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DataAkademik