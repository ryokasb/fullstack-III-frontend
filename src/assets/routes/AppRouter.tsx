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
import PasswordRecovery from "../pages/passwordRecovery/passwordrecovery";
import CodeVerify from "../pages/codeVerify/codeVerify";
import Userprofile from "../pages/userprofile/userprofile";
import SalesAdministrator from "../pages/adminview/salesadministrator/salesadminstrator";
import PrivateRoute from "./PrivateRoute";
import Error404page from "../pages/error404page/error404page";

interface Usuario {
  rol: string;
  [key: string]: unknown;
}

export const AppRouter = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
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
  const HomeComponent = usuario?.rol === "ADMIN" ? AdminHome : Home;

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
        <Route path="/Login" element={<Login onLogin={handleLogin} />} />

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
                <Productdetail />
              </main>
            </>
          }
        />
        <Route
          path="/mis-compras"
          element={
            <PrivateRoute>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <PurchasingManager />
              </main>
            </PrivateRoute>
          }
        />
        <Route
          path="/usermanager"
          element={
            <PrivateRoute rolesPermitidos={["ADMIN"]}>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <UserManager />
              </main>
            </PrivateRoute>
          }
        />
        <Route
          path="/productmanager"
          element={
            <PrivateRoute rolesPermitidos={["ADMIN"]}>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <ProductManager />
              </main>
            </PrivateRoute>
          }
        />
        <Route
          path="/salesadministrator"
          element={
            <PrivateRoute rolesPermitidos={["ADMIN"]}>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <SalesAdministrator />
              </main>
            </PrivateRoute>
          }
        />
        <Route
          path="/password-recovery"
          element={
            <>
              <main className="contenido">
                <PasswordRecovery />
              </main>
            </>
          }
        />
         <Route
          path="/error"
          element={
            <>
              <main className="contenido">
                <Error404page/>
              </main>
            </>
          }
        />
        <Route
          path="/code-verify"
          element={
            <>
              <main className="contenido">
                <CodeVerify />
              </main>
            </>
          }
          
          
        />
        <Route
          path="/user-profile"
          element={
            <PrivateRoute>
              <NavBarComponent onLogout={handleLogout} />
              <main className="contenido">
                <Userprofile />
              </main>
            </PrivateRoute>
          }
        />
      </Routes>
      
      
    </>
  );
};