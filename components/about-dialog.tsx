"use client"

import { Info, Github, Gitlab } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AboutDialogProps {
  onClose: () => void
}

export function AboutDialog({ onClose }: AboutDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600/20 p-2">
              <Info className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">About MobileStudio</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-400 hover:text-white">
            ×
          </Button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="text-zinc-400 mb-1">Project Name</h3>
            <p className="text-white font-mono">MobileStudio</p>
          </div>

          <div>
            <h3 className="text-zinc-400 mb-1">Version</h3>
            <p className="text-white font-mono">2.0.0</p>
          </div>

          <div>
            <h3 className="text-zinc-400 mb-1">Description</h3>
            <p className="text-zinc-300 leading-relaxed">
              A powerful mobile-first Progressive Web App code editor with Monaco integration, file management, live
              preview, and terminal emulator.
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-zinc-400 mb-3">Developer</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">Ryan Shelby</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 bg-transparent"
                  onClick={() => window.open("https://github.com/MdSagorMunshi", "_blank")}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 bg-transparent"
                  onClick={() => window.open("https://gitlab.com/rynex", "_blank")}
                >
                  <Gitlab className="h-4 w-4" />
                  GitLab
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-zinc-400 mb-2">Source Code</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-xs border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 bg-transparent"
                onClick={() => window.open("https://github.com/MdSagorMunshi/MobileStudio", "_blank")}
              >
                <Github className="h-3.5 w-3.5" />
                View on GitHub
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-xs border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 bg-transparent"
                onClick={() => window.open("https://gitlab.com/rynex/MobileStudio", "_blank")}
              >
                <Gitlab className="h-3.5 w-3.5" />
                View on GitLab
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
