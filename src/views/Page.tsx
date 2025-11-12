"use client"

import { useState } from "react"
import Pintura3DView from "./Pintura3DPage"
import SistemaSolar3DView from "./SistemaSolar3DView"
import DigitalSculptureView from "./DigitalSculptureView"

type Component = "pintura" | "sistema-solar" | "escultura"

export default function Page() {
  const [activeComponent, setActiveComponent] = useState<Component>("pintura")

  const components = [
    {
      id: "pintura" as Component,
      name: "Pintura 3D",
      icon: "🎨",
      description: "Crea arte digital mágico",
      component: <Pintura3DView />,
    },
    {
      id: "sistema-solar" as Component,
      name: "Sistema Solar",
      icon: "🌞",
      description: "Explora el universo",
      component: <SistemaSolar3DView />,
    },
    {
      id: "escultura" as Component,
      name: "Escultura Digital",
      icon: "🎭",
      description: "Moldea en 3D",
      component: <DigitalSculptureView />,
    },
  ]

  const activeComponentData = components.find((c) => c.id === activeComponent)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      {/* Header de navegación */}
      <div className="bg-white/70 backdrop-blur-md shadow-lg shadow-purple-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Mentes Creativas
                </h1>
                <p className="text-sm text-purple-400/80 font-medium">Módulos interactivos de aprendizaje</p>
              </div>
            </div>
          </div>

          {/* Pestañas de navegación */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {components.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setActiveComponent(comp.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeComponent === comp.id
                    ? "bg-gradient-to-r from-purple-300 to-pink-300 text-white shadow-lg scale-105"
                    : "bg-white/80 text-purple-600 hover:bg-white hover:scale-105 shadow-md"
                }`}
              >
                <span className="text-xl">{comp.icon}</span>
                <div className="text-left">
                  <div className="font-bold text-sm">{comp.name}</div>
                  <div className="text-xs opacity-80">{comp.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del componente activo */}
      <div className="transition-all duration-300">{activeComponentData?.component}</div>
    </div>
  )
}
