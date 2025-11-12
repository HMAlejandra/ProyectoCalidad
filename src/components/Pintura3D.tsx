"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { RotateCcw, Save, Volume2, VolumeX, Paintbrush, Info } from "lucide-react"

const Pintura3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [color, setColor] = useState("#FF6B6B")
  const [brushSize, setBrushSize] = useState(2)
  const [effect, setEffect] = useState("glow")
  const [isDrawing, setIsDrawing] = useState(false)
  const [narrationEnabled, setNarrationEnabled] = useState(true)
  const lastMouseXRef = useRef(0)
  const lastMouseYRef = useRef(0)

  const colors = [
    ["#FF6B6B", "#74B9FF", "#55EFC4", "#FECA57", "#FF7979", "#FFFFFF"],
    ["#FF6348", "#5F9EE8", "#4CD47D", "#FFA45C", "#FF5E7D", "#F0F0F0"],
  ]

  // Herramientas disponibles (para uso futuro)
  // const tools = [
  //   { id: "brush", name: "Pincel", icon: Paintbrush, description: "Dibuja líneas suaves" },
  //   { id: "eraser", name: "Borrador", icon: Eraser, description: "Borra partes del dibujo" },
  // ];

  const brushSizes = [1, 2, 4, 8, 16]

  const effects = [
    { id: "glow", name: "Brillo", color: "from-blue-400 to-cyan-400" },
    { id: "sparkle", name: "Chispas", color: "from-pink-400 to-purple-400" },
    { id: "shimmer", name: "Brillos", color: "from-yellow-400 to-orange-400" },
  ]

  // Inicializar el lienzo
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    ctx!.fillStyle = "#E8F4F8"
    ctx!.fillRect(0, 0, canvas.width, canvas.height)
    speak("Bienvenido a DreamDraw 3D. Elige una herramienta para empezar a dibujar")
  }, [])

  const speak = (text: string) => {
    if (!narrationEnabled) return

    // Efecto sonoro simple
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 600
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      console.log("Audio context error:", e)
    }

    // Narración de voz
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 0.9
      utterance.pitch = 1.2
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    } else {
      console.log("Narración:", text)
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
    ctx!.beginPath()
  }

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top

    ctx.lineWidth = brushSize * 8
    ctx.lineCap = "round"
    ctx.strokeStyle = color
    ctx.shadowBlur = effect === "glow" ? 20 : 0
    ctx.shadowColor = effect === "glow" ? color : "transparent"

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d")!
    ctx.fillStyle = "#E8F4F8"
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    speak("Lienzo limpio, listo para una nueva obra de arte")
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current!
    const link = document.createElement("a")
    link.download = "mi-dibujo-3d.png"
    link.href = canvas.toDataURL()
    link.click()
    speak("Tu dibujo ha sido guardado exitosamente")
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
                <span className="text-xl">🎨</span> Paleta de Colores
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {colors.flat().map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
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
                <span className="text-xl">✨</span> Tamaño del Pincel
              </h3>
              <div className="flex gap-2 flex-wrap">
                {brushSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
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
                <span className="text-xl">💫</span> Efectos Mágicos
              </h3>
              <div className="flex flex-col gap-3">
                {effects.map(({ id, name }) => (
                  <button
                    key={id}
                    onClick={() => setEffect(id)}
                    className={`p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      effect === id
                        ? "bg-gradient-to-r from-purple-300 to-pink-300 text-white shadow-lg scale-105"
                        : "bg-white/80 text-purple-600 hover:bg-white shadow-md"
                    }`}
                  >
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
                <span className="text-2xl">🖼️</span> Lienzo de Creatividad
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
              <div className="absolute bottom-4 left-4 bg-purple-100/90 backdrop-blur-md border border-purple-200 text-purple-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg">
                <Info className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Dibuja arrastrando el mouse o tu dedo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pintura3D
