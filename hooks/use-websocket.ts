// WebSocket hook - desactivado ya que no se usa chat en tiempo real
export interface WebSocketMessage {
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

export function useWebSocket(sessionId: string | null, userId: string | null) {
  return {
    messages: [],
    isConnected: false,
    unreadCount: 0,
    sendMessage: () => {},
    markAsRead: () => {},
    userTyping: () => {},
  }
}