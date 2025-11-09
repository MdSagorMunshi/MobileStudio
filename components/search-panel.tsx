"use client"

import { useState } from "react"
import { Search, X, ChevronDown, ChevronUp, Replace } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchPanelProps {
  onClose: () => void
  onSearch: (query: string, options: SearchOptions) => void
  onReplace: (replaceText: string) => void
  onReplaceAll: (replaceText: string) => void
  onNext: () => void
  onPrevious: () => void
  matchCount?: number
  currentMatch?: number
}

export interface SearchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
}

export function SearchPanel({
  onClose,
  onSearch,
  onReplace,
  onReplaceAll,
  onNext,
  onPrevious,
  matchCount = 0,
  currentMatch = 0,
}: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [showReplace, setShowReplace] = useState(false)
  const [options, setOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value, options)
  }

  const handleOptionToggle = (option: keyof SearchOptions) => {
    const newOptions = { ...options, [option]: !options[option] }
    setOptions(newOptions)
    if (searchQuery) {
      onSearch(searchQuery, newOptions)
    }
  }

  return (
    <div className="border-b border-zinc-800 bg-zinc-950 p-3 space-y-2">
      {/* Search Input Row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Find"
            className="pl-9 pr-24 h-8 bg-zinc-900 border-zinc-700 text-sm"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {matchCount > 0 && (
              <span className="text-xs text-zinc-500 mr-1">
                {currentMatch}/{matchCount}
              </span>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onPrevious} disabled={matchCount === 0}>
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onNext} disabled={matchCount === 0}>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => setShowReplace(!showReplace)}
        >
          <Replace className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Replace Input Row */}
      {showReplace && (
        <div className="flex items-center gap-2">
          <Input
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace"
            className="flex-1 h-8 bg-zinc-900 border-zinc-700 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => onReplace(replaceText)}
            disabled={matchCount === 0}
          >
            Replace
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => onReplaceAll(replaceText)}
            disabled={matchCount === 0}
          >
            All
          </Button>
        </div>
      )}

      {/* Options Row */}
      <div className="flex items-center gap-2">
        <button
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            options.caseSensitive
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white"
          }`}
          onClick={() => handleOptionToggle("caseSensitive")}
          title="Match Case"
        >
          Aa
        </button>
        <button
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            options.wholeWord
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white"
          }`}
          onClick={() => handleOptionToggle("wholeWord")}
          title="Match Whole Word"
        >
          Ab
        </button>
        <button
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            options.regex
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white"
          }`}
          onClick={() => handleOptionToggle("regex")}
          title="Use Regular Expression"
        >
          .*
        </button>
      </div>
    </div>
  )
}
