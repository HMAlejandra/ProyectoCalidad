"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sparkles, PlayCircle } from "lucide-react"

interface HomeViewProps {
  onSelectModule: (module: string) => void
}

export default function HomeView({ onSelectModule }: HomeViewProps) {
  const [floatingItems, setFloatingItems] = useState<Array<{ id: number; x: number; y: number; rotation: number }>>([])
  const [particleTrail, setParticleTrail] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])

  useEffect(() => {
    const items = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
    }))
    setFloatingItems(items)

    const interval = setInterval(() => {
      setFloatingItems((prev) =>
        prev.map((item) => ({
          ...item,
          x: (item.x + (Math.random() - 0.5) * 0.8) % 100,
          y: (item.y + (Math.random() - 0.5) * 0.8) % 100,
          rotation: item.rotation + Math.random() * 2,
        })),
      )
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const particle = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      opacity: 1,
    }

    setParticleTrail((prev) => {
      const updated = [...prev, particle]
      return updated.slice(-20)
    })
  }

  const modules = [
    {
      id: "pintura",
      label: "Pintura 3D",
      emoji: "🎨",
      description: "¡Crea arte digital mágico!",
      color: "from-pink-300 to-purple-300",
    },
    {
      id: "sistema-solar",
      label: "Sistema Solar",
      emoji: "🪐",
      description: "¡Explora el universo!",
      color: "from-blue-300 to-cyan-300",
    },
    {
      id: "escultura",
      label: "Escultura 3D",
      emoji: "🎭",
      description: "¡Moldea y crea!",
      color: "from-purple-300 to-pink-300",
    },
  ]

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-yellow-200 via-pink-100 to-blue-100 flex flex-col items-center justify-center px-4 py-8 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {particleTrail.map((particle) => (
        <div
          key={particle.id}
          className="fixed w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity * 0.5,
            animation: `fadeOut 0.8s ease-out forwards`,
            zIndex: 1,
          }}
        />
      ))}

      {floatingItems.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: `float 8s ease-in-out infinite`,
            zIndex: 0,
          }}
        >
          <div
            className="text-5xl drop-shadow-lg"
            style={{
              transform: `rotate(${item.rotation}deg)`,
              transition: "all 0.3s ease-out",
            }}
          >
            {["✨", "🌟", "💫", "⭐", "🎨", "🎭", "🪐", "🚀"][item.id % 8]}
          </div>
        </div>
      ))}

      <div className="relative z-20 text-center max-w-5xl w-full">
        {/* Título animado muy grande y visible */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg text-balance">
              ¡Mentes Creativas!
            </h1>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🎉</span>
            </div>
          </div>
        </div>

        {/* Subtítulos grandes y claros */}
        <p className="text-3xl sm:text-4xl lg:text-5xl text-purple-600 font-black mb-6 drop-shadow-md text-balance">
          🌈 Aprende, Crea y Diviértete 🌈
        </p>
        <p className="text-xl sm:text-2xl lg:text-3xl text-purple-500 font-bold mb-12 drop-shadow-md text-balance">
          Elige una actividad para comenzar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full">
          {modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`group relative bg-gradient-to-br ${module.color} rounded-3xl p-10 shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl active:scale-95 transform cursor-pointer animate-fade-in min-h-64 flex flex-col items-center justify-center`}
              style={{
                animationDelay: `${index * 0.1}s`,
                zIndex: 30,
              }}
            >
              {/* Brillo de fondo */}
              <div className="absolute inset-0 rounded-3xl bg-white opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" />

              {/* Contenido */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-8xl sm:text-9xl mb-6 animate-float-gentle">{module.emoji}</div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-lg mb-3 text-balance">
                  {module.label}
                </h2>
                <p className="text-lg sm:text-xl text-white/95 font-bold drop-shadow-md mb-6 text-balance">
                  {module.description}
                </p>

                {/* Botón interno */}
                <div className="mt-4 flex items-center gap-3 text-white font-black text-lg bg-white/30 px-6 py-3 rounded-2xl">
                  <PlayCircle className="w-6 h-6" />
                  <span>¡Empezar!</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto mb-12 z-20 relative">
          <h3 className="text-3xl sm:text-4xl font-black text-purple-600 mb-6 text-balance">¿Listo para crear?</h3>
          <p className="text-lg sm:text-xl lg:text-2xl text-purple-600 mb-8 leading-relaxed font-bold text-balance">
            En Mentes Creativas puedes dibujar, pintar, explorar el sistema solar y esculpir en 3D.
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl text-purple-700 font-black mb-8 text-balance">
            ¡Cada actividad está diseñada para que aprendas mientras te diviertes! 🚀
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={() => onSelectModule("pintura")}
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-5 rounded-2xl font-black text-lg sm:text-xl shadow-lg hover:scale-110 transition-all flex items-center gap-3 hover:shadow-2xl"
            >
              <span className="text-2xl">🎨</span>
              <span>Pintura</span>
            </button>
            <button
              onClick={() => onSelectModule("sistema-solar")}
              className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-5 rounded-2xl font-black text-lg sm:text-xl shadow-lg hover:scale-110 transition-all flex items-center gap-3 hover:shadow-2xl"
            >
              <span className="text-2xl">🪐</span>
              <span>Sistema Solar</span>
            </button>
            <button
              onClick={() => onSelectModule("escultura")}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-5 rounded-2xl font-black text-lg sm:text-xl shadow-lg hover:scale-110 transition-all flex items-center gap-3 hover:shadow-2xl"
            >
              <span className="text-2xl">🎭</span>
              <span>Escultura</span>
            </button>
          </div>
        </div>

        <div className="text-center text-purple-700 font-black text-2xl sm:text-3xl z-20 relative drop-shadow-lg text-balance">
          💡 ¡Mueve tu mouse para ver efectos mágicos!
        </div>
      </div>

      {/* Estilos globales */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: scale(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
