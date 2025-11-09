export interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  category: string
  action: () => void
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, Shortcut> = new Map()

  register(id: string, shortcut: Shortcut) {
    this.shortcuts.set(id, shortcut)
  }

  unregister(id: string) {
    this.shortcuts.delete(id)
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    for (const [, shortcut] of this.shortcuts) {
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
      const altMatch = shortcut.alt ? event.altKey : !event.altKey

      if (event.key.toLowerCase() === shortcut.key.toLowerCase() && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault()
        shortcut.action()
        return true
      }
    }
    return false
  }

  getShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values())
  }

  getShortcutsByCategory(): Record<string, Shortcut[]> {
    const shortcuts = this.getShortcuts()
    const byCategory: Record<string, Shortcut[]> = {}

    shortcuts.forEach((shortcut) => {
      if (!byCategory[shortcut.category]) {
        byCategory[shortcut.category] = []
      }
      byCategory[shortcut.category].push(shortcut)
    })

    return byCategory
  }

  formatShortcut(shortcut: Shortcut): string {
    const parts: string[] = []
    const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0

    if (shortcut.ctrl) parts.push(isMac ? "⌘" : "Ctrl")
    if (shortcut.shift) parts.push(isMac ? "⇧" : "Shift")
    if (shortcut.alt) parts.push(isMac ? "⌥" : "Alt")
    parts.push(shortcut.key.toUpperCase())

    return parts.join(isMac ? "" : "+")
  }
}

export const keyboardShortcutManager = new KeyboardShortcutManager()
