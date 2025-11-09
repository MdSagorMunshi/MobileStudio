"use client"

import { useState, useEffect, useRef } from "react"
import {
  Menu,
  X,
  FileCode,
  FolderOpen,
  Terminal,
  Play,
  Settings,
  GitBranch,
  Code2,
  Search,
  Layers,
  Info,
  Download,
  FileText,
  Wand2,
  Keyboard,
  BookMarked,
  FolderKanban,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { FileTree } from "@/components/file-tree"
import { CodeEditor, type CodeEditorRef } from "@/components/code-editor"
import { LivePreview } from "@/components/live-preview"
import { GitPanel } from "@/components/git-panel"
import { TerminalPanel } from "@/components/terminal-panel"
import { MobileToolbar } from "@/components/mobile-toolbar"
import { SettingsPanel } from "@/components/settings-panel"
import { SearchPanel, type SearchOptions } from "@/components/search-panel"
import { ShortcutsPanel } from "@/components/shortcuts-panel"
import { TemplateSelector } from "@/components/template-selector"
import { AboutDialog } from "@/components/about-dialog"
import { SnippetsPanel } from "@/components/snippets-panel"
import { ProjectSwitcher } from "@/components/project-switcher"
import { FileSearchPanel } from "@/components/file-search-panel"
import { VersionHistoryPanel } from "@/components/version-history-panel"
import { fileSystem, type FileNode } from "@/lib/file-system"
import { detectLanguage } from "@/lib/language-detector"
import { formatCode } from "@/lib/code-formatter"
import { downloadProject } from "@/lib/file-operations"
import { projectManager } from "@/lib/project-manager"
import { useTouchGestures } from "@/hooks/use-touch-gestures"
import { useToast } from "@/hooks/use-toast"
import { settingsStore } from "@/lib/settings-store"
import { keyboardShortcutManager } from "@/lib/keyboard-shortcuts"
import { versionHistory } from "@/lib/version-history"

export default function MobileStudio() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [openTabs, setOpenTabs] = useState<FileNode[]>([])
  const [fileContent, setFileContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<"files" | "git" | "terminal">("files")
  const [showSettings, setShowSettings] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showSnippets, setShowSnippets] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [searchMatchCount, setSearchMatchCount] = useState(0)
  const [searchCurrentMatch, setSearchCurrentMatch] = useState(0)
  const [showFileSearch, setShowFileSearch] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const editorRef = useRef<CodeEditorRef>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const initializeProjects = async () => {
      let projects = await projectManager.getAllProjects()

      if (projects.length === 0) {
        const defaultProject = await projectManager.createProject("Default Project", "Your first project")
        projects = [defaultProject]
      }

      let currentId = await projectManager.getCurrentProjectId()

      if (!currentId || !projects.find((p) => p.id === currentId)) {
        currentId = projects[0].id
        await projectManager.setCurrentProject(currentId)
      }

      setCurrentProjectId(currentId)
      fileSystem.setProjectDatabase(currentId)
      versionHistory.setProjectDatabase(currentId)
      await fileSystem.init()
    }

    initializeProjects()
    settingsStore.init()

    keyboardShortcutManager.register("save", {
      key: "s",
      ctrl: true,
      description: "Save current file",
      category: "File",
      action: () => handleSave(),
    })

    keyboardShortcutManager.register("find", {
      key: "f",
      ctrl: true,
      description: "Find in file",
      category: "Search",
      action: () => setShowSearch(true),
    })

    keyboardShortcutManager.register("format", {
      key: "f",
      ctrl: true,
      shift: true,
      description: "Format document",
      category: "Edit",
      action: () => handleFormat(),
    })

    keyboardShortcutManager.register("preview", {
      key: "p",
      ctrl: true,
      shift: true,
      description: "Toggle preview",
      category: "View",
      action: () => handlePreviewToggle(),
    })

    keyboardShortcutManager.register("sidebar", {
      key: "b",
      ctrl: true,
      description: "Toggle sidebar",
      category: "View",
      action: () => setSidebarOpen(!sidebarOpen),
    })

    keyboardShortcutManager.register("settings", {
      key: ",",
      ctrl: true,
      description: "Open settings",
      category: "General",
      action: () => setShowSettings(true),
    })

    keyboardShortcutManager.register("shortcuts", {
      key: "?",
      shift: true,
      description: "Show keyboard shortcuts",
      category: "General",
      action: () => setShowShortcuts(true),
    })

    keyboardShortcutManager.register("closeTab", {
      key: "w",
      ctrl: true,
      description: "Close current tab",
      category: "File",
      action: () => {
        if (selectedFile) {
          handleCloseTab(selectedFile.id)
        }
      },
    })

    keyboardShortcutManager.register("nextTab", {
      key: "Tab",
      ctrl: true,
      description: "Next tab",
      category: "Navigation",
      action: () => {
        if (openTabs.length > 0 && selectedFile) {
          const currentIndex = openTabs.findIndex((tab) => tab.id === selectedFile.id)
          const nextIndex = (currentIndex + 1) % openTabs.length
          setSelectedFile(openTabs[nextIndex])
        }
      },
    })

    keyboardShortcutManager.register("prevTab", {
      key: "Tab",
      ctrl: true,
      shift: true,
      description: "Previous tab",
      category: "Navigation",
      action: () => {
        if (openTabs.length > 0 && selectedFile) {
          const currentIndex = openTabs.findIndex((tab) => tab.id === selectedFile.id)
          const prevIndex = (currentIndex - 1 + openTabs.length) % openTabs.length
          setSelectedFile(openTabs[prevIndex])
        }
      },
    })

    keyboardShortcutManager.register("snippets", {
      key: "k",
      ctrl: true,
      shift: true,
      description: "Open snippets library",
      category: "General",
      action: () => setShowSnippets(true),
    })

    keyboardShortcutManager.register("fileSearch", {
      key: "f",
      ctrl: true,
      shift: true,
      description: "Search in files",
      category: "Search",
      action: () => setShowFileSearch(true),
    })

    keyboardShortcutManager.register("versionHistory", {
      key: "h",
      ctrl: true,
      shift: true,
      description: "Version history",
      category: "File",
      action: () => {
        if (selectedFile) {
          setShowVersionHistory(true)
        }
      },
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      keyboardShortcutManager.handleKeyDown(e)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sidebarOpen, selectedFile, openTabs])

  useEffect(() => {
    const settings = settingsStore.getSettings()
    if (!settings.autoSave || !selectedFile) return

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await versionHistory.saveVersion(selectedFile.id, fileContent)
        console.log("[v0] Auto-saved version for", selectedFile.name)
      } catch (error) {
        console.error("[v0] Auto-save failed:", error)
      }
    }, 2000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [fileContent, selectedFile])

  useTouchGestures({
    onSwipeRight: () => {
      if (!sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(true)
      }
    },
    onSwipeLeft: () => {
      if (sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    },
  })

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile.id)
      if (!openTabs.find((tab) => tab.id === selectedFile.id)) {
        setOpenTabs([...openTabs, selectedFile])
      }
    }
  }, [selectedFile])

  useEffect(() => {
    if (selectedFile && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [selectedFile])

  const loadFileContent = async (fileId: string) => {
    try {
      const file = await fileSystem.getFile(fileId)
      if (file && file.content !== undefined) {
        setFileContent(file.content)
      }
    } catch (error) {
      console.error("[v0] Failed to load file content:", error)
    }
  }

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setSelectedFile(file)
    }
  }

  const handleCloseTab = (fileId: string) => {
    setOpenTabs(openTabs.filter((tab) => tab.id !== fileId))
    if (selectedFile?.id === fileId) {
      const remainingTabs = openTabs.filter((tab) => tab.id !== fileId)
      setSelectedFile(remainingTabs[remainingTabs.length - 1] || null)
    }
  }

  const handleContentChange = async (content: string) => {
    setFileContent(content)
    if (selectedFile) {
      try {
        await fileSystem.updateFile(selectedFile.id, { content })
      } catch (error) {
        console.error("[v0] Failed to save file:", error)
      }
    }
  }

  const handlePreviewToggle = () => {
    if (showPreview) {
      setShowPreview(false)
      setSplitView(false)
    } else {
      setShowPreview(true)
      if (window.innerWidth >= 768) {
        setSplitView(true)
      }
    }
  }

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "File saved successfully",
    })
  }

  const handleFormat = async () => {
    if (!selectedFile || !editorRef.current) return

    try {
      const language = detectLanguage(selectedFile.name)
      const formatted = await formatCode(fileContent, language)
      handleContentChange(formatted)
      toast({
        title: "Formatted",
        description: "Code formatted successfully",
      })
    } catch (error) {
      toast({
        title: "Format Error",
        description: "Failed to format code",
        variant: "destructive",
      })
    }
  }

  const handleSearch = (query: string, options: SearchOptions) => {
    if (editorRef.current) {
      editorRef.current.search(query, options)
      setSearchMatchCount(editorRef.current.getMatchCount())
      setSearchCurrentMatch(editorRef.current.getCurrentMatchIndex())
    }
  }

  const handleReplace = (replaceText: string) => {
    if (editorRef.current) {
      editorRef.current.replace(replaceText)
      toast({
        title: "Replaced",
        description: "Text replaced successfully",
      })
    }
  }

  const handleReplaceAll = (replaceText: string) => {
    if (editorRef.current) {
      editorRef.current.replaceAll(replaceText)
      toast({
        title: "Replaced All",
        description: "All occurrences replaced",
      })
    }
  }

  const handleSearchNext = () => {
    if (editorRef.current) {
      editorRef.current.findNext()
      setSearchCurrentMatch(editorRef.current.getCurrentMatchIndex())
    }
  }

  const handleSearchPrevious = () => {
    if (editorRef.current) {
      editorRef.current.findPrevious()
      setSearchCurrentMatch(editorRef.current.getCurrentMatchIndex())
    }
  }

  const handleTemplateSelected = async () => {
    setOpenTabs([])
    setSelectedFile(null)
    setFileContent("")
    window.location.reload()
  }

  const handleInsertSnippet = (code: string) => {
    if (editorRef.current && selectedFile) {
      const currentContent = fileContent
      const updatedContent = currentContent + "\n\n" + code
      handleContentChange(updatedContent)
      setShowSnippets(false)
    }
  }

  const handleProjectSwitch = async (projectId: string) => {
    await projectManager.setCurrentProject(projectId)
    setCurrentProjectId(projectId)
    fileSystem.setProjectDatabase(projectId)
    versionHistory.setProjectDatabase(projectId)

    setOpenTabs([])
    setSelectedFile(null)
    setFileContent("")

    window.location.reload()
  }

  const handleFileSelectFromSearch = (file: FileNode, lineNumber?: number) => {
    setSelectedFile(file)
  }

  const handleRestoreVersion = async (content: string) => {
    if (selectedFile) {
      await versionHistory.saveVersion(selectedFile.id, fileContent, "Before restore")
      setFileContent(content)
      await fileSystem.updateFile(selectedFile.id, { content })
    }
  }

  const getFileExtension = (filename: string) => {
    const parts = filename.split(".")
    return parts.length > 1 ? parts[parts.length - 1] : ""
  }

  const handleInsertText = (text: string) => {
    if (editorRef.current && selectedFile) {
      // This would need to be implemented in the CodeEditor component
      // For now, just append to content
      const updatedContent = fileContent + text
      handleContentChange(updatedContent)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white overflow-hidden touch-manipulation">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 select-none">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-zinc-900 border-zinc-800">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  File
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={handleSave} disabled={!selectedFile} className="cursor-pointer">
                    Save File
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedFile) {
                        setShowVersionHistory(true)
                      }
                    }}
                    disabled={!selectedFile}
                    className="cursor-pointer"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Version History
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await downloadProject()
                        toast({
                          title: "Downloaded",
                          description: "Project exported as ZIP",
                        })
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to download project",
                          variant: "destructive",
                        })
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowTemplates(true)} className="cursor-pointer">
                    <Layers className="h-4 w-4 mr-2" />
                    Project Templates
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Search className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={() => setShowSearch(true)} className="cursor-pointer">
                    Find
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowFileSearch(true)} className="cursor-pointer">
                    <Search className="h-4 w-4 mr-2" />
                    Search in Files
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFormat} disabled={!selectedFile} className="cursor-pointer">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Format Document
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Code2 className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={() => setSidebarOpen(!sidebarOpen)} className="cursor-pointer">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {sidebarOpen ? "Hide" : "Show"} Sidebar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePreviewToggle} className="cursor-pointer">
                    <Play className="h-4 w-4 mr-2" />
                    Toggle Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSplitView(!splitView)}
                    disabled={!showPreview}
                    className="cursor-pointer"
                  >
                    Split View
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-zinc-800" />

              <DropdownMenuItem onClick={() => setShowSnippets(true)} className="cursor-pointer">
                <BookMarked className="h-4 w-4 mr-2" />
                Code Snippets
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowSettings(true)} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowShortcuts(true)} className="cursor-pointer">
                <Keyboard className="h-4 w-4 mr-2" />
                Keyboard Shortcuts
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-zinc-800" />

              <DropdownMenuItem onClick={() => setShowAbout(true)} className="cursor-pointer">
                <Info className="h-4 w-4 mr-2" />
                About
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowProjects(true)} className="cursor-pointer">
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="MobileStudio" width={20} height={20} className="rounded" />
            <span className="font-mono text-sm font-semibold">MobileStudio</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
            onClick={() => setShowTemplates(true)}
            title="Project Templates"
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 hidden md:flex"
            onClick={() => setSplitView(!splitView)}
            disabled={!showPreview}
          >
            <Code2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
            onClick={() => setShowSnippets(true)}
            title="Code Snippets"
          >
            <BookMarked className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 active:scale-95 transition-transform"
            onClick={() => setShowProjects(true)}
            title="Project Manager"
          >
            <FolderKanban className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with backdrop on mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-black transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                className={`flex-1 border-r border-zinc-800 px-4 py-3 text-xs font-medium active:scale-95 transition-transform ${
                  sidebarTab === "files" ? "text-white bg-zinc-900" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
                onClick={() => setSidebarTab("files")}
              >
                <FolderOpen className="mx-auto h-4 w-4" />
              </button>
              <button
                className={`flex-1 px-4 py-3 text-xs font-medium active:scale-95 transition-transform ${
                  sidebarTab === "git" ? "text-white bg-zinc-900" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
                onClick={() => setSidebarTab("git")}
              >
                <GitBranch className="mx-auto h-4 w-4" />
              </button>
              <button
                className={`flex-1 border-l border-zinc-800 px-4 py-3 text-xs font-medium active:scale-95 transition-transform ${
                  sidebarTab === "terminal"
                    ? "text-white bg-zinc-900"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
                onClick={() => setSidebarTab("terminal")}
              >
                <Terminal className="mx-auto h-4 w-4" />
              </button>
            </div>

            {sidebarTab === "files" && (
              <FileTree onFileSelect={handleFileSelect} selectedFileId={selectedFile?.id || null} />
            )}
            {sidebarTab === "git" && <GitPanel />}
            {sidebarTab === "terminal" && <TerminalPanel />}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Editor Section */}
          <div className={`flex flex-col ${splitView && showPreview ? "w-1/2 border-r border-zinc-800" : "flex-1"}`}>
            {/* Tab Bar */}
            <div className="flex items-center border-b border-zinc-800 bg-zinc-950 overflow-x-auto scrollbar-hide">
              {openTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 border-r border-zinc-800 px-4 py-2 cursor-pointer active:bg-zinc-800 transition-colors ${
                    selectedFile?.id === tab.id ? "bg-black" : "bg-zinc-950 hover:bg-zinc-900"
                  }`}
                  onClick={() => setSelectedFile(tab)}
                >
                  <FileCode className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  <span className="text-xs font-mono whitespace-nowrap">{tab.name}</span>
                  <button
                    className="ml-2 text-zinc-500 hover:text-white active:scale-90 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloseTab(tab.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {showSearch && selectedFile && (
              <SearchPanel
                onClose={() => setShowSearch(false)}
                onSearch={handleSearch}
                onReplace={handleReplace}
                onReplaceAll={handleReplaceAll}
                onNext={handleSearchNext}
                onPrevious={handleSearchPrevious}
                matchCount={searchMatchCount}
                currentMatch={searchCurrentMatch}
              />
            )}

            {showFileSearch && (
              <FileSearchPanel onClose={() => setShowFileSearch(false)} onFileSelect={handleFileSelectFromSearch} />
            )}

            <div className="flex-1 overflow-hidden bg-black">
              {selectedFile && !showPreview ? (
                <CodeEditor
                  ref={editorRef}
                  value={fileContent}
                  onChange={handleContentChange}
                  language={detectLanguage(selectedFile.name)}
                />
              ) : selectedFile && splitView ? (
                <CodeEditor
                  ref={editorRef}
                  value={fileContent}
                  onChange={handleContentChange}
                  language={detectLanguage(selectedFile.name)}
                />
              ) : !selectedFile ? (
                <div className="flex h-full items-center justify-center text-zinc-600">
                  <div className="text-center p-4">
                    <FileCode className="mx-auto h-12 w-12 mb-4" />
                    <p className="text-sm">Select a file to start editing</p>
                    <p className="text-xs text-zinc-700 mt-2">Swipe right to open sidebar</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Mobile Toolbar */}
            <MobileToolbar
              onSave={handleSave}
              onUndo={() => {
                // Implement undo if needed
                toast({ title: "Undo", description: "Feature coming soon" })
              }}
              onRedo={() => {
                // Implement redo if needed
                toast({ title: "Redo", description: "Feature coming soon" })
              }}
              onSearch={() => setShowSearch(true)}
              onInsertText={handleInsertText}
            />

            {/* Bottom Bar */}
            <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 py-1.5">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-zinc-500">UTF-8</span>
                {selectedFile && (
                  <>
                    <span className="text-zinc-500 hidden sm:inline">
                      {detectLanguage(selectedFile.name).toUpperCase()}
                    </span>
                    <span className="text-zinc-500">{fileContent.split("\n").length} lines</span>
                  </>
                )}
              </div>
              <Button
                size="sm"
                className="h-7 gap-2 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-transform"
                onClick={handlePreviewToggle}
              >
                <Play className="h-3 w-3" />
                <span className="text-xs">{showPreview ? "Close" : "Preview"}</span>
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className={splitView ? "w-1/2" : "absolute inset-0 z-40"}>
              <LivePreview onClose={() => setShowPreview(false)} />
            </div>
          )}
        </main>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showShortcuts && <ShortcutsPanel onClose={() => setShowShortcuts(false)} />}
      {showTemplates && (
        <TemplateSelector onClose={() => setShowTemplates(false)} onTemplateSelected={handleTemplateSelected} />
      )}
      {showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}
      {showSnippets && <SnippetsPanel onClose={() => setShowSnippets(false)} onInsert={handleInsertSnippet} />}
      {showProjects && (
        <ProjectSwitcher
          onClose={() => setShowProjects(false)}
          onProjectSwitch={handleProjectSwitch}
          currentProjectId={currentProjectId}
        />
      )}
      {showVersionHistory && selectedFile && (
        <VersionHistoryPanel
          fileId={selectedFile.id}
          fileName={selectedFile.name}
          onClose={() => setShowVersionHistory(false)}
          onRestore={handleRestoreVersion}
        />
      )}
    </div>
  )
}
