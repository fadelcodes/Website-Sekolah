// src/components/ui/DataTable.jsx
import React, { useMemo } from "react";
import useWindowSize from "../../hooks/useScreenSize"; // optional
import { format } from "date-fns";

const sampleColumns = [
  { key: "nis", label: "NIS" },
  { key: "nama", label: "Nama" },
  { key: "kelas", label: "Kelas" },
  { key: "nilai", label: "Nilai" },
];

const sampleData = [
  { id: 1, nis: "12345", nama: "Dio Aria", kelas: "7A", nilai: 90, updated_at: new Date() },
  { id: 2, nis: "12346", nama: "Annisa", kelas: "7B", nilai: 85, updated_at: new Date() },
  // ...
];

export default function DataTable({ columns = sampleColumns, data = sampleData }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500">Tidak ada data</div>;
  }

  if (isMobile) {
    // Render stacked card list on mobile for readability
    return (
      <div className="space-y-3">
        {data.map((row) => (
          <div key={row.id} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-semibold">{row.nama}</div>
                <div className="text-xs text-gray-500">NIS: {row.nis}</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold">{row.nilai}</div>
                <div className="text-xs text-gray-400">
                  {format(new Date(row.updated_at), "dd MMM yyyy")}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <div><strong>Kelas:</strong> {row.kelas}</div>
              {/* add actions or small buttons */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop / tablet: standard table with horizontal scroll wrapper
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-3 text-sm text-gray-600">
                {c.label}
              </th>
            ))}
            <th className="text-right px-4 py-3 text-sm text-gray-600">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-4 py-3 text-sm">{row.nis}</td>
              <td className="px-4 py-3 text-sm">{row.nama}</td>
              <td className="px-4 py-3 text-sm">{row.kelas}</td>
              <td className="px-4 py-3 text-sm">{row.nilai}</td>
              <td className="px-4 py-3 text-right text-sm">
                <button className="mr-2 px-3 py-1 rounded bg-blue-50 text-blue-600">Detail</button>
                <button className="px-3 py-1 rounded bg-red-50 text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
