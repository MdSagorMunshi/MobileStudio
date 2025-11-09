"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Undo, Redo, Search, Save, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileToolbarProps {
  onUndo?: () => void
  onRedo?: () => void
  onSearch?: () => void
  onSave?: () => void
  onInsertText?: (text: string) => void
}

export function MobileToolbar({ onUndo, onRedo, onSearch, onSave, onInsertText }: MobileToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const commonSymbols = [
    { label: "Tab", value: "\t" },
    { label: "{}", value: "{}", cursorOffset: -1 },
    { label: "[]", value: "[]", cursorOffset: -1 },
    { label: "()", value: "()", cursorOffset: -1 },
    { label: "<>", value: "<>", cursorOffset: -1 },
    { label: "=>", value: " => " },
    { label: "//", value: "// " },
    { label: "/**/", value: "/* */", cursorOffset: -3 },
    { label: ";", value: ";" },
    { label: ":", value: ": " },
    { label: "=", value: " = " },
    { label: "&&", value: " && " },
    { label: "||", value: " || " },
    { label: ".", value: "." },
    { label: ",", value: ", " },
    { label: "`", value: "``", cursorOffset: -1 },
    { label: '"', value: '""', cursorOffset: -1 },
    { label: "'", value: "''", cursorOffset: -1 },
  ]

  const handleInsert = (symbol: { label: string; value: string; cursorOffset?: number }) => {
    if (onInsertText) {
      onInsertText(symbol.value)
    } else {
      // Fallback to document.execCommand
      document.execCommand("insertText", false, symbol.value)
    }
  }

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
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onSearch}>
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-zinc-400 hover:text-white active:scale-95 transition-transform"
            onClick={() => setIsExpanded(true)}
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            <span className="text-xs">Keyboard</span>
          </Button>
        </div>
      )}

      {/* Expanded toolbar */}
      {isExpanded && (
        <div className="border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-400">CODE KEYBOARD</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-white active:scale-95 transition-transform"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="px-3 pt-3 pb-2">
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-12 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent active:scale-95 transition-transform"
                onClick={onUndo}
              >
                <Undo className="h-3.5 w-3.5" />
                <span className="text-xs">Undo</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-12 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent active:scale-95 transition-transform"
                onClick={onRedo}
              >
                <Redo className="h-3.5 w-3.5" />
                <span className="text-xs">Redo</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-12 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent active:scale-95 transition-transform"
                onClick={onSearch}
              >
                <Search className="h-3.5 w-3.5" />
                <span className="text-xs">Find</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-12 flex-col gap-1 border-zinc-800 hover:bg-zinc-900 bg-transparent active:scale-95 transition-transform"
                onClick={onSave}
              >
                <Save className="h-3.5 w-3.5" />
                <span className="text-xs">Save</span>
              </Button>
            </div>
          </div>

          {/* Symbol Keyboard */}
          <div className="px-3 pb-3">
            <div className="space-y-2">
              {/* Row 1 */}
              <div className="flex gap-1">
                {commonSymbols.slice(0, 6).map((symbol) => (
                  <button
                    key={symbol.label}
                    className="flex-1 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform"
                    onClick={() => handleInsert(symbol)}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>

              {/* Row 2 */}
              <div className="flex gap-1">
                {commonSymbols.slice(6, 12).map((symbol) => (
                  <button
                    key={symbol.label}
                    className="flex-1 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform"
                    onClick={() => handleInsert(symbol)}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>

              {/* Row 3 */}
              <div className="flex gap-1">
                {commonSymbols.slice(12, 18).map((symbol) => (
                  <button
                    key={symbol.label}
                    className="flex-1 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform"
                    onClick={() => handleInsert(symbol)}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>

              {/* Navigation Row */}
              <div className="flex gap-1">
                <button
                  className="flex-1 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform flex items-center justify-center"
                  onClick={() => {
                    const textarea = document.activeElement as HTMLTextAreaElement
                    if (textarea && textarea.selectionStart !== undefined) {
                      textarea.selectionStart = Math.max(0, textarea.selectionStart - 1)
                      textarea.selectionEnd = textarea.selectionStart
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="flex-1 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform flex items-center justify-center"
                  onClick={() => {
                    const textarea = document.activeElement as HTMLTextAreaElement
                    if (textarea && textarea.selectionStart !== undefined) {
                      textarea.selectionStart = Math.min(textarea.value.length, textarea.selectionStart + 1)
                      textarea.selectionEnd = textarea.selectionStart
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  className="flex-2 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform px-6"
                  onClick={() => handleInsert({ label: "Space", value: " " })}
                >
                  Space
                </button>
                <button
                  className="flex-1 h-10 rounded bg-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 transition-colors active:scale-95 transform"
                  onClick={() => handleInsert({ label: "↵", value: "\n" })}
                >
                  ↵
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
