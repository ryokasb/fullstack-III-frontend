import './productmanager.css'
import { useEffect, useState } from 'react'
import { getProductos, actualizarStock } from '../../../service/gateway/gatewayService'
import type { Producto } from '../../../service/gateway/Dto/Dtos'
import Swal from 'sweetalert2'

export default function ProductManager() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newStock, setNewStock] = useState<number>(0)

  useEffect(() => {
    getProductos()
      .then(data => setProductos(data.sort((a, b) => a.id - b.id)))
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))
  }, [])

  const handleEditClick = (producto: Producto) => {
    setEditingId(producto.id)
    setNewStock(producto.stock)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setNewStock(0)
  }

  const handleSaveStock = async (producto: Producto) => {
    try {
      await actualizarStock(producto.id, newStock)
      setProductos(prev =>
        prev
          .map(p => p.id === producto.id ? { ...p, stock: newStock } : p)
          .sort((a, b) => a.id - b.id)
      )
      setEditingId(null)
      Swal.fire({
        icon: 'success',
        title: 'Stock actualizado',
        text: `${producto.nombre}: stock actualizado a ${newStock}.`,
        confirmButtonColor: '#051150',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el stock.',
        confirmButtonColor: '#051150',
      })
    }
  }

  return (
    <main className="productmanager">
      <header className="pm-header">
        <h1 className="pm-title">Gestión de Productos</h1>
        <p className="pm-subtitle">{productos.length} productos en catálogo</p>
      </header>

      {loading && <p className="pm-status">Cargando productos...</p>}
      {error && <p className="pm-status pm-status--error">{error}</p>}

      {!loading && !error && (
        <div className="pm-table-wrap">
          <table className="pm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id} className={producto.stock === 0 ? 'pm-row--agotado' : ''}>
                  <td className="pm-cell--id">#{producto.id}</td>
                  <td className="pm-cell--name">{producto.nombre}</td>
                  <td className="pm-cell--desc">{producto.descripcion}</td>
                  <td className="pm-cell--price">
                    ${producto.precio.toLocaleString('es-CL')}
                  </td>
                  <td className="pm-cell--stock">
                    {editingId === producto.id ? (
                      <input
                        className="pm-stock-input"
                        type="number"
                        min={0}
                        value={newStock}
                        onChange={e => setNewStock(Number(e.target.value))}
                        autoFocus
                      />
                    ) : (
                      <span className={`pm-stock-badge ${producto.stock === 0 ? 'pm-stock-badge--out' : producto.stock <= 5 ? 'pm-stock-badge--low' : ''}`}>
                        {producto.stock}
                      </span>
                    )}
                  </td>
                  <td className="pm-cell--status">
                    <span className={`pm-status-tag ${producto.stock === 0 ? 'pm-status-tag--out' : 'pm-status-tag--in'}`}>
                      {producto.stock === 0 ? 'Agotado' : 'Disponible'}
                    </span>
                  </td>
                  <td className="pm-cell--action">
                    {editingId === producto.id ? (
                      <div className="pm-action-group">
                        <button className="pm-btn pm-btn--save" onClick={() => handleSaveStock(producto)}>
                          Guardar
                        </button>
                        <button className="pm-btn pm-btn--cancel" onClick={handleCancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button className="pm-btn pm-btn--edit" onClick={() => handleEditClick(producto)}>
                        Actualizar stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}