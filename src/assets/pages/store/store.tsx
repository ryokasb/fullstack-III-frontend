import './store.css'
import { useEffect, useState } from 'react'
import { getProductos } from '../../service/gateway/gatewayService'
import type { Producto } from '../../service/gateway/Dto/Dtos'
import { gameImages } from '../../utils/gameImage'

export default function Store() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError("Error al cargar los productos"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="store">
      <aside className="filters">
        <h3 className="filters__title">Filtros</h3>

        <div className="filters__group">
          <span className="filters__label">Precio</span>
          <button className="filters__btn">Menos de $5.000</button>
          <button className="filters__btn">$5.000 – $15.000</button>
          <button className="filters__btn">Más de $15.000</button>
        </div>

        <button className="filters__clear">Limpiar filtros</button>
      </aside>

      <section className="cards-section">
        <h2 className="section-title">Juegos <span>Key</span></h2>

        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="cards-grid">
          {productos.map(producto => (
            <article key={producto.id} className={`card ${producto.stock === 0 ? 'is-sold-out' : ''}`}>
              <div className="card__img-wrap">
                       <img
                          src={gameImages[producto.nombre] || `https://placehold.co/300x400/0a1433/c9a227?text=${encodeURIComponent(producto.nombre)}`}
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
                <button className="card__btn" disabled={producto.stock === 0}>
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