"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  onClose: () => void
}

export function VirtualKeyboard({ onKeyPress, onClose }: VirtualKeyboardProps) {
  const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  const topRowKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
  const middleRowKeys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
  const bottomRowKeys = ["Z", "X", "C", "V", "B", "N", "M"]

  const symbolRow1 = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"]
  const symbolRow2 = ["-", "_", "=", "+", "[", "]", "{", "}", "\\", "|"]
  const symbolRow3 = [";", ":", "'", '"', ",", ".", "<", ">", "/", "?"]
  const specialKeys = ["`", "~", " ", "Tab", "Enter", "Backspace"]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 p-2 shadow-2xl">
      {/* Close Button */}
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Number Row */}
      <div className="flex gap-1 mb-1 justify-center">
        {numberKeys.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Symbol Row 1 */}
      <div className="flex gap-1 mb-1 justify-center">
        {symbolRow1.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Top Letter Row */}
      <div className="flex gap-1 mb-1 justify-center">
        {topRowKeys.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Symbol Row 2 */}
      <div className="flex gap-1 mb-1 justify-center">
        {symbolRow2.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Middle Letter Row */}
      <div className="flex gap-1 mb-1 justify-center">
        {middleRowKeys.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Symbol Row 3 */}
      <div className="flex gap-1 mb-1 justify-center">
        {symbolRow3.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Bottom Letter Row */}
      <div className="flex gap-1 mb-1 justify-center">
        {bottomRowKeys.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-9 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
            onClick={() => onKeyPress(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Special Keys Row */}
      <div className="flex gap-1 justify-center flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
          onClick={() => onKeyPress("`")}
        >
          `
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
          onClick={() => onKeyPress("~")}
        >
          ~
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 flex-1 max-w-[200px] bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
          onClick={() => onKeyPress(" ")}
        >
          Space
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
          onClick={() => onKeyPress("\t")}
        >
          Tab
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
          onClick={() => onKeyPress("\n")}
        >
          Enter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white"
          onClick={() => onKeyPress("BACKSPACE")}
        >
          ⌫
        </Button>
      </div>
    </div>
  )
}
