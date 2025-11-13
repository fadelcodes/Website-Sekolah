import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      setUser: (user) => {
        console.log('🔄 Setting user in store:', user)
        set({ user })
      },
      setSession: (session) => {
        console.log('🔄 Setting session in store:', session ? 'Yes' : 'No')
        set({ session })
      },
      logout: () => {
        console.log('🚪 Logging out from store')
        set({ user: null, session: null })
      },
    }),
    {
      name: 'user-storage',
    }
  )
)