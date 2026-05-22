import './login.css'
import Logo from "../../img/logosmart.png";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  return (
    <main className="login">
      <img className="logo-gog" src={Logo} alt="logo" />

      <form className="login-form">
        <h2>Bienvenido</h2>
        <p>Inicia sesión para continuar</p>

        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />

        <button type="submit">Ingresar</button>

        <div className='crear-cuenta'>
          <p>¿nuevo usuario?</p>

          <a
            className='btn-crearcuenta'
            onClick={() => navigate("/register")}
          >
            Crea una cuenta
          </a>

        </div>
      </form>
    </main>
  );
}