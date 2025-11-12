"use client"

import { useEffect } from "react"
import { Volume2, Rocket, Sun } from "lucide-react"

export default function SistemaSolar3DView() {
  const narrar = (texto: string) => {
    const mensaje = new SpeechSynthesisUtterance(texto)
    mensaje.lang = "es-ES"
    mensaje.rate = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(mensaje)
  }

  useEffect(() => {
    narrar("¡Hola explorador! Hoy viajaremos por el sistema solar. Observa los planetas y escucha sus secretos.")
  }, [])

  const planetas = [
    {
      nombre: "Mercurio",
      color: "from-gray-300 to-gray-400",
      texto: "Soy Mercurio, el más cercano al sol.",
    },
    {
      nombre: "Venus",
      color: "from-yellow-200 to-amber-300",
      texto: "Soy Venus, el planeta más brillante.",
    },
    {
      nombre: "Tierra",
      color: "from-blue-300 to-cyan-400",
      texto: "Soy la Tierra, donde vivimos todos.",
    },
    {
      nombre: "Marte",
      color: "from-red-300 to-rose-400",
      texto: "Soy Marte, el planeta rojo.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 via-purple-100 to-pink-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
        <Sun size={36} className="text-amber-400" /> Sistema Solar Interactivo
      </h1>

      <button
        onClick={() => narrar("Explora los planetas tocando sus nombres. Cada uno te contará algo especial.")}
        className="bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-full mb-8 flex items-center gap-2 shadow-lg shadow-purple-200/50 transition-all duration-300 hover:scale-105 backdrop-blur-md"
      >
        <Volume2 /> Repetir narración
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {planetas.map((planeta) => (
          <button
            key={planeta.nombre}
            onClick={() => narrar(planeta.texto)}
            className={`p-8 rounded-full shadow-xl hover:scale-110 transition-all duration-300 bg-gradient-to-br ${planeta.color} text-white font-semibold backdrop-blur-sm`}
          >
            {planeta.nombre}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <Rocket size={48} className="text-purple-400 animate-bounce" />
      </div>
    </div>
  )
}
