import './purchasing-manager.css'
import { useState, useEffect } from "react";
import { FaKey, FaSearch, FaBoxOpen } from 'react-icons/fa';
import { getPedidosPorUsuario, getProductoPorId } from '../../service/gateway/gatewayService';

// ── Tipos ──────────────────────────────────────────────────────
interface DetallePedido {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  claveJuego: string | null;
}

interface Pedido {
  id: number;
  usuarioId: string;
  fechaCreacion: string;
  estado: string;
  total: number;
  detalles: DetallePedido[];
}

interface Row {
  rowId: string;
  pedidoId: number;
  fecha: string;
  orderId: string;
  estado: string;
  productName: string;
  price: number;
  gameKey: string | null;
}

// ── Componente ─────────────────────────────────────────────────
export default function PurchasingManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    if (!usuario?.correo) { setLoading(false); return; }

    getPedidosPorUsuario(usuario.correo)
      .then(async (pedidos: Pedido[]) => {
        // Para cada detalle resolvemos el nombre del producto en paralelo
        const allRows = await Promise.all(
          pedidos.flatMap(pedido =>
            pedido.detalles.map(async detalle => {
              let productName = `Producto #${detalle.productoId}`;
              try {
                const producto = await getProductoPorId(String(detalle.productoId));
                productName = producto.nombre;
              } catch { /* fallback al id */ }

              return {
                rowId:       `${pedido.id}-${detalle.id}`,
                pedidoId:    pedido.id,
                fecha:       new Date(pedido.fechaCreacion).toLocaleDateString('es-CL'),
                orderId:     `o-${pedido.id}`,
                estado:      pedido.estado,
                productName,
                price:       detalle.precioUnitario,
                gameKey:     detalle.claveJuego,
              } as Row;
            })
          )
        );
        setRows(allRows);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Error al cargar pedidos")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter(r =>
    r.productName.toLowerCase().includes(search.toLowerCase()) ||
    r.orderId.toLowerCase().includes(search.toLowerCase())
  );

  const toggleKey = (id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) return (
    <main className="pm">
      <div className="pm__loading">
        <div className="pm__spinner" />
        <p>Cargando tu biblioteca...</p>
      </div>
    </main>
  );

  if (error) return (
    <main className="pm">
      <div className="pm__error">
        <span>⚠</span>
        <p>{error}</p>
      </div>
    </main>
  );

  return (
    <main className="pm">
      <div className="pm__header">
        <div className="pm__title-group">
          <h1 className="pm__title">Mi libreria</h1>
          <span className="pm__count">{rows.length} juegos</span>
        </div>
        <div className="pm__search-wrapper">
          <FaSearch className="pm__search-icon" size={13} />
          <input
            className="pm__search"
            type="search"
            placeholder="Buscar por producto o ID de orden..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="pm__table-wrapper">
        {filtered.length === 0 ? (
          <div className="pm__empty">
            <FaBoxOpen size={40} />
            <p>{rows.length === 0 ? 'No tienes compras aún' : 'No se encontraron resultados'}</p>
          </div>
        ) : (
          <table className="pm__table">
            <thead>
              <tr>
                <th className="pm__th pm__th--img" />
                <th className="pm__th">Fecha</th>
                <th className="pm__th">Order ID</th>
                <th className="pm__th pm__th--name">Producto</th>
                <th className="pm__th">Estado</th>
                <th className="pm__th pm__th--price">Precio</th>
                <th className="pm__th pm__th--action" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.rowId} className="pm__row" style={{ animationDelay: `${i * 40}ms` }}>
                  <td className="pm__td pm__td--img">
                    <div className="pm__cover">
                      <span>{r.productName.charAt(0)}</span>
                    </div>
                  </td>

                  <td className="pm__td pm__td--date">{r.fecha}</td>

                  <td className="pm__td">
                    <span className="pm__order-id">{r.orderId}</span>
                  </td>

                  <td className="pm__td pm__td--name">{r.productName}</td>

                  <td className="pm__td">
                    <span className={`pm__estado pm__estado--${r.estado.toLowerCase()}`}>
                      {r.estado}
                    </span>
                  </td>

                  <td className="pm__td pm__td--price">
                    CLP {r.price.toLocaleString('es-CL')}
                  </td>

                  <td className="pm__td pm__td--action">
                    {r.gameKey ? (
                      <div className="pm__key-wrapper">
                        {revealedKeys.has(r.rowId) && (
                          <span className="pm__key-value">{r.gameKey}</span>
                        )}
                        <button className="pm__key-btn" onClick={() => toggleKey(r.rowId)}>
                          <FaKey size={11} />
                          {revealedKeys.has(r.rowId) ? 'Ocultar' : 'Ver key'}
                        </button>
                      </div>
                    ) : (
                      <span className="pm__no-key">Sin key</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}