export interface FileVersion {
  id: string
  fileId: string
  content: string
  timestamp: number
  label?: string
}

const VERSIONS_KEY_PREFIX = "mobilestudio_versions_"
const MAX_VERSIONS_PER_FILE = 20

class VersionHistory {
  private dbName = "mobilestudio_versions"

  setProjectDatabase(projectId: string) {
    this.dbName = `mobilestudio_versions_${projectId}`
  }

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("versions")) {
          const store = db.createObjectStore("versions", { keyPath: "id" })
          store.createIndex("fileId", "fileId", { unique: false })
          store.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  async saveVersion(fileId: string, content: string, label?: string): Promise<FileVersion> {
    const db = await this.getDB()
    const version: FileVersion = {
      id: `${fileId}_${Date.now()}`,
      fileId,
      content,
      timestamp: Date.now(),
      label,
    }

    const tx = db.transaction(["versions"], "readwrite")
    const store = tx.objectStore("versions")

    // Add new version
    await new Promise<void>((resolve, reject) => {
      const request = store.add(version)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    // Cleanup old versions if exceed limit
    await this.cleanupOldVersions(fileId)

    return version
  }

  private async cleanupOldVersions(fileId: string): Promise<void> {
    const versions = await this.getFileVersions(fileId)
    if (versions.length > MAX_VERSIONS_PER_FILE) {
      const db = await this.getDB()
      const tx = db.transaction(["versions"], "readwrite")
      const store = tx.objectStore("versions")

      // Keep the most recent versions and delete the oldest
      const toDelete = versions
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, versions.length - MAX_VERSIONS_PER_FILE)

      for (const version of toDelete) {
        store.delete(version.id)
      }

      await new Promise<void>((resolve) => {
        tx.oncomplete = () => resolve()
      })
    }
  }

  async getFileVersions(fileId: string): Promise<FileVersion[]> {
    const db = await this.getDB()
    const tx = db.transaction(["versions"], "readonly")
    const store = tx.objectStore("versions")
    const index = store.index("fileId")

    return new Promise((resolve, reject) => {
      const request = index.getAll(fileId)
      request.onsuccess = () => {
        const versions = request.result as FileVersion[]
        // Sort by timestamp descending (newest first)
        versions.sort((a, b) => b.timestamp - a.timestamp)
        resolve(versions)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getVersion(versionId: string): Promise<FileVersion | null> {
    const db = await this.getDB()
    const tx = db.transaction(["versions"], "readonly")
    const store = tx.objectStore("versions")

    return new Promise((resolve, reject) => {
      const request = store.get(versionId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteVersion(versionId: string): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(["versions"], "readwrite")
    const store = tx.objectStore("versions")

    return new Promise((resolve, reject) => {
      const request = store.delete(versionId)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const versionHistory = new VersionHistory()
