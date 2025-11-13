import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Starting application...')

// Test Supabase connection on startup
import { testConnection } from './services/supabase'

testConnection().then(success => {
  if (success) {
    console.log('✅ App starting with successful Supabase connection')
  } else {
    console.error('❌ App starting with Supabase connection issues')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)