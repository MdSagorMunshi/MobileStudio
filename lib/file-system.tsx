export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  parentId: string | null
  content?: string
  createdAt: number
  updatedAt: number
}

class FileSystemManager {
  private dbName = "mobile-studio-fs"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "id" })
        }
      }
    })
  }

  async getAllFiles(): Promise<FileNode[]> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.getAll()

      request.onsuccess = () => {
        const files = request.result as FileNode[]
        files.sort((a, b) => {
          if (a.type !== b.type) return a.type === "folder" ? -1 : 1
          return a.name.localeCompare(b.name)
        })
        resolve(files)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getFile(id: string): Promise<FileNode | null> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getFileByPath(path: string): Promise<FileNode | null> {
    const allFiles = await this.getAllFiles()
    return allFiles.find((f) => this.getFilePath(f, allFiles) === path) || null
  }

  private getFilePath(file: FileNode, allFiles: FileNode[]): string {
    const parts: string[] = [file.name]
    let current = file

    while (current.parentId) {
      const parent = allFiles.find((f) => f.id === current.parentId)
      if (!parent) break
      parts.unshift(parent.name)
      current = parent
    }

    return parts.join("/")
  }

  async createFile(name: string, parentId: string | null = null, content = ""): Promise<FileNode> {
    await this.init()
    const file: FileNode = {
      id: crypto.randomUUID(),
      name,
      type: "file",
      parentId,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.add(file)

      request.onsuccess = () => resolve(file)
      request.onerror = () => reject(request.error)
    })
  }

  async createFolder(name: string, parentId: string | null = null): Promise<FileNode> {
    await this.init()
    const folder: FileNode = {
      id: crypto.randomUUID(),
      name,
      type: "folder",
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.add(folder)

      request.onsuccess = () => resolve(folder)
      request.onerror = () => reject(request.error)
    })
  }

  async updateFile(id: string, updates: Partial<FileNode>): Promise<void> {
    await this.init()
    const file = await this.getFile(id)
    if (!file) throw new Error("File not found")

    const updatedFile = { ...file, ...updates, updatedAt: Date.now() }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.put(updatedFile)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFile(id: string): Promise<void> {
    await this.init()
    const allFiles = await this.getAllFiles()
    const children = allFiles.filter((f) => f.parentId === id)

    for (const child of children) {
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

  async clearAll(): Promise<void> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async initializeDefaultProject(): Promise<void> {
    const files = await this.getAllFiles()
    if (files.length > 0) return

    await this.createFile(
      "index.html",
      null,
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MobileStudio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to MobileStudio</h1>
    <p>Start editing to see changes in real-time!</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    )

    await this.createFile(
      "styles.css",
      null,
      `* {
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
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-in;
}

p {
  font-size: 1.25rem;
  opacity: 0.9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    )

    await this.createFile(
      "script.js",
      null,
      `console.log('Welcome to MobileStudio!');

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded successfully');
});`,
    )
  }
}

export const fileSystem = new FileSystemManager()
