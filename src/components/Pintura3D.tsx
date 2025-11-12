"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { RotateCcw, Save, Volume2, VolumeX, Paintbrush } from "lucide-react"

const Pintura3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [color, setColor] = useState("#FF6B6B")
  const [brushSize, setBrushSize] = useState(3)
  const [effect, setEffect] = useState("normal")
  const [isDrawing, setIsDrawing] = useState(false)
  const [narrationEnabled, setNarrationEnabled] = useState(true)
  const lastMouseXRef = useRef(0)
  const lastMouseYRef = useRef(0)

  const colors = [
    ["#FF6B6B", "#FF1744", "#F50057", "#2D9DB4", "#4ECDC4", "#00BCD4"],
    ["#FFE66D", "#FFC400", "#FF9800", "#95E1D3", "#FF9FF3", "#C7CEEA"],
  ]

  const brushSizes = [1, 2, 3, 5, 8]

  const effects = [
    { id: "normal", name: "Pincel Normal", icon: "🖌️" },
    { id: "glow", name: "Brillo Resplandeciente", icon: "✨" },
    { id: "sparkle", name: "Chispas Mágicas", icon: "⭐" },
    { id: "rainbow", name: "Arcoíris", icon: "🌈" },
    { id: "blurry", name: "Desenfoque Suave", icon: "🌫️" },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    bgGrad.addColorStop(0, "#FFF9E6")
    bgGrad.addColorStop(1, "#E6F3FF")
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    speak("Bienvenido a DreamDraw. Elige un pincel y comienza a crear magia")
  }, [])

  const speak = (text: string) => {
    if (!narrationEnabled) return
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "es-ES"
        utterance.rate = 0.9
        utterance.pitch = 1.2
        utterance.volume = 1
        window.speechSynthesis.speak(utterance)
      }
    } catch (e) {
      console.log("Audio error:", e)
    }
  }

  const startDrawing = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    lastMouseXRef.current = x
    lastMouseYRef.current = y
    setIsDrawing(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const ctx = canvasRef.current!.getContext("2d")
    if (ctx) {
      ctx.beginPath()
    }
  }

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top

    if (effect === "normal") {
      ctx.lineWidth = brushSize * 4
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = color
      ctx.shadowBlur = 0
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (effect === "glow") {
      ctx.lineWidth = brushSize * 6
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = color
      ctx.shadowBlur = 15
      ctx.shadowColor = color
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.shadowBlur = 0
    } else if (effect === "sparkle") {
      // Línea principal
      ctx.lineWidth = brushSize * 3
      ctx.strokeStyle = color
      ctx.shadowBlur = 0
      ctx.lineTo(x, y)
      ctx.stroke()
      // Agregar chispas alrededor
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * 20 + 10
        const sx = x + Math.cos(angle) * dist
        const sy = y + Math.sin(angle) * dist
        ctx.fillStyle = color
        ctx.globalAlpha = 0.6
        ctx.fillRect(sx - 2, sy - 2, 4, 4)
        ctx.globalAlpha = 1
      }
    } else if (effect === "rainbow") {
      // Efecto arcoíris con cambio de color
      const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"]
      const colorIndex = Math.floor((Date.now() / 50) % colors.length)
      ctx.lineWidth = brushSize * 5
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = colors[colorIndex]
      ctx.shadowBlur = 5
      ctx.shadowColor = colors[colorIndex]
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.shadowBlur = 0
    } else if (effect === "blurry") {
      ctx.lineWidth = brushSize * 8
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.5
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d")!
    const bgGrad = ctx.createLinearGradient(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    bgGrad.addColorStop(0, "#FFF9E6")
    bgGrad.addColorStop(1, "#E6F3FF")
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    speak("Lienzo limpio, ¡creemos algo nuevo!")
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current!
    const link = document.createElement("a")
    link.download = "mi-dibujo-magico.png"
    link.href = canvas.toDataURL()
    link.click()
    speak("Tu obra maestra ha sido guardada")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 p-6 sm:p-8 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-300 rounded-2xl flex items-center justify-center shadow-lg">
              <Paintbrush className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                DreamDraw 3D
              </h1>
              <p className="text-sm text-purple-400/80">Crea arte digital mágico</p>
            </div>
          </div>
          <button
            onClick={() => {
              const newState = !narrationEnabled
              setNarrationEnabled(newState)
              setTimeout(() => speak(newState ? "Narración activada" : "Narración desactivada"), 100)
            }}
            className="p-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl"
            aria-label={narrationEnabled ? "Desactivar narración" : "Activar narración"}
          >
            {narrationEnabled ? (
              <Volume2 className="w-5 h-5 text-purple-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-purple-600" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 space-y-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-purple-100/30">
              <h3 className="font-semibold text-purple-600 mb-4 flex items-center gap-2">
                <span className="text-xl">🎨</span> Colores
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {colors.flat().map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c)
                      speak("Color cambiado")
                    }}
                    className={`h-10 w-full rounded-xl transition-all duration-300 hover:scale-110 ${
                      color === c ? "ring-4 ring-purple-300 shadow-lg scale-110" : "hover:shadow-md"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-purple-100/30">
              <h3 className="font-semibold text-purple-600 mb-4 flex items-center gap-2">
                <span className="text-xl">✏️</span> Grosor
              </h3>
              <div className="flex gap-2 flex-wrap justify-center">
                {brushSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setBrushSize(size)
                      speak(`Pincel ${size}`)
                    }}
                    className={`px-3 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm ${
                      brushSize === size
                        ? "bg-gradient-to-r from-purple-300 to-pink-300 text-white shadow-lg scale-105"
                        : "bg-white/80 text-purple-600 hover:bg-white shadow-md"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-purple-100/30">
              <h3 className="font-semibold text-purple-600 mb-4 flex items-center gap-2">
                <span className="text-xl">💫</span> Pinceles Mágicos
              </h3>
              <div className="flex flex-col gap-2">
                {effects.map(({ id, name, icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setEffect(id)
                      speak(name)
                    }}
                    className={`p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-left flex items-center gap-2 ${
                      effect === id
                        ? "bg-gradient-to-r from-purple-300 to-pink-300 text-white shadow-lg scale-105"
                        : "bg-white/80 text-purple-600 hover:bg-white shadow-md"
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveDrawing}
                className="flex-1 bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Guardar
              </button>
              <button
                onClick={clearCanvas}
                className="flex-1 bg-gradient-to-r from-orange-300 to-pink-300 hover:from-orange-400 hover:to-pink-400 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Limpiar
              </button>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-purple-200/50 p-4 sm:p-6 relative overflow-hidden">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-purple-100">
              <h2 className="text-lg font-bold text-purple-600 flex items-center gap-2">
                <span className="text-2xl">🖼️</span> Tu Lienzo Mágico
              </h2>
            </div>

            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-inner p-4 flex items-center justify-center min-h-[500px]">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={handleMouseMove}
                onTouchEnd={stopDrawing}
                data-testid="pintura-canvas"
                className="w-full max-w-full h-auto cursor-crosshair bg-white/90 rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pintura3D
