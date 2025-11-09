export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  parentId: string | null
  createdAt: number
  updatedAt: number
}

class FileSystem {
  private dbName = "MobileStudio-default"
  private db: IDBDatabase | null = null

  setProjectDatabase(projectId: string) {
    this.dbName = `MobileStudio-${projectId}`
    this.db = null
    console.log("[v0] Set database name to:", this.dbName)
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        console.log("[v0] Initializing file system for project:", this.dbName)
        this.initializeDefaultProject().then(resolve).catch(reject)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "id" })
        }
      }
    })
  }

  async initializeDefaultProject(): Promise<void> {
    try {
      const files = await this.getAllFiles()

      if (files.length === 0) {
        const rootId = this.generateId()
        const srcId = this.generateId()
        const indexId = this.generateId()
        const styleId = this.generateId()
        const scriptId = this.generateId()

        const defaultFiles: FileNode[] = [
          {
            id: rootId,
            name: "root",
            type: "folder",
            parentId: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: srcId,
            name: "src",
            type: "folder",
            parentId: rootId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
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
    <p>Start editing to see changes in real-time!</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
            parentId: srcId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: styleId,
            name: "style.css",
            type: "file",
            content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  opacity: 0.9;
}`,
            parentId: srcId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: scriptId,
            name: "script.js",
            type: "file",
            content: `console.log('MobileStudio is ready!');

// Add your JavaScript code here
document.querySelector('h1').addEventListener('click', () => {
  console.log('Hello from MobileStudio!');
});`,
            parentId: srcId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ]

        for (const file of defaultFiles) {
          await this.createItem(file)
        }

        console.log("[v0] Default project initialized")
      }
    } catch (error) {
      console.error("[v0] Failed to load files:", error)
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async createItem(item: FileNode): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.add(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async createFile(name: string, parentId: string | null, content = ""): Promise<FileNode> {
    const file: FileNode = {
      id: this.generateId(),
      name,
      type: "file",
      content,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await this.createItem(file)
    return file
  }

  async createFolder(name: string, parentId: string | null): Promise<FileNode> {
    const folder: FileNode = {
      id: this.generateId(),
      name,
      type: "folder",
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await this.createItem(folder)
    return folder
  }

  async getFile(id: string): Promise<FileNode | undefined> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllFiles(): Promise<FileNode[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async updateFile(id: string, updates: Partial<FileNode>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const file = await this.getFile(id)
    if (!file) throw new Error("File not found")

    const updatedFile = {
      ...file,
      ...updates,
      updatedAt: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.put(updatedFile)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFile(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const files = await this.getAllFiles()
    const childFiles = files.filter((f) => f.parentId === id)

    for (const child of childFiles) {
      await this.deleteFile(child.id)
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async renameFile(id: string, newName: string): Promise<void> {
    await this.updateFile(id, { name: newName })
  }

  async moveFile(id: string, newParentId: string | null): Promise<void> {
    await this.updateFile(id, { parentId: newParentId })
  }
}

export const fileSystem = new FileSystem()
