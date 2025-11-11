import { useState, useRef, useEffect } from "react";

// Tipos
type Tool = "mold" | "add" | "smooth" | "detail" | "paint" | "eraser" | null;
type BrushSize = "S" | "M" | "L";
type Color = string;

interface Point {
  x: number;
  y: number;
  tool: Tool;
  color: Color;
  size: BrushSize;
}

export default function DigitalSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>(null);
  const [selectedColor, setSelectedColor] = useState<Color>("#ef4444");
  const [brushSize] = useState<BrushSize>("M");
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [narrationActive, setNarrationActive] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const colors = ["#ef4444", "#3b82f6", "#fbbf24", "#10b981", "#a855f7"];

  // 🔊 Función para hablar
  const speak = (text: string) => {
    if (!narrationActive) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.pitch = 1.2;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // Auto-guardado cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (points.length > 0) {
        localStorage.setItem("sculpture-points", JSON.stringify(points));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [points]);

  // Cargar progreso guardado
  useEffect(() => {
    const saved = localStorage.getItem("sculpture-points");
    if (saved) {
      try {
        setPoints(JSON.parse(saved));
      } catch {
        console.error("Error loading saved data");
      }
    }
  }, []);

  // Renderizar figura humana
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Transformaciones
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // 🧍 FIGURA HUMANA BASE

    // Piernas
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(370, 380, 25, 120);
    ctx.fillRect(405, 380, 25, 120);

    // Cuerpo
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(360, 260);
    ctx.lineTo(440, 260);
    ctx.lineTo(460, 380);
    ctx.lineTo(340, 380);
    ctx.closePath();
    ctx.fill();

    // Brazos
    ctx.save();
    ctx.translate(400, 280);
    ctx.rotate((Math.sin(rotation * Math.PI / 180) * 10) * Math.PI / 180);
    ctx.fillStyle = "#fde68a";
    ctx.fillRect(-80, 0, 50, 20);
    ctx.fillRect(30, 0, 50, 20);
    ctx.restore();

    // Cuello y cabeza
    ctx.fillStyle = "#fde68a";
    ctx.fillRect(385, 250, 30, 20);
    ctx.beginPath();
    ctx.arc(400, 210, 45, 0, Math.PI * 2);
    ctx.fill();

    // Cabello
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.arc(400, 190, 45, Math.PI, 2 * Math.PI);
    ctx.fill();

    // Ojos y sonrisa
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(385, 210, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(415, 210, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(400, 225, 15, 0, Math.PI, false);
    ctx.stroke();

    // Puntos (dibujos)
    points.forEach((p) => {
      const size = p.size === "S" ? 5 : p.size === "M" ? 10 : 20;

      if (p.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }, [points, rotation, zoom]);

  // Eventos de dibujo
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedTool) return;
    setIsDrawing(true);
    addPoint(e);
    speak(`Estás usando la herramienta ${toolName(selectedTool)}.`);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !selectedTool) return;
    addPoint(e);
  };

  const stopDrawing = () => setIsDrawing(false);

  const addPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((p) => [...p, { x, y, tool: selectedTool, color: selectedColor, size: brushSize }]);
  };

  // Conversión de nombres amigables para niños
  const toolName = (tool: Tool) => {
    switch (tool) {
      case "mold":
        return "Moldear";
      case "add":
        return "Agregar";
      case "smooth":
        return "Suavizar";
      case "detail":
        return "Detalles";
      case "paint":
        return "Pintar";
      case "eraser":
        return "Borrar";
      default:
        return "ninguna";
    }
  };

  // Guardar y reset
  const handleSave = () => {
    localStorage.setItem("sculpture-points", JSON.stringify(points));
    speak("¡Tu escultura ha sido guardada!");
  };

  const handleReset = () => {
    setPoints([]);
    setRotation(0);
    setZoom(1);
    localStorage.removeItem("sculpture-points");
    speak("Tu escultura se ha borrado. Puedes comenzar una nueva.");
    setShowResetDialog(false);
  };

  const toggleNarration = () => {
    setNarrationActive(!narrationActive);
    if (!narrationActive) {
      speak("¡Hola! Soy tu ayudante digital. Vamos a crear una escultura divertida en 3D. Usa las herramientas para moldear, pintar o borrar. ¡Diviértete!");
    } else {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🎨 Escultura Digital 3D</h1>
          <p className="text-sm text-indigo-200">Módulo interactivo - Mentes Creativas</p>
        </div>
        <button
          onClick={toggleNarration}
          className={`${narrationActive ? "bg-red-500" : "bg-yellow-500"} hover:bg-yellow-600 px-4 py-2 rounded-full font-semibold transition`}
        >
          🔊 {narrationActive ? "Detener voz" : "Activar narración"}
        </button>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lateral de herramientas */}
        <aside className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-indigo-600">🛠️ Herramientas</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key: "mold", label: "Moldear", icon: "✋" },
              { key: "add", label: "Añadir", icon: "➕" },
              { key: "smooth", label: "Suavizar", icon: "🌊" },
              { key: "detail", label: "Detalle", icon: "🔍" },
              { key: "paint", label: "Pintar", icon: "🎨" },
              { key: "eraser", label: "Borrar", icon: "🧽" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setSelectedTool(t.key as Tool);
                  speak(`Seleccionaste la herramienta ${t.label}.`);
                }}
                className={`h-24 rounded-lg border-2 transition flex flex-col items-center justify-center ${
                  selectedTool === t.key ? "bg-yellow-100 border-yellow-500 border-4" : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className="text-3xl">{t.icon}</div>
                <div className="text-xs font-semibold text-gray-900">{t.label}</div>
              </button>
            ))}
          </div>

          <h3 className="font-semibold text-gray-700 mb-3">🎨 Colores:</h3>
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  speak(`Color cambiado`);
                }}
                className={`w-10 h-10 rounded-full border-2 transition ${
                  selectedColor === color ? "border-black border-4 scale-110" : "border-gray-400"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold">
              💾 Guardar
            </button>
            <button onClick={() => setShowResetDialog(true)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold">
              🔄 Reiniciar
            </button>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex flex-col p-6">
          <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-bold text-gray-700">🎭 Área de Escultura</h2>
            </div>

            <div className="flex-1 relative bg-gray-50 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="border-2 border-gray-300 rounded-lg cursor-crosshair"
              />
              <button
                onClick={() => {
                  setRotation((r) => r - 15);
                  speak("Giraste a la izquierda");
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full text-2xl shadow-lg"
              >
                ↺
              </button>
              <button
                onClick={() => {
                  setRotation((r) => r + 15);
                  speak("Giraste a la derecha");
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full text-2xl shadow-lg"
              >
                ↻
              </button>
            </div>
          </div>
        </main>
      </div>

      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-xl font-bold mb-4">🔄 ¿Reiniciar?</h3>
            <p className="mb-6">Esto borrará tu escultura actual.</p>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold">
                Sí, borrar
              </button>
              <button onClick={() => setShowResetDialog(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
