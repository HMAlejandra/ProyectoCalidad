"use client"

import { useState } from "react"
import { Sparkles, Paintbrush as PaintBrush, Globe, Wand2, Home, Menu, X } from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const modules = [
    { id: "home", label: "Inicio", icon: Home, color: "from-yellow-300 to-orange-300" },
    { id: "pintura", label: "Pintura 3D", icon: PaintBrush, color: "from-pink-300 to-purple-300" },
    { id: "sistema-solar", label: "Sistema Solar", icon: Globe, color: "from-blue-300 to-cyan-300" },
    { id: "escultura", label: "Escultura 3D", icon: Wand2, color: "from-purple-300 to-pink-300" },
  ]

  return (
    <>
      {/* Botón de toggle para móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-purple-200 via-pink-100 to-blue-100 shadow-2xl transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full p-3 pt-12 lg:pt-4 gap-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div className="text-left min-w-0">
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  Mentes
                </h1>
                <p className="text-xs text-purple-500 font-semibold truncate">Creativas</p>
              </div>
            )}
          </div>

          {/* Menú */}
          <nav className="flex-1 space-y-2">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  onClick={() => onViewChange(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                    activeView === module.id
                      ? `bg-gradient-to-r ${module.color} text-white shadow-lg scale-105`
                      : "bg-white/60 text-gray-700 hover:bg-white/80 hover:shadow-md"
                  }`}
                  title={module.label}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  {isOpen && <span className="font-semibold text-sm whitespace-nowrap">{module.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Footer info */}
          {isOpen && (
            <div className="bg-white/50 rounded-2xl p-3 text-center text-xs text-purple-600 font-medium flex-shrink-0">
              🎨 Aprende, crea y diviértete
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
