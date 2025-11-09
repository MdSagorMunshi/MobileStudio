"use client"

import { useState, useEffect } from "react"
import { FolderOpen, Plus, Trash2, Copy, Edit, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { projectManager, type Project } from "@/lib/project-manager"
import { useToast } from "@/hooks/use-toast"

interface ProjectSwitcherProps {
  onClose: () => void
  onProjectSwitch: (projectId: string) => void
  currentProjectId: string | null
}

export function ProjectSwitcher({ onClose, onProjectSwitch, currentProjectId }: ProjectSwitcherProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [showNewForm, setShowNewForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const allProjects = await projectManager.getAllProjects()
    setProjects(allProjects)
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    const newProject = await projectManager.createProject(formData.name, formData.description)
    await loadProjects()
    setShowNewForm(false)
    setFormData({ name: "", description: "" })
    toast({
      title: "Created",
      description: "New project created successfully",
    })
    onProjectSwitch(newProject.id)
  }

  const handleUpdate = async () => {
    if (!editingProject || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    await projectManager.updateProject(editingProject.id, {
      name: formData.name,
      description: formData.description,
    })
    await loadProjects()
    setEditingProject(null)
    setFormData({ name: "", description: "" })
    toast({
      title: "Updated",
      description: "Project updated successfully",
    })
  }

  const handleDelete = async (id: string) => {
    if (projects.length === 1) {
      toast({
        title: "Error",
        description: "Cannot delete the last project",
        variant: "destructive",
      })
      return
    }

    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      await projectManager.deleteProject(id)
      await loadProjects()
      toast({
        title: "Deleted",
        description: "Project deleted successfully",
      })

      if (currentProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id)
        if (remaining.length > 0) {
          onProjectSwitch(remaining[0].id)
        }
      }
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await projectManager.duplicateProject(id)
      await loadProjects()
      toast({
        title: "Duplicated",
        description: "Project duplicated successfully",
      })
      onProjectSwitch(duplicated.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate project",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || "",
    })
    setShowNewForm(true)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-3xl h-[80vh] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-lg font-semibold">Project Manager</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowNewForm(true)
                setEditingProject(null)
                setFormData({ name: "", description: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showNewForm ? (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome Project"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of your project..."
                  className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingProject ? handleUpdate : handleCreate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {editingProject ? "Update" : "Create"} Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewForm(false)
                    setEditingProject(null)
                    setFormData({ name: "", description: "" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  currentProjectId === project.id
                    ? "border-blue-600 bg-blue-950/20"
                    : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
                }`}
                onClick={() => {
                  if (currentProjectId !== project.id) {
                    onProjectSwitch(project.id)
                    onClose()
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-blue-500" />
                      <h3 className="font-semibold">{project.name}</h3>
                      {currentProjectId === project.id && (
                        <span className="text-xs px-2 py-0.5 bg-blue-600 rounded-full">Current</span>
                      )}
                    </div>
                    {project.description && <p className="text-sm text-zinc-400 mt-2">{project.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                      <span>Created: {formatDate(project.createdAt)}</span>
                      <span>Updated: {formatDate(project.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(project)
                      }}
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicate(project.id)
                      }}
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(project.id)
                      }}
                      className="h-8 w-8 text-zinc-400 hover:text-red-500"
                      disabled={projects.length === 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center text-zinc-500 py-8">
                <p>No projects yet. Create your first project to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
