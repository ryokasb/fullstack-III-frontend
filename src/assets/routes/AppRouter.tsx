import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import AdminNavBar from "../components/AdminNavbar/AdminNavBar";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import Store from "../pages/store/store";
import Register from "../pages/register/register";
import ScrollToTop from "../components/ScrollToTop";
import Productdetail from "../pages/product-detail/product-detail";

export const AppRouter = () => {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const usuarioGuardado = localStorage.getItem("usuario");
      setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = () => {
    const usuarioGuardado = localStorage.getItem("usuario");
    setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  const NavBarComponent = usuario?.rol === "ADMIN" ? AdminNavBar : NavBar;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <Home />
              </main>
            </>
          }
        />
        <Route
          path="/Login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/Games"
          element={
            <>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <Store />
              </main>
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <main className="contenido">
                <Register />
              </main>
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <Productdetail/>
              </main>
            </>
          }
        />
      </Routes>
    </>
  );
};