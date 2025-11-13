import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validasi environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  throw new Error('Missing Supabase configuration')
}

console.log('🔗 Supabase URL:', supabaseUrl)
console.log('🔑 Supabase Key present:', !!supabaseKey)

// Buat client dengan config yang benar
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
})

// Test connection yang sederhana
export const testConnection = async () => {
  try {
    // Test basic auth connection
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Auth connection failed:', error)
      return false
    }
    
    console.log('✅ Supabase auth connected successfully')
    console.log('📋 Session:', session ? 'Active' : 'No session')
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}