"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Star } from "lucide-react"

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
    brillo: number
    ojos: boolean
  }
> = {
  mercurio: {
    nombre: "Mercurio",
    color: "#808080",
    tamaño: 35,
    orbita: 100,
    velocidad: 1.6,
    emoji: "☿️",
    info: "Mercurio es el planeta más cercano al Sol. Es muy pequeño y muy caliente.",
    detalles: "No tiene atmósfera y sus temperaturas varían muchísimo.",
    narracion: "Hola soy Mercurio, el planeta más rápido y cercano al Sol. Soy pequeñito pero muy rápido.",
    datos: { distancia: "58 millones km", temperatura: "430°C de día, -180°C de noche", lunas: "0 lunas" },
    brillo: 0.8,
    ojos: true,
  },
  venus: {
    nombre: "Venus",
    color: "#FFA500",
    tamaño: 45,
    orbita: 140,
    velocidad: 1.2,
    emoji: "♀️",
    info: "Venus es el planeta más caliente y brilla mucho en el cielo nocturno.",
    detalles: "Gira en dirección opuesta a la mayoría de planetas.",
    narracion: "¡Hola! Soy Venus, la más bella del sistema solar. Soy muy caliente pero muy bonita.",
    datos: { distancia: "108 millones km", temperatura: "462°C", lunas: "0 lunas" },
    brillo: 1.2,
    ojos: true,
  },
  tierra: {
    nombre: "Tierra",
    color: "#1E90FF",
    tamaño: 48,
    orbita: 180,
    velocidad: 1,
    emoji: "🌍",
    info: "La Tierra es especial porque tiene agua, aire y la temperatura perfecta para la vida.",
    detalles: "Es el tercer planeta desde el Sol y el único conocido con vida.",
    narracion: "¡Hola! Soy la Tierra, tu hogar. Soy azul porque tengo mucha agua y es un lugar muy bonito.",
    datos: { distancia: "150 millones km", temperatura: "15°C promedio", lunas: "1 luna" },
    brillo: 1.3,
    ojos: true,
  },
  marte: {
    nombre: "Marte",
    color: "#DC143C",
    tamaño: 40,
    orbita: 220,
    velocidad: 0.8,
    emoji: "♂️",
    info: "Marte es conocido como el planeta rojo por su color.",
    detalles: "Los científicos buscan señales de vida antigua en Marte.",
    narracion: "Hola, soy Marte el planeta rojo. Soy muy especial y los científicos me visitan con robots.",
    datos: { distancia: "228 millones km", temperatura: "-63°C promedio", lunas: "2 lunas: Fobos y Deimos" },
    brillo: 0.9,
    ojos: true,
  },
  jupiter: {
    nombre: "Júpiter",
    color: "#DAA520",
    tamaño: 75,
    orbita: 300,
    velocidad: 0.4,
    emoji: "♃",
    info: "Júpiter es el planeta más grande del sistema solar.",
    detalles: "Tiene más de 70 lunas y un fuerte campo magnético.",
    narracion:
      "¡Hola! Soy Júpiter, el gigante del sistema solar. Soy tan grande que cabrían muchas Tierras dentro de mí.",
    datos: { distancia: "778 millones km", temperatura: "-145°C", lunas: "+79 lunas" },
    brillo: 1.1,
    ojos: true,
  },
  saturno: {
    nombre: "Saturno",
    color: "#F4A460",
    tamaño: 70,
    orbita: 380,
    velocidad: 0.3,
    emoji: "♄",
    info: "Saturno es famoso por sus hermosos anillos hechos de hielo y rocas.",
    detalles: "Es el segundo planeta más grande y podría flotar en el agua.",
    narracion: "¡Hola! Soy Saturno, tengo los anillos más hermosos del sistema solar. Soy muy bonito.",
    datos: { distancia: "1.4 mil millones km", temperatura: "-178°C", lunas: "+82 lunas" },
    brillo: 1.0,
    ojos: true,
  },
  urano: {
    nombre: "Urano",
    color: "#00CED1",
    tamaño: 58,
    orbita: 450,
    velocidad: 0.2,
    emoji: "♅",
    info: "Urano es un planeta de color azul verdoso que gira de lado.",
    detalles: "Está tan lejos del Sol que es muy frío y oscuro.",
    narracion: "Hola, soy Urano, giro de lado como si estuviera acostado. Soy muy especial.",
    datos: { distancia: "2.9 mil millones km", temperatura: "-224°C", lunas: "27 lunas" },
    brillo: 0.85,
    ojos: true,
  },
  neptuno: {
    nombre: "Neptuno",
    color: "#4169E1",
    tamaño: 55,
    orbita: 520,
    velocidad: 0.15,
    emoji: "♆",
    info: "Neptuno es el planeta más alejado del Sol. Tiene vientos muy fuertes.",
    detalles: "Es de color azul intenso debido al metano en su atmósfera.",
    narracion: "¡Hola! Soy Neptuno, el planeta más lejano. Soy muy azul y tengo los vientos más rápidos.",
    datos: { distancia: "4.5 mil millones km", temperatura: "-214°C", lunas: "14 lunas" },
    brillo: 0.9,
    ojos: true,
  },
}

