"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  FolderOpen,
  Folder,
  Plus,
  Trash2,
  Upload,
  Download,
  FolderPlus,
} from "lucide-react"
import { fileSystem, type FileNode } from "@/lib/file-system"
import { downloadFile, downloadProject, uploadFiles, uploadZip } from "@/lib/file-operations"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { settingsStore } from "@/lib/settings-store"

interface FileTreeProps {
  onFileSelect: (file: FileNode) => void
  selectedFileId: string | null
}

export function FileTree({ onFileSelect, selectedFileId }: FileTreeProps) {
  const [files, setFiles] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"file" | "folder">("file")
  const [dialogParentId, setDialogParentId] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const treeContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      await fileSystem.init()
      await fileSystem.initializeDefaultProject()
      const allFiles = await fileSystem.getAllFiles()
      setFiles(allFiles)
    } catch (error) {
      console.error("[v0] Failed to load files:", error)
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return

    try {
      if (dialogType === "file") {
        const file = await fileSystem.createFile(newItemName, dialogParentId)
        onFileSelect(file)
      } else {
        await fileSystem.createFolder(newItemName, dialogParentId)
      }
      await loadFiles()
      setDialogOpen(false)
      setNewItemName("")
    } catch (error) {
      console.error("[v0] Failed to create item:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fileSystem.deleteFile(id)
      await loadFiles()
    } catch (error) {
      console.error("[v0] Failed to delete item:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      await uploadFiles(files)
      await loadFiles()
      toast({
        title: "Files Uploaded",
        description: `${files.length} file(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files",
        variant: "destructive",
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await uploadZip(file)
      await loadFiles()
      toast({
        title: "Project Imported",
        description: "ZIP file imported successfully",
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import ZIP file",
        variant: "destructive",
      })
    }

    if (zipInputRef.current) {
      zipInputRef.current.value = ""
    }
  }

  const handleDownloadProject = async () => {
    try {
      await downloadProject()
      toast({
        title: "Project Downloaded",
        description: "Project exported as ZIP",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download project",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = (type: "file" | "folder", parentId: string | null = null) => {
    setDialogType(type)
    setDialogParentId(parentId)
    setNewItemName("")
    setDialogOpen(true)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setContextMenuOpen(true)
  }

  const handleSelectAll = () => {
    // Placeholder for select all functionality
    toast({
      title: "Select All",
      description: "Select all functionality coming soon",
    })
  }

  const renderTree = (parentId: string | null = null, level = 0) => {
    const children = files.filter((f) => f.parentId === parentId)

    return children.map((node) => {
      const isExpanded = expandedFolders.has(node.id)
      const isSelected = node.id === selectedFileId

      return (
        <div key={node.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-zinc-900 cursor-pointer ${
                  isSelected ? "bg-zinc-800" : ""
                }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => {
                  if (node.type === "folder") {
                    toggleFolder(node.id)
                  } else {
                    onFileSelect(node)
                  }
                }}
              >
                {node.type === "folder" && (
                  <span className="text-zinc-500">
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </span>
                )}
                {node.type === "folder" ? (
                  isExpanded ? (
                    <FolderOpen className="h-3.5 w-3.5 text-blue-500" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 text-blue-500" />
                  )
                ) : (
                  <FileCode className="h-3.5 w-3.5 text-zinc-500" />
                )}
                <span className="flex-1 truncate text-zinc-300">{node.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-zinc-900 border-zinc-800">
              {node.type === "folder" && (
                <>
                  <ContextMenuItem
                    className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                    onClick={() => openCreateDialog("file", node.id)}
                  >
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    New File
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                    onClick={() => openCreateDialog("folder", node.id)}
                  >
                    <FolderPlus className="mr-2 h-3.5 w-3.5" />
                    New Folder
                  </ContextMenuItem>
                </>
              )}
              {node.type === "file" && (
                <ContextMenuItem
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                  onClick={() => downloadFile(node.id)}
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download File
                </ContextMenuItem>
              )}
              <ContextMenuItem
                className="text-red-400 focus:bg-zinc-800 focus:text-red-400 cursor-pointer"
                onClick={() => handleDelete(node.id)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          {node.type === "folder" && isExpanded && renderTree(node.id, level + 1)}
        </div>
      )
    })
  }

  return (
    <>
      <div ref={treeContainerRef} className="flex-1 overflow-y-auto p-2" onContextMenu={handleContextMenu}>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="text-xs font-medium text-zinc-400">EXPLORER</div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={() => openCreateDialog("file")}
                title="New File"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={() => openCreateDialog("folder")}
                title="New Folder"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Files"
              >
                <Upload className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-500 hover:text-white hover:bg-zinc-800"
                onClick={handleDownloadProject}
                title="Download Project"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-0.5">{renderTree()}</div>
        </div>
      </div>

      {contextMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenuOpen(false)} />
          <div
            className="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 p-1 shadow-md"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
            }}
          >
            <button
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-zinc-300 outline-none hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                openCreateDialog("file")
                setContextMenuOpen(false)
              }}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              New File
            </button>
            <button
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-zinc-300 outline-none hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                openCreateDialog("folder")
                setContextMenuOpen(false)
              }}
            >
              <FolderPlus className="mr-2 h-3.5 w-3.5" />
              New Folder
            </button>
            <div className="my-1 h-px bg-zinc-800" />
            <button
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-zinc-300 outline-none hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                handleSelectAll()
                setContextMenuOpen(false)
              }}
            >
              Select All
            </button>
            <button
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-zinc-300 outline-none hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                fileInputRef.current?.click()
                setContextMenuOpen(false)
              }}
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              Upload Files
            </button>
            <button
              className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-zinc-300 outline-none hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                handleDownloadProject()
                setContextMenuOpen(false)
              }}
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Download Project
            </button>
          </div>
        </>
      )}

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} accept="*/*" />

      <input ref={zipInputRef} type="file" className="hidden" onChange={handleZipUpload} accept=".zip" />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New {dialogType === "file" ? "File" : "Folder"}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter a name for the new {dialogType === "file" ? "file" : "folder"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">
                Name
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateItem()
                }}
                placeholder={dialogType === "file" ? "index.html" : "components"}
                className="bg-black border-zinc-800 text-white"
                autoComplete="off"
                readOnly={settingsStore.getSettings().keyboardMode === "mscode"}
                onClick={(e) => {
                  if (settingsStore.getSettings().keyboardMode === "mscode") {
                    e.currentTarget.blur()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-zinc-800 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleCreateItem} className="bg-blue-600 hover:bg-blue-700">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
