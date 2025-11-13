import { supabase } from './supabase'
import toast from 'react-hot-toast'

// Generic CRUD operations
export const api = {
  // Fetch all records
  fetchAll: async (table, options = {}) => {
    try {
      let query = supabase.from(table).select('*')
      
      // Apply ordering if specified
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true })
      }
      
      // Apply filtering if specified
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value)
        })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Error fetching ${table}:`, error)
      return { data: null, error }
    }
  },

  // Fetch single record
  fetchById: async (table, id) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Error fetching ${table} with id ${id}:`, error)
      return { data: null, error }
    }
  },

  // Create record
  create: async (table, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()

      if (error) throw error
      
      toast.success('Data berhasil ditambahkan')
      return { data: result?.[0], error: null }
    } catch (error) {
      console.error(`Error creating ${table}:`, error)
      toast.error('Gagal menambahkan data')
      return { data: null, error }
    }
  },

  // Update record
  update: async (table, id, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()

      if (error) throw error
      
      toast.success('Data berhasil diperbarui')
      return { data: result?.[0], error: null }
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      toast.error('Gagal memperbarui data')
      return { data: null, error }
    }
  },

  // Delete record
  delete: async (table, id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('Data berhasil dihapus')
      return { error: null }
    } catch (error) {
      console.error(`Error deleting ${table}:`, error)
      toast.error('Gagal menghapus data')
      return { error }
    }
  },
}

// Specific API calls for the application
export const akademikAPI = {
  // Siswa operations
  fetchSiswa: () => api.fetchAll('siswa', { 
    orderBy: 'nama',
    ascending: true 
  }),
  
  fetchSiswaByKelas: (kelasId) => api.fetchAll('siswa', {
    filters: [{ column: 'kelas_id', operator: 'eq', value: kelasId }],
    orderBy: 'nama',
    ascending: true
  }),

  // Guru operations
  fetchGuru: () => api.fetchAll('guru', {
    orderBy: 'nama',
    ascending: true
  }),

  // Kelas operations
  fetchKelas: () => api.fetchAll('kelas', {
    orderBy: 'nama',
    ascending: true
  }),

  // Jadwal operations
  fetchJadwal: () => api.fetchAll('jadwal', {
    orderBy: 'hari',
    ascending: true
  }),

  fetchJadwalByKelas: (kelasId) => api.fetchAll('jadwal', {
    filters: [{ column: 'kelas_id', operator: 'eq', value: kelasId }],
    orderBy: 'hari',
    ascending: true
  }),

  fetchJadwalByGuru: (guruId) => api.fetchAll('jadwal', {
    filters: [{ column: 'guru_id', operator: 'eq', value: guruId }],
    orderBy: 'hari',
    ascending: true
  }),

  // Nilai operations
  fetchNilai: () => api.fetchAll('nilai', {
    orderBy: 'created_at',
    ascending: false
  }),

  fetchNilaiBySiswa: (siswaId) => api.fetchAll('nilai', {
    filters: [{ column: 'siswa_id', operator: 'eq', value: siswaId }],
    orderBy: 'created_at',
    ascending: false
  }),

  // Absensi operations
  fetchAbsensi: () => api.fetchAll('absensi', {
    orderBy: 'tanggal',
    ascending: false
  }),

  fetchAbsensiBySiswa: (siswaId) => api.fetchAll('absensi', {
    filters: [{ column: 'siswa_id', operator: 'eq', value: siswaId }],
    orderBy: 'tanggal',
    ascending: false
  }),

  // Pengumuman operations
  fetchPengumuman: () => api.fetchAll('pengumuman', {
    orderBy: 'created_at',
    ascending: false
  }),
}

export default api