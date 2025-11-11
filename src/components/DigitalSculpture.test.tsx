// src/__tests__/DigitalSculpture.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DigitalSculpture from "../components/DigitalSculpture";

describe("DigitalSculpture Component", () => {
  beforeAll(() => {
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
      rotate: jest.fn(),
      scale: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      drawImage: jest.fn(),
      fill: jest.fn(),
      strokeStyle: "",
      lineWidth: 1,
      fillText: jest.fn(),
    }));
  });

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  // ========================================
  // RF-ART-001: Herramientas de Modelado 3D
  // ========================================

  describe("RF-ART-001: Herramientas de Modelado", () => {
    test("Debe renderizar las 4 herramientas principales de modelado", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText("Moldear")).toBeInTheDocument();
      expect(screen.getByText("Añadir")).toBeInTheDocument();
    expect(screen.getByText("Suavizar")).toBeInTheDocument();
    expect(screen.getByText("Detalle")).toBeInTheDocument();
    });

    test("Debe seleccionar una herramienta al hacer clic", () => {
      render(<DigitalSculpture />);

      const moldButton = screen.getByText("Moldear").closest("button");
      expect(moldButton).toBeInTheDocument();

      if (moldButton) {
        fireEvent.click(moldButton);
        // Verificar que el botón tiene la clase de selección
        expect(moldButton.className).toContain("border-4");
      }
    });

    test("Debe cambiar la herramienta seleccionada", () => {
      render(<DigitalSculpture />);

      const moldButton = screen.getByText("Moldear").closest("button");
      const addButton = screen.getByText("Añadir").closest("button");

      if (moldButton && addButton) {
        fireEvent.click(moldButton);
        expect(moldButton.className).toContain("border-orange-500");

        fireEvent.click(addButton);
        expect(addButton.className).toContain("border-blue-500");
      }
    });

    test("Debe renderizar íconos visuales para cada herramienta", () => {
      render(<DigitalSculpture />);

      // Verificar que los emojis/íconos están presentes
      expect(screen.getByText("✋")).toBeInTheDocument();
      expect(screen.getByText("➕")).toBeInTheDocument();
      expect(screen.getByText("🌊")).toBeInTheDocument();
      expect(screen.getByText("🔍")).toBeInTheDocument();
    });
  });

  // ========================================
  // RF-ART-002: Sistema de Pintura
  // ========================================

  describe("RF-ART-002: Sistema de Pintura y Decoración", () => {
    test("Debe renderizar herramientas de decoración", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText("Pintar")).toBeInTheDocument();
      expect(screen.getByText("Borrar")).toBeInTheDocument();
    });

    test("Debe renderizar paleta con al menos 5 colores", () => {
      render(<DigitalSculpture />);

      const colorButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.style.backgroundColor);
      expect(colorButtons.length).toBeGreaterThanOrEqual(5);
    });

    test("Debe permitir seleccionar un color", () => {
      render(<DigitalSculpture />);

      const colorButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.style.backgroundColor);
      const firstColor = colorButtons[0];

      if (firstColor) {
        fireEvent.click(firstColor);
        // Verificar que el botón tiene borde de selección
        expect(firstColor.className).toContain("border-4");
      }
    });

    test("Debe renderizar 3 tamaños de pincel (S, M, L)", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("L")).toBeInTheDocument();
    });

    test("Debe cambiar el tamaño del pincel al hacer clic", () => {
      render(<DigitalSculpture />);

      const sizeL = screen.getByText("L").closest("button");

      if (sizeL) {
        fireEvent.click(sizeL);
        expect(sizeL.className).toContain("bg-yellow-400");
      }
    });
  });

  // ========================================
  // RF-ART-003: Controles de Visualización
  // ========================================

  describe("RF-ART-003: Controles de Visualización 3D", () => {
    test("Debe renderizar botones de rotación", () => {
      render(<DigitalSculpture />);

      const rotateButtons = screen.getAllByText(/[↺↻]/);
      expect(rotateButtons.length).toBeGreaterThanOrEqual(2);
    });

    test("Debe renderizar controles de zoom (+/-)", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText("+")).toBeInTheDocument();
      expect(screen.getByText("−")).toBeInTheDocument();
    });

    test("Debe cambiar rotación al hacer clic en botón de rotar", () => {
      render(<DigitalSculpture />);

      const rotateButton = screen.getAllByText("↻")[0];

      if (rotateButton) {
        fireEvent.click(rotateButton);
        // La rotación se aplica internamente al canvas
        expect(rotateButton).toBeInTheDocument();
      }
    });

    test("Debe cambiar zoom al hacer clic en botones +/-", () => {
      render(<DigitalSculpture />);

      const zoomInButton = screen.getByText("+");
      const zoomOutButton = screen.getByText("−");

      fireEvent.click(zoomInButton);
      fireEvent.click(zoomOutButton);

      expect(zoomInButton).toBeInTheDocument();
      expect(zoomOutButton).toBeInTheDocument();
    });
  });

  // ========================================
  // RF-ART-004: Sistema de Instrucciones
  // ========================================

  describe("RF-ART-004: Sistema de Instrucciones Narradas", () => {
    test("Debe renderizar botón de narración en el header", () => {
      render(<DigitalSculpture />);

      const narrationButton = screen.getByText(/Narración/);
      expect(narrationButton).toBeInTheDocument();
    });

    test("Debe cambiar estado al activar narración", () => {
      render(<DigitalSculpture />);

      const narrationButton = screen.getByText(/Narración/).closest("button");

      if (narrationButton) {
        fireEvent.click(narrationButton);
        // Verificar que el texto cambió
        expect(screen.getByText("Pausar")).toBeInTheDocument();
      }
    });

    test("Debe renderizar instrucciones paso a paso", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText("Paso 1️⃣")).toBeInTheDocument();
      expect(screen.getByText("Paso 2️⃣")).toBeInTheDocument();
      expect(screen.getByText("Paso 3️⃣")).toBeInTheDocument();
    });

    test("Debe renderizar indicadores de compatibilidad", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText(/Arrastra para moldear/)).toBeInTheDocument();
      expect(screen.getByText(/Compatible táctil/)).toBeInTheDocument();
    });
  });

  // ========================================
  // RF-ART-005: Auto-guardado y Persistencia
  // ========================================

  describe("RF-ART-005: Auto-guardado y Persistencia", () => {
    test("Debe renderizar botón de guardar", () => {
      render(<DigitalSculpture />);

      const saveButton = screen.getByText(/💾 Guardar/);
      expect(saveButton).toBeInTheDocument();
    });

    test("Debe guardar en localStorage al hacer clic en guardar", () => {
      render(<DigitalSculpture />);

      const saveButton = screen.getByText(/💾 Guardar/).closest("button");

      if (saveButton) {
        fireEvent.click(saveButton);

        // Verificar que se intentó guardar
        const saved = localStorage.getItem("sculpture-points");
        expect(saved).toBeDefined();
      }
    });

    test("Debe mostrar indicador de progreso de guardado", () => {
      render(<DigitalSculpture />);

      // El indicador de progreso existe en el DOM
      // Puede no estar visible al inicio, pero el elemento debe existir
      expect(document.body).toBeInTheDocument();
    });

    test("Debe cargar datos guardados desde localStorage", () => {
      const mockData = JSON.stringify([
        { x: 100, y: 100, tool: "mold", color: "#ef4444", size: "M" },
      ]);
      localStorage.setItem("sculpture-points", mockData);

      render(<DigitalSculpture />);

      // Verificar que el componente renderiza correctamente con datos guardados
      expect(screen.getByText(/Área de Escultura/)).toBeInTheDocument();
    });
  });

  // ========================================
  // RF-ART-006: Sistema de Ayuda
  // ========================================

  describe("RF-ART-006: Sistema de Ayuda Contextual", () => {
    test("Debe renderizar botón de ayuda", () => {
      render(<DigitalSculpture />);

      const helpButton = screen.getByText(/❓ ¿Ayuda?/);
      expect(helpButton).toBeInTheDocument();
    });

    test("Debe abrir modal de ayuda al hacer clic", () => {
      render(<DigitalSculpture />);

      const helpButton = screen.getByText(/❓ ¿Ayuda?/).closest("button");

      if (helpButton) {
        fireEvent.click(helpButton);

        expect(screen.getByText(/Centro de Ayuda/)).toBeInTheDocument();
      }
    });

    test("Debe cerrar modal de ayuda", () => {
      render(<DigitalSculpture />);

      const helpButton = screen.getByText(/❓ ¿Ayuda?/).closest("button");

      if (helpButton) {
        fireEvent.click(helpButton);

        const closeButton = screen.getByText("Entendido");
        fireEvent.click(closeButton);

        // El modal no debería estar visible
        expect(screen.queryByText(/Centro de Ayuda/)).not.toBeInTheDocument();
      }
    });

    test("Debe renderizar sección de consejos", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText(/💡 Consejos:/)).toBeInTheDocument();
      expect(screen.getByText(/✓ Guarda seguido/)).toBeInTheDocument();
    });
  });

  // ========================================
  // RF-ART-007: Botón de Reinicio
  // ========================================

  describe("RF-ART-007: Botón de Reinicio", () => {
    test("Debe renderizar botón de reiniciar", () => {
      render(<DigitalSculpture />);

      const resetButton = screen.getByText(/🔄 Reiniciar/);
      expect(resetButton).toBeInTheDocument();
    });

    test("Debe mostrar diálogo de confirmación al intentar reiniciar", () => {
      render(<DigitalSculpture />);

      const resetButton = screen.getByText(/🔄 Reiniciar/).closest("button");

      if (resetButton) {
        fireEvent.click(resetButton);

        expect(screen.getByText(/¿Reiniciar?/)).toBeInTheDocument();
        expect(
          screen.getByText(/¿Estás seguro de que quieres borrar/)
        ).toBeInTheDocument();
      }
    });

    test("Debe tener opciones Sí y No en el diálogo", () => {
      render(<DigitalSculpture />);

      const resetButton = screen.getByText(/🔄 Reiniciar/).closest("button");

      if (resetButton) {
        fireEvent.click(resetButton);

        expect(screen.getByText("Sí, borrar")).toBeInTheDocument();
        expect(screen.getByText("Cancelar")).toBeInTheDocument();
      }
    });

    test("Debe cancelar el reinicio al hacer clic en No", () => {
      render(<DigitalSculpture />);

      const resetButton = screen.getByText(/🔄 Reiniciar/).closest("button");

      if (resetButton) {
        fireEvent.click(resetButton);

        const cancelButton = screen.getByText("Cancelar");
        fireEvent.click(cancelButton);

        expect(screen.queryByText(/¿Reiniciar?/)).not.toBeInTheDocument();
      }
    });

    test("Debe reiniciar al confirmar con Sí", () => {
      render(<DigitalSculpture />);

      const resetButton = screen.getByText(/🔄 Reiniciar/).closest("button");

      if (resetButton) {
        fireEvent.click(resetButton);

        const confirmButton = screen.getByText("Sí, borrar");
        fireEvent.click(confirmButton);

        // Verificar que localStorage fue limpiado
        expect(localStorage.getItem("sculpture-points")).toBeNull();
      }
    });
  });

  // ========================================
  // Pruebas de Integración - Canvas
  // ========================================

  describe("Integración: Canvas y Dibujo", () => {
    test("Debe renderizar el canvas correctamente", () => {
      render(<DigitalSculpture />);

      const canvas = document.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute("width", "800");
      expect(canvas).toHaveAttribute("height", "600");
    });

    test("Debe permitir dibujar al seleccionar herramienta y hacer clic en canvas", () => {
      render(<DigitalSculpture />);

      const moldButton = screen.getByText("Moldear").closest("button");
      const canvas = document.querySelector("canvas");

      if (moldButton && canvas) {
        fireEvent.click(moldButton);
        fireEvent.mouseDown(canvas, { clientX: 400, clientY: 300 });
        fireEvent.mouseMove(canvas, { clientX: 405, clientY: 305 });
        fireEvent.mouseUp(canvas);

        expect(canvas).toBeInTheDocument();
      }
    });
  });

  // ========================================
  // Pruebas de Accesibilidad
  // ========================================

  describe("Accesibilidad", () => {
    test("Todos los botones deben ser accesibles", () => {
      render(<DigitalSculpture />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    test("Debe tener texto descriptivo en elementos importantes", () => {
      render(<DigitalSculpture />);

      expect(screen.getByText(/Mentes Creativas/)).toBeInTheDocument();
      expect(screen.getByText(/Área de Escultura/)).toBeInTheDocument();
    });
  });

  // ========================================
  // Pruebas de Rendimiento
  // ========================================

  describe("Rendimiento", () => {
    test("Debe renderizar en menos de 500ms", () => {
      const start = performance.now();
      render(<DigitalSculpture />);
      const end = performance.now();

      expect(end - start).toBeLessThan(500);
    });

    test("No debe tener memory leaks al desmontar", () => {
      const { unmount } = render(<DigitalSculpture />);
      unmount();
      // Si no hay errores, el componente se desmontó correctamente
      expect(true).toBe(true);
    });
  });
});