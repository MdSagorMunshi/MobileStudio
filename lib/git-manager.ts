// Git operations using isomorphic-git

import git from "isomorphic-git"

const DB_NAME = "mobilestudio-git"
const DB_VERSION = 1

interface GitConfig {
  name: string
  email: string
}

class GitManager {
  private fs: any
  private dir = "/project"

  async init() {
    // Use IndexedDB as filesystem for isomorphic-git
    const { default: LightningFS } = await import("@isomorphic-git/lightning-fs")
    this.fs = new LightningFS(DB_NAME)
  }

  async initRepo() {
    if (!this.fs) await this.init()

    try {
      await git.init({ fs: this.fs, dir: this.dir, defaultBranch: "main" })
      console.log("[v0] Git repository initialized")
    } catch (error) {
      console.error("[v0] Failed to initialize git repo:", error)
      throw error
    }
  }

  async getStatus() {
    if (!this.fs) await this.init()

    try {
      const status = await git.statusMatrix({ fs: this.fs, dir: this.dir })
      return status.map(([filepath, headStatus, workdirStatus, stageStatus]) => ({
        filepath,
        status: this.getFileStatus(headStatus, workdirStatus, stageStatus),
      }))
    } catch (error) {
      console.error("[v0] Failed to get git status:", error)
      return []
    }
  }

  private getFileStatus(head: number, workdir: number, stage: number): string {
    // Status codes: 0 = absent, 1 = present, 2 = modified
    if (head === 0 && workdir === 1 && stage === 0) return "untracked"
    if (head === 1 && workdir === 2 && stage === 1) return "modified"
    if (head === 1 && workdir === 0 && stage === 1) return "deleted"
    if (head === 0 && workdir === 1 && stage === 1) return "added"
    if (head === 1 && workdir === 1 && stage === 1) return "unchanged"
    return "unknown"
  }

  async add(filepath: string) {
    if (!this.fs) await this.init()

    try {
      await git.add({ fs: this.fs, dir: this.dir, filepath })
      console.log("[v0] Added file to staging:", filepath)
    } catch (error) {
      console.error("[v0] Failed to add file:", error)
      throw error
    }
  }

  async addAll() {
    if (!this.fs) await this.init()

    try {
      const status = await this.getStatus()
      for (const file of status) {
        if (file.status !== "unchanged") {
          await git.add({ fs: this.fs, dir: this.dir, filepath: file.filepath })
        }
      }
      console.log("[v0] Added all files to staging")
    } catch (error) {
      console.error("[v0] Failed to add all files:", error)
      throw error
    }
  }

  async commit(message: string, config: GitConfig) {
    if (!this.fs) await this.init()

    try {
      const sha = await git.commit({
        fs: this.fs,
        dir: this.dir,
        message,
        author: {
          name: config.name,
          email: config.email,
        },
      })
      console.log("[v0] Committed with SHA:", sha)
      return sha
    } catch (error) {
      console.error("[v0] Failed to commit:", error)
      throw error
    }
  }

  async log(depth = 10) {
    if (!this.fs) await this.init()

    try {
      const commits = await git.log({ fs: this.fs, dir: this.dir, depth })
      return commits.map((commit) => ({
        oid: commit.oid,
        message: commit.commit.message,
        author: commit.commit.author.name,
        timestamp: commit.commit.author.timestamp,
      }))
    } catch (error) {
      console.error("[v0] Failed to get log:", error)
      return []
    }
  }

  async getCurrentBranch() {
    if (!this.fs) await this.init()

    try {
      const branch = await git.currentBranch({ fs: this.fs, dir: this.dir })
      return branch || "main"
    } catch (error) {
      console.error("[v0] Failed to get current branch:", error)
      return "main"
    }
  }

  async listBranches() {
    if (!this.fs) await this.init()

    try {
      const branches = await git.listBranches({ fs: this.fs, dir: this.dir })
      return branches
    } catch (error) {
      console.error("[v0] Failed to list branches:", error)
      return []
    }
  }

  async createBranch(name: string) {
    if (!this.fs) await this.init()

    try {
      await git.branch({ fs: this.fs, dir: this.dir, ref: name })
      console.log("[v0] Created branch:", name)
    } catch (error) {
      console.error("[v0] Failed to create branch:", error)
      throw error
    }
  }

  async checkout(ref: string) {
    if (!this.fs) await this.init()

    try {
      await git.checkout({ fs: this.fs, dir: this.dir, ref })
      console.log("[v0] Checked out:", ref)
    } catch (error) {
      console.error("[v0] Failed to checkout:", error)
      throw error
    }
  }
}

export const gitManager = new GitManager()