const curiosidades = [
  "🌟 El Sol es tan grande que cabrían 1.3 millones de Tierras dentro de él.",
  "🚀 La luz del Sol tarda 8 minutos en llegar a la Tierra.",
  "🪐 Los anillos de Saturno están hechos de hielo y polvo.",
  "⭐ Júpiter protege a la Tierra atrayendo asteroides con su gravedad.",
  "🌙 La Luna se está alejando de la Tierra 3.8 cm cada año.",
  "♀️ Venus gira en dirección contraria a los demás planetas.",
]

export default function SistemaSolar3D() {
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([])
  const [audioActivo, setAudioActivo] = useState(false)
  const [puntos, setPuntos] = useState(0)
  const [planetasDescubiertos, setPlanetasDescubiertos] = useState<string[]>([])
  const [rotacion, setRotacion] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const planetPositionsRef = useRef<Record<string, { x: number; y: number; tamaño: number }>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setRotacion((prev) => (prev + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

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

    if (selectedPlanets.includes(planeta)) {
      setSelectedPlanets(selectedPlanets.filter((p) => p !== planeta))
    } else {
      setSelectedPlanets([...selectedPlanets, planeta])
    }

    if (!planetasDescubiertos.includes(planeta)) {
      setPlanetasDescubiertos([...planetasDescubiertos, planeta])
      setPuntos((prev) => prev + 10)
      reproducirNarracion(
        `¡Felicidades! Has descubierto ${planetData[planeta].nombre}. ${planetData[planeta].narracion}`,
      )
    } else {
      reproducirNarracion(planetData[planeta].narracion)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fondo estrellado
      ctx.fillStyle = "#0a0e27"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Estrellas animadas
      for (let i = 0; i < 150; i++) {
        const x = (i * 67 + rotacion * 0.5) % canvas.width
        const y = (i * 113) % canvas.height
        const brillo = 0.3 + Math.sin(Date.now() / 1000 + i) * 0.4
        ctx.fillStyle = `rgba(255, 255, 255, ${brillo})`
        ctx.fillRect(x, y, 2, 2)
      }

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Sol con pulso y gradiente
      const pulso = 1 + Math.sin(Date.now() / 500) * 0.1
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60 * pulso)
      gradient.addColorStop(0, "#FFF8DC")
      gradient.addColorStop(0.3, "#FFD700")
      gradient.addColorStop(0.6, "#FF8C00")
      gradient.addColorStop(1, "#FF4500")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 60 * pulso, 0, Math.PI * 2)
      ctx.fill()

      // Rayos de sol
      ctx.strokeStyle = "rgba(255, 200, 0, 0.3)"
      ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6
        const x1 = centerX + Math.cos(angle) * 70
        const y1 = centerY + Math.sin(angle) * 70
        const x2 = centerX + Math.cos(angle) * 90
        const y2 = centerY + Math.sin(angle) * 90
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      planetPositionsRef.current = {}

      Object.entries(planetData).forEach(([key, planeta]) => {
        // Órbita
        ctx.strokeStyle = "rgba(100, 200, 255, 0.2)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, planeta.orbita, 0, Math.PI * 2)
        ctx.stroke()

        // Calcular posición con rotación continua
        const angulo = rotacion * planeta.velocidad * (Math.PI / 180)
        const x = centerX + Math.cos(angulo) * planeta.orbita
        const y = centerY + Math.sin(angulo) * planeta.orbita * 0.5

        planetPositionsRef.current[key] = { x, y, tamaño: planeta.tamaño }

        // Aura de selección
        if (selectedPlanets.includes(key)) {
          ctx.fillStyle = "rgba(255, 255, 0, 0.2)"
          ctx.beginPath()
          ctx.arc(x, y, planeta.tamaño + 20, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = "rgba(255, 255, 0, 0.5)"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(x, y, planeta.tamaño + 20, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Planeta con gradiente
        const gradPlanet = ctx.createRadialGradient(
          x - planeta.tamaño / 3,
          y - planeta.tamaño / 3,
          0,
          x,
          y,
          planeta.tamaño,
        )
        gradPlanet.addColorStop(0, planeta.color)
        gradPlanet.addColorStop(0.7, planeta.color)
        gradPlanet.addColorStop(1, `${planeta.color}80`)
        ctx.fillStyle = gradPlanet
        ctx.beginPath()
        ctx.arc(x, y, planeta.tamaño, 0, Math.PI * 2)
        ctx.fill()

        // Brillo
        ctx.fillStyle = `rgba(255, 255, 255, ${planeta.brillo * 0.3})`
        ctx.beginPath()
        ctx.arc(x - planeta.tamaño / 3, y - planeta.tamaño / 3, planeta.tamaño / 3, 0, Math.PI * 2)
        ctx.fill()

        if (planeta.ojos) {
          const eyeY = y - planeta.tamaño / 4
          const eyeSize = planeta.tamaño / 6

          // Ojo izquierdo
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.beginPath()
          ctx.arc(x - planeta.tamaño / 4, eyeY, eyeSize, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = "#000"
          ctx.beginPath()
          ctx.arc(x - planeta.tamaño / 4, eyeY, eyeSize / 2, 0, Math.PI * 2)
          ctx.fill()

          // Ojo derecho
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.beginPath()
          ctx.arc(x + planeta.tamaño / 4, eyeY, eyeSize, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = "#000"
          ctx.beginPath()
          ctx.arc(x + planeta.tamaño / 4, eyeY, eyeSize / 2, 0, Math.PI * 2)
          ctx.fill()

          // Sonrisa
          ctx.strokeStyle = "rgba(0, 0, 0, 0.6)"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y + planeta.tamaño / 4, planeta.tamaño / 3, 0, Math.PI, false)
          ctx.stroke()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [selectedPlanets, rotacion])

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
            width={900}
            height={650}
            className="block mx-auto rounded-2xl shadow-lg w-full max-w-full h-auto cursor-pointer bg-slate-900"
            onClick={(e) => {
              const canvas = canvasRef.current
              if (!canvas) return
              const rect = canvas.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top

              let planetClicked = false
              Object.entries(planetPositionsRef.current).forEach(([key, pos]) => {
                const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
                if (dist < pos.tamaño + 20 && !planetClicked) {
                  handlePlanetaClick(key)
                  planetClicked = true
                }
              })
            }}
          />

          <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 text-center">
            <p className="text-purple-600 font-medium flex items-center justify-center gap-2">
              <span className="text-xl">👆</span>
              Haz clic en los planetas para seleccionarlos y escucha sus historias
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
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
                      selectedPlanets.includes(planeta)
                        ? "bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700"
                        : "bg-gradient-to-r from-blue-200 to-purple-200 text-purple-700"
                    }`}
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
              onClick={() => (audioActivo ? detenerNarracion() : reproducirNarracion("Bienvenido al explorador solar"))}
              className="p-4 bg-gradient-to-br from-green-200 to-emerald-300 hover:from-green-300 hover:to-emerald-400 text-green-700 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
              aria-label={audioActivo ? "Detener narración" : "Activar narración"}
              title={audioActivo ? "Detener" : "Narración"}
            >
              {audioActivo ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <button
              onClick={() => reproducirNarracion(curiosidades[Math.floor(Math.random() * curiosidades.length)])}
              className="p-4 bg-gradient-to-br from-yellow-200 to-orange-300 hover:from-yellow-300 hover:to-orange-400 text-orange-700 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-pulse"
              aria-label="Escuchar curiosidad"
              title="Curiosidades"
            >
              <Star className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-8 mt-4 text-sm">
            <span className="text-purple-400 font-medium">🔊 Narración</span>
            <span className="text-purple-400 font-medium">✨ Curiosidades</span>
          </div>
        </div>
      </div>
    </div>
  )
}
