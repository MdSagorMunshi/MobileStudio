import { fileSystem, type FileNode } from "./file-system"
import JSZip from "jszip"

export async function downloadFile(fileId: string) {
  const file = await fileSystem.getFile(fileId)
  if (!file || file.type !== "file" || file.content === undefined) {
    throw new Error("File not found or invalid")
  }

  const blob = new Blob([file.content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadProject() {
  const zip = new JSZip()
  const files = await fileSystem.getAllFiles()

  const buildPath = (file: FileNode, allFiles: FileNode[]): string => {
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

  files.forEach((file) => {
    if (file.type === "file" && file.content !== undefined) {
      const path = buildPath(file, files)
      zip.file(path, file.content)
    }
  })

  const blob = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "mobilestudio-project.zip"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function uploadFile(file: File, parentId: string | null = null): Promise<FileNode> {
  const content = await file.text()
  const newFile = await fileSystem.createFile(file.name, parentId, content)
  return newFile
}

export async function uploadFiles(files: FileList, parentId: string | null = null): Promise<FileNode[]> {
  const uploadedFiles: FileNode[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    try {
      const uploaded = await uploadFile(file, parentId)
      uploadedFiles.push(uploaded)
    } catch (error) {
      console.error(`[v0] Failed to upload ${file.name}:`, error)
    }
  }

  return uploadedFiles
}

export async function uploadZip(file: File): Promise<void> {
  const zip = new JSZip()
  const contents = await zip.loadAsync(file)

  await fileSystem.clearAll()

  const processZipEntry = async (relativePath: string, zipEntry: JSZip.JSZipObject) => {
    if (zipEntry.dir) {
      const parts = relativePath.split("/").filter(Boolean)
      let currentParentId: string | null = null

      for (const part of parts) {
        const allFiles = await fileSystem.getAllFiles()
        const existing = allFiles.find((f) => f.name === part && f.parentId === currentParentId)

        if (existing) {
          currentParentId = existing.id
        } else {
          const folder = await fileSystem.createFolder(part, currentParentId)
          currentParentId = folder.id
        }
      }
    } else {
      const content = await zipEntry.async("text")
      const parts = relativePath.split("/")
      const fileName = parts.pop()!
      const folderParts = parts.filter(Boolean)

      let parentId: string | null = null
      if (folderParts.length > 0) {
        const allFiles = await fileSystem.getAllFiles()

        for (const part of folderParts) {
          const existing = allFiles.find((f) => f.name === part && f.parentId === parentId)
          if (existing) {
            parentId = existing.id
          } else {
            const folder = await fileSystem.createFolder(part, parentId)
            parentId = folder.id
          }
        }
      }

      await fileSystem.createFile(fileName, parentId, content)
    }
  }

  const entries = Object.keys(contents.files).sort()
  for (const relativePath of entries) {
    await processZipEntry(relativePath, contents.files[relativePath])
  }
}
