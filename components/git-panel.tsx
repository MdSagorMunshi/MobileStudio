"use client"
import { GitBranch, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { downloadProject } from "@/lib/file-operations"
import { useToast } from "@/hooks/use-toast"

export function GitPanel() {
  const { toast } = useToast()

  const handleDownloadProject = async () => {
    try {
      await downloadProject()
      toast({
        title: "Download Started",
        description: "Your project is being downloaded as a ZIP file",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download project",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-zinc-300">Source Control</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          <Alert className="bg-zinc-900 border-zinc-800">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-zinc-400">
              Git integration features are coming soon! In the meantime, you can download your project as a ZIP file.
            </AlertDescription>
          </Alert>

          <Button
            size="sm"
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-xs"
            onClick={handleDownloadProject}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Project as ZIP
          </Button>

          <div className="space-y-2 pt-4">
            <div className="text-xs font-medium text-zinc-400">COMING SOON</div>
            <div className="space-y-1 text-xs text-zinc-600">
              <div>• Initialize Git repository</div>
              <div>• Stage and commit changes</div>
              <div>• View commit history</div>
              <div>• Branch management</div>
              <div>• Push to remote repositories</div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
