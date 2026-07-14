import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Userprofile from "./userprofile";
import {
  actualizarUsuario,
} from "../../service/gateway/gatewayService";
import Swal from "sweetalert2";

// --- Mocks ---

vi.mock("../../service/gateway/gatewayService", () => ({
  actualizarUsuario: vi.fn(),
  cambiarContrasenaSinCodigo: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({}),
  },
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

const usuarioMock = {
  id: 1,
  nombre: "Dante Rojas", // Solucionado: Ahora coincide con lo que esperan tus expects
  correo: "dante@duocuc.cl",
  rol: "Cliente",
};

function renderPerfil() {
  return render(
    <MemoryRouter>
      <Userprofile />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem("usuario", JSON.stringify(usuarioMock));
});

describe("Userprofile", () => {
  it("renderiza los datos del usuario y sus iniciales", () => {
    renderPerfil();
    expect(screen.getByText("Dante Rojas")).toBeInTheDocument();
    expect(screen.getByText("dante@duocuc.cl")).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
    expect(screen.getByText("DR")).toBeInTheDocument(); // Solucionado si tu componente extrae iniciales de "Dante Rojas"
  });

  it("muestra '?' como iniciales y 'Usuario' cuando no hay datos en localStorage", () => {
    localStorage.clear();
    renderPerfil();
    expect(screen.getByText("?")).toBeInTheDocument();
    expect(screen.getByText("Usuario")).toBeInTheDocument();
  });

  it("muestra la sección de perfil por defecto", () => {
    renderPerfil();
    expect(screen.getByText("Actualiza tu nombre y correo electrónico")).toBeInTheDocument();
  });

  it("cambia a la sección de seguridad al hacer click en el tab", () => {
    renderPerfil();
    fireEvent.click(screen.getByText("Seguridad"));
    expect(screen.getByText("Cambia tu contraseña de acceso")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña actual")).toBeInTheDocument(); 
  });

  it("guarda el perfil correctamente y cierra sesión al confirmar", async () => {
    (actualizarUsuario as ReturnType<typeof vi.fn>).mockResolvedValue({});
    renderPerfil();

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(actualizarUsuario).toHaveBeenCalledWith(1, {
        nombre: "Dante Rojas",
        correo: "dante@duocuc.cl",
      });
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success", title: "Perfil actualizado" })
    );

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("usuario")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
}); 


