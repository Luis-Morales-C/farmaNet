// Chat window - desactivado ya que no se usa chat en tiempo real
interface ChatWindowProps {
  sessionId: string
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

export function ChatWindow({ isOpen }: ChatWindowProps) {
  // Componente vacío - no renderiza nada
  return null
}