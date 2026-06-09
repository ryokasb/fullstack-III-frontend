import './usermanager.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarios } from '../../../service/gateway/gatewayService'
import type { Usuario } from '../../../service/gateway/Dto/Dtos'

export default function UserManager() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getUsuarios()
      .then(data => setUsuarios(data.sort((a: Usuario, b: Usuario) => a.id - b.id)))
      .catch(() => setError('Error al cargar los usuarios'))
      .finally(() => setLoading(false))
  }, [])

  const handleEditClick = (id: number) => {
    navigate(`/usermanager/editprofile/${id}`)
  }

  return (
    <main className="usermanager">
      <header className="um-header">
        <h1 className="um-title">Gestión de Usuarios</h1>
        <p className="um-subtitle">{usuarios.length} usuarios registrados</p>
      </header>

      {loading && <p className="um-status">Cargando usuarios...</p>}
      {error && <p className="um-status um-status--error">{error}</p>}

      {!loading && !error && (
        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id} className={!usuario.nombre ? 'um-row--inactivo' : 'hola'}>
                  <td className="um-cell--id">#{usuario.id}</td>
                  <td className="um-cell--name">{usuario.nombre}</td>
                  <td className="um-cell--email">{usuario.correo}</td>
                  <td className="um-cell--rol">
                    <span className={`um-rol-badge um-rol-badge--${usuario.rol?.toLowerCase() ?? 'default'}`}>
                      {usuario.rol ?? 'Sin rol'}
                    </span>
                  </td>
                  <td className="um-cell--action">
                    <button
                      className="um-btn um-btn--edit"
                      onClick={() => handleEditClick(usuario.id)}
                    >
                      Actualizar usuario
                    </button>
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