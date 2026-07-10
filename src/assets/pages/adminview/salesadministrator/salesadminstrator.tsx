import './salesadministrator.css'
import { useEffect, useMemo, useState } from 'react'
import { getPedidos, getProductos } from '../../../service/gateway/gatewayService'
import type { Pedido } from '../../../service/gateway/Dto/Dtos'
import Swal from 'sweetalert2'

export default function SalesAdministrator() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [productosMap, setProductosMap] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [clavesVisibles, setClavesVisibles] = useState<Record<number, boolean>>({})
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    Promise.all([getPedidos(), getProductos()])
      .then(([pedidosData, productosData]) => {
        setPedidos(pedidosData.sort((a: Pedido, b: Pedido) => b.id - a.id))
        const map: Record<number, string> = {}
        productosData.forEach((p: { id: number; nombre: string }) => {
          map[p.id] = p.nombre
        })
        setProductosMap(map)
      })
      .catch(() => setError('Error al cargar los pedidos'))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const toggleClave = (detalleId: number) => {
    setClavesVisibles(prev => ({ ...prev, [detalleId]: !prev[detalleId] }))
  }

  const estadosDisponibles = useMemo(() => {
    const set = new Set(pedidos.map(p => p.estado))
    return ['TODOS', ...Array.from(set)]
  }, [pedidos])

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(p => {
      const coincideEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado
      const email = p.usuarioId ?? ''
      const coincideBusqueda = email.toLowerCase().includes(busqueda.toLowerCase())
      return coincideEstado && coincideBusqueda
    })
  }, [pedidos, filtroEstado, busqueda])

  const totalVentas = useMemo(() => {
    return pedidosFiltrados
      .filter(p => p.estado !== 'CANCELADO')
      .reduce((acc, p) => acc + p.total, 0)
  }, [pedidosFiltrados])

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return fecha
    }
  }

  const estadoClase = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'sa-status-tag--pagado'
      case 'CANCELADO':
        return 'sa-status-tag--cancelado'
      case 'PENDIENTE':
        return 'sa-status-tag--pendiente'
      default:
        return 'sa-status-tag--enviado'
    }
  }

  const nombreProducto = (productoId: number) => productosMap[productoId] ?? `Producto #${productoId}`

  const verDetalleCompleto = (pedido: Pedido) => {
    const itemsHtml = pedido.detalles
      .map(
        d =>
          `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a2540;">
            <span>${d.cantidad}x ${nombreProducto(d.productoId)}</span>
            <span>$${(d.cantidad * d.precioUnitario).toLocaleString('es-CL')}</span>
          </div>`
      )
      .join('')

    Swal.fire({
      title: `Pedido #${pedido.id}`,
      html: `
        <div style="text-align:left;font-size:0.9rem;">
          <p><strong>Usuario:</strong> ${pedido.usuarioId}</p>
          <p><strong>Fecha:</strong> ${formatFecha(pedido.fechaCreacion)}</p>
          <hr style="border-color:#1a2540;margin:10px 0;" />
          ${itemsHtml}
          <hr style="border-color:#1a2540;margin:10px 0;" />
          <p style="text-align:right;"><strong>Total: $${pedido.total.toLocaleString('es-CL')}</strong></p>
        </div>
      `,
      confirmButtonColor: '#051150',
    })
  }

  return (
    <main className="salesadministrator">
      <header className="sa-header">
        <h1 className="sa-title">Gestión de Ventas</h1>
        <p className="sa-subtitle">
          {pedidosFiltrados.length} pedidos · Total generado: ${totalVentas.toLocaleString('es-CL')}
        </p>
      </header>

      <div className="sa-filters">
        <input
          className="sa-search"
          placeholder="Buscar por email de usuario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select
          className="sa-select"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
        >
          {estadosDisponibles.map(estado => (
            <option key={estado} value={estado}>
              {estado === 'TODOS' ? 'Todos los estados' : estado}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="sa-status">Cargando pedidos...</p>}
      {error && <p className="sa-status sa-status--error">{error}</p>}

      {!loading && !error && (
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="sa-empty">No hay pedidos que coincidan con el filtro.</td>
                </tr>
              )}
              {pedidosFiltrados.map(pedido => (
                <>
                  <tr key={pedido.id} className={pedido.estado === 'CANCELADO' ? 'sa-row--cancelado' : ''}>
                    <td className="sa-cell--id">#{pedido.id}</td>
                    <td className="sa-cell--user">{pedido.usuarioId}</td>
                    <td className="sa-cell--date">{formatFecha(pedido.fechaCreacion)}</td>
                    <td className="sa-cell--items">
                      <button className="sa-btn-link" onClick={() => toggleExpand(pedido.id)}>
                        {pedido.detalles.length} producto{pedido.detalles.length !== 1 ? 's' : ''} {expandedId === pedido.id ? '▲' : '▼'}
                      </button>
                    </td>
                    <td className="sa-cell--total">${pedido.total.toLocaleString('es-CL')}</td>
                    <td className="sa-cell--status">
                      <span className={`sa-status-tag ${estadoClase(pedido.estado)}`}>{pedido.estado}</span>
                    </td>
                    <td className="sa-cell--action">
                      <button className="sa-btn sa-btn--view" onClick={() => verDetalleCompleto(pedido)}>
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                  {expandedId === pedido.id && (
                    <tr className="sa-row--expanded">
                      <td colSpan={7}>
                        <div className="sa-detail-panel">
                          {pedido.detalles.map(d => (
                            <div key={d.id} className="sa-detail-item">
                              <span>{d.cantidad}x {nombreProducto(d.productoId)}</span>
                              <span className="sa-detail-clave">
                                {clavesVisibles[d.id] ? d.claveJuego : '••••-••••-••••-••••'}
                                <button className="sa-btn-eye" onClick={() => toggleClave(d.id)}>
                                  {clavesVisibles[d.id] ? '🙈' : '👁️'}
                                </button>
                              </span>
                              <span>${(d.cantidad * d.precioUnitario).toLocaleString('es-CL')}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}