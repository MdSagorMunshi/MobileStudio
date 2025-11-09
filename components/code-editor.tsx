"use client"

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { settingsStore } from "@/lib/settings-store"
import type { SearchOptions } from "./search-panel"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  readOnly?: boolean
}

export interface CodeEditorRef {
  search: (query: string, options: SearchOptions) => void
  replace: (replaceText: string) => void
  replaceAll: (replaceText: string) => void
  findNext: () => void
  findPrevious: () => void
  getMatchCount: () => number
  getCurrentMatchIndex: () => number
  formatDocument: () => void
  insertText: (text: string) => void
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(
  ({ value, onChange, language, readOnly = false }, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const matchCountRef = useRef(0)
    const currentMatchRef = useRef(0)

    useImperativeHandle(ref, () => ({
      search: (query: string, options: SearchOptions) => {
        if (!editorRef.current || !query) return

        const model = editorRef.current.getModel()
        if (!model) return

        const matches = model.findMatches(
          query,
          true,
          options.regex,
          options.caseSensitive,
          options.wholeWord ? query : null,
          true,
        )

        matchCountRef.current = matches.length
        currentMatchRef.current = matches.length > 0 ? 1 : 0

        if (matches.length > 0) {
          editorRef.current.setSelection(matches[0].range)
          editorRef.current.revealRangeInCenter(matches[0].range)
        }
      },
      replace: (replaceText: string) => {
        if (!editorRef.current) return
        const selection = editorRef.current.getSelection()
        if (selection) {
          editorRef.current.executeEdits("", [
            {
              range: selection,
              text: replaceText,
            },
          ])
        }
      },
      replaceAll: (replaceText: string) => {
        if (!editorRef.current) return
        const model = editorRef.current.getModel()
        if (!model) return

        const selection = editorRef.current.getSelection()
        if (!selection) return

        const searchText = model.getValueInRange(selection)
        const fullText = model.getValue()
        const newText = fullText.replace(new RegExp(searchText, "g"), replaceText)

        editorRef.current.setValue(newText)
      },
      findNext: () => {
        if (!editorRef.current) return
        editorRef.current.trigger("", "editor.action.nextMatchFindAction", null)
        if (matchCountRef.current > 0) {
          currentMatchRef.current = (currentMatchRef.current % matchCountRef.current) + 1
        }
      },
      findPrevious: () => {
        if (!editorRef.current) return
        editorRef.current.trigger("", "editor.action.previousMatchFindAction", null)
        if (matchCountRef.current > 0) {
          currentMatchRef.current = currentMatchRef.current === 1 ? matchCountRef.current : currentMatchRef.current - 1
        }
      },
      getMatchCount: () => matchCountRef.current,
      getCurrentMatchIndex: () => currentMatchRef.current,
      formatDocument: () => {
        if (!editorRef.current) return
        editorRef.current.trigger("", "editor.action.formatDocument", null)
      },
      insertText: (text: string) => {
        if (!editorRef.current) return

        if (text === "BACKSPACE") {
          const position = editorRef.current.getPosition()
          if (position) {
            const model = editorRef.current.getModel()
            if (model) {
              const range = {
                startLineNumber: position.lineNumber,
                startColumn: Math.max(1, position.column - 1),
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              }
              editorRef.current.executeEdits("", [{ range, text: "" }])
            }
          }
        } else {
          editorRef.current.trigger("keyboard", "type", { text })
        }
      },
    }))

    useEffect(() => {
      const updateEditorSettings = () => {
        if (editorRef.current) {
          const settings = settingsStore.getSettings()
          editorRef.current.updateOptions({
            fontSize: settings.fontSize,
            fontFamily: settings.fontFamily,
            tabSize: settings.tabSize,
            wordWrap: settings.wordWrap ? "on" : "off",
            minimap: { enabled: settings.minimap },
            lineNumbers: settings.lineNumbers ? "on" : "off",
          })
        }
      }

      const interval = setInterval(updateEditorSettings, 100)
      return () => clearInterval(interval)
    }, [])

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editorRef.current = editor

      const settings = settingsStore.getSettings()

      editor.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        lineHeight: 20,
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers ? "on" : "off",
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        wordWrap: settings.wordWrap ? "on" : "off",
        wrappingStrategy: "advanced",
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "all",
        renderWhitespace: "selection",
        bracketPairColorization: {
          enabled: true,
        },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: "never",
          seedSearchStringFromSelection: "selection",
        },
        formatOnPaste: true,
        formatOnType: true,
      })

      monaco.editor.defineTheme("mobilestudio-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6B7280", fontStyle: "italic" },
          { token: "keyword", foreground: "60A5FA" },
          { token: "string", foreground: "34D399" },
          { token: "number", foreground: "F59E0B" },
          { token: "type", foreground: "A78BFA" },
          { token: "function", foreground: "60A5FA" },
          { token: "variable", foreground: "E5E7EB" },
          { token: "constant", foreground: "F59E0B" },
          { token: "operator", foreground: "60A5FA" },
          { token: "tag", foreground: "60A5FA" },
          { token: "attribute.name", foreground: "A78BFA" },
          { token: "attribute.value", foreground: "34D399" },
        ],
        colors: {
          "editor.background": "#000000",
          "editor.foreground": "#E5E7EB",
          "editor.lineHighlightBackground": "#18181B",
          "editor.selectionBackground": "#1E3A8A",
          "editor.inactiveSelectionBackground": "#1E293B",
          "editorCursor.foreground": "#60A5FA",
          "editorLineNumber.foreground": "#52525B",
          "editorLineNumber.activeForeground": "#A1A1AA",
          "editorIndentGuide.background": "#27272A",
          "editorIndentGuide.activeBackground": "#3F3F46",
          "editorWhitespace.foreground": "#27272A",
          "editorBracketMatch.background": "#1E3A8A",
          "editorBracketMatch.border": "#60A5FA",
          "editor.findMatchBackground": "#1E3A8A",
          "editor.findMatchHighlightBackground": "#1E40AF50",
          "editor.findRangeHighlightBackground": "#1E293B",
        },
      })

      monaco.editor.defineTheme("mobilestudio-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6B7280", fontStyle: "italic" },
          { token: "keyword", foreground: "2563EB" },
          { token: "string", foreground: "059669" },
          { token: "number", foreground: "D97706" },
          { token: "type", foreground: "7C3AED" },
          { token: "function", foreground: "2563EB" },
          { token: "variable", foreground: "1F2937" },
          { token: "constant", foreground: "D97706" },
          { token: "operator", foreground: "2563EB" },
          { token: "tag", foreground: "2563EB" },
          { token: "attribute.name", foreground: "7C3AED" },
          { token: "attribute.value", foreground: "059669" },
        ],
        colors: {
          "editor.background": "#FFFFFF",
          "editor.foreground": "#1F2937",
          "editor.lineHighlightBackground": "#F9FAFB",
          "editor.selectionBackground": "#DBEAFE",
          "editor.inactiveSelectionBackground": "#F3F4F6",
          "editorCursor.foreground": "#2563EB",
          "editorLineNumber.foreground": "#9CA3AF",
          "editorLineNumber.activeForeground": "#6B7280",
          "editorIndentGuide.background": "#E5E7EB",
          "editorIndentGuide.activeBackground": "#D1D5DB",
          "editorWhitespace.foreground": "#E5E7EB",
          "editorBracketMatch.background": "#DBEAFE",
          "editorBracketMatch.border": "#2563EB",
          "editor.findMatchBackground": "#DBEAFE",
          "editor.findMatchHighlightBackground": "#BFDBFE50",
          "editor.findRangeHighlightBackground": "#F3F4F6",
        },
      })

      monaco.editor.defineTheme("mobilestudio-hacker", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "4ADE80", fontStyle: "italic" },
          { token: "keyword", foreground: "22D3EE" },
          { token: "string", foreground: "4ADE80" },
          { token: "number", foreground: "FDE047" },
          { token: "type", foreground: "A3E635" },
          { token: "function", foreground: "22D3EE" },
          { token: "variable", foreground: "86EFAC" },
          { token: "constant", foreground: "FDE047" },
          { token: "operator", foreground: "22D3EE" },
          { token: "tag", foreground: "22D3EE" },
          { token: "attribute.name", foreground: "A3E635" },
          { token: "attribute.value", foreground: "4ADE80" },
        ],
        colors: {
          "editor.background": "#0C0C0C",
          "editor.foreground": "#86EFAC",
          "editor.lineHighlightBackground": "#14532D",
          "editor.selectionBackground": "#065F46",
          "editor.inactiveSelectionBackground": "#14532D",
          "editorCursor.foreground": "#22D3EE",
          "editorLineNumber.foreground": "#166534",
          "editorLineNumber.activeForeground": "#22C55E",
          "editorIndentGuide.background": "#14532D",
          "editorIndentGuide.activeBackground": "#166534",
          "editorWhitespace.foreground": "#14532D",
          "editorBracketMatch.background": "#065F46",
          "editorBracketMatch.border": "#22D3EE",
          "editor.findMatchBackground": "#065F46",
          "editor.findMatchHighlightBackground": "#14532D",
          "editor.findRangeHighlightBackground": "#14532D",
        },
      })

      const theme =
        settings.theme === "light"
          ? "mobilestudio-light"
          : settings.theme === "hacker"
            ? "mobilestudio-hacker"
            : "mobilestudio-dark"
      monaco.editor.setTheme(theme)
    }

    const handleChange = (value: string | undefined) => {
      onChange(value || "")
    }

    return (
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="mobilestudio-dark"
        options={{
          readOnly,
          domReadOnly: readOnly,
        }}
        loading={
          <div className="flex h-full items-center justify-center bg-black text-zinc-500">
            <div className="text-center">
              <div className="mb-2 text-sm">Loading editor...</div>
            </div>
          </div>
        }
      />
    )
  },
)

CodeEditor.displayName = "CodeEditor"
