"use client"

import { useState, useEffect } from "react"
import { X, Clock, RotateCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { versionHistory, type FileVersion } from "@/lib/version-history"
import { useToast } from "@/hooks/use-toast"

interface VersionHistoryPanelProps {
  fileId: string
  fileName: string
  onClose: () => void
  onRestore: (content: string) => void
}

export function VersionHistoryPanel({ fileId, fileName, onClose, onRestore }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<FileVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadVersions()
  }, [fileId])

  const loadVersions = async () => {
    try {
      const fileVersions = await versionHistory.getFileVersions(fileId)
      setVersions(fileVersions)
    } catch (error) {
      console.error("[v0] Failed to load versions:", error)
    }
  }

  const handleRestore = (version: FileVersion) => {
    if (confirm("Restore this version? Your current changes will be saved as a new version.")) {
      onRestore(version.content)
      toast({
        title: "Restored",
        description: "Version restored successfully",
      })
      onClose()
    }
  }

  const handleDelete = async (versionId: string) => {
    if (confirm("Delete this version? This cannot be undone.")) {
      try {
        await versionHistory.deleteVersion(versionId)
        await loadVersions()
        if (selectedVersion?.id === versionId) {
          setSelectedVersion(null)
        }
        toast({
          title: "Deleted",
          description: "Version deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete version",
          variant: "destructive",
        })
      }
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-5xl h-[90vh] bg-zinc-900 border border-zinc-800 rounded-lg flex">
        {/* Versions List */}
        <div className="w-80 border-r border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Version History</h2>
              <p className="text-xs text-zinc-500 mt-0.5">{fileName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-2 space-y-1">
            {versions.length === 0 ? (
              <div className="text-center text-zinc-500 py-8 px-4">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No version history yet</p>
                <p className="text-xs mt-1">Auto-save will create versions as you edit</p>
              </div>
            ) : (
              versions.map((version) => (
                <button
                  key={version.id}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedVersion?.id === version.id
                      ? "bg-zinc-800 border border-zinc-700"
                      : "hover:bg-zinc-800 border border-transparent"
                  }`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="text-xs text-zinc-400">{formatDate(version.timestamp)}</span>
                      </div>
                      {version.label && <p className="text-xs text-zinc-500 mt-1 truncate">{version.label}</p>}
                      <p className="text-xs text-zinc-600 mt-1">{version.content.length} characters</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 text-zinc-500 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(version.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Version Preview */}
        <div className="flex-1 flex flex-col">
          {selectedVersion ? (
            <>
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{formatDate(selectedVersion.timestamp)}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedVersion.content.split("\n").length} lines, {selectedVersion.content.length} characters
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleRestore(selectedVersion)}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Restore
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-black">
                <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-words">
                  {selectedVersion.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a version to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
