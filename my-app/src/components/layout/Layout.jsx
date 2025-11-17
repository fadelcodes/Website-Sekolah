// src/components/layout/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <div className="flex">
        {/* Sidebar: hidden on mobile */}
        <aside className="hidden md:block w-72 border-r border-gray-200 bg-white">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom nav only on mobile */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </footer>
    </div>
  );
}
