// GatewayService/GatewayService.ts

import type * as Dtos from "./Dto/Dtos";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper para manejar respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error ${response.status}`);
  }
  return response.json();
};

// ─── AUTH (rutas públicas) ───────────────────────────────────────

export const login = async (data: Dtos.LoginRequest): Promise<Dtos.LoginResponse> => {
  const params = new URLSearchParams({
    correo: data.correo,
    contraseña: data.contraseña,
  });

  const response = await fetch(`${BASE_URL}/api/usuarios/login?${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(response);
};
export const registro = async (data: Dtos.RegistroRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/usuarios/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// ─── Helper para rutas privadas (agrega el JWT) ──────────────────

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── USUARIOS (rutas privadas) ───────────────────────────────────

export const getUsuarios = async () => {
  const response = await fetch(`${BASE_URL}/api/usuarios`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

// ─── PRODUCTOS (inventario-service) ─────────────────────────────

export const getProductos = async (): Promise<Dtos.Producto[]> => {
  const response = await fetch(`${BASE_URL}/api/productos`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export const createProducto = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/productos`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export async function getProductoPorId(id: string): Promise<Dtos.Producto> {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`)
  if (!response.ok) throw new Error('Producto no encontrado')
  return response.json()
}

// ─── PEDIDOS (pedidos-service) ───────────────────────────────────

export const getPedidos = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/pedidos`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export async function getPedidosPorUsuario(correo: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:8080/api/v1/pedidos/usuario/${correo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Error al obtener los pedidos");
  return response.json();
}

export const crearPedido = async (body: {
  detalles: { productoId: number; cantidad: number; precioUnitario: number }[]
}) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8080/api/v1/pedidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al crear pedido");
  return res.json();
};

export const completarPedido = async (pedidoId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8080/api/v1/pedidos/${pedidoId}/estado?nuevoEstado=COMPLETADO`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al completar pedido");
  return res.json();
};