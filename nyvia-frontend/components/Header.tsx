'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      {/* Logo/Workspace Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
             style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}>
          <span className="text-white text-sm font-bold">N</span>
        </div>
        <h1 className="text-sm font-medium text-gray-900">Nyvia Lite</h1>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 text-xs font-medium text-gray-700">
          {user?.email || 'Carregando...'}
        </span>
        <button 
          onClick={logout}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
