type Theme = "dark" | "light" | "hacker"

interface Settings {
  theme: Theme
  fontSize: number
  fontFamily: string
  tabSize: number
  wordWrap: boolean
  minimap: boolean
  lineNumbers: boolean
  autoSave: boolean
  keyboardMode: "external" | "builtin"
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  fontSize: 14,
  fontFamily: "monospace",
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  lineNumbers: true,
  autoSave: true,
  keyboardMode: "external",
}

class SettingsStore {
  private settings: Settings = DEFAULT_SETTINGS

  async init() {
    const stored = localStorage.getItem("mobilestudio-settings")
    if (stored) {
      this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
    this.applyTheme(this.settings.theme)
  }

  getSettings(): Settings {
    return { ...this.settings }
  }

  async updateSettings(updates: Partial<Settings>) {
    this.settings = { ...this.settings, ...updates }
    localStorage.setItem("mobilestudio-settings", JSON.stringify(this.settings))

    if (updates.theme) {
      this.applyTheme(updates.theme)
    }
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement
    root.classList.remove("dark", "light", "hacker")
    root.classList.add(theme)
  }
}

export const settingsStore = new SettingsStore()
export type { Settings, Theme }
