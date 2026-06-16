import './NavBar.css';
import logo from '../../img/logosmart.png';
import { FaShoppingCart, FaHome, FaGamepad} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { MdContactMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useCart } from '../../hooks/UseCart'
import type * as Dtos from "../../service/gateway/Dto/Dtos";
import { crearPedido, completarPedido, getProductoPorId, getProductoBusqueda } from '../../service/gateway/gatewayService';
import { useAuthGuard } from '../../hooks/useAuthGuard';

interface NavBarProps {
  onLogout: () => void;
}

export default function NavBar({ onLogout }: NavBarProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const { cartItems, removeItem, clearCart } = useCart();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Dtos.Producto[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

 

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (configRef.current && !configRef.current.contains(e.target as Node)) {
        setIsConfigOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (value.trim().length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    try {
      const results = await getProductoBusqueda(value);
      setSearchResults(results.slice(0, 4));
      setIsSearchOpen(true);
    } catch {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
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
        onLogout();
        navigate("/");
      }
    });
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para realizar un pedido.',
        confirmButtonColor: '#051150',
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Confirmar pago',
      html: `
        <div style="text-align:left; font-size:14px; color:#333">
          <p style="margin-bottom:12px">Resumen de tu pedido:</p>
          ${cartItems.map(item => `
            <div style="display:flex; justify-content:space-between; margin-bottom:6px">
              <span>${item.name}</span>
              <span style="font-weight:600">$${item.price.toLocaleString('es-CL')}</span>
            </div>
          `).join('')}
          <hr style="margin:12px 0; border-color:#eee"/>
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:15px">
            <span>Total</span>
            <span>$${total.toLocaleString('es-CL')}</span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#051150',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Confirmar y pagar',
      cancelButtonText: 'Cancelar',
    });

    if (!isConfirmed) return;

    try {
      const pedido = await crearPedido({
        detalles: cartItems.map(item => ({
          productoId: item.id,
          cantidad: 1,
          precioUnitario: item.price,
        }))
      });

      const pedidoCompletado = await completarPedido(pedido.id);

      clearCart();
      setIsOpen(false);

      const keysHtml = await Promise.all(
        pedidoCompletado.detalles.map(async (d: any) => {
          const producto = await getProductoPorId(d.productoId);
          return `
            <div style="margin-bottom:10px; padding:10px; background:#f5f7ff; border-radius:8px; border-left:3px solid #051150">
              <p style="margin:0 0 4px; font-size:12px; color:#888">${producto.nombre}</p>
              <p style="margin:0; font-size:15px; font-weight:700; color:#051150; letter-spacing:1px">${d.claveJuego}</p>
            </div>
          `;
        })
      );

      Swal.fire({
        icon: 'success',
        title: '¡Pago exitoso!',
        html: `
          <p style="margin-bottom:12px; color:#555">Guarda tus claves de juego:</p>
          ${keysHtml.join('')}
        `,
        confirmButtonColor: '#051150',
        confirmButtonText: 'Listo',
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo procesar el pedido. Intenta nuevamente.',
        confirmButtonColor: '#051150',
      });
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <nav className='navbar'>
      <div className='navbar__brand'>
        <img src={logo} onClick={() => navigate("/")} alt="logo" className='navbar__logo' />
      </div>

      <div className='navbar__search' ref={searchRef}>
        <input
          type="search"
          placeholder='Buscar juegos...'
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)}
        />
        {isSearchOpen && searchResults.length > 0 && (
          <div className='navbar__search-dropdown'>
            {searchResults.map((producto) => (
              <div
                key={producto.id}
                className='navbar__search-item'
                onClick={() => {
                  navigate(`/product/${producto.id}`);
                  setIsSearchOpen(false);
                  setSearch('');
                  setSearchResults([]);
                }}
              >
                <div className='navbar__search-info'>
                  <span className='navbar__search-name'>{producto.nombre}</span>
                  <span className='navbar__search-price'>
                    ${producto.precio?.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ul className='navbar__links'>
        <li className='navbar__item' onClick={() => navigate("/")}>
          <FaHome size={15} /> Inicio
        </li>
        <li className='navbar__item' onClick={() => navigate("/Games")}>
          <FaGamepad size={15} /> Juegos
        </li>
        <li className='navbar__item'>
          <MdContactMail size={15} /> Contacto
        </li>
      </ul>

      <div className='navbar__cart' ref={cartRef}>
        <div onClick={() => setIsOpen(prev => !prev)} className='navbar__cart-icon'>
          <FaShoppingCart size={20} />
          {cartItems.length > 0 && (
            <span className='navbar__cart-badge'>{cartItems.length}</span>
          )}
        </div>

        {isOpen && (
          <div className='navbar__cart-dropdown'>
            <div className='navbar__cart-header'>
              <span>Mi carrito de compras</span>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className='navbar__cart-body'>
              {cartItems.length === 0 ? (
                <div className='navbar__cart-empty'>
                  <FaShoppingCart size={32} color="#ccc" />
                  <p>Tu carrito está vacío</p>
                  <span>Aún no has elegido tus productos.</span>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className='navbar__cart-item'>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#222' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#051150' }}>${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className='navbar__cart-remove'>✕</button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className='navbar__cart-footer'>
                <div className='navbar__cart-total'>
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </div>
                <button onClick={handleCheckout} className='navbar__cart-checkout'>
                  Realizar pedido
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='navbar__user'>
        {usuario ? (
          <>
            <div className='navbar_userconfig' ref={configRef}>
              <FaGear
                color='white'
                size={25}
                style={{ marginRight: 20, cursor: 'pointer' }}
                onClick={() => setIsConfigOpen(prev => !prev)}
              />
              {isConfigOpen && (
                <div className='navbar__config-menu'>
                  <button
                    className='navbar__config-item'
                    onClick={() => { navigate('/user-profile'); setIsConfigOpen(false); }}
                  >
                    <span className='navbar__config-icon'>👤</span>
                    Perfil usuario
                  </button>
                  <button
                    className='navbar__config-item'
                    onClick={() => { navigate('/mis-compras'); setIsConfigOpen(false); }}
                  >
                    <span className='navbar__config-icon'>🔑</span>
                    Ver keys / compras
                  </button>
                </div>
              )}
            </div>

            <div className='navbar__avatar'>
              {usuario.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className='navbar__user-info'>
              <span className='navbar__user-name'>{usuario.nombre}</span>
              <span className='navbar__user-role'>Usuario</span>
            </div>
            <button className='navbar__logout' onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className='navbar__auth'>
            <button className='navbar__login' onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
            <button className='navbar__register' onClick={() => navigate("/register")}>
              Registrarse
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}