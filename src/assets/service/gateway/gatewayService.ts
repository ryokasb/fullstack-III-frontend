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

export const crearPedido = async (data: Dtos.PedidoRequest): Promise<Dtos.PedidoResponse> => {
  const response = await fetch(`${BASE_URL}/api/v1/pedidos`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};