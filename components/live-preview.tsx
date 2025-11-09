"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw, ExternalLink, X, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fileSystem } from "@/lib/file-system"

interface LivePreviewProps {
  onClose: () => void
}

interface ConsoleMessage {
  type: "log" | "warn" | "error" | "info"
  message: string
  timestamp: number
}

export function LivePreview({ onClose }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [showConsole, setShowConsole] = useState(true)
  const consoleEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPreview()
  }, [])

  useEffect(() => {
    // Auto-scroll console to bottom
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [consoleMessages])

  const addConsoleMessage = (type: ConsoleMessage["type"], message: string) => {
    setConsoleMessages((prev) => [
      ...prev,
      {
        type,
        message,
        timestamp: Date.now(),
      },
    ])
  }

  const loadPreview = async () => {
    setIsRefreshing(true)
    setConsoleMessages([])

    try {
      const files = await fileSystem.getAllFiles()

      // Find HTML, CSS, and JS files
      const htmlFile = files.find((f) => f.name === "index.html" && f.type === "file")
      const cssFiles = files.filter((f) => f.name.endsWith(".css") && f.type === "file")
      const jsFiles = files.filter((f) => f.name.endsWith(".js") && f.type === "file")

      let htmlContent = htmlFile?.content || "<html><body><h1>No index.html found</h1></body></html>"

      // Inject CSS
      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map((f) => f.content || "").join("\n")
        const styleTag = `<style>${cssContent}</style>`

        // Insert before </head> or at the beginning
        if (htmlContent.includes("</head>")) {
          htmlContent = htmlContent.replace("</head>", `${styleTag}</head>`)
        } else if (htmlContent.includes("<head>")) {
          htmlContent = htmlContent.replace("<head>", `<head>${styleTag}`)
        } else {
          htmlContent = `<head>${styleTag}</head>${htmlContent}`
        }
      }

      // Inject JS
      if (jsFiles.length > 0) {
        const jsContent = jsFiles.map((f) => f.content || "").join("\n")
        const scriptTag = `<script>${jsContent}</script>`

        // Insert before </body> or at the end
        if (htmlContent.includes("</body>")) {
          htmlContent = htmlContent.replace("</body>", `${scriptTag}</body>`)
        } else {
          htmlContent = `${htmlContent}${scriptTag}`
        }
      }

      const wrappedContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; }
            </style>
            <script>
              // Capture console messages
              (function() {
                const originalLog = console.log;
                const originalWarn = console.warn;
                const originalError = console.error;
                const originalInfo = console.info;

                function sendToParent(type, args) {
                  const message = Array.from(args).map(arg => {
                    if (typeof arg === 'object') {
                      try {
                        return JSON.stringify(arg, null, 2);
                      } catch (e) {
                        return String(arg);
                      }
                    }
                    return String(arg);
                  }).join(' ');
                  
                  window.parent.postMessage({
                    type: 'console',
                    level: type,
                    message: message
                  }, '*');
                }

                console.log = function(...args) {
                  originalLog.apply(console, args);
                  sendToParent('log', args);
                };

                console.warn = function(...args) {
                  originalWarn.apply(console, args);
                  sendToParent('warn', args);
                };

                console.error = function(...args) {
                  originalError.apply(console, args);
                  sendToParent('error', args);
                };

                console.info = function(...args) {
                  originalInfo.apply(console, args);
                  sendToParent('info', args);
                };

                // Capture errors
                window.addEventListener('error', function(e) {
                  sendToParent('error', ['Error: ' + e.message + ' at line ' + e.lineno]);
                });

                // Capture unhandled promise rejections
                window.addEventListener('unhandledrejection', function(e) {
                  sendToParent('error', ['Unhandled Promise Rejection: ' + e.reason]);
                });
              })();
            </script>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `

      // Create blob URL for iframe
      const blob = new Blob([wrappedContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      if (iframeRef.current) {
        iframeRef.current.src = url
      }

      // Clean up blob URL after loading
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      console.error("[v0] Failed to load preview:", error)
      addConsoleMessage("error", `Failed to load preview: ${error}`)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        addConsoleMessage(event.data.level, event.data.message)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleRefresh = () => {
    loadPreview()
  }

  const handleOpenInNewTab = async () => {
    try {
      const files = await fileSystem.getAllFiles()
      const htmlFile = files.find((f) => f.name === "index.html" && f.type === "file")
      const cssFiles = files.filter((f) => f.name.endsWith(".css") && f.type === "file")
      const jsFiles = files.filter((f) => f.name.endsWith(".js") && f.type === "file")

      let htmlContent = htmlFile?.content || "<html><body><h1>No index.html found</h1></body></html>"

      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map((f) => f.content || "").join("\n")
        const styleTag = `<style>${cssContent}</style>`
        if (htmlContent.includes("</head>")) {
          htmlContent = htmlContent.replace("</head>", `${styleTag}</head>`)
        } else {
          htmlContent = `<head>${styleTag}</head>${htmlContent}`
        }
      }

      if (jsFiles.length > 0) {
        const jsContent = jsFiles.map((f) => f.content || "").join("\n")
        const scriptTag = `<script>${jsContent}</script>`
        if (htmlContent.includes("</body>")) {
          htmlContent = htmlContent.replace("</body>", `${scriptTag}</body>`)
        } else {
          htmlContent = `${htmlContent}${scriptTag}`
        }
      }

      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    } catch (error) {
      console.error("[v0] Failed to open in new tab:", error)
    }
  }

  const clearConsole = () => {
    setConsoleMessages([])
  }

  const getConsoleIcon = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
      case "warn":
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
      case "info":
        return <AlertCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
      default:
        return null
    }
  }

  const getConsoleColor = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400"
      case "warn":
        return "text-yellow-400"
      case "info":
        return "text-blue-400"
      default:
        return "text-zinc-300"
    }
  }

  return (
    <div className="flex h-full flex-col bg-black">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">PREVIEW</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className={`${showConsole ? "flex-1" : "flex-1"} bg-white overflow-hidden`}>
        <iframe
          ref={iframeRef}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          title="Live Preview"
        />
      </div>

      {/* Console Panel */}
      <div
        className={`${showConsole ? "h-48" : "h-10"} border-t border-zinc-800 bg-zinc-950 flex flex-col transition-all`}
      >
        {/* Console Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white"
            >
              {showConsole ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              CONSOLE
              {consoleMessages.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-zinc-800 rounded text-xs">{consoleMessages.length}</span>
              )}
            </button>
          </div>
          {showConsole && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-zinc-400 hover:text-white"
              onClick={clearConsole}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Console Messages */}
        {showConsole && (
          <div className="flex-1 overflow-auto p-2 space-y-1 font-mono text-xs">
            {consoleMessages.length === 0 ? (
              <div className="text-zinc-600 text-center py-4">No console output yet</div>
            ) : (
              consoleMessages.map((msg, index) => (
                <div key={index} className="flex gap-2 items-start px-2 py-1 hover:bg-zinc-900 rounded">
                  {getConsoleIcon(msg.type)}
                  <span className={`flex-1 ${getConsoleColor(msg.type)} break-all`}>{msg.message}</span>
                  <span className="text-zinc-600 text-[10px] flex-shrink-0">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
