import './NavBar.css';
import logo from '../../img/logosmart.png';
import { FaShoppingCart } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className='barra-navegacion'>
      <div className='logo-izquierda'>
        <img src={logo} alt="" />
      </div>

      <div className='busqueda'>
        <input type="search" placeholder='Buscar' />
      </div>

      <ul>
        <li onClick={() => navigate("/")}>Inicio</li>
        <li onClick={() => navigate("/Games")}>Juegos</li>
        <li>Contacto</li>
      </ul>

      <div className='carrito'>
        <FaShoppingCart size={22} />
      </div>

      <div className='login-singin'>
        <div className='btn-login'>
        <VscAccount/>
        <a
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </a>
        </div>
        <a> | </a>
         <a
          className='btn-registrate'
          onClick={() => navigate("/register")}
        >
          registrarse
        </a>
      </div>
    </nav>
  );
}