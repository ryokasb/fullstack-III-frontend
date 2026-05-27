import './AdminNavBar.css';
import logo from '../../img/logosmart.png';
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaShieldAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

interface AdminNavBarProps {
  onLogout: () => void;
}

export default function AdminNavBar({ onLogout }: AdminNavBarProps) {
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que quieres salir?',
      showCancelButton: true,
      confirmButtonColor: '#051150',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("rol");
        onLogout();
        navigate("/");
      }
    });
  };

  return (
    <nav className='admin-navbar'>
      {/* Izquierda: logo + badge admin */}
      <div className='admin-navbar__brand'>
        <img src={logo} onClick={() => navigate("/")} alt="logo" className='admin-navbar__logo' />
        <span className='admin-navbar__badge'>
          <FaShieldAlt size={11} />
          Panel Admin
        </span>
      </div>

      {/* Centro: navegación */}
      <ul className='admin-navbar__links'>
        <li className='admin-navbar__item' onClick={() => navigate("/")}>
          <FaUsers size={16} />
          Usuarios
        </li>
        <li className='admin-navbar__item' onClick={() => navigate("/Games")}>
          <FaBoxOpen size={16} />
          Productos
        </li>
      </ul>

      {/* Derecha: usuario + cerrar sesión */}
      <div className='admin-navbar__user'>
        {usuario && (
          <>
            <div className='admin-navbar__avatar'>
              {usuario.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className='admin-navbar__user-info'>
              <span className='admin-navbar__user-name'>{usuario.nombre}</span>
              <span className='admin-navbar__user-role'>Administrador</span>
            </div>
            <button className='admin-navbar__logout' onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}