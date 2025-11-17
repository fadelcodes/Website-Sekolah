// src/pages/admin/DashboardAdmin.jsx
import React from "react";
import CardStat from "../../components/dashboard/CardStat";
import ChartWrapper from "../../components/dashboard/ChartWrapper";
import DataTable from "../../components/ui/DataTable";
import Skeleton from "../../components/ui/Skeleton";

export default function DashboardAdmin({ stats = {}, chartData = [], announcements = [] }) {
  // Simulasi loading flags
  const loading = false;

  return (
    <div className="space-y-6">
      {/* Top cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} type="card" />)
        ) : (
          <>
            <CardStat title="Siswa" value={stats.students ?? 0} />
            <CardStat title="Guru" value={stats.teachers ?? 0} />
            <CardStat title="Kelas" value={stats.classes ?? 0} />
          </>
        )}
      </section>

      {/* Charts + announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-3">Grafik Nilai</h3>
            <ChartWrapper data={chartData} height={260} />
          </div>
        </div>

        <aside className="bg-white p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold mb-2">Pengumuman Terbaru</h4>
          {announcements.length === 0 ? (
            <div className="text-sm text-gray-500">Belum ada pengumuman</div>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="text-sm">
                  <div className="font-medium">{a.judul}</div>
                  <div className="text-xs text-gray-500">{a.created_at}</div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>

      {/* Recent table */}
      <section className="bg-white p-4 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold mb-3">Daftar Siswa</h3>
        <DataTable />
      </section>
    </div>
  );
}
