import React from "react"
import { Link } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white text-gray-900">
      <a href="#main" className="sr-only focus:not-sr-only p-2">
        Ir al contenido principal
      </a>

      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl flex items-center justify-center shadow">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <Link to="/" className="font-bold text-lg text-purple-700">
                Mentes Creativas
              </Link>
              <div className="text-xs text-gray-500">Módulos interactivos</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-white/60">
              Inicio
            </Link>
            <Link to="/sistema-solar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-white/60">
              Sistema Solar
            </Link>
            <Link to="/pintura3d" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-white/60">
              Pintura 3D
            </Link>
            <Link to="/escultura3d" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-white/60">
              Escultura
            </Link>
          </nav>
        </div>
      </header>

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
