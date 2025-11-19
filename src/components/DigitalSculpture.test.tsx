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
      fillText: jest.fn(), toDataURL: jest.fn(() => "data:image/png;base64,"),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      }))
    }));
  });

  beforeEach(() => {
    localStorage.clear();
  });

  test("renderiza herramientas", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Círculo")).toBeInTheDocument();
    expect(screen.getByText("Cuadrado")).toBeInTheDocument();
  });

  test("renderiza más herramientas", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Triángulo")).toBeInTheDocument();
    expect(screen.getByText("Borrar")).toBeInTheDocument();
  });

  test("renderiza íconos", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("🔵")).toBeInTheDocument();
    expect(screen.getByText("⬜")).toBeInTheDocument();
  });

  test("renderiza botón de guardar", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Guardar")).toBeInTheDocument();
  });

  test("renderiza botón de nuevo", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
  });

  test("renderiza canvas", () => {
    render(<DigitalSculpture />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("renderiza header", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Escultura Creativa 3D")).toBeInTheDocument();
  });

  test("renderiza área de lienzo", () => {
    render(<DigitalSculpture />);
    expect(screen.getByText("Lienzo de Creatividad")).toBeInTheDocument();
  });

  test("diálogo de nuevo", () => {
    render(<DigitalSculpture />);
    const btn = screen.getByText("Nuevo");
    fireEvent.click(btn);
    expect(screen.getByText("¿Crear nueva obra?")).toBeInTheDocument();
  });

  test("cancela nuevo", () => {
    render(<DigitalSculpture />);
    const btn = screen.getByText("Nuevo");
    fireEvent.click(btn);
    const cancelBtn = screen.getByText("Cancelar");
    fireEvent.click(cancelBtn);
    expect(screen.queryByText("¿Crear nueva obra?")).not.toBeInTheDocument();
  });
});
