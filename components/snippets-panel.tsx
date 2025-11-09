"use client"

import { useState, useEffect } from "react"
import { X, Search, Plus, Copy, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { snippetsStore, type Snippet } from "@/lib/snippets-store"
import { useToast } from "@/hooks/use-toast"

interface SnippetsPanelProps {
  onClose: () => void
  onInsert: (code: string) => void
}

export function SnippetsPanel({ onClose, onInsert }: SnippetsPanelProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "javascript",
    category: "Custom",
    code: "",
  })

  useEffect(() => {
    snippetsStore.init().then(() => {
      const allSnippets = snippetsStore.getAll()
      setSnippets(allSnippets)
      setFilteredSnippets(allSnippets)
      setCategories(["All", ...snippetsStore.getCategories()])
    })
  }, [])

  useEffect(() => {
    let filtered = snippets

    if (selectedCategory !== "All") {
      filtered = snippetsStore.getByCategory(selectedCategory)
    }

    if (searchQuery) {
      filtered = snippetsStore.search(searchQuery)
    }

    setFilteredSnippets(filtered)
  }, [searchQuery, selectedCategory, snippets])

  const handleInsert = (code: string) => {
    onInsert(code)
    toast({
      title: "Inserted",
      description: "Snippet inserted into editor",
    })
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied",
      description: "Snippet copied to clipboard",
    })
  }

  const handleDelete = (id: string) => {
    snippetsStore.delete(id)
    setSnippets(snippetsStore.getAll())
    toast({
      title: "Deleted",
      description: "Snippet deleted successfully",
    })
  }

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet)
    setFormData({
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      category: snippet.category,
      code: snippet.code,
    })
    setShowAddForm(true)
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.code) {
      toast({
        title: "Error",
        description: "Title and code are required",
        variant: "destructive",
      })
      return
    }

    if (editingSnippet) {
      snippetsStore.update(editingSnippet.id, formData)
      toast({
        title: "Updated",
        description: "Snippet updated successfully",
      })
    } else {
      snippetsStore.add(formData)
      toast({
        title: "Added",
        description: "Snippet added successfully",
      })
    }

    setSnippets(snippetsStore.getAll())
    setCategories(["All", ...snippetsStore.getCategories()])
    setShowAddForm(false)
    setEditingSnippet(null)
    setFormData({
      title: "",
      description: "",
      language: "javascript",
      category: "Custom",
      code: "",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-4xl h-[90vh] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-lg font-semibold">Code Snippets</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowAddForm(true)
                setEditingSnippet(null)
                setFormData({
                  title: "",
                  description: "",
                  language: "javascript",
                  category: "Custom",
                  code: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Snippet
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showAddForm ? (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Input
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <div>
                <Label>Code</Label>
                <Textarea
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 font-mono text-sm min-h-[300px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  {editingSnippet ? "Update" : "Add"} Snippet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSnippet(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="border-b border-zinc-800 p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search snippets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-zinc-700 hover:bg-zinc-800"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Snippets List */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {filteredSnippets.map((snippet) => (
                <div key={snippet.id} className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{snippet.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{snippet.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded">{snippet.language}</span>
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded">{snippet.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleInsert(snippet.code)}
                        className="h-8 text-zinc-400 hover:text-white"
                      >
                        Insert
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(snippet.code)}
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(snippet)}
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(snippet.id)}
                        className="h-8 w-8 text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <pre className="text-xs font-mono bg-black p-3 rounded overflow-x-auto border border-zinc-800 mt-2">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
              {filteredSnippets.length === 0 && (
                <div className="text-center text-zinc-500 py-8">
                  <p>No snippets found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
