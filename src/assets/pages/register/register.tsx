import './register.css'
import Logo from "../../img/logosmart.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registro } from "../../service/gateway/gatewayService";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");
  const [loading, setLoading] = useState(false);
  const [verContraseña, setVerContraseña] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contrasena !== repetirContraseña) {
      Swal.fire({ icon: 'error', title: 'Las contraseñas no coinciden', confirmButtonColor: '#051150' });
      return;
    }

    if (contrasena.length < 6) {
      Swal.fire({ icon: 'error', title: 'La contraseña debe tener al menos 6 caracteres', confirmButtonColor: '#051150' });
      return;
    }

    setLoading(true);
    try {
      await registro({ nombre, correo, contrasena, rol: "CLIENTE", activo: true });
      Swal.fire({ icon: 'success', title: '¡Cuenta creada!', text: 'Ya puedes iniciar sesión', confirmButtonColor: '#051150' })
        .then(() => navigate("/login"));
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: error.message || 'Error inesperado',
        confirmButtonColor: '#051150'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register">
      <div className="login-card">

        {/* PANEL IZQUIERDO */}
        <div className="login-visual">
          <img
            onClick={() => navigate("/")}
            className="logo-gog"
            src={Logo}
            alt="logo"
          />
          <h3>Únete a la comunidad</h3>
          <p>Crea tu cuenta y accede a todo el catálogo de God of Games</p>
        </div>

        {/* PANEL DERECHO */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Bienvenido</h2>
          <p className="login-subtitle">Ingresa tus datos</p>

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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

          {/* Contraseña */}
          <div className="input-eye">
            <input
              type={verContraseña ? "text" : "password"}
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <span onClick={() => setVerContraseña(prev => !prev)}>
              {verContraseña ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Repetir contraseña */}
          <div className="input-eye">
            <input
              type={verRepetir ? "text" : "password"}
              placeholder="Repetir contraseña"
              value={repetirContraseña}
              onChange={(e) => setRepetirContraseña(e.target.value)}
              required
            />
            <span onClick={() => setVerRepetir(prev => !prev)}>
              {verRepetir ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <div className='crear-cuenta'>
            <p>¿ya tienes una cuenta?</p>
            <a className='btn-crearcuenta' onClick={() => navigate("/login")}>inicia sesion</a>
          </div>
        </form>

      </div>
    </main>
  );
}