export interface Project {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  description?: string
}

const PROJECTS_KEY = "mobilestudio_projects"
const CURRENT_PROJECT_KEY = "mobilestudio_current_project"
const PROJECT_DATA_PREFIX = "mobilestudio_project_data_"

class ProjectManager {
  async getAllProjects(): Promise<Project[]> {
    const stored = localStorage.getItem(PROJECTS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  }

  async getCurrentProjectId(): Promise<string | null> {
    return localStorage.getItem(CURRENT_PROJECT_KEY)
  }

  async setCurrentProject(projectId: string) {
    localStorage.setItem(CURRENT_PROJECT_KEY, projectId)
  }

  async createProject(name: string, description?: string): Promise<Project> {
    const projects = await this.getAllProjects()
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    projects.push(newProject)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    return newProject
  }

  async updateProject(id: string, updates: Partial<Pick<Project, "name" | "description">>) {
    const projects = await this.getAllProjects()
    const index = projects.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: Date.now(),
      }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    }
  }

  async deleteProject(id: string) {
    const projects = await this.getAllProjects()
    const filtered = projects.filter((p) => p.id !== id)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered))

    // Delete project data from IndexedDB
    const dbName = `${PROJECT_DATA_PREFIX}${id}`
    indexedDB.deleteDatabase(dbName)

    // If this was the current project, clear it
    const currentId = await this.getCurrentProjectId()
    if (currentId === id) {
      localStorage.removeItem(CURRENT_PROJECT_KEY)
    }
  }

  async duplicateProject(id: string): Promise<Project> {
    const projects = await this.getAllProjects()
    const original = projects.find((p) => p.id === id)
    if (!original) {
      throw new Error("Project not found")
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: `${original.name} (Copy)`,
      description: original.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    projects.push(newProject)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))

    // Copy project data in IndexedDB
    const originalDbName = `${PROJECT_DATA_PREFIX}${id}`
    const newDbName = `${PROJECT_DATA_PREFIX}${newProject.id}`

    return new Promise((resolve, reject) => {
      const openOriginal = indexedDB.open(originalDbName, 1)
      openOriginal.onsuccess = () => {
        const originalDb = openOriginal.result
        const openNew = indexedDB.open(newDbName, 1)

        openNew.onupgradeneeded = () => {
          const newDb = openNew.result
          if (!newDb.objectStoreNames.contains("files")) {
            newDb.createObjectStore("files", { keyPath: "id" })
          }
        }

        openNew.onsuccess = () => {
          const newDb = openNew.result
          const tx = originalDb.transaction(["files"], "readonly")
          const store = tx.objectStore("files")
          const getAllRequest = store.getAll()

          getAllRequest.onsuccess = () => {
            const files = getAllRequest.result
            const newTx = newDb.transaction(["files"], "readwrite")
            const newStore = newTx.objectStore("files")

            files.forEach((file) => {
              newStore.add(file)
            })

            newTx.oncomplete = () => {
              newDb.close()
              originalDb.close()
              resolve(newProject)
            }
          }
        }

        openNew.onerror = () => reject(openNew.error)
      }

      openOriginal.onerror = () => reject(openOriginal.error)
    })
  }

  getProjectDatabaseName(projectId: string): string {
    return `${PROJECT_DATA_PREFIX}${projectId}`
  }
}

export const projectManager = new ProjectManager()
