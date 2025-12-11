'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Message from './Message'

interface MessageType {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWindowProps {
  workspaceId: number | null
}

export default function ChatWindow({ workspaceId }: ChatWindowProps) {
  const { token } = useAuth()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Resetar ao trocar workspace
  useEffect(() => {
    setMessages([])
    setConversationId(null)
  }, [workspaceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !token || !workspaceId || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await api.sendMessage(
        token,
        workspaceId,
        userMessage,
        conversationId || undefined
      )

      // Salvar conversationId da primeira mensagem
      if (!conversationId) {
        setConversationId(response.conversationId)
      }

      // Adicionar resposta do assistant
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Erro ao processar sua mensagem. Tente novamente.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center text-gray-400">
          <div 
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
          >
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <p className="text-sm">Selecione um workspace para começar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Inicie uma nova análise estratégica
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Message key={idx} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="w-full px-4 py-6 bg-gray-50">
                <div className="max-w-3xl mx-auto flex gap-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
                  >
                    <span className="text-white text-xs font-bold">N</span>
                  </div>
                  <div className="flex-1">
                    <div className="animate-pulse text-sm text-gray-500">
                      Analisando...
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Descreva seu briefing de marketing..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#495EE3] focus:border-transparent"
              rows={3}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Nyvia fornece inteligência estratégica, não copy pronto • Pressione Enter para enviar
          </p>
        </div>
      </div>
    </div>
  )
}
