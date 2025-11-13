import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  Bell,
  ChevronLeft,
  School,
  UserCheck,
  BarChart3
} from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useAuth } from '../../hooks/useAuth'

function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const { user } = useAuth()

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/data-akademik', label: 'Data Akademik', icon: Users },
    { path: '/admin/jadwal', label: 'Jadwal', icon: Calendar },
    { path: '/admin/nilai-absensi', label: 'Nilai & Absensi', icon: BookOpen },
    { path: '/admin/pengumuman', label: 'Pengumuman', icon: Bell },
  ]

  const guruMenu = [
    { path: '/guru/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/guru/kelas-siswa', label: 'Kelas & Siswa', icon: Users },
    { path: '/guru/nilai-absensi', label: 'Nilai & Absensi', icon: BookOpen },
    { path: '/guru/jadwal', label: 'Jadwal Mengajar', icon: Calendar },
    { path: '/guru/pengumuman', label: 'Pengumuman', icon: Bell },
  ]

  const siswaMenu = [
    { path: '/siswa/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/siswa/jadwal', label: 'Jadwal', icon: Calendar },
    { path: '/siswa/nilai-absensi', label: 'Nilai & Absensi', icon: BookOpen },
    { path: '/siswa/pengumuman', label: 'Pengumuman', icon: Bell },
  ]

  const getMenu = () => {
    switch (user?.role) {
      case 'admin': return adminMenu
      case 'guru': return guruMenu
      case 'siswa': return siswaMenu
      default: return []
    }
  }

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator'
      case 'guru': return 'Guru'
      case 'siswa': return 'Siswa'
      default: return 'Pengguna'
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 80 }}
      className="bg-white shadow-sm border-r border-gray-200 h-screen sticky top-0 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">SMP Manager</h1>
              <p className="text-xs text-gray-500">{getRoleLabel()}</p>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft 
            className={`w-4 h-4 transition-transform ${!sidebarOpen && 'rotate-180'}`} 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {getMenu().map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.nama}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Sidebar