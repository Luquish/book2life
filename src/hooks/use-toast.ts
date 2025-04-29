"use client"

// Adapted from shadcn/ui toast hook
import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type Toast = ToastProps & {
  id: string
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        description,
        variant,
        duration,
        visible: true,
      },
    ])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)))

      // Remove from array after animation
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
      }, 300)
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)))

    // Remove from array after animation
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
    }, 300)
  }, [])

  // Add toast component to the DOM
  useEffect(() => {
    if (typeof document === "undefined") return

    if (document.getElementById("toast-container")) return

    const toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
    document.body.appendChild(toastContainer)

    return () => {
      if (document.getElementById("toast-container")) {
        document.body.removeChild(toastContainer)
      }
    }
  }, [])

  // Render toasts
  useEffect(() => {
    const toastContainer = document.getElementById("toast-container")
    if (!toastContainer) return

    // Clear container
    toastContainer.innerHTML = ""

    // Add toasts
    toasts.forEach((t) => {
      const toast = document.createElement("div")
      toast.className = `
        p-4 rounded-lg shadow-lg transition-all duration-300 transform 
        ${t.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${t.variant === "destructive" ? "bg-red-600 text-white" : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"}
      `

      const content = document.createElement("div")

      if (t.title) {
        const title = document.createElement("div")
        title.className = "font-medium"
        title.textContent = t.title
        content.appendChild(title)
      }

      if (t.description) {
        const description = document.createElement("div")
        description.className = "text-sm"
        description.textContent = t.description
        content.appendChild(description)
      }

      toast.appendChild(content)

      // Close button
      const closeButton = document.createElement("button")
      closeButton.className = "absolute top-1 right-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      closeButton.innerHTML = "×"
      closeButton.onclick = () => dismiss(t.id)
      toast.appendChild(closeButton)

      toast.style.position = "relative"
      toastContainer.appendChild(toast)
    })
  }, [toasts, dismiss])

  return { toast, dismiss }
}
