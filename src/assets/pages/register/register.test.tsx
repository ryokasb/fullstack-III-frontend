import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Register from "./register";
import { registro } from "../../service/gateway/gatewayService";
import Swal from "sweetalert2";

// --- Mocks ---

vi.mock("../../service/gateway/gatewayService", () => ({
  registro: vi.fn(),
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

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

function llenarFormulario({
  nombre = "Dante Rojas",
  correo = "dante@duocuc.cl",
  contrasena = "clave123",
  repetir = "clave123",
}: {
  nombre?: string;
  correo?: string;
  contrasena?: string;
  repetir?: string;
} = {}) {
  fireEvent.change(screen.getByPlaceholderText("Nombre"), {
    target: { value: nombre },
  });
  fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
    target: { value: correo },
  });
  fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
    target: { value: contrasena },
  });
  fireEvent.change(screen.getByPlaceholderText("Repetir contraseña"), {
    target: { value: repetir },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Register", () => {
  it("renderiza los campos del formulario", () => {
    renderRegister();
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repetir contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrar/i })).toBeInTheDocument();
  });

  it("muestra error si las contraseñas no coinciden", async () => {
    renderRegister();
    llenarFormulario({ contrasena: "clave123", repetir: "otraClave123" });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Las contraseñas no coinciden",
        })
      );
    });
    expect(registro).not.toHaveBeenCalled();
  });

  it("muestra error si la contraseña tiene menos de 6 caracteres", async () => {
    renderRegister();
    llenarFormulario({ contrasena: "abc12", repetir: "abc12" });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "La contraseña debe tener al menos 6 caracteres",
        })
      );
    });
    expect(registro).not.toHaveBeenCalled();
  });

  it("registra correctamente y navega a /login tras confirmar", async () => {
    (registro as ReturnType<typeof vi.fn>).mockResolvedValue({});
    renderRegister();
    llenarFormulario();

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    await waitFor(() => {
      expect(registro).toHaveBeenCalledWith({
        nombre: "Dante Rojas",
        correo: "dante@duocuc.cl",
        contrasena: "clave123",
        rol: "CLIENTE",
        activo: true,
      });
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: "success", title: "¡Cuenta creada!" })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("muestra un error si falla el registro", async () => {
    (registro as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("El correo ya está registrado")
    );
    renderRegister();
    llenarFormulario();

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error al registrarse",
          text: "El correo ya está registrado",
        })
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("muestra 'Registrando...' y deshabilita el botón mientras se procesa", async () => {
    let resolvePromise: (value: unknown) => void = () => {};
    (registro as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(resolve => {
        resolvePromise = resolve;
      })
    );
    renderRegister();
    llenarFormulario();

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    const boton = await screen.findByRole("button", { name: /registrando/i });
    expect(boton).toBeDisabled();

    resolvePromise({});
  });

  it("alterna la visibilidad de la contraseña al hacer click en el ícono", () => {
    renderRegister();
    const inputContrasena = screen.getByPlaceholderText("Contraseña") as HTMLInputElement;
    expect(inputContrasena.type).toBe("password");

    const iconos = document.querySelectorAll(".input-eye span");
    fireEvent.click(iconos[0]);

    expect(inputContrasena.type).toBe("text");
  });

  it("alterna la visibilidad de repetir contraseña al hacer click en el ícono", () => {
    renderRegister();
    const inputRepetir = screen.getByPlaceholderText("Repetir contraseña") as HTMLInputElement;
    expect(inputRepetir.type).toBe("password");

    const iconos = document.querySelectorAll(".input-eye span");
    fireEvent.click(iconos[1]);

    expect(inputRepetir.type).toBe("text");
  });

  it("navega a /login al hacer click en 'inicia sesion'", () => {
    renderRegister();
    fireEvent.click(screen.getByText("inicia sesion"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navega a / al hacer click en el logo", () => {
    renderRegister();
    fireEvent.click(screen.getByAltText("logo"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});