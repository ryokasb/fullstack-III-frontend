// ============================================================
// gateway.service.ts
// Cliente TypeScript para la Gateway (Spring Boot, puerto 8080)
// ============================================================

const BASE_URL = "http://localhost:8080";

// ─── Tipos ───────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  email: string;
  password: string;
  [key: string]: unknown; // campos extra según tu microservicio
}

export interface AuthResponse {
  token: string;
  [key: string]: unknown;
}

export interface GatewayError {
  status: number;
  message: string;
}

// ─── Token storage ───────────────────────────────────────────

let _token: string | null = null;

export const TokenStore = {
  set(token: string) {
    _token = token;
    localStorage.setItem("jwt_token", token);
  },
  get(): string | null {
    return _token ?? localStorage.getItem("jwt_token");
  },
  clear() {
    _token = null;
    localStorage.removeItem("jwt_token");
  },
};

// ─── HTTP helper ─────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  auth?: boolean;       // ¿incluir Bearer token? (default: true)
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, body, headers: extraHeaders = {} } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (auth) {
    const token = TokenStore.get();
    if (!token) throw { status: 401, message: "No hay token JWT almacenado" } as GatewayError;
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      message = errBody?.message ?? errBody?.error ?? message;
    } catch {
      // sin cuerpo JSON
    }
    throw { status: response.status, message } as GatewayError;
  }

  // 204 No Content
  if (response.status === 204) return undefined as unknown as T;

  return response.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────

export const AuthService = {
  /**
   * POST /api/usuarios/login
   * Guarda el token automáticamente en TokenStore.
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await request<AuthResponse>("POST", "/api/usuarios/login", {
      auth: false,
      body: data,
    });
    TokenStore.set(res.token);
    return res;
  },

  /**
   * POST /api/usuarios/registro
   */
  async registro(data: RegistroRequest): Promise<AuthResponse> {
    const res = await request<AuthResponse>("POST", "/api/usuarios/registro", {
      auth: false,
      body: data,
    });
    TokenStore.set(res.token);
    return res;
  },

  /**
   * Cierra sesión eliminando el token local.
   */
  logout() {
    TokenStore.clear();
  },

  isAuthenticated(): boolean {
    return TokenStore.get() !== null;
  },
};

// ─── Usuarios ─────────────────────────────────────────────────

export const UsuariosService = {
  getAll<T = unknown>(): Promise<T> {
    return request<T>("GET", "/api/usuarios");
  },
  getById<T = unknown>(id: string | number): Promise<T> {
    return request<T>("GET", `/api/usuarios/${id}`);
  },
  update<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PUT", `/api/usuarios/${id}`, { body: data });
  },
  delete(id: string | number): Promise<void> {
    return request<void>("DELETE", `/api/usuarios/${id}`);
  },
};

// ─── Inventario / Productos ───────────────────────────────────

export const ProductosService = {
  getAll<T = unknown>(): Promise<T> {
    return request<T>("GET", "/api/productos");
  },
  getById<T = unknown>(id: string | number): Promise<T> {
    return request<T>("GET", `/api/productos/${id}`);
  },
  create<T = unknown>(data: unknown): Promise<T> {
    return request<T>("POST", "/api/productos", { body: data });
  },
  update<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PUT", `/api/productos/${id}`, { body: data });
  },
  patch<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PATCH", `/api/productos/${id}`, { body: data });
  },
  delete(id: string | number): Promise<void> {
    return request<void>("DELETE", `/api/productos/${id}`);
  },
};

// ─── Pedidos ──────────────────────────────────────────────────

export const PedidosService = {
  getAll<T = unknown>(): Promise<T> {
    return request<T>("GET", "/api/v1/pedidos");
  },
  getById<T = unknown>(id: string | number): Promise<T> {
    return request<T>("GET", `/api/v1/pedidos/${id}`);
  },
  create<T = unknown>(data: unknown): Promise<T> {
    return request<T>("POST", "/api/v1/pedidos", { body: data });
  },
  update<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PUT", `/api/v1/pedidos/${id}`, { body: data });
  },
  patch<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PATCH", `/api/v1/pedidos/${id}`, { body: data });
  },
  delete(id: string | number): Promise<void> {
    return request<void>("DELETE", `/api/v1/pedidos/${id}`);
  },
};

// ─── Envíos ───────────────────────────────────────────────────

export const EnviosService = {
  getAll<T = unknown>(): Promise<T> {
    return request<T>("GET", "/api/v1/envios");
  },
  getById<T = unknown>(id: string | number): Promise<T> {
    return request<T>("GET", `/api/v1/envios/${id}`);
  },
  create<T = unknown>(data: unknown): Promise<T> {
    return request<T>("POST", "/api/v1/envios", { body: data });
  },
  update<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PUT", `/api/v1/envios/${id}`, { body: data });
  },
  patch<T = unknown>(id: string | number, data: unknown): Promise<T> {
    return request<T>("PATCH", `/api/v1/envios/${id}`, { body: data });
  },
  delete(id: string | number): Promise<void> {
    return request<void>("DELETE", `/api/v1/envios/${id}`);
  },
};

// ─── Actuator ─────────────────────────────────────────────────

export const ActuatorService = {
  health<T = unknown>(): Promise<T> {
    return request<T>("GET", "/actuator/health", { auth: false });
  },
  info<T = unknown>(): Promise<T> {
    return request<T>("GET", "/actuator/info", { auth: false });
  },
};

// ─── Export agrupado ──────────────────────────────────────────

export const GatewayService = {
  auth: AuthService,
  usuarios: UsuariosService,
  productos: ProductosService,
  pedidos: PedidosService,
  envios: EnviosService,
  actuator: ActuatorService,
};

export default GatewayService;