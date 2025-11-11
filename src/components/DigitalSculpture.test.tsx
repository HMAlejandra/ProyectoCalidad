import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DigitalSculpture from "./DigitalSculpture";

describe("DigitalSculpture", () => {
  beforeAll(() => {
    // @ts-ignore
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      fillStyle: "", fillRect: jest.fn(), beginPath: jest.fn(), moveTo: jest.fn(),
      lineTo: jest.fn(), stroke: jest.fn(), arc: jest.fn(), clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: [] })), putImageData: jest.fn(),
      createImageData: jest.fn(), translate: jest.fn(), rotate: jest.fn(),
      closePath: jest.fn(), scale: jest.fn(), save: jest.fn(), restore: jest.fn(),
      drawImage: jest.fn(), fill: jest.fn(), strokeStyle: "", lineWidth: 1,
      fillText: jest.fn(), toDataURL: jest.fn(() => "data:image/png;base64,")
    }));
  });

  beforeEach(() => {
    localStorage.clear();
  });

  test("renderiza herramientas", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Moldear")).toBeInTheDocument();
    expect(screen.getByText("Añadir")).toBeInTheDocument();
  });

  test("renderiza decoración", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Pintar")).toBeInTheDocument();
    expect(screen.getByText("Borrar")).toBeInTheDocument();
  });

  test("renderiza íconos", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("✋")).toBeInTheDocument();
    expect(screen.getByText("➕")).toBeInTheDocument();
  });

  test("renderiza botón de guardar", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText(/💾 Guardar/)).toBeInTheDocument();
  });

  test("renderiza botón de reiniciar", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText(/🔄 Reiniciar/)).toBeInTheDocument();
  });

  test("renderiza canvas", () => {
    render(<DigitalSculpture />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("renderiza header", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText(/Módulo interactivo - Mentes Creativas/)).toBeInTheDocument();
  });

  test("renderiza área de escultura", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText(/Área de Escultura/)).toBeInTheDocument();
  });

  test("diálogo de reinicio", () => {
    render(<DigitalSculpture />);
    const btn = screen.getByText(/🔄 Reiniciar/).closest("button");
    if (btn) {
      fireEvent.click(btn);
      expect(screen.getByText(/¿Reiniciar\?/)).toBeInTheDocument();
    }
  });

  test("cancela reinicio", () => {
    render(<DigitalSculpture />);
    const btn = screen.getByText(/🔄 Reiniciar/).closest("button");
    if (btn) {
      fireEvent.click(btn);
      const cancelBtn = screen.getByText(/Cancelar/);
      fireEvent.click(cancelBtn);
      expect(screen.queryByText(/¿Reiniciar\?/)).not.toBeInTheDocument();
    }
  });
});
