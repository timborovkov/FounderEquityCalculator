import { useEffect } from 'react'

export default function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handleKeyDown = e => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + S: Save
      if (modifier && e.key === 's') {
        e.preventDefault()
        handlers.onSave?.()
      }

      // Cmd/Ctrl + Z: Undo
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handlers.onUndo?.()
      }

      // Cmd/Ctrl + Shift + Z: Redo
      if (modifier && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        handlers.onRedo?.()
      }

      // Cmd/Ctrl + K: Quick command (if implemented)
      if (modifier && e.key === 'k') {
        e.preventDefault()
        handlers.onCommand?.()
      }

      // Cmd/Ctrl + P: Export PDF
      if (modifier && e.key === 'p') {
        e.preventDefault()
        handlers.onExport?.('pdf')
      }

      // Escape: Close modals/dialogs
      if (e.key === 'Escape') {
        handlers.onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
