import { openDB, type IDBPDatabase } from "idb"

export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: string[]
  parentId: string | null
  createdAt: number
  updatedAt: number
}

class FileSystem {
  private db: IDBPDatabase | null = null
  private currentProjectId = "default"

  setProjectDatabase(projectId: string) {
    this.currentProjectId = projectId
    this.db = null
  }

  async init() {
    console.log("[v0] Initializing file system for project:", this.currentProjectId)
    this.db = await openDB(`mobilestudio-fs-${this.currentProjectId}`, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "id" })
        }
      },
    })

    const files = await this.getAllFiles()
    if (files.length === 0) {
      await this.initializeDefaultProject()
    }
  }

  async initializeDefaultProject() {
    const rootId = "root"
    const srcId = "src-folder"
    const indexId = "index-html"
    const styleId = "style-css"
    const scriptId = "script-js"

    const root: FileNode = {
      id: rootId,
      name: "project",
      type: "folder",
      children: [srcId],
      parentId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const srcFolder: FileNode = {
      id: srcId,
      name: "src",
      type: "folder",
      children: [indexId, styleId, scriptId],
      parentId: rootId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const indexFile: FileNode = {
      id: indexId,
      name: "index.html",
      type: "file",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MobileStudio Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to MobileStudio</h1>
    <p>Start editing your files to see the magic happen!</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      parentId: srcId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const styleFile: FileNode = {
      id: styleId,
      name: "style.css",
      type: "file",
      content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.container {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
}

h1 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
}`,
      parentId: srcId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const scriptFile: FileNode = {
      id: scriptId,
      name: "script.js",
      type: "file",
      content: `console.log('MobileStudio is ready!');

// Your code here
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
});`,
      parentId: srcId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await this.createFile(root)
    await this.createFile(srcFolder)
    await this.createFile(indexFile)
    await this.createFile(styleFile)
    await this.createFile(scriptFile)
  }

  async createFile(file: FileNode) {
    if (!this.db) throw new Error("Database not initialized")
    await this.db.put("files", file)
  }

  async getFile(id: string): Promise<FileNode | undefined> {
    if (!this.db) throw new Error("Database not initialized")
    return await this.db.get("files", id)
  }

  async getAllFiles(): Promise<FileNode[]> {
    if (!this.db) throw new Error("Database not initialized")
    return await this.db.getAll("files")
  }

  async updateFile(id: string, updates: Partial<FileNode>) {
    if (!this.db) throw new Error("Database not initialized")
    const file = await this.getFile(id)
    if (!file) throw new Error("File not found")
    const updated = { ...file, ...updates, updatedAt: Date.now() }
    await this.db.put("files", updated)
  }

  async deleteFile(id: string) {
    if (!this.db) throw new Error("Database not initialized")
    const file = await this.getFile(id)
    if (!file) return

    if (file.type === "folder" && file.children) {
      for (const childId of file.children) {
        await this.deleteFile(childId)
      }
    }

    if (file.parentId) {
      const parent = await this.getFile(file.parentId)
      if (parent && parent.children) {
        parent.children = parent.children.filter((id) => id !== file.id)
        await this.updateFile(parent.id, { children: parent.children })
      }
    }

    await this.db.delete("files", id)
  }

  async getRootFiles(): Promise<FileNode[]> {
    const allFiles = await this.getAllFiles()
    const root = allFiles.find((f) => f.parentId === null)
    if (!root || !root.children) return []

    const rootChildren = await Promise.all(root.children.map((id) => this.getFile(id)))
    return rootChildren.filter((f): f is FileNode => f !== undefined)
  }
}

export const fileSystem = new FileSystem()
