import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Bell,
  User
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function BottomNav() {
  const { user } = useAuth()

  const getMenu = () => {
    const baseMenu = [
      { path: `/${user?.role}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
      { path: `/${user?.role}/jadwal`, label: 'Jadwal', icon: Calendar },
      { path: `/${user?.role}/nilai-absensi`, label: 'Nilai', icon: BookOpen },
      { path: `/${user?.role}/pengumuman`, label: 'Info', icon: Bell },
    ]

    return baseMenu
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around safe-area-bottom">
      {getMenu().map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 flex-1 max-w-20 ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-400'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav