'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'

export default function Home() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [isLoading, setIsLoading] = useState(false)

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(1) // Default workspace ID used
    // In a real app, you might fetch this from user settings or similar

  const handleNewChat = () => {
    setMessages([])
    setMessage('')
  }

  const handleWorkspaceChange = (workspaceId: number) => {
    setActiveWorkspaceId(workspaceId)
    setMessages([])
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    
    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          workspaceId: activeWorkspaceId,
          message
        })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            if (data.chunk) {
              assistantMessage += data.chunk
              setMessages(prev => {
                const newMessages = [...prev]
                const lastMsg = newMessages[newMessages.length - 1]
                if (lastMsg?.role === 'assistant') {
                  lastMsg.content = assistantMessage
                } else {
                  newMessages.push({ role: 'assistant', content: assistantMessage })
                }
                return newMessages
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        onNewChat={handleNewChat}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceChange={handleWorkspaceChange}
      />
      
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Nyvia Chat</h1>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-50 text-gray-900' : 'bg-gray-50 text-gray-900'}`}>
              <strong>{msg.role === 'user' ? 'Você' : 'Nyvia'}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-900"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-[#9749E3] text-white rounded hover:bg-[#7C3AB8] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </main>
    </div>
  )
}
