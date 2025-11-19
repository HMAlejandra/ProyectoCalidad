import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SistemaSolar3D from './SistemaSolar3D';

describe('SistemaSolar3D Component', () => {
  beforeAll(() => {
    // Mock canvas 2D context
    // @ts-ignore
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      clearRect: jest.fn(),
      fillStyle: '',
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      strokeStyle: '',
      lineWidth: 1,
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      closePath: jest.fn(),
      fillText: jest.fn(),
    }));
  });

  it('should render the main title', () => {
    render(<SistemaSolar3D />);
    const title = screen.getByText(/Explorador del Sistema Solar/i);
    expect(title).toBeInTheDocument();
  });

  it('should render the canvas element', () => {
    render(<SistemaSolar3D />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should display initial instructions', () => {
    render(<SistemaSolar3D />);
    const instructions = screen.getByText(/Haz clic en los planetas/i);
    expect(instructions).toBeInTheDocument();
  });

  it('should render canvas with correct dimensions', () => {
    render(<SistemaSolar3D />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toHaveAttribute('width', '900');
    expect(canvas).toHaveAttribute('height', '650');
  });

  it('should render points counter', () => {
    render(<SistemaSolar3D />);
    expect(screen.getByText(/puntos/i)).toBeInTheDocument();
  });

  it('should render discovered planets section', () => {
    render(<SistemaSolar3D />);
    expect(screen.getByText(/Planetas Descubiertos/i)).toBeInTheDocument();
  });

  it('should render all required sections', () => {
    render(<SistemaSolar3D />);
    expect(screen.getByText(/Tu Progreso/i)).toBeInTheDocument();
    expect(screen.getByText(/Controles/i)).toBeInTheDocument();
  });

  it('should have a canvas element that can be clicked', () => {
    render(<SistemaSolar3D />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeTruthy();
    expect(typeof canvas.click).toBe('function');
  });
});
