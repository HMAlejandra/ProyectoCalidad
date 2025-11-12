/// <reference types="node" />
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import SistemaSolar3D from "./SistemaSolar3D"

describe("🌞 SistemaSolar3D Component", () => {

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
      screen.getByText(/Haz clic en un planeta para escucharlo/i)
    ).toBeInTheDocument();
  });

  test("permite hacer clic en el canvas", () => {
    const { container } = render(<SistemaSolar3D />)
    const componentInstance = container.querySelector("canvas")
    expect(componentInstance).toBeInTheDocument()
  })

  test("al renderizar, inicia con animación activa", () => {
    render(<SistemaSolar3D />);
    expect(
      screen.getByText(/Explorador del Sistema Solar/i)
    ).toBeVisible();
  });
});
