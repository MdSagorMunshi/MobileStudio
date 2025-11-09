"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projectTemplates, createProjectFromTemplate } from "@/lib/project-templates"
import { useToast } from "@/hooks/use-toast"

interface TemplateSelectorProps {
  onClose: () => void
  onTemplateSelected: () => void
}

export function TemplateSelector({ onClose, onTemplateSelected }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCreateProject = async () => {
    if (!selectedTemplate) return

    try {
      await createProjectFromTemplate(selectedTemplate)
      toast({
        title: "Project Created",
        description: "Template loaded successfully",
      })
      onTemplateSelected()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project from template",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl m-4">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 sticky top-0 bg-zinc-950 z-10">
          <h2 className="text-lg font-semibold">Choose a Template</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-6 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-zinc-400">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-zinc-800 text-zinc-300 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleCreateProject} disabled={!selectedTemplate} className="bg-blue-600 hover:bg-blue-700">
            Create Project
          </Button>
        </div>
      </div>
    </div>
  )
}
