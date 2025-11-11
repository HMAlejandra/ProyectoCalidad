import React, { useEffect } from "react";
import { Volume2, Rocket, Sun } from "lucide-react";


const SistemaSolar3DView: React.FC = () => {
  const narrar = (texto: string) => {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(mensaje);
  };

  useEffect(() => {
    narrar("¡Hola explorador! Hoy viajaremos por el sistema solar. Observa los planetas y escucha sus secretos.");
  }, []);

  const planetas = [
    { nombre: "Mercurio", color: "bg-gray-400", texto: "Soy Mercurio, el más cercano al sol." },
    { nombre: "Venus", color: "bg-yellow-500", texto: "Soy Venus, el planeta más brillante." },
    { nombre: "Tierra", color: "bg-blue-500", texto: "Soy la Tierra, donde vivimos todos." },
    { nombre: "Marte", color: "bg-red-500", texto: "Soy Marte, el planeta rojo." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
        <Sun size={36} /> Sistema Solar Interactivo
      </h1>

      <button
        onClick={() => narrar("Explora los planetas tocando sus nombres. Cada uno te contará algo especial.")}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg mb-6 flex items-center gap-2"
      >
        <Volume2 /> Repetir narración
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {planetas.map((planeta) => (
          <button
            key={planeta.nombre}
            onClick={() => narrar(planeta.texto)}
            className={`p-6 rounded-full shadow-lg hover:scale-110 transition-transform ${planeta.color}`}
          >
            {planeta.nombre}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <Rocket size={48} className="text-emerald-400 animate-bounce" />
      </div>
    </div>
  );
};

export default SistemaSolar3DView;
