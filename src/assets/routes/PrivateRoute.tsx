// components/PrivateRoute/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Usuario {
  rol: string;
  [key: string]: unknown;
}

interface PrivateRouteProps {
  children: ReactNode;
  rolesPermitidos?: string[];
}

const PrivateRoute = ({ children, rolesPermitidos }: PrivateRouteProps) => {
  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario: Usuario | null = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  // No hay sesión -> al login
  if (!usuario) {
    return <Navigate to="/error" replace />;
  }

  // Hay sesión pero el rol no está permitido -> a home
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;