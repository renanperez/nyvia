'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

interface Workspace {
  id: number
  name: string
  description: string
}

interface SidebarProps {
  activeWorkspaceId: number | null
  onSelectWorkspace: (id: number) => void
  onNewChat: () => void
}

export default function Sidebar({ activeWorkspaceId, onSelectWorkspace, onNewChat }: SidebarProps) {
  const { token } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    
    const fetchWorkspaces = async () => {
      try {
        const data = await api.getWorkspaces(token)
        setWorkspaces(data.workspaces)
      } catch (error) {
        console.error('Erro ao buscar workspaces:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaces()
  }, [token])

  return (
    <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button 
          onClick={onNewChat}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
          style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
        >
          + Nova Análise
        </button>
      </div>

      {/* Workspaces List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Workspaces
          </h3>
          
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-400">
              Carregando...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">
              Nenhum workspace
            </div>
          ) : (
            <div className="space-y-1">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => onSelectWorkspace(workspace.id)}
                  className={`w-full px-3 py-2 text-sm text-left rounded-lg transition-colors ${
                    activeWorkspaceId === workspace.id
                      ? 'bg-white/10 hover:bg-white/15'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{workspace.name}</div>
                  {workspace.description && (
                    <div className="text-xs text-gray-400 mt-0.5 truncate">
                      {workspace.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
          ⚙️ Configurações
        </button>
      </div>
    </aside>
  )
}
