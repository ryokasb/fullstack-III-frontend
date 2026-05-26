import './NavBar.css';
import logo from '../../img/logosmart.png';
import { FaShoppingCart } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Swal from 'sweetalert2';

interface CartItem {
  id: number;
  name: string;
  price: number;
}

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);

  // Lee el usuario del localStorage
  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  
 
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
      navigate("/login");
    }
  });
};

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <nav className='barra-navegacion'>
      <div className='logo-izquierda'>
        <img src={logo} onClick={() => navigate("/")} alt="" />
      </div>

      <div className='busqueda'>
        <input type="search" placeholder='Buscar' />
      </div>

      <ul>
        <li onClick={() => navigate("/")}>Inicio</li>
        <li onClick={() => navigate("/Games")}>Juegos</li>
        <li>Contacto</li>
      </ul>

      {/* CARRITO */}
      <div className='carrito' ref={cartRef} style={{ position: 'relative' }}>
        <div onClick={() => setIsOpen(prev => !prev)} style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
          <FaShoppingCart size={22} />
          {cartItems.length > 0 && (
            <span style={{
              position: 'absolute', top: -8, right: -8,
              background: 'red', color: 'white',
              borderRadius: '50%', width: 16, height: 16,
              fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {cartItems.length}
            </span>
          )}
        </div>

        {isOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 12px)', right: 0,
            width: 320, background: 'white', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 1000, overflow: 'hidden'
          }}>
            <div style={{ background: '#1d35ad', color: 'white', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Mi carrito de compras</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <div style={{ padding: '1rem 1.25rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <FaShoppingCart size={32} color="#000000" style={{ marginBottom: 12 }} />
                  <p style={{ fontWeight: 600, margin: '0 0 4px', color: '#222' }}>Tu carrito está vacío</p>
                  <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Aún no has elegido tus productos.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid #eee' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#222' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#051150' }}>${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>✕</button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: '12px 18px', borderTop: '0.5px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  style={{ width: '100%', background: '#051150', color: 'white', border: 'none', borderRadius: 8, padding: 10, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}
                >
                  Ir al checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='login-singin'>
        {usuario ? (
          <div>
            <span style={{ fontSize: 15 }}>Hola, {usuario.nombre}</span>
            <a className = "btn-cerrarsesion" onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: 15 }}>
              Cerrar sesión
            </a>
          </div>
        ) : (
          <>
            <div className='btn-login'>
              <VscAccount />
              <a onClick={() => navigate("/login")}>Iniciar Sesión</a>
            </div>
            <a> | </a>
            <a className='btn-registrate' onClick={() => navigate("/register")}>registrarse</a>
          </>
        )}
      </div>
    </nav>
  );
}