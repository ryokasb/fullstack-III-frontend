//request
export interface LoginRequest {
  correo: string;
  contraseña: string;
}

export interface RegistroRequest {
  nombre: string;
  correo: string;
  contraseña: string;
  rol:string;
}

export interface DetalleRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoRequest {
  detalles: DetalleRequest[];
}

//responses
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface LoginResponse {
  token: string;
  mensaje: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };
}


export interface PedidoResponse {
  id: number;
  usuarioId: string;
  fechaCreacion: string;
  estado: "PENDIENTE" | "COMPLETADO" | "CANCELADO";
  total: number;
  detalles: {
    id: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}
//usuario dtos
export interface Usuario{
  id: number,
  nombre: string,
  correo: string,
  rol: string
} 

// Carrito vive solo en el front
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}