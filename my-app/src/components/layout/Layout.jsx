import React from 'react'
import { useScreenSize } from '../../hooks/useScreenSize'
import Header from './Header'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

function Layout({ children }) {
  const { isMobile } = useScreenSize()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop/tablet */}
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
        
        {/* Bottom Navigation for mobile */}
        {isMobile && <BottomNav />}
      </div>
    </div>
  )
}

export default Layout