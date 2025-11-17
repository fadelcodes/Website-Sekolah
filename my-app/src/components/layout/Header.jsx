// src/components/layout/Header.jsx
import React from "react";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <div className="flex items-center gap-4">
          {/* Hamburger visible on mobile only */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Open menu"
            onClick={() => {
              // emit event to open overlay sidebar if you implement overlay
              const ev = new CustomEvent("openMobileSidebar");
              window.dispatchEvent(ev);
            }}
          >
            <Menu size={20} />
          </button>
          <div className="text-lg font-semibold">SMP Akademik</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <input
              type="search"
              placeholder="Cari data, siswa, kelas..."
              className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100">
              {/* Profile avatar */}
              <img
                src="/src/assets/avatar-placeholder.png"
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
