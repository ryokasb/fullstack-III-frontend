import './login.css'
import Logo from "../../img/logosmart.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../service/gateway/gatewayService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verContraseña, setVerContraseña] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ correo, contraseña });
      localStorage.setItem("token", res.token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      localStorage.setItem("rol", res.usuario.rol);

      onLogin();

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login">
      <div className="login-card">

        {/* PANEL IZQUIERDO */}
        <div className="login-visual">
          <img
            onClick={() => navigate("/")}
            className="logo-gog"
            src={Logo}
            alt="logo"
          />
          <h3>Bienvenido a God of Games</h3>
          <p></p>
        </div>

        {/* PANEL DERECHO */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Bienvenido</h2>
          <p className="login-subtitle">Inicia sesión para continuar</p>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Ingresa un email válido')}
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
            required
          />

          <div className="input-eye">
            <input
              type={verContraseña ? "text" : "password"}
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <span onClick={() => setVerContraseña(prev => !prev)}>
              {verContraseña ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>

          <div className='crear-cuenta'>
            <p>¿nuevo usuario?</p>
            <a className='btn-crearcuenta' onClick={() => navigate("/register")}>
              Crea una cuenta
            </a>
          </div>
          <div className='recuperar-contraseña'>
            <a className='btn-crearcuenta' onClick={() => navigate("/password-recovery")}>¿Olvidaste tu contraseña?</a>
          </div>
        </form>

      </div>
    </main>
  );
}