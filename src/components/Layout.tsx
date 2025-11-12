import type React from "react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white text-gray-900">
      <a href="#main" className="sr-only focus:not-sr-only p-2">
        Ir al contenido principal
      </a>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Mentes Creativas — Plataforma educativa interactiva
        </div>
      </footer>
    </div>
  )
}
