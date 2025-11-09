"use client"

import { useEffect, useRef } from "react"

interface TouchGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  threshold?: number
}

export function useTouchGestures(options: TouchGestureOptions) {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, threshold = 50 } = options

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const touchesRef = useRef<Touch[]>([])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      } else if (e.touches.length === 2) {
        touchesRef.current = Array.from(e.touches)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchesRef.current.length === 2 && onPinch) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const prevTouch1 = touchesRef.current[0]
        const prevTouch2 = touchesRef.current[1]

        const prevDistance = Math.hypot(
          prevTouch2.clientX - prevTouch1.clientX,
          prevTouch2.clientY - prevTouch1.clientY,
        )
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

        const scale = currentDistance / prevDistance
        onPinch(scale)

        touchesRef.current = Array.from(e.touches)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) return

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }

      const deltaX = touchEnd.x - touchStartRef.current.x
      const deltaY = touchEnd.y - touchStartRef.current.y

      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      if (absDeltaX > threshold || absDeltaY > threshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }

      touchStartRef.current = null
      touchesRef.current = []
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, threshold])
}
