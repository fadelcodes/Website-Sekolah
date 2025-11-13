import { ROLES } from './constants'

export const hasRole = (user, role) => {
  return user?.role === role
}

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN)
export const isGuru = (user) => hasRole(user, ROLES.GURU)
export const isSiswa = (user) => hasRole(user, ROLES.SISWA)

export const canAccess = (user, requiredRole) => {
  if (!user) return false
  
  const roleHierarchy = {
    [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.GURU, ROLES.SISWA],
    [ROLES.GURU]: [ROLES.GURU, ROLES.SISWA],
    [ROLES.SISWA]: [ROLES.SISWA],
  }

  return roleHierarchy[user.role]?.includes(requiredRole) || false
}