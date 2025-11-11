import React, { useState, useRef, useEffect } from "react";
import {
  RotateCcw,
  Save,
  Volume2,
  VolumeX,
  Paintbrush,
  Info,
} from "lucide-react";


const Pintura3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#FF6B6B");
  const [brushSize, setBrushSize] = useState(2);
  const [effect, setEffect] = useState("glow");
  const [isDrawing, setIsDrawing] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const lastMouseXRef = useRef(0);
  const lastMouseYRef = useRef(0);

  const colors = [
    ["#FF6B6B", "#74B9FF", "#55EFC4", "#FECA57", "#FF7979", "#FFFFFF"],
    ["#FF6348", "#5F9EE8", "#4CD47D", "#FFA45C", "#FF5E7D", "#F0F0F0"],
  ];

  // Herramientas disponibles (para uso futuro)
  // const tools = [
  //   { id: "brush", name: "Pincel", icon: Paintbrush, description: "Dibuja líneas suaves" },
  //   { id: "eraser", name: "Borrador", icon: Eraser, description: "Borra partes del dibujo" },
  // ];

  const brushSizes = [1, 2, 4, 8, 16];

  const effects = [
    { id: "glow", name: "Brillo", color: "from-blue-400 to-cyan-400" },
    { id: "sparkle", name: "Chispas", color: "from-pink-400 to-purple-400" },
    { id: "shimmer", name: "Brillos", color: "from-yellow-400 to-orange-400" },
  ];

  // Inicializar el lienzo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx!.fillStyle = "#E8F4F8";
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
    speak("Bienvenido a DreamDraw 3D. Elige una herramienta para empezar a dibujar");
  }, []);

  const speak = (text: string) => {
    if (!narrationEnabled) return;

    // Efecto sonoro simple
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 600;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log("Audio context error:", e);
    }

    // Narración de voz
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Narración:", text);
    }
  };

  const startDrawing = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    lastMouseXRef.current = x;
    lastMouseYRef.current = y;
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current!.getContext("2d");
    ctx!.beginPath();
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = brushSize * 8;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.shadowBlur = effect === "glow" ? 20 : 0;
    ctx.shadowColor = effect === "glow" ? color : "transparent";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = "#E8F4F8";
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    speak("Lienzo limpio, listo para una nueva obra de arte");
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current!;
    const link = document.createElement("a");
    link.download = "mi-dibujo-3d.png";
    link.href = canvas.toDataURL();
    link.click();
    speak("Tu dibujo ha sido guardado exitosamente");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Paintbrush className="text-yellow-500" /> DreamDraw 3D
          </h1>
          <button
            onClick={() => {
              const newState = !narrationEnabled;
              setNarrationEnabled(newState);
              setTimeout(() => speak(newState ? "Narración activada" : "Narración desactivada"), 100);
            }}
            className="p-3 bg-gray-100 rounded-xl"
            aria-label={narrationEnabled ? "Desactivar narración" : "Activar narración"}
          >
            {narrationEnabled ? <Volume2 /> : <VolumeX />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-gray-700">Colores</h3>
            <div className="grid grid-cols-6 gap-2">
              {colors.flat().map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-full rounded-lg ${color === c ? "ring-4 ring-yellow-400" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <h3 className="font-semibold text-gray-700">Tamaño</h3>
            <div className="flex gap-2">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`px-3 py-2 rounded-lg ${brushSize === size ? "bg-yellow-400 text-white" : "bg-gray-200"}`}
                >
                  {size}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-gray-700">Efectos</h3>
            <div className="flex flex-col gap-2">
              {effects.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => setEffect(id)}
                  className={`p-2 rounded-lg ${
                    effect === id ? "bg-yellow-400 text-white" : "bg-gray-200"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveDrawing}
                className="flex-1 bg-green-400 hover:bg-green-500 text-white py-2 rounded-lg font-semibold"
              >
                <Save className="inline mr-2" /> Guardar
              </button>
              <button
                onClick={clearCanvas}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg font-semibold"
              >
                <RotateCcw className="inline mr-2" /> Limpiar
              </button>
            </div>
          </div>

          <div className="flex-[2] bg-gray-50 rounded-xl border shadow-inner p-2 relative">
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
              className="w-full h-full cursor-crosshair bg-white rounded-xl"
            />
            <div className="absolute bottom-2 left-2 bg-yellow-100 border border-yellow-300 text-gray-700 text-sm rounded-lg px-3 py-1 flex items-center gap-1">
              <Info className="w-4 h-4 text-yellow-600" /> Dibuja arrastrando el mouse o tu dedo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pintura3D;
