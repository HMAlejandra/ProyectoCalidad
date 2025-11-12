"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

// Tipos
type Tool = "circulo" | "cuadrado" | "triangulo" | "linea" | "borrar" | null
type BrushSize = "S" | "M" | "L"
type Color = string

interface DrawPoint {
  x: number
  y: number
  tool: Tool
  color: Color
  size: BrushSize
  radius?: number
}

export default function DigitalSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Tool>(null)
  const [selectedColor, setSelectedColor] = useState<Color>("#FF6B6B")
  const [brushSize, setBrushSize] = useState<BrushSize>("M")
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<DrawPoint[]>([])
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [narrationActive, setNarrationActive] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const colors = [
    "#FF6B6B",
    "#FF1744",
    "#F50057",
    "#4ECDC4",
    "#00BCD4",
    "#FFE66D",
    "#FFC400",
    "#95E1D3",
    "#FF9FF3",
    "#C7CEEA",
  ]

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

  // Auto-guardado
  useEffect(() => {
    const interval = setInterval(() => {
      if (points.length > 0) {
        localStorage.setItem("sculpture-points", JSON.stringify(points))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [points])

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

    // Fondo degradado
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    bgGrad.addColorStop(0, "#E0F7FA")
    bgGrad.addColorStop(1, "#B3E5FC")
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    points.forEach((p) => {
      const size = p.size === "S" ? 15 : p.size === "M" ? 30 : 50
      ctx.fillStyle = p.color
      ctx.strokeStyle = p.color
      ctx.lineWidth = 2

      if (p.tool === "circulo") {
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 2
        ctx.stroke()
      } else if (p.tool === "cuadrado") {
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 2
        ctx.strokeRect(p.x - size / 2, p.y - size / 2, size, size)
      } else if (p.tool === "triangulo") {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y - size)
        ctx.lineTo(p.x - size, p.y + size)
        ctx.lineTo(p.x + size, p.y + size)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 2
        ctx.stroke()
      } else if (p.tool === "linea") {
        ctx.lineWidth = size / 5
        ctx.beginPath()
        ctx.moveTo(p.x - size, p.y - size)
        ctx.lineTo(p.x + size, p.y + size)
        ctx.stroke()
      } else if (p.tool === "borrar") {
        ctx.clearRect(p.x - size, p.y - size, size * 2, size * 2)
      }
    })

    ctx.restore()
  }, [points, rotation, zoom])

  // Eventos de dibujo
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedTool) return
    setIsDrawing(true)
    addPoint(e)
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

  const toolName = (tool: Tool) => {
    switch (tool) {
      case "circulo":
        return "Círculo"
      case "cuadrado":
        return "Cuadrado"
      case "triangulo":
        return "Triángulo"
      case "linea":
        return "Línea"
      case "borrar":
        return "Borrar"
      default:
        return "ninguna"
    }
  }

  const handleSave = () => {
    localStorage.setItem("sculpture-points", JSON.stringify(points))
    speak("¡Tu obra ha sido guardada!")
  }

  const handleReset = () => {
    setPoints([])
    setRotation(0)
    setZoom(1)
    localStorage.removeItem("sculpture-points")
    speak("Tu obra se ha borrado. Puedes comenzar una nueva.")
    setShowResetDialog(false)
  }

  const toggleNarration = () => {
    setNarrationActive(!narrationActive)
    if (!narrationActive) {
      speak("¡Hola! Vamos a crear arte con formas. Elige círculos, cuadrados, triángulos o líneas. ¡Diviértete!")
    } else {
      speechSynthesis.cancel()
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-200 via-purple-150 to-blue-200 flex flex-col overflow-hidden">
      <header className="bg-white/70 backdrop-blur-md shadow-lg shadow-purple-100/50 px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎨</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Escultura Creativa 3D
            </h1>
            <p className="text-sm text-purple-400/80 font-medium">Crea con formas geométricas</p>
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

      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        <aside className="w-72 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold mb-5 text-purple-600 flex items-center gap-2">
            <span className="text-xl">🛠️</span> Herramientas de Dibujo
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { key: "circulo", label: "Círculo", icon: "🔵" },
              { key: "cuadrado", label: "Cuadrado", icon: "⬜" },
              { key: "triangulo", label: "Triángulo", icon: "🔺" },
              { key: "linea", label: "Línea", icon: "📏" },
              { key: "borrar", label: "Borrar", icon: "🧹" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setSelectedTool(t.key as Tool)
                  speak(`Seleccionaste ${t.label}.`)
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
              <span className="text-lg">🎨</span> Colores
            </h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color)
                    speak("Color cambiado")
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                    selectedColor === color
                      ? "border-purple-400 shadow-lg scale-110 ring-4 ring-purple-200"
                      : "border-purple-100 hover:shadow-md"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
              <span className="text-lg">📏</span> Tamaño
            </h3>
            <div className="flex gap-2 justify-center">
              {["S", "M", "L"].map((s) => (
                <button
                  key={s}
                  onClick={() => setBrushSize(s as BrushSize)}
                  className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                    brushSize === s
                      ? "bg-gradient-to-r from-purple-300 to-pink-300 text-white scale-105 shadow-lg"
                      : "bg-white/80 text-purple-600 hover:bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <span>💾</span> Guardar
            </button>
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex-1 bg-gradient-to-r from-orange-300 to-pink-300 hover:from-orange-400 hover:to-pink-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <span>🔄</span> Nuevo
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-2">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 flex-1 flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 flex justify-between items-center border-b border-purple-100">
              <h2 className="text-lg font-bold text-purple-600 flex items-center gap-2">
                <span className="text-2xl">🎭</span> Lienzo de Creatividad
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
              <h3 className="text-2xl font-bold text-purple-600 mb-2">¿Crear nueva obra?</h3>
              <p className="text-purple-400">Borrará tu obra actual y no se puede deshacer.</p>
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
