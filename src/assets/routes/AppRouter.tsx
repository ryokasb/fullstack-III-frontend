import { Route, Routes } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import Store from "../pages/store/store";
import Register from "../pages/register/register";
import ScrollToTop from "../components/ScrollToTop";
import Productdetail from "../pages/product-detail/product-detail";

export const AppRouter = () => {
  return (
    <>
      <ScrollToTop />  {}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <main className="contenido">
                <Home />
              </main>
            </>
          }
        />
        <Route
          path="/Login"
          element={<Login />}
        />
        <Route
          path="/Games"
          element={
            <>
              <NavBar />
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
              <NavBar />
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