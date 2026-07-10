import './store.css'
import { useEffect, useState } from 'react'
import { getProductos } from '../../service/gateway/gatewayService'
import type { Producto } from '../../service/gateway/Dto/Dtos'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/UseCart'
import Swal from 'sweetalert2'

export default function Store() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orden, setOrden] = useState("")
  const [filtroPrecio, setFiltroPrecio] = useState("")
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError("Error al cargar los productos"))
      .finally(() => setLoading(false))
  }, [])

  const productosFiltrados = [...productos]
    .filter(p => {
      if (filtroPrecio === "menos-5000") return p.precio < 5.00
      if (filtroPrecio === "5000-15000") return p.precio >= 5.00 && p.precio <= 15.00
      if (filtroPrecio === "mas-15000") return p.precio > 15.00
      return true
    })
    .filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === "precio-asc") return a.precio - b.precio
      if (orden === "precio-desc") return b.precio - a.precio
      if (orden === "nombre-az") return a.nombre.localeCompare(b.nombre)
      if (orden === "nombre-za") return b.nombre.localeCompare(a.nombre)
      return 0
    })

  const limpiarFiltros = () => {
    setOrden("")
    setFiltroPrecio("")
    setBusqueda("")
  }

  const handleComprar = (e: React.MouseEvent, producto: Producto) => {

    const token = localStorage.getItem("token");
            if (!token) {
              Swal.fire({
                icon: 'warning',
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para agregar productos a tu carrito.',
                confirmButtonColor: '#051150',
              });
              return;
            }
            
    e.stopPropagation()
    addItem({ id: producto.id, name: producto.nombre, price: producto.precio })
    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: `${producto.nombre} fue añadido al carrito.`,
      confirmButtonColor: '#051150',
      timer: 1500,
      showConfirmButton: false,
    })
  }

  return (
    <main className="store">
      <aside className="filters">
        <h3 className="filters__title">Filtros</h3>
        <div className="filters__group">
          <span className="filters__label">Ordenar por</span>
          <select
            className="filters__select"
            value={orden}
            onChange={e => setOrden(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre-az">Nombre: A → Z</option>
            <option value="nombre-za">Nombre: Z → A</option>
          </select>
        </div>

        <div className="filters__group">
          <span className="filters__label">Precio</span>
          <button
            className={`filters__btn ${filtroPrecio === "menos-5000" ? "filters__btn--active" : ""}`}
            onClick={() => setFiltroPrecio(prev => prev === "menos-5000" ? "" : "menos-5000")}
          >
            Menos de $5.000
          </button>
          <button
            className={`filters__btn ${filtroPrecio === "5000-15000" ? "filters__btn--active" : ""}`}
            onClick={() => setFiltroPrecio(prev => prev === "5000-15000" ? "" : "5000-15000")}
          >
            $5.000 – $15.000
          </button>
          <button
            className={`filters__btn ${filtroPrecio === "mas-15000" ? "filters__btn--active" : ""}`}
            onClick={() => setFiltroPrecio(prev => prev === "mas-15000" ? "" : "mas-15000")}
          >
            Más de $15.000
          </button>
        </div>

        <button className="filters__clear" onClick={limpiarFiltros}>Limpiar filtros</button>
      </aside>

      <section className="cards-section">
        <h2 className="section-title">Juegos <span>Key</span></h2>

        <div className='search-bar'>
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="cards-grid">
          {productosFiltrados.map(producto => (
            <article
              onClick={() => navigate(`/product/${producto.id}`)}
              key={producto.id}
              className={`card ${producto.stock === 0 ? 'is-sold-out' : ''}`}
            >
              <div className="card__img-wrap">
                <img
                  src={`http://localhost:8080/uploads/productos/` + producto.imagen}
                  alt={producto.nombre}
                />
                {producto.stock === 0 && (
                  <div className="card__sold-out-overlay"><span>Agotado</span></div>
                )}
              </div>
              <div className="card__body">
                <p className="card__title">{producto.nombre}</p>
                <p style={{ fontSize: 12, color: '#aaa', margin: '4px 0' }}>{producto.descripcion}</p>
                <div className="card__price-row">
                  <span className="card__price">
                    ${producto.precio.toLocaleString('es-CL')}
                  </span>
                </div>
                <button
                  className="card__btn"
                  disabled={producto.stock === 0}
                  onClick={(e) => handleComprar(e, producto)}
                >
                  {producto.stock === 0 ? 'No disponible' : 'Comprar'}
                </button>
              </div>
              <button className="card__wish" aria-label="Añadir a favoritos">♡</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}