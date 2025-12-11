'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<number | null>(null)

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div 
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
          >
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Não renderizar se não autenticado
  if (!user) {
    return null
  }

  const handleNewChat = () => {
    // Reset para nova conversa no mesmo workspace
    setActiveWorkspaceId(activeWorkspaceId)
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={setActiveWorkspaceId}
          onNewChat={handleNewChat}
        />
        <main className="flex-1">
          <ChatWindow workspaceId={activeWorkspaceId} />
        </main>
      </div>
    </div>
  )
}
