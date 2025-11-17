// src/components/ui/Input.jsx
import React from "react";

export default function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>}
      <input
        {...props}
        className={`w-full rounded-lg border px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${props.className ?? ""}`}
      />
    </label>
  );
}
