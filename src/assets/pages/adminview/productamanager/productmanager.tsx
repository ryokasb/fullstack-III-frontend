import './productmanager.css'
import { useEffect, useState } from 'react'
import { getProductos, actualizarProducto, createProducto, eliminarProducto } from '../../../service/gateway/gatewayService'
import type { Producto } from '../../../service/gateway/Dto/Dtos'
import Swal from 'sweetalert2'

export default function ProductManager() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [accion, setAccion] = useState("")
  const [newStock, setNewStock] = useState<number>(0)
  const [newName, setName] = useState("")
  const [newDescription, setDescription] = useState("")
  const [newPrice, setPrice] = useState<number>(0)

  useEffect(() => {
    getProductos()
      .then(data => setProductos(data.sort((a, b) => a.id - b.id)))
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))
  }, [])

  const handleEditClick = (producto: Producto) => {
    setEditingId(producto.id)
    setNewStock(producto.stock)
    setDescription(producto.descripcion)
    setName(producto.nombre)
    setPrice(producto.precio)
    setAccion("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setAccion("")
  }

  const handleCrearProducto = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nuevo producto',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" />
        <input id="swal-descripcion" class="swal2-input" placeholder="Descripción" />
        <input id="swal-precio" class="swal2-input" type="number" min="0" placeholder="Precio" />
        <input id="swal-stock" class="swal2-input" type="number" min="0" placeholder="Stock" />
      `,
      confirmButtonText: 'Crear',
      confirmButtonColor: '#051150',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim()
        const descripcion = (document.getElementById('swal-descripcion') as HTMLInputElement).value.trim()
        const precio = Number((document.getElementById('swal-precio') as HTMLInputElement).value)
        const stock = Number((document.getElementById('swal-stock') as HTMLInputElement).value)

        if (!nombre) return Swal.showValidationMessage('El nombre es obligatorio')
        if (precio <= 0) return Swal.showValidationMessage('El precio debe ser mayor a 0')
        if (stock < 0) return Swal.showValidationMessage('El stock no puede ser negativo')

        return { nombre, descripcion, precio, stock }
      }
    })

    if (!formValues) return

    try {
      const nuevo = await createProducto(formValues)
      setProductos(prev => [...prev, nuevo].sort((a, b) => a.id - b.id))
      Swal.fire({
        icon: 'success',
        title: '¡Producto creado!',
        confirmButtonColor: '#051150',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: error.message || 'No se pudo crear el producto',
        confirmButtonColor: '#051150',
      })
    }
  }
   const handleEliminar = async (producto: Producto) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#c0392b',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })

    if (!isConfirmed) return

    try {
      await eliminarProducto(producto.id)
      setProductos(prev => prev.filter(p => p.id !== producto.id))
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        confirmButtonColor: '#051150',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: error.message || 'No se pudo eliminar el producto',
        confirmButtonColor: '#051150',
      })
    }
  }

  const handleSave = async (producto: Producto) => {
    if (!accion) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una acción',
        text: 'Debes elegir qué campo deseas actualizar.',
        confirmButtonColor: '#051150',
      })
      return
    }

    const payload: Partial<Producto> = {}
    if (accion === "nombre") payload.nombre = newName
    if (accion === "descripcion") payload.descripcion = newDescription
    if (accion === "precio") payload.precio = newPrice
    if (accion === "stock") payload.stock = newStock

    if (accion === "precio" && newPrice <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Error al Actualizar',
        text: 'El precio de un juego no puede ser 0$',
        confirmButtonColor: '#051150',
      })
      return
    }

    try {
      const updated = await actualizarProducto(producto.id, payload)
      setProductos(prev =>
        prev
          .map(p => p.id === producto.id ? { ...p, ...updated } : p)
          .sort((a, b) => a.id - b.id)
      )
      setEditingId(null)
      setAccion("")
      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado',
        text: `${producto.nombre} actualizado correctamente.`,
        confirmButtonColor: '#051150',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el producto.',
        confirmButtonColor: '#051150',
      })
    }
  }

  const isEditing = (producto: Producto) => editingId === producto.id

  return (
    <main className="productmanager">
      <header className="pm-header">
        <h1 className="pm-title">Gestión de Productos</h1>
        <p className="pm-subtitle">{productos.length} productos en catálogo</p>
      </header>

      <button className='btn_newGame' onClick={handleCrearProducto}>
        Agregar nuevo producto
      </button>

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
                <th>Campo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id} className={producto.stock === 0 ? 'pm-row--agotado' : ''}>
                  <td className="pm-cell--id">#{producto.id}</td>

                  <td className="pm-cell--name">
                    {isEditing(producto) && accion === "nombre" ? (
                      <input
                        className="pm-stock-input"
                        value={newName}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      isEditing(producto) ? newName : producto.nombre
                    )}
                  </td>

                  <td className="pm-cell--desc">
                    {isEditing(producto) && accion === "descripcion" ? (
                      <input
                        className="pm-stock-input"
                        value={newDescription}
                        onChange={e => setDescription(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      isEditing(producto) ? newDescription : producto.descripcion
                    )}
                  </td>

                  <td className="pm-cell--price">
                    {isEditing(producto) && accion === "precio" ? (
                      <input
                        className="pm-stock-input"
                        type="number"
                        min={0}
                        value={newPrice}
                        onChange={e => setPrice(Number(e.target.value))}
                        autoFocus
                      />
                    ) : (
                      isEditing(producto) ? newPrice : `$${producto.precio.toLocaleString('es-CL')}`
                    )}
                  </td>

                  <td className="pm-cell--stock">
                    {isEditing(producto) && accion === "stock" ? (
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
                        {isEditing(producto) ? newStock : producto.stock}
                      </span>
                    )}
                  </td>

                  <td className="pm-cell--status">
                    <span className={`pm-status-tag ${producto.stock === 0 ? 'pm-status-tag--out' : 'pm-status-tag--in'}`}>
                      {producto.stock === 0 ? 'Agotado' : 'Disponible'}
                    </span>
                  </td>

                  <td className="pm-cell--accion">
                    {isEditing(producto) ? (
                      <select
                        className="pm-select"
                        value={accion}
                        onChange={e => setAccion(e.target.value)}
                      >
                        <option value="">-- Campo --</option>
                        <option value="nombre">Nombre</option>
                        <option value="descripcion">Descripción</option>
                        <option value="precio">Precio</option>
                        <option value="stock">Stock</option>
                      </select>
                    ) : (
                      <span className="pm-text-muted">—</span>
                    )}
                  </td>

                  <td className="pm-cell--action">
                    {isEditing(producto) ? (
                      <div className="pm-action-group">
                        <button className="pm-btn pm-btn--save" onClick={() => handleSave(producto)}>
                          Guardar
                        </button>
                        <button className="pm-btn pm-btn--cancel" onClick={handleCancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div>
                      <button className="pm-btn pm-btn--edit" onClick={() => handleEditClick(producto)}>
                        Editar
                      </button>
                       <button className="pm-btn pm-btn--delete" onClick={() => handleEliminar(producto)} style={{marginLeft:"15px"}}>
                        Eliminar
                       </button>
                       </div>
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