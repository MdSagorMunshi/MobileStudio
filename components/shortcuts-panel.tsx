"use client"

import { X, Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { keyboardShortcutManager } from "@/lib/keyboard-shortcuts"

interface ShortcutsPanelProps {
  onClose: () => void
}

export function ShortcutsPanel({ onClose }: ShortcutsPanelProps) {
  const shortcutsByCategory = keyboardShortcutManager.getShortcutsByCategory()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 sticky top-0 bg-zinc-950 z-10">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
            <section key={category}>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-zinc-900 transition-colors"
                  >
                    <span className="text-sm text-zinc-300">{shortcut.description}</span>
                    <kbd className="px-3 py-1.5 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded shadow-sm">
                      {keyboardShortcutManager.formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-950/50">
          <p className="text-xs text-zinc-500 text-center">
            Press <kbd className="px-2 py-1 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded">?</kbd> to
            toggle this panel
          </p>
        </div>
      </div>
    </div>
  )
}
