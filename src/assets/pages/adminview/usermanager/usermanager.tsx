import './usermanager.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarios, toggleActivarUsuario, registro} from '../../../service/gateway/gatewayService'
import type { Usuario } from '../../../service/gateway/Dto/Dtos'
import Swal from 'sweetalert2'

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
  }

  const handleToggle = async (usuario: Usuario) => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}')
  
  if (usuario.id === usuarioActual.id) {
    Swal.fire({
      icon: 'error',
      title: 'Acción no permitida',
      text: 'No puedes desactivar tu propia cuenta.',
      confirmButtonColor: '#051150',
    })
    return
  }

    const accion = usuario.activo ? 'desactivar' : 'activar'
     
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      text: `¿Estás seguro de ${accion} a "${usuario.nombre}"?`,
      confirmButtonText: `Sí, ${accion}`,
      confirmButtonColor: usuario.activo ? '#c0392b' : '#051150',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })

    if (!isConfirmed) return

    try {
      await toggleActivarUsuario(usuario.id)
      setUsuarios(prev =>
        prev.map(u => u.id === usuario.id ? { ...u, activo: !u.activo } : u)
      )
      Swal.fire({
        icon: 'success',
        title: `Usuario ${accion === 'activar' ? 'activado' : 'desactivado'}`,
        confirmButtonColor: '#051150',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || `No se pudo ${accion} el usuario`,
        confirmButtonColor: '#051150',
      })
    }
  }
 const handleCrearUsuario = async () => {
  const disparar = async (valores?: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Nuevo usuario',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${valores?.nombre || ''}" />
        <input id="swal-correo" class="swal2-input" type="email" placeholder="Correo electrónico" value="${valores?.correo || ''}" />
        <input id="swal-contrasena" class="swal2-input" type="password" placeholder="Contraseña" />
        ${valores?.error ? `<p style="color:#e74c3c;font-size:13px;margin-top:8px;">${valores.error}</p>` : ''}
      `,
      confirmButtonText: 'Crear',
      confirmButtonColor: '#051150',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim()
        const correo = (document.getElementById('swal-correo') as HTMLInputElement).value.trim()
        const contrasena = (document.getElementById('swal-contrasena') as HTMLInputElement).value

        if (!nombre) return Swal.showValidationMessage('El nombre es obligatorio')
        if (!correo) return Swal.showValidationMessage('El correo es obligatorio')
        if (!contrasena) return Swal.showValidationMessage('La contraseña es obligatoria')

        return { nombre, correo, contrasena, rol: 'CLIENTE', activo: true }
      }
    })

    if (!formValues) return

    try {
      await registro(formValues)
      const data = await getUsuarios()
      setUsuarios(data.sort((a: Usuario, b: Usuario) => a.id - b.id))
      Swal.fire({
        icon: 'success',
        title: '¡Usuario creado!',
        confirmButtonColor: '#051150',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error: any) {
      disparar({ ...formValues, error: error.message || 'No se pudo crear el usuario' })
    }
  }

  disparar()
}
  return (
    <main className="usermanager">
      <header className="um-header">
        <h1 className="um-title">Gestión de Usuarios</h1>
        <p className="um-subtitle">{usuarios.length} usuarios registrados</p>
      </header>
      <button className='btn_newUser' onClick={handleCrearUsuario} >Agregar nuevo usuario</button>
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
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id} className={!usuario.activo ? 'um-row--inactivo' : ''}>
                  <td className="um-cell--id">#{usuario.id}</td>
                  <td className="um-cell--name">{usuario.nombre}</td>
                  <td className="um-cell--email">{usuario.correo}</td>
                  <td className="um-cell--rol">
                    <span className={`um-rol-badge um-rol-badge--${usuario.rol?.toLowerCase() ?? 'default'}`}>
                      {usuario.rol ?? 'Sin rol'}
                    </span>
                  </td>
                  <td className="um-cell--status">
                    <span className={`um-status-tag ${usuario.activo ? 'um-status-tag--in' : 'um-status-tag--out'}`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="um-cell--action">
                    <button
                      className="um-btn um-btn--edit"
                      style={{ marginRight: "10px" }}
                      onClick={() => handleEditClick(usuario.id)}
                    >
                      Actualizar
                    </button>
                    <button
                      className={`um-btn ${usuario.activo ? 'um-btn--delete' : 'um-btn--save'}`}
                      onClick={() => handleToggle(usuario)}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
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