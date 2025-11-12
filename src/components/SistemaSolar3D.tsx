"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Pause, Star } from "lucide-react"

// === DATOS DE LOS PLANETAS ===
const planetData: Record<
  string,
  {
    nombre: string
    color: string
    tamaño: number
    orbita: number
    velocidad: number
    emoji: string
    info: string
    detalles: string
    narracion: string
    datos: { distancia: string; temperatura: string; lunas: string }
  }
> = {
  mercurio: {
    nombre: "Mercurio",
    color: "#B0B0B0",
    tamaño: 25,
    orbita: 80,
    velocidad: 1.6,
    emoji: "☿️",
    info: "Mercurio es el planeta más cercano al Sol. Es muy pequeño y muy caliente.",
    detalles: "No tiene atmósfera y sus temperaturas varían muchísimo.",
    narracion:
      "Mercurio es el planeta más cercano al Sol y el más pequeño del sistema solar. De día hace mucho calor pero de noche hace mucho frío. No tiene aire para respirar y está lleno de cráteres como la Luna.",
    datos: {
      distancia: "58 millones km",
      temperatura: "430°C de día, -180°C de noche",
      lunas: "0 lunas",
    },
  },
  venus: {
    nombre: "Venus",
    color: "#FFC649",
    tamaño: 38,
    orbita: 115,
    velocidad: 1.2,
    emoji: "♀️",
    info: "Venus es el planeta más caliente y brilla mucho en el cielo nocturno.",
    detalles: "Gira en dirección opuesta a la mayoría de planetas.",
    narracion:
      "Venus es el planeta más caliente de todos, incluso más que Mercurio. Brilla tanto en el cielo que parece una estrella. Tiene nubes de ácido y gira al revés comparado con los demás planetas.",
    datos: {
      distancia: "108 millones km",
      temperatura: "462°C",
      lunas: "0 lunas",
    },
  },
  tierra: {
    nombre: "Tierra",
    color: "#4A90E2",
    tamaño: 40,
    orbita: 150,
    velocidad: 1,
    emoji: "🌍",
    info: "La Tierra es especial porque tiene agua, aire y la temperatura perfecta para la vida.",
    detalles: "Es el tercer planeta desde el Sol y el único conocido con vida.",
    narracion:
      "La Tierra es nuestro hogar. Es especial porque tiene agua, aire y la temperatura perfecta para la vida. Es el tercer planeta desde el Sol y el único conocido con vida. Tiene una luna que vemos en las noches.",
    datos: {
      distancia: "150 millones km",
      temperatura: "15°C promedio",
      lunas: "1 luna",
    },
  },
}

// === CURIOSIDADES ===
const curiosidades = [
  "🌟 El Sol es tan grande que cabrían 1.3 millones de Tierras dentro de él.",
  "🚀 La luz del Sol tarda 8 minutos en llegar a la Tierra.",
  "🪐 Los anillos de Saturno están hechos de hielo y polvo.",
]

// === COMPONENTE PRINCIPAL ===
export default function SistemaSolar3D() {
  const [, setPlanetaSeleccionado] = useState<string | null>(null)
  const [audioActivo, setAudioActivo] = useState(false)
  const [animando, setAnimando] = useState(true)
  const [puntos, setPuntos] = useState(0)
  const [planetasDescubiertos, setPlanetasDescubiertos] = useState<string[]>([])

  // ✅ Tipado correcto
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  // === FUNCIONES DE VOZ ===
  const reproducirNarracion = (texto: string) => {
    if (speechRef.current) window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = "es-ES"
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 1

    utterance.onstart = () => setAudioActivo(true)
    utterance.onend = () => setAudioActivo(false)
    utterance.onerror = () => setAudioActivo(false)

    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const detenerNarracion = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel()
      setAudioActivo(false)
      speechRef.current = null
    }
  }

  const handlePlanetaClick = (planeta: string) => {
    detenerNarracion()
    setPlanetaSeleccionado(planeta)

    if (!planetasDescubiertos.includes(planeta)) {
      setPlanetasDescubiertos([...planetasDescubiertos, planeta])
      setPuntos((prev) => prev + 10)
      reproducirNarracion(
        `¡Felicidades! Has descubierto ${planetData[planeta].nombre}. Ganaste 10 puntos. ${planetData[planeta].narracion}`,
      )
    } else {
      reproducirNarracion(planetData[planeta].narracion)
    }
  }

  // === ANIMACIÓN CANVAS ===
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#0a1628"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2)
      ctx.fill()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [animando])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 p-6 transition-all">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">🌞</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-center">
              Explorador del Sistema Solar
            </h1>
          </div>
          <p className="text-center text-purple-400/80 mt-2 font-medium">Descubre los secretos del universo</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 p-6 transition-all">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="block mx-auto rounded-2xl shadow-lg w-full max-w-full h-auto"
            onClick={() => handlePlanetaClick("tierra")}
          />

          <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 text-center">
            <p className="text-purple-600 font-medium flex items-center justify-center gap-2">
              <span className="text-xl">👆</span>
              Haz clic en un planeta para escucharlo
              <span className="text-xl">🚀</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg shadow-purple-100/30 p-5 transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium mb-1">Tu Progreso</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {puntos} puntos
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg shadow-purple-100/30 p-5 transition-all hover:scale-105">
            <p className="text-purple-400 text-sm font-medium mb-2">Planetas Descubiertos</p>
            <div className="flex flex-wrap gap-2">
              {planetasDescubiertos.length > 0 ? (
                planetasDescubiertos.map((planeta) => (
                  <span
                    key={planeta}
                    className="px-3 py-1 bg-gradient-to-r from-blue-200 to-purple-200 text-purple-700 rounded-full text-sm font-medium shadow-md"
                  >
                    {planetData[planeta]?.emoji} {planetData[planeta]?.nombre}
                  </span>
                ))
              ) : (
                <span className="text-purple-300 italic">Ninguno aún, ¡comienza a explorar!</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-100/50 p-6">
          <p className="text-purple-600 font-semibold text-center mb-4">Controles</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <button
              onClick={() => setAnimando(!animando)}
              className="p-4 bg-gradient-to-br from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-blue-700 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
              aria-label={animando ? "Pausar animación" : "Reproducir animación"}
            >
              {animando ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={() => (audioActivo ? detenerNarracion() : reproducirNarracion("Modo narración activado."))}
              className="p-4 bg-gradient-to-br from-green-200 to-emerald-300 hover:from-green-300 hover:to-emerald-400 text-green-700 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
              aria-label={audioActivo ? "Detener narración" : "Activar narración"}
            >
              {audioActivo ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <button
              onClick={() => reproducirNarracion(curiosidades[Math.floor(Math.random() * curiosidades.length)])}
              className="p-4 bg-gradient-to-br from-yellow-200 to-orange-300 hover:from-yellow-300 hover:to-orange-400 text-orange-700 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-pulse"
              aria-label="Escuchar curiosidad"
            >
              <Star className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-8 mt-4 text-sm">
            <span className="text-purple-400 font-medium">⏯️ Pausar/Reproducir</span>
            <span className="text-purple-400 font-medium">🔊 Narración</span>
            <span className="text-purple-400 font-medium">✨ Curiosidades</span>
          </div>
        </div>
      </div>
    </div>
  )
}
