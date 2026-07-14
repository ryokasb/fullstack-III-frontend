import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PasswordRecovery from "./passwordrecovery";
import { solicitarRecuperacion } from "../../service/gateway/gatewayService";

// --- Mocks ---

vi.mock("../../service/gateway/gatewayService", () => ({
  solicitarRecuperacion: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderRecovery() {
  return render(
    <MemoryRouter>
      <PasswordRecovery />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PasswordRecovery", () => {
  it("renderiza el formulario correctamente", () => {
    renderRecovery();
    expect(screen.getByText("Recuperar contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar código/i })).toBeInTheDocument();
  });

  it("permite escribir en el campo de correo", () => {
    renderRecovery();
    const input = screen.getByLabelText("Correo electrónico") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "dante@duocuc.cl" } });
    expect(input.value).toBe("dante@duocuc.cl");
  });

  it("envía la solicitud y navega a /code-verify si tiene éxito", async () => {
    (solicitarRecuperacion as ReturnType<typeof vi.fn>).mockResolvedValue({});
    renderRecovery();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "dante@duocuc.cl" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    await waitFor(() => {
      expect(solicitarRecuperacion).toHaveBeenCalledWith("dante@duocuc.cl");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/code-verify");
    });
  });

  it("muestra un mensaje de error si falla la solicitud", async () => {
    (solicitarRecuperacion as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Correo no registrado")
    );
    renderRecovery();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "noexiste@duocuc.cl" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    await waitFor(() => {
      expect(screen.getByText("Correo no registrado")).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("muestra un mensaje de error genérico si el error no trae mensaje", async () => {
    (solicitarRecuperacion as ReturnType<typeof vi.fn>).mockRejectedValue({});
    renderRecovery();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "dante@duocuc.cl" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    await waitFor(() => {
      expect(screen.getByText("Error al enviar el correo")).toBeInTheDocument();
    });
  });

  it("limpia el error previo al reintentar el envío", async () => {
    (solicitarRecuperacion as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error("Correo no registrado"))
      .mockResolvedValueOnce({});
    renderRecovery();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "dante@duocuc.cl" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    await waitFor(() => {
      expect(screen.getByText("Correo no registrado")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    await waitFor(() => {
      expect(screen.queryByText("Correo no registrado")).not.toBeInTheDocument();
    });
  });

  it("muestra 'Enviando...' y deshabilita el botón mientras se procesa", async () => {
    let resolvePromise: (value: unknown) => void = () => {};
    (solicitarRecuperacion as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(resolve => {
        resolvePromise = resolve;
      })
    );
    renderRecovery();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "dante@duocuc.cl" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    const boton = await screen.findByRole("button", { name: /enviando/i });
    expect(boton).toBeDisabled();

    resolvePromise({});
  });

  it("navega a / al hacer click en el logo", () => {
    renderRecovery();
    fireEvent.click(screen.getByAltText("logo"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});