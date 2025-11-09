"use client"

import { useState } from "react"
import { ChevronUp, Keyboard, Undo, Redo, Search, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileToolbarProps {
  onUndo?: () => void
  onRedo?: () => void
  onSearch?: () => void
  onSave?: () => void
}

export function MobileToolbar({ onUndo, onRedo, onSearch, onSave }: MobileToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="md:hidden">
      {/* Collapsed toolbar */}
      {!isExpanded && (
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 py-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onUndo}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onRedo}>
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-zinc-400 hover:text-white"
            onClick={() => setIsExpanded(true)}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            <span className="text-xs">Show Toolbar</span>
          </Button>
        </div>
      )}

      {/* Expanded toolbar */}
      {isExpanded && (
        <div className="border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-400">QUICK ACTIONS</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-white"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2 p-3">
            <Button
              variant="outline"
              size="sm"
              className="h-16 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent"
              onClick={onUndo}
            >
              <Undo className="h-4 w-4" />
              <span className="text-xs">Undo</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-16 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent"
              onClick={onRedo}
            >
              <Redo className="h-4 w-4" />
              <span className="text-xs">Redo</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-16 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent"
              onClick={onSearch}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">Find</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-16 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent"
              onClick={onSave}
            >
              <Save className="h-4 w-4" />
              <span className="text-xs">Save</span>
            </Button>
          </div>
          <div className="px-3 pb-3">
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 rounded p-1">
              {["Tab", "{}", "[]", "()", "<>", "=>", "//", "/**/", ";"].map((symbol) => (
                <button
                  key={symbol}
                  className="h-8 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600"
                  onClick={() => {
                    // Insert symbol at cursor position
                    document.execCommand("insertText", false, symbol)
                  }}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
