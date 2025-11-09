"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fileSystem } from "@/lib/file-system"

interface LivePreviewProps {
  onClose: () => void
}

export function LivePreview({ onClose }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadPreview()
  }, [])

  const loadPreview = async () => {
    setIsRefreshing(true)
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

      // Add error handling wrapper
      const wrappedContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; }
              .preview-error {
                padding: 2rem;
                background: #1a1a1a;
                color: #ef4444;
                font-family: monospace;
                white-space: pre-wrap;
              }
            </style>
            <script>
              window.addEventListener('error', function(e) {
                document.body.innerHTML = '<div class="preview-error">Error: ' + e.message + '\\n\\nLine: ' + e.lineno + '\\nFile: ' + e.filename + '</div>';
              });
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
    } finally {
      setIsRefreshing(false)
    }
  }

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
      <div className="flex-1 bg-white">
        <iframe
          ref={iframeRef}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          title="Live Preview"
        />
      </div>
    </div>
  )
}
