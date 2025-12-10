"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type SlideOverProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
  width?: string
}

export default function SlideOver({ isOpen, onClose, title, children, width = "520px" }: SlideOverProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    // trap focus to container (basic)
    const prev = document.activeElement as HTMLElement | null
    containerRef.current?.focus()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
      prev?.focus?.()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end md:items-center justify-center md:justify-end bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 h-[80vh] md:h-auto overflow-auto rounded-t-xl md:rounded-l-xl p-6 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "dialog"}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                {title && <h3 className="text-xl font-bold">{title}</h3>}
              </div>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onClose} aria-label="Close slide over">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
