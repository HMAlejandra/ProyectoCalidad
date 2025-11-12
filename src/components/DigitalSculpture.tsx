"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

// Tipos
type Tool = "mold" | "add" | "smooth" | "detail" | "paint" | "eraser" | null
type BrushSize = "S" | "M" | "L"
type Color = string

interface Point {
  x: number
  y: number
  tool: Tool
  color: Color
  size: BrushSize
}

export default function DigitalSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Tool>(null)
  const [selectedColor, setSelectedColor] = useState<Color>("#ef4444")
  const [brushSize] = useState<BrushSize>("M")
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [narrationActive, setNarrationActive] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const colors = ["#ef4444", "#3b82f6", "#fbbf24", "#10b981", "#a855f7"]

  // 🔊 Función para hablar
  const speak = (text: string) => {
    if (!narrationActive) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "es-ES"
    utterance.pitch = 1.2
    utterance.rate = 1
    utterance.volume = 1
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  // Auto-guardado cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (points.length > 0) {
        localStorage.setItem("sculpture-points", JSON.stringify(points))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [points])

  // Cargar progreso guardado
  useEffect(() => {
    const saved = localStorage.getItem("sculpture-points")
    if (saved) {
      try {
        setPoints(JSON.parse(saved))
      } catch {
        console.error("Error loading saved data")
      }
    }
  }, [])

  // Renderizar figura humana
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    // Transformaciones
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(zoom, zoom)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // 🧍 FIGURA HUMANA BASE

    // Piernas
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(370, 380, 25, 120)
    ctx.fillRect(405, 380, 25, 120)

    // Cuerpo
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.moveTo(360, 260)
    ctx.lineTo(440, 260)
    ctx.lineTo(460, 380)
    ctx.lineTo(340, 380)
    ctx.closePath()
    ctx.fill()

    // Brazos
    ctx.save()
    ctx.translate(400, 280)
    ctx.rotate((Math.sin((rotation * Math.PI) / 180) * 10 * Math.PI) / 180)
    ctx.fillStyle = "#fde68a"
    ctx.fillRect(-80, 0, 50, 20)
    ctx.fillRect(30, 0, 50, 20)
    ctx.restore()

    // Cuello y cabeza
    ctx.fillStyle = "#fde68a"
    ctx.fillRect(385, 250, 30, 20)
    ctx.beginPath()
    ctx.arc(400, 210, 45, 0, Math.PI * 2)
    ctx.fill()

    // Cabello
    ctx.fillStyle = "#1f2937"
    ctx.beginPath()
    ctx.arc(400, 190, 45, Math.PI, 2 * Math.PI)
    ctx.fill()

    // Ojos y sonrisa
    ctx.fillStyle = "#111"
    ctx.beginPath()
    ctx.arc(385, 210, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(415, 210, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "#111"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(400, 225, 15, 0, Math.PI, false)
    ctx.stroke()

    // Puntos (dibujos)
    points.forEach((p) => {
      const size = p.size === "S" ? 5 : p.size === "M" ? 10 : 20

      if (p.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
      } else {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    ctx.restore()
  }, [points, rotation, zoom])

  // Eventos de dibujo
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedTool) return
    setIsDrawing(true)
    addPoint(e)
    speak(`Estás usando la herramienta ${toolName(selectedTool)}.`)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !selectedTool) return
    addPoint(e)
  }

  const stopDrawing = () => setIsDrawing(false)

  const addPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPoints((p) => [...p, { x, y, tool: selectedTool, color: selectedColor, size: brushSize }])
  }

  // Conversión de nombres amigables para niños
  const toolName = (tool: Tool) => {
    switch (tool) {
      case "mold":
        return "Moldear"
      case "add":
        return "Agregar"
      case "smooth":
        return "Suavizar"
      case "detail":
        return "Detalles"
      case "paint":
        return "Pintar"
      case "eraser":
        return "Borrar"
      default:
        return "ninguna"
    }
  }

  // Guardar y reset
  const handleSave = () => {
    localStorage.setItem("sculpture-points", JSON.stringify(points))
    speak("¡Tu escultura ha sido guardada!")
  }

  const handleReset = () => {
    setPoints([])
    setRotation(0)
    setZoom(1)
    localStorage.removeItem("sculpture-points")
    speak("Tu escultura se ha borrado. Puedes comenzar una nueva.")
    setShowResetDialog(false)
  }

  const toggleNarration = () => {
    setNarrationActive(!narrationActive)
    if (!narrationActive) {
      speak(
        "¡Hola! Soy tu ayudante digital. Vamos a crear una escultura divertida en 3D. Usa las herramientas para moldear, pintar o borrar. ¡Diviértete!",
      )
    } else {
      speechSynthesis.cancel()
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex flex-col overflow-hidden">
      <header className="bg-white/70 backdrop-blur-md shadow-lg shadow-purple-100/50 px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎨</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Escultura Digital 3D
            </h1>
            <p className="text-sm text-purple-400/80 font-medium">Módulo interactivo - Mentes Creativas</p>
          </div>
        </div>
        <button
          onClick={toggleNarration}
          className={`${
            narrationActive
              ? "bg-gradient-to-br from-red-300 to-pink-300 hover:from-red-400 hover:to-pink-400"
              : "bg-gradient-to-br from-yellow-300 to-orange-300 hover:from-yellow-400 hover:to-orange-400"
          } px-5 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2`}
        >
          <span className="text-lg">🔊</span>
          {narrationActive ? "Detener voz" : "Activar narración"}
        </button>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        <aside className="w-72 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold mb-5 text-purple-600 flex items-center gap-2">
            <span className="text-xl">🛠️</span> Herramientas Creativas
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { key: "mold", label: "Moldear", icon: "✋" },
              { key: "add", label: "Añadir", icon: "➕" },
              { key: "smooth", label: "Suavizar", icon: "🌊" },
              { key: "detail", label: "Detalle", icon: "🔍" },
              { key: "paint", label: "Pintar", icon: "🎨" },
              { key: "eraser", label: "Borrar", icon: "🧽" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setSelectedTool(t.key as Tool)
                  speak(`Seleccionaste la herramienta ${t.label}.`)
                }}
                className={`h-24 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center hover:scale-105 ${
                  selectedTool === t.key
                    ? "bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300 shadow-lg scale-105"
                    : "bg-white/80 border-purple-100 hover:bg-white shadow-md"
                }`}
              >
                <div className="text-3xl mb-1">{t.icon}</div>
                <div className="text-xs font-semibold text-purple-700">{t.label}</div>
              </button>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
              <span className="text-lg">🎨</span> Paleta de Colores
            </h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color)
                    speak(`Color cambiado`)
                  }}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                    selectedColor === color
                      ? "border-purple-400 shadow-lg scale-110 ring-4 ring-purple-200"
                      : "border-purple-100 hover:shadow-md"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-lg">💾</span> Guardar
            </button>
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex-1 bg-gradient-to-r from-orange-300 to-pink-300 hover:from-orange-400 hover:to-pink-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-lg">🔄</span> Reiniciar
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-2">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 flex-1 flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 flex justify-between items-center border-b border-purple-100">
              <h2 className="text-lg font-bold text-purple-600 flex items-center gap-2">
                <span className="text-2xl">🎭</span> Área de Escultura
              </h2>
            </div>

            <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="border-2 border-purple-200 rounded-2xl cursor-crosshair shadow-lg bg-white/90 max-w-full h-auto"
              />
              <button
                onClick={() => {
                  setRotation((r) => r - 15)
                  speak("Giraste a la izquierda")
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white rounded-full text-2xl shadow-lg hover:scale-110 transition-all duration-300"
              >
                ↺
              </button>
              <button
                onClick={() => {
                  setRotation((r) => r + 15)
                  speak("Giraste a la derecha")
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white rounded-full text-2xl shadow-lg hover:scale-110 transition-all duration-300"
              >
                ↻
              </button>
            </div>
          </div>
        </main>
      </div>

      {showResetDialog && (
        <div className="fixed inset-0 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-purple-200/50 p-8 max-w-sm mx-4 transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-pink-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">¿Reiniciar escultura?</h3>
              <p className="text-purple-400">Esto borrará tu escultura actual y no se puede deshacer.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-red-300 to-pink-300 hover:from-red-400 hover:to-pink-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
              >
                Sí, borrar
              </button>
              <button
                onClick={() => setShowResetDialog(false)}
                className="flex-1 bg-gradient-to-r from-purple-200 to-blue-200 hover:from-purple-300 hover:to-blue-300 text-purple-700 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
