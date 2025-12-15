'use client'

interface SidebarProps {
  onNewChat: () => void
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Botão Nova Consulta */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9749E3] text-white rounded-lg hover:bg-[#7C3AB8] transition-colors font-medium"
        >
          <span className="text-xl">+</span>
          <span>Nova Consulta</span>
        </button>
      </div>

      {/* Seção Workspaces */}
      <div className="flex-1 px-4 py-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Workspaces
        </h3>
        <div className="space-y-1">
          {/* Placeholder - será implementado */}
          <div className="text-sm text-gray-400 italic">
            Lista de workspaces
          </div>
        </div>
      </div>

      {/* Seção Artefatos */}
      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Artefatos
        </h3>
        <div className="space-y-1">
          {/* Placeholder - será implementado */}
          <div className="text-sm text-gray-400 italic">
            Briefings/Documentos
          </div>
        </div>
      </div>

      {/* Seção Conta */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Conta
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            Perfil
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            Pagamento
          </button>
        </div>
      </div>
    </aside>
  )
}