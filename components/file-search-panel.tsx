"use client"

import { useState, useEffect } from "react"
import { Search, X, FileCode, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { fileSystem, type FileNode } from "@/lib/file-system"

interface FileSearchPanelProps {
  onClose: () => void
  onFileSelect: (file: FileNode, lineNumber?: number) => void
}

interface SearchResult {
  file: FileNode
  matches: Array<{
    line: number
    content: string
    columnStart: number
    columnEnd: number
  }>
}

export function FileSearchPanel({ onClose, onFileSelect }: FileSearchPanelProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [matchCase, setMatchCase] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [includeFiles, setIncludeFiles] = useState("*")
  const [excludeFiles, setExcludeFiles] = useState("")

  useEffect(() => {
    if (query.length > 0) {
      const timeoutId = setTimeout(() => {
        performSearch()
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
    }
  }, [query, matchCase, useRegex, includeFiles, excludeFiles])

  const performSearch = async () => {
    if (!query) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const files = await fileSystem.getAllFiles()
      const fileResults: SearchResult[] = []

      // Parse include/exclude patterns
      const includePattern = includeFiles || "*"
      const excludePattern = excludeFiles

      for (const file of files) {
        if (file.type !== "file" || !file.content) continue

        // Apply file filters
        if (includePattern !== "*") {
          const patterns = includePattern.split(",").map((p) => p.trim())
          const matches = patterns.some((pattern) => {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"))
            return regex.test(file.name)
          })
          if (!matches) continue
        }

        if (excludePattern) {
          const patterns = excludePattern.split(",").map((p) => p.trim())
          const shouldExclude = patterns.some((pattern) => {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"))
            return regex.test(file.name)
          })
          if (shouldExclude) continue
        }

        const lines = file.content.split("\n")
        const matches: SearchResult["matches"] = []

        let searchPattern: RegExp
        try {
          if (useRegex) {
            searchPattern = new RegExp(query, matchCase ? "g" : "gi")
          } else {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            searchPattern = new RegExp(escapedQuery, matchCase ? "g" : "gi")
          }
        } catch (e) {
          // Invalid regex, skip this file
          continue
        }

        lines.forEach((line, index) => {
          const match = line.match(searchPattern)
          if (match) {
            const columnStart = line.search(searchPattern)
            matches.push({
              line: index + 1,
              content: line,
              columnStart,
              columnEnd: columnStart + match[0].length,
            })
          }
        })

        if (matches.length > 0) {
          fileResults.push({
            file,
            matches,
          })
        }
      }

      setResults(fileResults)
    } catch (error) {
      console.error("[v0] Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const totalMatches = results.reduce((sum, result) => sum + result.matches.length, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-4xl h-[90vh] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-lg font-semibold">Search in Files</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="border-b border-zinc-800 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search text..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700"
              autoFocus
            />
          </div>

          {/* Search Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-zinc-400 mb-1">Files to include</Label>
              <Input
                placeholder="*.js, *.ts"
                value={includeFiles}
                onChange={(e) => setIncludeFiles(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-400 mb-1">Files to exclude</Label>
              <Input
                placeholder="node_modules, *.min.js"
                value={excludeFiles}
                onChange={(e) => setExcludeFiles(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="matchCase" checked={matchCase} onCheckedChange={(checked) => setMatchCase(!!checked)} />
              <Label htmlFor="matchCase" className="text-sm cursor-pointer">
                Match Case
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="useRegex" checked={useRegex} onCheckedChange={(checked) => setUseRegex(!!checked)} />
              <Label htmlFor="useRegex" className="text-sm cursor-pointer">
                Use Regex
              </Label>
            </div>
          </div>

          {query && (
            <div className="text-xs text-zinc-500">
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  {totalMatches} {totalMatches === 1 ? "result" : "results"} in {results.length}{" "}
                  {results.length === 1 ? "file" : "files"}
                </>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {results.length === 0 && query && !isSearching && (
            <div className="text-center text-zinc-500 py-8">No results found</div>
          )}
          {results.length === 0 && !query && (
            <div className="text-center text-zinc-500 py-8">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Start typing to search across all files</p>
            </div>
          )}
          {results.map((result) => (
            <div key={result.file.id} className="border border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-zinc-950 px-3 py-2 flex items-center gap-2">
                <FileCode className="h-4 w-4 text-blue-500" />
                <span className="font-mono text-sm font-medium">{result.file.name}</span>
                <span className="text-xs text-zinc-500 ml-auto">
                  {result.matches.length} {result.matches.length === 1 ? "match" : "matches"}
                </span>
              </div>
              <div className="divide-y divide-zinc-800">
                {result.matches.map((match, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors group"
                    onClick={() => {
                      onFileSelect(result.file, match.line)
                      onClose()
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-zinc-500 font-mono flex-shrink-0 w-12">{match.line}</span>
                      <code className="text-xs font-mono flex-1 break-all">
                        <span className="text-zinc-400">{match.content.slice(0, match.columnStart)}</span>
                        <span className="bg-yellow-500/20 text-yellow-300">
                          {match.content.slice(match.columnStart, match.columnEnd)}
                        </span>
                        <span className="text-zinc-400">{match.content.slice(match.columnEnd)}</span>
                      </code>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
