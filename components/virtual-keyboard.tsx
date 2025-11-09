"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  onClose: () => void
}

export function VirtualKeyboard({ onKeyPress, onClose }: VirtualKeyboardProps) {
  const [isShiftActive, setIsShiftActive] = useState(false)
  const [showSymbols, setShowSymbols] = useState(false)

  const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  const topRowKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]
  const middleRowKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"]
  const bottomRowKeys = ["z", "x", "c", "v", "b", "n", "m"]

  // Symbol rows
  const symbolRow1 = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"]
  const symbolRow2 = ["-", "_", "=", "+", "[", "]", "{", "}", "\\", "|"]
  const symbolRow3 = [";", ":", "'", '"', ",", ".", "<", ">", "/", "?"]
  const symbolRow4 = ["`", "~"]

  const handleKeyPress = (key: string) => {
    if (isShiftActive && !showSymbols) {
      onKeyPress(key.toUpperCase())
      setIsShiftActive(false)
    } else {
      onKeyPress(key)
    }
  }

  const toggleSymbols = () => {
    setShowSymbols(!showSymbols)
    setIsShiftActive(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 p-2 shadow-2xl select-none">
      {/* Close Button */}
      <div className="flex justify-end mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-400 hover:text-white"
          onClick={onClose}
          onMouseDown={(e) => e.preventDefault()}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!showSymbols ? (
        <>
          {/* Number Row */}
          <div className="flex gap-1 mb-1 justify-center">
            {numberKeys.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => onKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {key}
              </Button>
            ))}
          </div>

          {/* Q to P Row */}
          <div className="flex gap-1 mb-1 justify-center">
            {topRowKeys.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => handleKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isShiftActive ? key.toUpperCase() : key}
              </Button>
            ))}
          </div>

          {/* A to L Row */}
          <div className="flex gap-1 mb-1 justify-center">
            {middleRowKeys.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => handleKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isShiftActive ? key.toUpperCase() : key}
              </Button>
            ))}
          </div>

          {/* SHIFT, Z to M Row */}
          <div className="flex gap-1 mb-1 justify-center items-center">
            <Button
              variant="outline"
              size="sm"
              className={`h-10 px-4 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none ${
                isShiftActive ? "bg-zinc-600" : "bg-zinc-800"
              }`}
              onClick={() => setIsShiftActive(!isShiftActive)}
              onMouseDown={(e) => e.preventDefault()}
            >
              ⇧ SHIFT
            </Button>
            {bottomRowKeys.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => handleKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isShiftActive ? key.toUpperCase() : key}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress("BACKSPACE")}
              onMouseDown={(e) => e.preventDefault()}
            >
              ⌫
            </Button>
          </div>

          {/* Bottom Control Row */}
          <div className="flex gap-1 justify-center items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={toggleSymbols}
              onMouseDown={(e) => e.preventDefault()}
            >
              123
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress("\t")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 flex-1 max-w-[250px] bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress(" ")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Space
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress("\n")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Enter
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Number Row */}
          <div className="flex gap-1 mb-1 justify-center">
            {numberKeys.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => onKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
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
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => onKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
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
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => onKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
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
                className="h-10 min-w-[2.5rem] px-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => onKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {key}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress("BACKSPACE")}
              onMouseDown={(e) => e.preventDefault()}
            >
              ⌫
            </Button>
          </div>

          {/* Bottom Control Row */}
          <div className="flex gap-1 justify-center items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={toggleSymbols}
              onMouseDown={(e) => e.preventDefault()}
            >
              ABC
            </Button>
            {symbolRow4.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-10 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
                onClick={() => onKeyPress(key)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {key}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-10 flex-1 max-w-[200px] bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress(" ")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Space
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress("\t")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600 text-white select-none"
              onClick={() => onKeyPress("\n")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Enter
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
