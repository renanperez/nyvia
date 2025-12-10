const API_URL = 'http://localhost:3001'

class ApiService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  // Workspaces
  async getWorkspaces(token: string) {
    const response = await fetch(`${API_URL}/workspaces`, {
      headers: this.getHeaders(token)
    })
    
    if (!response.ok) throw new Error('Erro ao buscar workspaces')
    return response.json()
  }

  async createWorkspace(token: string, name: string, description?: string) {
    const response = await fetch(`${API_URL}/workspaces`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ name, description })
    })
    
    if (!response.ok) throw new Error('Erro ao criar workspace')
    return response.json()
  }

  // Chat
  async sendMessage(
    token: string,
    workspaceId: number,
    message: string,
    conversationId?: number
  ) {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ workspaceId, conversationId, message })
    })
    
    if (!response.ok) throw new Error('Erro ao enviar mensagem')
    return response.json()
  }
}

export const api = new ApiService()
