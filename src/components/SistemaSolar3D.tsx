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
  marte: {
    nombre: "Marte",
    color: "#CD5C5C",
    tamaño: 32,
    orbita: 180,
    velocidad: 0.8,
    emoji: "♂️",
    info: "Marte es conocido como el planeta rojo por su color. Tiene los volcanes más grandes del sistema solar.",
    detalles: "Los científicos buscan señales de vida antigua en Marte.",
    narracion:
      "Marte es conocido como el planeta rojo. Su color se debe al óxido de hierro en su superficie. Tiene el volcán más grande del sistema solar llamado Monte Olimpo. Los científicos están buscando señales de vida antigua.",
    datos: {
      distancia: "228 millones km",
      temperatura: "-63°C promedio",
      lunas: "2 lunas: Fobos y Deimos",
    },
  },
  jupiter: {
    nombre: "Júpiter",
    color: "#D4A574",
    tamaño: 60,
    orbita: 250,
    velocidad: 0.4,
    emoji: "♃",
    info: "Júpiter es el planeta más grande del sistema solar. Tiene una gran mancha roja que es una tormenta gigante.",
    detalles: "Tiene más de 70 lunas y un fuerte campo magnético.",
    narracion:
      "Júpiter es el gigante del sistema solar. Es el planeta más grande de todos. Tiene una gran mancha roja que es una tormenta gigante que lleva siglos activa. Tiene más de 79 lunas orbitando a su alrededor.",
    datos: {
      distancia: "778 millones km",
      temperatura: "-145°C",
      lunas: "+79 lunas",
    },
  },
  saturno: {
    nombre: "Saturno",
    color: "#E8D4A0",
    tamaño: 55,
    orbita: 320,
    velocidad: 0.3,
    emoji: "♄",
    info: "Saturno es famoso por sus hermosos anillos hechos de hielo y rocas.",
    detalles: "Es el segundo planeta más grande y podría flotar en el agua.",
    narracion:
      "Saturno es el planeta más hermoso por sus anillos brillantes. Estos anillos están hechos de miles de millones de pedazos de hielo y rocas. Es tan liviano que podría flotar en el agua si hubiera un océano lo suficientemente grande.",
    datos: {
      distancia: "1.4 mil millones km",
      temperatura: "-178°C",
      lunas: "+82 lunas",
    },
  },
  urano: {
    nombre: "Urano",
    color: "#4FD0E7",
    tamaño: 48,
    orbita: 380,
    velocidad: 0.2,
    emoji: "♅",
    info: "Urano es un planeta de color azul verdoso que gira de lado.",
    detalles: "Está tan lejos del Sol que es muy frío y oscuro.",
    narracion:
      "Urano es un planeta muy especial porque gira de lado, como si estuviera acostado. Es de color azul verdoso y tiene anillos como Saturno, pero son más difíciles de ver. Hace mucho frío en Urano.",
    datos: {
      distancia: "2.9 mil millones km",
      temperatura: "-224°C",
      lunas: "27 lunas",
    },
  },
  neptuno: {
    nombre: "Neptuno",
    color: "#4169E1",
    tamaño: 46,
    orbita: 430,
    velocidad: 0.15,
    emoji: "♆",
    info: "Neptuno es el planeta más alejado del Sol. Tiene vientos muy fuertes.",
    detalles: "Es de color azul intenso debido al metano en su atmósfera.",
    narracion:
      "Neptuno es el planeta más lejano del Sol en nuestro sistema solar. Es de color azul intenso y tiene los vientos más rápidos de todos los planetas. Tarda 165 años en dar una vuelta completa alrededor del Sol.",
    datos: {
      distancia: "4.5 mil millones km",
      temperatura: "-214°C",
      lunas: "14 lunas",
    },
  },
}

// === CURIOSIDADES ===
const curiosidades = [
  "🌟 El Sol es tan grande que cabrían 1.3 millones de Tierras dentro de él.",
  "🚀 La luz del Sol tarda 8 minutos en llegar a la Tierra.",
  "🪐 Los anillos de Saturno están hechos de hielo y polvo.",
  "⭐ Júpiter protege a la Tierra atrayendo asteroides con su gravedad.",
  "🌙 La Luna se está alejando de la Tierra 3.8 cm cada año.",
  "♀️ Venus gira en dirección contraria a los demás planetas.",
  "🔴 Un día en Venus dura más que un año en Venus.",
  "🌍 La Tierra es el único planeta no nombrado por un dios.",
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

    let rotacion = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#0a1628"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Dibujar estrellas de fondo
      for (let i = 0; i < 100; i++) {
        const x = (i * 67) % canvas.width
        const y = (i * 113) % canvas.height
        const brillo = 0.3 + Math.sin(Date.now() / 1000 + i) * 0.3
        ctx.fillStyle = `rgba(255, 255, 255, ${brillo})`
        ctx.fillRect(x, y, 2, 2)
      }

      // Dibujar el Sol
      const pulso = 1 + Math.sin(Date.now() / 500) * 0.05
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50 * pulso)
      gradient.addColorStop(0, "#FFF4E6")
      gradient.addColorStop(0.3, "#FDB813")
      gradient.addColorStop(0.6, "#FFAA00")
      gradient.addColorStop(1, "#FF6B00")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 50 * pulso, 0, Math.PI * 2)
      ctx.fill()

      // Dibujar planetas y órbitas
      Object.values(planetData).forEach((planeta) => {
        // Dibujar órbita como círculo
        ctx.strokeStyle = "rgba(100, 149, 237, 0.2)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, planeta.orbita, 0, Math.PI * 2)
        ctx.stroke()

        // Calcular posición del planeta
        const angulo = (rotacion * planeta.velocidad) * (Math.PI / 180)
        const x = centerX + Math.cos(angulo) * planeta.orbita
        const y = centerY + Math.sin(angulo) * planeta.orbita * 0.4

        // Dibujar planeta
        ctx.fillStyle = planeta.color
        ctx.beginPath()
        ctx.arc(x, y, planeta.tamaño / 2, 0, Math.PI * 2)
        ctx.fill()

        // Dibujar nombre del planeta cerca
        ctx.font = "bold 10px Arial"
        ctx.fillStyle = "#FFFFFF"
        ctx.textAlign = "center"
        ctx.fillText(planeta.emoji, x, y - planeta.tamaño / 2 - 8)
      })

      if (animando) {
        rotacion = (rotacion + 0.5) % 360
      }

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
