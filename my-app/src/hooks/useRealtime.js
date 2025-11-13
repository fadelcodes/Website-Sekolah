import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useDataStore } from '../store/dataStore'
import toast from 'react-hot-toast'

export function useRealtime(table, callback) {
  const { setLoading } = useDataStore()

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        console.log(`📡 Fetching ${table} data...`)
        
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error(`❌ Error fetching ${table}:`, error)
          if (mounted) callback([])
          return
        }

        if (mounted && data) {
          console.log(`✅ ${table} loaded:`, data.length, 'items')
          callback(data)
        }
      } catch (error) {
        console.error(`❌ Error in useRealtime for ${table}:`, error)
        if (mounted) callback([])
      }
    }

    fetchData()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`🔄 Realtime update on ${table}:`, payload.eventType)
          fetchData() // Refresh data
        }
      )
      .subscribe()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [table, callback])
}