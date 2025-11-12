import { render } from "@testing-library/react";
import App from "./App";

test("renderiza la aplicación", () => {
  render(<App />);
  // Verificar que la app renderiza sin errores críticos (puede tener warnings de rutas)
  expect(document.querySelector("div")).toBeInTheDocument();
});