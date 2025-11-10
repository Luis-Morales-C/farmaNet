// Chat service - desactivado ya que no se usa chat en tiempo real
export interface ChatMessage {
  id: string
  sessionId: string
  senderId: string
  recipientId: string
  senderName: string
  recipientName: string
  content: string
  type: 'TEXT' | 'JOIN' | 'LEAVE' | 'TYPING' | 'SYSTEM'
  timestamp: string
  read: boolean
}

export interface ChatSession {
  sessionId: string
  clientId: string
  advisorId: string
  createdAt: string
}

export const chatService = {
  async createSession(clientId: string, advisorId: string): Promise<{ sessionId: string }> {
    return { sessionId: '' }
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    return []
  },

  async getUserMessages(userId: string): Promise<ChatMessage[]> {
    return []
  },

  async getUnreadMessages(sessionId: string, userId: string): Promise<ChatMessage[]> {
    return []
  },

  async getUnreadCount(sessionId: string, userId: string): Promise<number> {
    return 0
  },

  async markAsRead(sessionId: string, userId: string): Promise<void> {
    // No-op
  },

  async getUserSessions(userId: string): Promise<string[]> {
    return []
  },

  async endSession(sessionId: string): Promise<void> {
    // No-op
  },

  async searchMessages(sessionId: string, keyword: string): Promise<ChatMessage[]> {
    return []
  },
}