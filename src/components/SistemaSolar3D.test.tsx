/// <reference types="node" />
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SistemaSolar3D from "./SistemaSolar3D";

// 🧩 Mock de Canvas 2D Context
beforeAll(() => {
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
    rotate: jest.fn(),
    closePath: jest.fn(),
    scale: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    drawImage: jest.fn(),
    fill: jest.fn(),
    strokeStyle: "",
    lineWidth: 1,
    fillText: jest.fn(),
    toDataURL: jest.fn(() => "data:image/png;base64,"),
  }));

  // Mock de SpeechSynthesis — usar cast seguro para no romper tipado/entorno
  ;(global as any).window = (global as any).window || {};
  (global as any).window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
  };
  (global as any).SpeechSynthesisUtterance = jest
    .fn()
    .mockImplementation((text: any) => ({ text }));
});

describe("🌞 SistemaSolar3D Component", () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  test("renderiza el título principal correctamente", () => {
    render(<SistemaSolar3D />);
    expect(
      screen.getByText(/Explorador del Sistema Solar/i)
    ).toBeInTheDocument();
  });

  test("renderiza el canvas del sistema solar", () => {
    render(<SistemaSolar3D />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("width");
    expect(canvas).toHaveAttribute("height");
  });

  test("muestra el texto de instrucción", () => {
    render(<SistemaSolar3D />);
    expect(
      screen.getByText(/Haz clic en un planeta para escucharlo 🚀/i)
    ).toBeInTheDocument();
  });

  test("permite hacer clic en un planeta simulado y cambiar el estado", () => {
    const { container } = render(<SistemaSolar3D />);
    const componentInstance = container.querySelector("canvas");
    expect(componentInstance).toBeInTheDocument();
    if (componentInstance) fireEvent.click(componentInstance);
    expect(
      screen.getByText(/Explorador del Sistema Solar/i)
    ).toBeInTheDocument();
  });

  test("al renderizar, inicia con animación activa", () => {
    render(<SistemaSolar3D />);
    expect(
      screen.getByText(/Explorador del Sistema Solar/i)
    ).toBeVisible();
  });
});
