import { create } from 'zustand'

export const useDataStore = create((set, get) => ({
  // Data states - mulai dengan array kosong
  siswa: [],
  guru: [],
  kelas: [],
  jadwal: [],
  nilai: [],
  absensi: [],
  pengumuman: [],
  
  // Loading states
  loading: false,
  
  // Actions
  setSiswa: (siswa) => set({ siswa }),
  setGuru: (guru) => set({ guru }),
  setKelas: (kelas) => set({ kelas }),
  setJadwal: (jadwal) => set({ jadwal }),
  setNilai: (nilai) => set({ nilai }),
  setAbsensi: (absensi) => set({ absensi }),
  setPengumuman: (pengumuman) => set({ pengumuman }),
  
  setLoading: (loading) => set({ loading }),
}))