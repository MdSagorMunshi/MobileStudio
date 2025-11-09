"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { TerminalIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fileSystem } from "@/lib/file-system"

export function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [currentDirectory, setCurrentDirectory] = useState("/")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Add welcome message
    addOutput("MobileStudio Terminal v2.0.0")
    addOutput("Type 'help' for available commands")
    addOutput("")
  }, [])

  const addOutput = (text: string, isError = false) => {
    setHistory((prev) => [...prev, isError ? `ERROR: ${text}` : text])
  }

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add command to history
    addOutput(`$ ${trimmedCmd}`)

    const parts = trimmedCmd.split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    try {
      switch (command) {
        case "help":
          addOutput("Available commands:")
          addOutput("  help          - Show this help message")
          addOutput("  clear         - Clear terminal")
          addOutput("  ls            - List files in current directory")
          addOutput("  la            - List all files (including hidden)")
          addOutput("  cat <file>    - Display file contents")
          addOutput("  echo <text>   - Print text")
          addOutput("  pwd           - Print working directory")
          addOutput("  cd <dir>      - Change directory")
          addOutput("  cd ..         - Go to parent directory")
          addOutput("  mkdir <dir>   - Create directory")
          addOutput("  touch <file>  - Create empty file")
          addOutput("  cp <src> <dst> - Copy file")
          addOutput("  mv <src> <dst> - Move/rename file")
          addOutput("  rm <file>     - Remove file")
          addOutput("  date          - Show current date and time")
          addOutput("  whoami        - Display current user")
          break

        case "clear":
          setHistory([])
          break

        case "ls":
        case "la":
          const files = await fileSystem.getAllFiles()
          const rootFiles = files.filter((f) => f.parentId === null)
          if (rootFiles.length === 0) {
            addOutput("No files found")
          } else {
            rootFiles.forEach((file) => {
              const prefix = file.type === "folder" ? "📁" : "📄"
              const size = file.type === "file" ? ` (${file.content?.length || 0} bytes)` : ""
              addOutput(`${prefix} ${file.name}${command === "la" ? size : ""}`)
            })
          }
          break

        case "cat":
          if (args.length === 0) {
            addOutput("Usage: cat <filename>", true)
          } else {
            const filename = args[0]
            const files = await fileSystem.getAllFiles()
            const file = files.find((f) => f.name === filename && f.type === "file")
            if (!file) {
              addOutput(`File not found: ${filename}`, true)
            } else {
              addOutput(file.content || "(empty file)")
            }
          }
          break

        case "echo":
          addOutput(args.join(" "))
          break

        case "pwd":
          addOutput(currentDirectory)
          break

        case "cd":
          if (args.length === 0) {
            setCurrentDirectory("/")
            addOutput("Changed to root directory")
          } else if (args[0] === "..") {
            setCurrentDirectory("/")
            addOutput("Changed to parent directory")
          } else {
            const files = await fileSystem.getAllFiles()
            const folder = files.find((f) => f.name === args[0] && f.type === "folder")
            if (folder) {
              setCurrentDirectory(`/${args[0]}`)
              addOutput(`Changed directory to /${args[0]}`)
            } else {
              addOutput(`Directory not found: ${args[0]}`, true)
            }
          }
          break

        case "mkdir":
          if (args.length === 0) {
            addOutput("Usage: mkdir <dirname>", true)
          } else {
            await fileSystem.createFolder(args[0], null)
            addOutput(`Directory created: ${args[0]}`)
          }
          break

        case "touch":
          if (args.length === 0) {
            addOutput("Usage: touch <filename>", true)
          } else {
            await fileSystem.createFile(args[0], null, "")
            addOutput(`File created: ${args[0]}`)
          }
          break

        case "cp":
          if (args.length < 2) {
            addOutput("Usage: cp <source> <destination>", true)
          } else {
            const files = await fileSystem.getAllFiles()
            const srcFile = files.find((f) => f.name === args[0] && f.type === "file")
            if (!srcFile) {
              addOutput(`Source file not found: ${args[0]}`, true)
            } else {
              await fileSystem.createFile(args[1], null, srcFile.content || "")
              addOutput(`Copied ${args[0]} to ${args[1]}`)
            }
          }
          break

        case "mv":
          if (args.length < 2) {
            addOutput("Usage: mv <source> <destination>", true)
          } else {
            const files = await fileSystem.getAllFiles()
            const srcFile = files.find((f) => f.name === args[0])
            if (!srcFile) {
              addOutput(`Source file not found: ${args[0]}`, true)
            } else {
              await fileSystem.updateFile(srcFile.id, { ...srcFile, name: args[1] })
              addOutput(`Renamed ${args[0]} to ${args[1]}`)
            }
          }
          break

        case "rm":
          if (args.length === 0) {
            addOutput("Usage: rm <filename>", true)
          } else {
            const files = await fileSystem.getAllFiles()
            const file = files.find((f) => f.name === args[0])
            if (!file) {
              addOutput(`File not found: ${args[0]}`, true)
            } else {
              await fileSystem.deleteFile(file.id)
              addOutput(`Removed: ${args[0]}`)
            }
          }
          break

        case "date":
          addOutput(new Date().toString())
          break

        case "whoami":
          addOutput("developer")
          break

        case "":
          break

        default:
          addOutput(`Command not found: ${command}`, true)
          addOutput("Type 'help' for available commands")
      }
    } catch (error) {
      addOutput(`Error executing command: ${error}`, true)
    }

    addOutput("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCommand.trim()) {
      executeCommand(currentCommand)
      setCurrentCommand("")
    }
  }

  const handleClear = () => {
    setHistory([])
    addOutput("MobileStudio Terminal v2.0.0")
    addOutput("Type 'help' for available commands")
    addOutput("")
  }

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <div className="flex h-full flex-col bg-black">
      <div className="flex items-center justify-between border-b border-zinc-800 p-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-zinc-300">Terminal</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={handleClear}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {history.map((line, index) => (
          <div
            key={index}
            className={`${
              line.startsWith("ERROR:") ? "text-red-500" : line.startsWith("$") ? "text-green-500" : "text-zinc-300"
            }`}
          >
            {line}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <span className="text-green-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent text-zinc-300 outline-none"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}
