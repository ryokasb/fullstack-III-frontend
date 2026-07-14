import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "./home";
import { getProductos } from "../../service/gateway/gatewayService";

// --- Mocks ---

vi.mock("../../service/gateway/gatewayService", () => ({
  getProductos: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --- Datos de prueba ---

const productosMock = [
  { id: 1, nombre: "Elden Ring", descripcion: "RPG", precio: 25.0, stock: 5, imagen: "a.jpg" },
  { id: 2, nombre: "Stardew Valley", descripcion: "Granja", precio: 4.5, stock: 2, imagen: "b.jpg" },
  { id: 3, nombre: "Hollow Knight", descripcion: "Metroidvania", precio: 10.0, stock: 3, imagen: "c.jpg" },
  { id: 4, nombre: "Celeste", descripcion: "Plataformas", precio: 8.0, stock: 4, imagen: "d.jpg" },
  { id: 5, nombre: "Hades", descripcion: "Roguelike", precio: 15.0, stock: 1, imagen: "e.jpg" },
  { id: 6, nombre: "Undertale", descripcion: "Indie", precio: 6.0, stock: 6, imagen: "f.jpg" },
  { id: 7, nombre: "Cuphead", descripcion: "Run and gun", precio: 12.0, stock: 7, imagen: "g.jpg" },
];

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Home", () => {
  it("muestra 'Cargando destacados...' mientras no hay productos", () => {
    (getProductos as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderHome();
    expect(screen.getByText(/cargando destacados/i)).toBeInTheDocument();
  });

  it("renderiza los 6 productos más caros ordenados de mayor a menor precio", async () => {
    (getProductos as ReturnType<typeof vi.fn>).mockResolvedValue(productosMock);
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const nombres = screen.getAllByRole("heading", { level: 4 }).map(el => el.textContent);
    expect(nombres).toEqual([
      "Elden Ring",
      "Hades",
      "Cuphead",
      "Hollow Knight",
      "Celeste",
      "Undertale",
    ]);
    // Stardew Valley (más barato) queda fuera del top 6
    expect(screen.queryByText("Stardew Valley")).not.toBeInTheDocument();
  });

  it("registra un error en consola si falla la carga de destacados y mantiene el estado de carga", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (getProductos as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("fail"));
    renderHome();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error al cargar destacados");
    });

    expect(screen.getByText(/cargando destacados/i)).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  it("navega a /Games al hacer click en 'Ver Ofertas'", () => {
    (getProductos as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    renderHome();
    fireEvent.click(screen.getByText("Ver Ofertas"));
    expect(mockNavigate).toHaveBeenCalledWith("/Games");
  });

  it("navega a /Games al hacer click en los banners de ofertas", () => {
    (getProductos as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    renderHome();

    const botones = screen.getAllByRole("button");
    const botonOfertas = botones.find(b => b.querySelector("img.ofertas-logo"));
    const botonJp = botones.find(b => b.querySelector("img.Jplogo"));

    fireEvent.click(botonOfertas!);
    expect(mockNavigate).toHaveBeenCalledWith("/Games");

    mockNavigate.mockClear();
    fireEvent.click(botonJp!);
    expect(mockNavigate).toHaveBeenCalledWith("/Games");
  });

  it("navega al detalle del producto al hacer click en 'Ver más'", async () => {
    (getProductos as ReturnType<typeof vi.fn>).mockResolvedValue(productosMock);
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const botonesVerMas = screen.getAllByText("Ver más");
    fireEvent.click(botonesVerMas[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });
});