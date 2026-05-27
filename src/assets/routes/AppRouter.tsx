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
import PurchasingManager from "../pages/purchasingmanager/purchasing-manager";
import UserManager from "../pages/adminview/usermanager/usermanager";
import ProductManager from "../pages/adminview/productamanager/productmanager";
import AdminHome from "../pages/adminview/adminhome/adminhome";

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
  const HomeComponent = usuario?.rol === "ADMIN" ? AdminHome: Home;


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
                <HomeComponent />
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
        <Route
          path="/mis-compras"
          element={
            <>
            <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <PurchasingManager />
              </main>
            </>
          }
        />
        <Route
          path="/usermanager"
          element={
            <>
            <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <UserManager />
              </main>
            </>
          }
        />
          <Route
          path="/productmanager"
          element={
            <>
            <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <ProductManager />
              </main>
            </>
          }
        />
        
       
      </Routes>
    </>
  );
};
