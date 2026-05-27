import './AdminNavBar.css';
import logo from '../../img/logosmart.png';
import { useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { FaUsers, FaBoxOpen, FaShieldAlt } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import Swal from 'sweetalert2';

interface AdminNavBarProps {
  onLogout: () => void;
}

export default function AdminNavBar({ onLogout }: AdminNavBarProps) {
  const navigate = useNavigate();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const configRef = useRef<HTMLDivElement>(null);

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (configRef.current && !configRef.current.contains(e.target as Node)) {
        setIsConfigOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <li className='admin-navbar__item' onClick={() => navigate("/usermanager")}>
          <FaUsers size={16} />
          Usuarios
        </li>
        <li className='admin-navbar__item' onClick={() => navigate("/productmanager")}>
          <FaBoxOpen size={16} />
          Productos
        </li>
      </ul>

      {/* Usuario */}
      <div className='admin-navbar__user'>
        {usuario && (
          <>
            {/* Config gear con menú */}
            <div className='admin-navbar_config' ref={configRef}>
              <FaGear
                color='white'
                size={25}
                style={{ marginRight: 20, cursor: 'pointer' }}
                onClick={() => setIsConfigOpen(prev => !prev)}
              />
              {isConfigOpen && (
                <div className='admin-navbar__config-menu'>
                  <button
                    className='admin-navbar__config-item'
                    onClick={() => { navigate(''); setIsConfigOpen(false); }}
                  >
                    <span className='admin-navbar__config-icon'>👤</span>
                    Perfil usuario
                  </button>
                </div>
              )}
            </div>

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