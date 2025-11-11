import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Star } from "lucide-react";

// === DATOS DE LOS PLANETAS ===
const planetData: Record<
  string,
  {
    nombre: string;
    color: string;
    tamaño: number;
    orbita: number;
    velocidad: number;
    emoji: string;
    info: string;
    detalles: string;
    narracion: string;
    datos: { distancia: string; temperatura: string; lunas: string };
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
};

// === CURIOSIDADES ===
const curiosidades = [
  "🌟 El Sol es tan grande que cabrían 1.3 millones de Tierras dentro de él.",
  "🚀 La luz del Sol tarda 8 minutos en llegar a la Tierra.",
  "🪐 Los anillos de Saturno están hechos de hielo y polvo.",
];

// === COMPONENTE PRINCIPAL ===
export default function SistemaSolar3D() {
  const [, setPlanetaSeleccionado] = useState<string | null>(null);
  const [audioActivo, setAudioActivo] = useState(false);
  const [animando, setAnimando] = useState(true);
  const [puntos, setPuntos] = useState(0);
  const [planetasDescubiertos, setPlanetasDescubiertos] = useState<string[]>([]);

  // ✅ Tipado correcto
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // === FUNCIONES DE VOZ ===
  const reproducirNarracion = (texto: string) => {
    if (speechRef.current) window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onstart = () => setAudioActivo(true);
    utterance.onend = () => setAudioActivo(false);
    utterance.onerror = () => setAudioActivo(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const detenerNarracion = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      setAudioActivo(false);
      speechRef.current = null;
    }
  };

  const handlePlanetaClick = (planeta: string) => {
    detenerNarracion();
    setPlanetaSeleccionado(planeta);

    if (!planetasDescubiertos.includes(planeta)) {
      setPlanetasDescubiertos([...planetasDescubiertos, planeta]);
      setPuntos((prev) => prev + 10);
      reproducirNarracion(
        `¡Felicidades! Has descubierto ${planetData[planeta].nombre}. Ganaste 10 puntos. ${planetData[planeta].narracion}`
      );
    } else {
      reproducirNarracion(planetData[planeta].narracion);
    }
  };

  // === ANIMACIÓN CANVAS ===
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animando]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <h1 className="text-center text-white text-2xl font-bold py-4">
        🌞 Explorador del Sistema Solar
      </h1>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="block mx-auto rounded-lg shadow-2xl"
        onClick={() => handlePlanetaClick("tierra")}
      />

      <p className="text-center text-white mt-4">
        Haz clic en un planeta para escucharlo 🚀
      </p>

      <div className="text-center text-white mt-2">
        <p>Puntos: {puntos}</p>
        <p>
          Planetas descubiertos:{" "}
          {planetasDescubiertos.length > 0 ? planetasDescubiertos.join(", ") : "ninguno"}
        </p>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setAnimando(!animando)}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          {animando ? <Pause /> : <Play />}
        </button>

        <button
          onClick={() => (audioActivo ? detenerNarracion() : reproducirNarracion("Modo narración activado."))}
          className="p-2 bg-green-500 text-white rounded-full"
        >
          {audioActivo ? <VolumeX /> : <Volume2 />}
        </button>

        <button
          onClick={() => reproducirNarracion(curiosidades[Math.floor(Math.random() * curiosidades.length)])}
          className="p-2 bg-yellow-500 text-white rounded-full"
        >
          <Star />
        </button>
      </div>
    </div>
  );
}
