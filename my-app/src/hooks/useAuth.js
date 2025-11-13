import { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export function useAuth() {
  const { user, session, setUser, setSession, logout } = useUserStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('🔄 Starting auth initialization...')
        
        // Safety timeout
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn('⏰ Auth timeout, forcing completion')
            setLoading(false)
          }
        }, 8000)

        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
          clearTimeout(timeoutId)
          if (mounted) setLoading(false)
          return
        }

        console.log('📋 Session status:', currentSession ? 'Active' : 'No session')
        
        if (mounted) {
          setSession(currentSession)
        }

        if (currentSession?.user) {
          console.log('👤 User found:', currentSession.user.email)
          await fetchUserProfile(currentSession.user.id)
        } else {
          console.log('👤 No user session, showing login')
          clearTimeout(timeoutId)
          if (mounted) setLoading(false)
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔄 Auth state changed:', event)
        
        if (!mounted) return

        setSession(currentSession)

        if (currentSession?.user) {
          console.log('👤 User signed in:', currentSession.user.email)
          await fetchUserProfile(currentSession.user.id)
        } else {
          console.log('👤 User signed out')
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setSession])

  const fetchUserProfile = async (userId) => {
    try {
      console.log('🔍 Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Error fetching profile:', error)
        
        // Jika profile tidak ada, buat default
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating default...')
          await createDefaultProfile(userId)
          return
        }
        
        // Jika table tidak ada, gunakan basic user
        if (error.code === '42P01') {
          console.log('🗃️ Profiles table missing, using basic user')
          const { data: authUser } = await supabase.auth.getUser()
          const basicUser = {
            id: userId,
            nama: 'Administrator',
            email: authUser.user.email,
            role: 'admin'
          }
          setUser(basicUser)
          setLoading(false)
          return
        }
        
        throw error
      }

      console.log('✅ Profile loaded:', data)
      setUser(data)
      setLoading(false)
      
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error)
      
      // Final fallback
      const fallbackUser = {
        id: userId,
        nama: 'Administrator',
        email: 'admin@smp.com',
        role: 'admin'
      }
      
      setUser(fallbackUser)
      setLoading(false)
    }
  }

  const createDefaultProfile = async (userId) => {
    try {
      const { data: authUser } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            nama: authUser.user.email?.split('@')[0] || 'User',
            email: authUser.user.email,
            role: 'admin'
          }
        ])
        .select()
        .single()

      if (error) throw error

      console.log('✅ Default profile created:', data)
      setUser(data)
      setLoading(false)
    } catch (error) {
      console.error('❌ Error creating profile:', error)
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      console.log('🔐 Attempting sign in...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Sign in error:', error)
        toast.error(error.message)
        return { success: false, error }
      }
      
      console.log('✅ Sign in successful')
      toast.success('Login berhasil!')
      return { success: true, data }
    } catch (error) {
      console.error('❌ Login error:', error)
      toast.error('Terjadi kesalahan saat login')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama: userData.nama,
            role: userData.role
          }
        }
      })

      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Registrasi berhasil! Silakan login.')
      return { success: true, data }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Terjadi kesalahan saat registrasi')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      logout()
      toast.success('Logout berhasil!')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Gagal logout')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  }
}