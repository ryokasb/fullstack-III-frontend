// GatewayService/GatewayService.ts

import type * as Dtos from "./Dto/Dtos";

const BASE_URL = "http://localhost:8080";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Error ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
};

// ─── AUTH (rutas públicas) ───────────────────────────────────────

export const login = async (data: Dtos.LoginRequest): Promise<Dtos.LoginResponse> => {
  const params = new URLSearchParams({
    correo: data.correo,
    contrasena: data.contraseña,
  });

  const response = await fetch(`${BASE_URL}/api/usuarios/login?${params}`, {
    method: "POST",
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

//edicion de usuario
export const actualizarUsuario = async (id: number, data: Dtos.ActualizarUsuario): Promise<Dtos.Usuario> => {
  const response = await fetch(`${BASE_URL}/api/usuarios/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const toggleActivarUsuario = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/usuarios/${id}/toggle-activo`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return handleResponse(response);
};


export const cambiarContrasenaSinCodigo = async (data: {
  correo: string;
  contrasenaActual: string;
  nuevaContrasena: string;
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/usuarios/cambiar-contrasena-sin-codigo`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const solicitarRecuperacion = async (correo: string): Promise<void> => {
  const response = await fetch(
    `${BASE_URL}/api/usuarios/recuperar-contrasena?correo=${encodeURIComponent(correo)}`,
    { method: "POST" }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al enviar el correo");
  }
};

export const cambiarContraseña = async (data: Dtos.CambiarContraseña): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/usuarios/cambiar-contrasena`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
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

export const getProductoBusqueda = async(busqueda:string):Promise<Dtos.Producto[]> => {
  const response = await fetch(`${BASE_URL}/api/productos/buscar/${busqueda}`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

export const createProducto = async (data: Dtos.CrearProducto): Promise<Dtos.Producto> => {
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

export const eliminarProducto = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(response);
};


export const actualizarStock = async (id: number, nuevoStock: number): Promise<Dtos.Producto> => {
  const response = await fetch(`${BASE_URL}/api/productos/${id}/stock?nuevoStock=${nuevoStock}`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export const actualizarProducto = async (id: number, data: Partial<Dtos.Producto>): Promise<Dtos.Producto> => {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};


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
    `${BASE_URL}/api/v1/pedidos/usuario/${correo}`,
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
  const res = await fetch(`${BASE_URL}/api/v1/pedidos`, {
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
  const res = await fetch(`${BASE_URL}/api/v1/pedidos/${pedidoId}/estado?nuevoEstado=COMPLETADO`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al completar pedido");
  return res.json();
};