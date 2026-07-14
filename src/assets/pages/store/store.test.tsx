import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Store from "./store";
import { getProductos } from "../../service/gateway/gatewayService";
import { useCart } from "../../hooks/UseCart";
import Swal from "sweetalert2";

// --- Mocks ---

vi.mock("../../service/gateway/gatewayService", () => ({
  getProductos: vi.fn(),
}));

vi.mock("../../hooks/UseCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
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

const productosMock = [
  {
    id: 1,
    nombre: "Elden Ring",
    descripcion: "RPG de acción",
    precio: 25.0,
    stock: 5,
    imagen: "elden-ring.jpg",
  },
  {
    id: 2,
    nombre: "Stardew Valley",
    descripcion: "Simulador de granja",
    precio: 4.5,
    stock: 0,
    imagen: "stardew.jpg",
  },
  {
    id: 3,
    nombre: "Hollow Knight",
    descripcion: "Metroidvania",
    precio: 10.0,
    stock: 3,
    imagen: "hollow-knight.jpg",
  },
];

const addItemMock = vi.fn();

function renderStore() {
  return render(
    <MemoryRouter>
      <Store />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  (useCart as ReturnType<typeof vi.fn>).mockReturnValue({ addItem: addItemMock });
  (getProductos as ReturnType<typeof vi.fn>).mockResolvedValue(productosMock);
});

describe("Store", () => {
  it("muestra el estado de carga inicialmente", () => {
    (getProductos as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderStore();
    expect(screen.getByText(/cargando productos/i)).toBeInTheDocument();
  });

  it("renderiza los productos luego de cargarlos", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });
    expect(screen.getByText("Stardew Valley")).toBeInTheDocument();
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
  });

  it("muestra un mensaje de error si la carga de productos falla", async () => {
    (getProductos as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("fail"));
    renderStore();
    await waitFor(() => {
      expect(screen.getByText(/error al cargar los productos/i)).toBeInTheDocument();
    });
  });

  it("muestra 'No disponible' y deshabilita el botón cuando el stock es 0", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Stardew Valley")).toBeInTheDocument();
    });

    const card = screen.getByText("Stardew Valley").closest("article");
    expect(card).toHaveClass("is-sold-out");

    const boton = screen.getByRole("button", { name: /no disponible/i });
    expect(boton).toBeDisabled();
  });

  it("filtra los productos por texto de búsqueda", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/buscar juegos/i);
    fireEvent.change(input, { target: { value: "hollow" } });

    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
    expect(screen.queryByText("Elden Ring")).not.toBeInTheDocument();
    expect(screen.queryByText("Stardew Valley")).not.toBeInTheDocument();
  });

  it("filtra los productos por rango de precio", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Menos de $5.000"));

    expect(screen.getByText("Stardew Valley")).toBeInTheDocument();
    expect(screen.queryByText("Elden Ring")).not.toBeInTheDocument();
    expect(screen.queryByText("Hollow Knight")).not.toBeInTheDocument();
  });

  it("permite deseleccionar un filtro de precio activo al hacer click de nuevo", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const boton = screen.getByText("Menos de $5.000");
    fireEvent.click(boton);
    expect(screen.queryByText("Elden Ring")).not.toBeInTheDocument();

    fireEvent.click(boton);
    expect(screen.getByText("Elden Ring")).toBeInTheDocument();
  });

  it("ordena los productos por precio ascendente", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "precio-asc" } });

    const titulos = screen.getAllByText(/Elden Ring|Stardew Valley|Hollow Knight/);
    expect(titulos[0]).toHaveTextContent("Stardew Valley");
    expect(titulos[1]).toHaveTextContent("Hollow Knight");
    expect(titulos[2]).toHaveTextContent("Elden Ring");
  });

  it("limpia los filtros al hacer click en 'Limpiar filtros'", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/buscar juegos/i), {
      target: { value: "hollow" },
    });
    fireEvent.click(screen.getByText("Menos de $5.000"));
    expect(screen.queryByText("Elden Ring")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Limpiar filtros"));

    expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    expect(screen.getByText("Stardew Valley")).toBeInTheDocument();
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
  });

  it("navega al detalle del producto al hacer click en la tarjeta", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Elden Ring"));
    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });

  it("muestra advertencia y no agrega al carrito si no hay token", async () => {
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const boton = screen.getAllByText("Comprar")[0];
    fireEvent.click(boton);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "warning" })
    );
    expect(addItemMock).not.toHaveBeenCalled();
  });

  it("agrega el producto al carrito y muestra confirmación si hay token", async () => {
    localStorage.setItem("token", "fake-token");
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const boton = screen.getAllByText("Comprar")[0];
    fireEvent.click(boton);

    expect(addItemMock).toHaveBeenCalledWith({
      id: 1,
      name: "Elden Ring",
      price: 25.0,
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success" })
    );
  });

  it("no navega al detalle al hacer click en 'Comprar' (stopPropagation)", async () => {
    localStorage.setItem("token", "fake-token");
    renderStore();
    await waitFor(() => {
      expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    });

    const boton = screen.getAllByText("Comprar")[0];
    fireEvent.click(boton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});