// src/components/layout/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, BookOpen, Bell } from "lucide-react";

const items = [
  { to: "/siswa/dashboard", label: "Home", icon: Home },
  { to: "/siswa/nilai", label: "Nilai", icon: BookOpen },
  { to: "/siswa/kelas", label: "Kelas", icon: Users },
  { to: "/siswa/pengumuman", label: "Pengumuman", icon: Bell },
];

export default function BottomNav() {
  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto flex justify-between px-6 py-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center text-xs py-2 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`
              }
            >
              <Icon size={18} />
              <span className="mt-1">{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
