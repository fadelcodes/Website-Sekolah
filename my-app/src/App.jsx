import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load pages
const Login = React.lazy(() => import('./pages/auth/Login'))
const Register = React.lazy(() => import('./pages/auth/Register'))

// Admin Pages
const DashboardAdmin = React.lazy(() => import('./pages/admin/DashboardAdmin'))
const DataAkademik = React.lazy(() => import('./pages/admin/DataAkademik'))
const SiswaManagement = React.lazy(() => import('./pages/admin/SiswaManagement'))
const GuruManagement = React.lazy(() => import('./pages/admin/GuruManagement'))
const KelasManagement = React.lazy(() => import('./pages/admin/KelasManagement'))
const JadwalAdmin = React.lazy(() => import('./pages/admin/JadwalAdmin'))
const NilaiAbsensiAdmin = React.lazy(() => import('./pages/admin/NilaiAbsensiAdmin'))
const PengumumanAdmin = React.lazy(() => import('./pages/admin/PengumumanAdmin'))

// Fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner text="Memuat halaman..." />
  </div>
)

function App() {
  const { user, loading } = useAuth()

  console.log('🔄 App rendering:', { 
    user: user ? `Logged in (${user.role})` : 'Not logged in', 
    loading 
  })

  // Show loading during auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Memeriksa autentikasi..." />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <React.Suspense fallback={<SuspenseFallback />}>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to={`/${user.role}/dashboard`} replace />} 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                user?.role === 'admin' ? (
                  <Layout>
                    <React.Suspense fallback={<SuspenseFallback />}>
                      <Routes>
                        <Route path="dashboard" element={<DashboardAdmin />} />
                        <Route path="data-akademik" element={<DataAkademik />} />
                        <Route path="siswa" element={<SiswaManagement />} />
                        <Route path="guru" element={<GuruManagement />} />
                        <Route path="kelas" element={<KelasManagement />} />
                        <Route path="jadwal" element={<JadwalAdmin />} />
                        <Route path="nilai-absensi" element={<NilaiAbsensiAdmin />} />
                        <Route path="pengumuman" element={<PengumumanAdmin />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Default redirect */}
            <Route 
              path="/" 
              element={
                user ? 
                  <Navigate to={`/${user.role}/dashboard`} replace /> : 
                  <Navigate to="/login" replace />
              } 
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App