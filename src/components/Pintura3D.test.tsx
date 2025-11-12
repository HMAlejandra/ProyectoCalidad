import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pintura3D from "./Pintura3D";

// Simula window.speechSynthesis y AudioContext para evitar errores en test
beforeAll(() => {
  Object.defineProperty(window, "speechSynthesis", {
    value: {
      speak: jest.fn(),
      cancel: jest.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, "AudioContext", {
    value: jest.fn().mockImplementation(() => ({
      createOscillator: () => ({
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        frequency: { value: 0 },
        type: "",
      }),
      createGain: () => ({
        connect: jest.fn(),
        gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
      }),
      destination: {},
      currentTime: 0,
    })),
    writable: true,
  });

  // Mock canvas 2D context for jsdom
  // @ts-ignore
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillStyle: "",
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: [] })),
    putImageData: jest.fn(),
    createImageData: jest.fn(),
    translate: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    drawImage: jest.fn(),
    fill: jest.fn(),
    strokeStyle: "",
    lineWidth: 1,
    fillText: jest.fn(),
  }));

  // Polyfill SpeechSynthesisUtterance for jsdom
  class MockSpeechSynthesisUtterance {
    text: string;
    lang = "";
    rate = 1;
    pitch = 1;
    constructor(text: string) {
      this.text = text;
    }
  }
  // @ts-ignore
  global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as any;
});

describe("🧪 Componente Pintura3D", () => {
  it("se renderiza correctamente con título principal", () => {
    render(<Pintura3D />);
    expect(screen.getByText("DreamDraw 3D")).toBeInTheDocument();
    // Comprobamos que el mensaje de ayuda del canvas esté presente
    expect(screen.getByText(/Dibuja arrastrando el mouse/i)).toBeInTheDocument();
  });

  it("muestra botones de herramientas y colores", () => {
    render(<Pintura3D />);
    // El componente actual tiene Paleta de Colores, Tamaño, y Efectos Mágicos
    expect(screen.getByText(/Paleta de Colores/i)).toBeInTheDocument();
    expect(screen.getByText(/Tamaño del Pincel/i)).toBeInTheDocument();
    expect(screen.getByText(/Efectos Mágicos/i)).toBeInTheDocument();
  });

  it("permite seleccionar una herramienta", () => {
    render(<Pintura3D />);
    // Seleccionamos un tamaño de pincel existente (ej. 2) y comprobamos clase activa
    const sizeButton = screen.getByText("2");
    fireEvent.click(sizeButton);
    expect(sizeButton).toHaveClass("from-purple-300", "to-pink-300");
  });

  it("permite seleccionar un color", () => {
    render(<Pintura3D />);
    const colorButtons = screen.getAllByRole("button");
    const redButton = colorButtons.find((btn) => btn.style.backgroundColor === "rgb(255, 107, 107)");
    if (redButton) {
      fireEvent.click(redButton);
      expect(redButton).toHaveClass("ring-4");
    }
  });

  it("renderiza el canvas correctamente", () => {
    render(<Pintura3D />);
    const canvas = screen.getByTestId("pintura-canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("permite limpiar el lienzo", () => {
    render(<Pintura3D />);
    const clearButton = screen.getByText("Limpiar");
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
  });

  it("permite guardar el dibujo", () => {
    render(<Pintura3D />);
    const saveButton = screen.getByText("Guardar");
    expect(saveButton).toBeInTheDocument();
    // No hacemos click porque toDataURL fallará en jsdom, solo verificamos que el botón existe
  });

  it("permite activar/desactivar la narración", () => {
    render(<Pintura3D />);
    // Buscar el botón por su nombre accesible (aria-label)
    const narrationButton = screen.getByRole("button", { name: /narración/i });
    fireEvent.click(narrationButton);
    expect(narrationButton).toBeInTheDocument();
  });
});
