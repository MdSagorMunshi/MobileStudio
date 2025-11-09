"use client"

import { useState, useEffect } from "react"
import { X, Palette, Code, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { settingsStore, type Settings } from "@/lib/settings-store"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<Settings>(settingsStore.getSettings())

  useEffect(() => {
    settingsStore.init()
    setSettings(settingsStore.getSettings())
  }, [])

  const handleSettingChange = async (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    await settingsStore.updateSettings({ [key]: value })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Appearance */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-blue-500" />
              <h3 className="text-base font-semibold">Appearance</h3>
            </div>
            <div className="space-y-4 pl-7">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="hacker">Hacker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Editor */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-blue-500" />
              <h3 className="text-base font-semibold">Editor</h3>
            </div>
            <div className="space-y-6 pl-7">
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
                <Slider
                  id="fontSize"
                  min={10}
                  max={24}
                  step={1}
                  value={[settings.fontSize]}
                  onValueChange={([value]) => handleSettingChange("fontSize", value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange("fontFamily", value)}>
                  <SelectTrigger id="fontFamily" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                    <SelectItem value="'Fira Code', monospace">Fira Code</SelectItem>
                    <SelectItem value="'JetBrains Mono', monospace">JetBrains Mono</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tabSize">Tab Size: {settings.tabSize} spaces</Label>
                <Slider
                  id="tabSize"
                  min={2}
                  max={8}
                  step={2}
                  value={[settings.tabSize]}
                  onValueChange={([value]) => handleSettingChange("tabSize", value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="wordWrap">Word Wrap</Label>
                <Switch
                  id="wordWrap"
                  checked={settings.wordWrap}
                  onCheckedChange={(checked) => handleSettingChange("wordWrap", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lineNumbers">Line Numbers</Label>
                <Switch
                  id="lineNumbers"
                  checked={settings.lineNumbers}
                  onCheckedChange={(checked) => handleSettingChange("lineNumbers", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="minimap">Minimap</Label>
                <Switch
                  id="minimap"
                  checked={settings.minimap}
                  onCheckedChange={(checked) => handleSettingChange("minimap", checked)}
                />
              </div>
            </div>
          </section>

          {/* General */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Save className="h-5 w-5 text-blue-500" />
              <h3 className="text-base font-semibold">General</h3>
            </div>
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">Auto Save</Label>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
