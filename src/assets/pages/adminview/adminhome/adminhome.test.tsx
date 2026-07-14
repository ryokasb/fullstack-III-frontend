import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminHome from "./adminhome";

// --- Mocks ---

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderAdminHome() {
  return render(
    <MemoryRouter>
      <AdminHome />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("AdminHome", () => {
  it("renderiza el nombre del usuario guardado en localStorage", () => {
    localStorage.setItem("usuario", JSON.stringify({ nombre: "Dante Rojas" }));
    renderAdminHome();
    expect(screen.getByText("Dante Rojas")).toBeInTheDocument();
  });

  it("no falla y renderiza vacío el nombre si no hay usuario en localStorage", () => {
    renderAdminHome();
    expect(screen.getByText("Panel de Administración")).toBeInTheDocument();
    expect(screen.getByText("Bienvenido,")).toBeInTheDocument();
  });

  it("renderiza las tres tarjetas de gestión con su descripción", () => {
    renderAdminHome();

    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(
      screen.getByText(/crea, edita y elimina juegos del catálogo/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(
      screen.getByText(/consulta y administra las cuentas registradas/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Ventas")).toBeInTheDocument();
    expect(screen.getByText(/consulta y administra todas las ventas/i)).toBeInTheDocument();
  });

  it("navega a /productmanager al hacer click en la tarjeta de Productos", () => {
    renderAdminHome();
    fireEvent.click(screen.getByText("Productos"));
    expect(mockNavigate).toHaveBeenCalledWith("/productmanager");
  });

  it("navega a /usermanager al hacer click en la tarjeta de Usuarios", () => {
    renderAdminHome();
    fireEvent.click(screen.getByText("Usuarios"));
    expect(mockNavigate).toHaveBeenCalledWith("/usermanager");
  });

  it("navega a /salesadministrator al hacer click en la tarjeta de Ventas", () => {
    renderAdminHome();
    fireEvent.click(screen.getByText("Ventas"));
    expect(mockNavigate).toHaveBeenCalledWith("/salesadministrator");
  });
});