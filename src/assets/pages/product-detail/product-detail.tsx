import './product-detail.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductoPorId } from '../../service/gateway/gatewayService'
import type { Producto } from '../../service/gateway/Dto/Dtos'
import { gameImages } from '../../utils/gameImage'
import { useCart } from '../../hooks/UseCart'
import Swal from 'sweetalert2'

export default function Productdetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProductoPorId(id)
      .then(setProducto)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      )
      .finally(() => setLoading(false))
  }, [id])

  const handleAgregarCarrito = () => {

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

    if (!producto) return
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

  if (loading) {
    return (
      <main className="product-detail">
        <div className="pd-loading">
          <div className="pd-spinner" />
          <p>Cargando producto...</p>
        </div>
      </main>
    )
  }

  if (error || !producto) {
    return (
      <main className="product-detail">
        <div className="pd-error">
          <span className="pd-error-icon">⚠</span>
          <p>{error ?? 'Producto no disponible'}</p>
        </div>
      </main>
    )
  }

  const imagenSrc = gameImages[producto.nombre] ?? gameImages['default']
  const stockBajo = producto.stock <= 5
  const sinStock = producto.stock === 0

  return (
    <main className="product-detail">
      <div className="detalleproducto">

        <div className="pd-imagen-wrapper">
          <img
            src={imagenSrc}
            alt={producto.nombre}
            className="pd-imagen"
          />
          {sinStock && <span className="pd-badge pd-badge--agotado">Agotado</span>}
          {!sinStock && stockBajo && (
            <span className="pd-badge pd-badge--poco">Últimas unidades</span>
          )}
        </div>

        <div className="pd-info">
          <h1 className="pd-nombre">{producto.nombre}</h1>

          <p className="pd-precio">
            ${producto.precio.toLocaleString('es-CL')}
          </p>

          <p className="pd-descripcion">
            {producto.descripcion}
          </p>

          <div className="pd-stock">
            <span className={`pd-stock-dot ${sinStock ? 'dot--rojo' : stockBajo ? 'dot--amarillo' : 'dot--verde'}`} />
            <span className="pd-stock-texto">
              {sinStock
                ? 'Sin stock'
                : stockBajo
                ? `Solo quedan ${producto.stock} unidades`
                : `${producto.stock} unidades disponibles`}
            </span>
          </div>

          <button
            className="pd-boton"
            disabled={sinStock}
            onClick={handleAgregarCarrito}
          >
            {sinStock ? 'No disponible' : 'Agregar al carrito'}
          </button>
        </div>

      </div>
    </main>
  )
}