// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Users, Bell } from "lucide-react";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/data-akademik", label: "Data Akademik", icon: Users },
  { to: "/admin/jadwal", label: "Jadwal", icon: BookOpen },
  { to: "/admin/pengumuman", label: "Pengumuman", icon: Bell },
];

export default function Sidebar() {
  return (
    <nav className="p-4">
      <div className="mb-6 px-2">
        <img src="/src/assets/logo.png" alt="logo" className="w-36" />
      </div>

      <ul className="space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <NavLink
                to={it.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                <span className="hidden md:inline">{it.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
