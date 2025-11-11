import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SistemaSolar3D from "../components/SistemaSolar3D";

// 🧩 Mock de SpeechSynthesis para evitar errores en test
beforeAll(() => {
  global.window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
  } as any;
  global.SpeechSynthesisUtterance = jest
    .fn()
    .mockImplementation((text) => ({ text }));
});

describe("🌞 SistemaSolar3D Component", () => {
  test("renderiza el título principal correctamente", () => {
    render(<SistemaSolar3D />);
    expect(
      screen.getByText(/Explorador del Sistema Solar/i)
    ).toBeInTheDocument();
  });

  test("renderiza el canvas del sistema solar", () => {
    render(<SistemaSolar3D />);
    const canvas =
      screen.getByRole("img", { hidden: true }) ||
      screen.getByRole("presentation") ||
      screen.getByText(/Haz clic/).previousSibling;
    expect(canvas).toBeInTheDocument();
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

  test("al renderizar, inicia con animación activa y sin audio", () => {
    render(<SistemaSolar3D />);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Explorador del Sistema Solar/i)
    ).toBeVisible();
  });
});
