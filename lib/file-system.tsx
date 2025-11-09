export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  parentId: string | null
  content?: string
  createdAt: number
}

class FileSystem {
  private dbName = "mobilestudio_files"
  private db: IDBDatabase | null = null

  setProjectDatabase(projectId: string) {
    this.dbName = `mobilestudio_project_data_${projectId}`
    this.db = null
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "id" })
        }
      }
    })
  }

  async init(): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(["files"], "readonly")
    const store = tx.objectStore("files")
    const count = await new Promise<number>((resolve) => {
      const countRequest = store.count()
      countRequest.onsuccess = () => resolve(countRequest.result)
    })

    if (count === 0) {
      await this.createDefaultFiles()
    }
  }

  private async createDefaultFiles() {
    const root = await this.createFolder("my-project", null)
    await this.createFile(
      "index.html",
      root.id,
      `<!DOCTYPE html>
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
    <p>Start editing your files!</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    )
    await this.createFile(
      "style.css",
      root.id,
      `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a0a;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`,
    )
    await this.createFile(
      "script.js",
      root.id,
      `console.log('Welcome to MobileStudio!')

// Add your JavaScript code here
`,
    )
  }

  async getAllFiles(): Promise<FileNode[]> {
    const db = await this.getDB()
    const tx = db.transaction(["files"], "readonly")
    const store = tx.objectStore("files")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getFile(id: string): Promise<FileNode | null> {
    const db = await this.getDB()
    const tx = db.transaction(["files"], "readonly")
    const store = tx.objectStore("files")

    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async createFile(name: string, parentId: string | null, content = ""): Promise<FileNode> {
    const file: FileNode = {
      id: Date.now().toString() + Math.random(),
      name,
      type: "file",
      parentId,
      content,
      createdAt: Date.now(),
    }

    const db = await this.getDB()
    const tx = db.transaction(["files"], "readwrite")
    const store = tx.objectStore("files")

    return new Promise((resolve, reject) => {
      const request = store.add(file)
      request.onsuccess = () => resolve(file)
      request.onerror = () => reject(request.error)
    })
  }

  async createFolder(name: string, parentId: string | null): Promise<FileNode> {
    const folder: FileNode = {
      id: Date.now().toString() + Math.random(),
      name,
      type: "folder",
      parentId,
      createdAt: Date.now(),
    }

    const db = await this.getDB()
    const tx = db.transaction(["files"], "readwrite")
    const store = tx.objectStore("files")

    return new Promise((resolve, reject) => {
      const request = store.add(folder)
      request.onsuccess = () => resolve(folder)
      request.onerror = () => reject(request.error)
    })
  }

  async updateFile(id: string, updates: Partial<FileNode>): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(["files"], "readwrite")
    const store = tx.objectStore("files")

    const file = await this.getFile(id)
    if (!file) return

    const updated = { ...file, ...updates }

    return new Promise((resolve, reject) => {
      const request = store.put(updated)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFile(id: string): Promise<void> {
    const db = await this.getDB()
    const files = await this.getAllFiles()
    const toDelete = [id]

    const findChildren = (parentId: string) => {
      files
        .filter((f) => f.parentId === parentId)
        .forEach((child) => {
          toDelete.push(child.id)
          if (child.type === "folder") {
            findChildren(child.id)
          }
        })
    }

    findChildren(id)

    const tx = db.transaction(["files"], "readwrite")
    const store = tx.objectStore("files")

    return new Promise((resolve, reject) => {
      toDelete.forEach((fileId) => store.delete(fileId))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async clearAll(): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(["files"], "readwrite")
    const store = tx.objectStore("files")

    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const fileSystem = new FileSystem()
