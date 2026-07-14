import './userprofile.css'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaSignOutAlt } from 'react-icons/fa'
import { useState } from 'react'
import { actualizarUsuario, cambiarContrasenaSinCodigo } from '../../service/gateway/gatewayService'
import Swal from 'sweetalert2'

type Seccion = 'perfil' | 'seguridad'

export default function Userprofile() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const iniciales = usuario.nombre
    ? usuario.nombre.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const [seccionActiva, setSeccionActiva] = useState<Seccion>('perfil')

  const [nombre, setNombre] = useState(usuario.nombre || '')
  const [correo, setCorreo] = useState(usuario.correo || '')
  const [contrasenaActual, setContrasenaActual] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [repetirContrasena, setRepetirContrasena] = useState('')
  const [loading, setLoading] = useState(false)

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('rol')
    navigate('/login')
  }

  const handleGuardarPerfil = async () => {
    setLoading(true)
    try {
      await actualizarUsuario(usuario.id, { nombre, correo })
      await Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Debes iniciar sesión nuevamente.',
        confirmButtonText: 'Cerrar sesión',
        confirmButtonColor: '#051150',
      })
      cerrarSesion()
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo actualizar', confirmButtonColor: '#051150' })
    } finally {
      setLoading(false)
    }
  }

  const handleGuardarContrasena = async () => {
    if (nuevaContrasena !== repetirContrasena) {
      Swal.fire({ icon: 'error', title: 'Las contraseñas no coinciden', confirmButtonColor: '#051150' })
      return
    }

    setLoading(true)
    try {
      await cambiarContrasenaSinCodigo({
        correo: usuario.correo,
        contrasenaActual,
        nuevaContrasena,
      })
      await Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'Debes iniciar sesión nuevamente para continuar.',
        confirmButtonText: 'Cerrar sesión',
        confirmButtonColor: '#051150',
      })
      cerrarSesion()
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo actualizar', confirmButtonColor: '#051150' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="userprofile">
      <div className="up-layout">

        {/* ASIDE */}
        <aside className="up-aside">
          <div className="up-hero">
            <div className="up-avatar">{iniciales}</div>
            <p className="up-name">{usuario.nombre || 'Usuario'}</p>
            <p className="up-email">{usuario.correo || ''}</p>
            <span className="up-rol">{usuario.rol || 'Cliente'}</span>
          </div>

          <nav className="up-nav">
            <button
              className={`up-nav-item ${seccionActiva === 'perfil' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('perfil')}
            >
              <FaUser className="up-nav-icon" />
              Perfil
            </button>
            <button
              className={`up-nav-item ${seccionActiva === 'seguridad' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('seguridad')}
            >
              <FaLock className="up-nav-icon" />
              Seguridad
            </button>
          </nav>

          <button className="up-logout" onClick={cerrarSesion}>
            <FaSignOutAlt />
            Cerrar sesión
          </button>
        </aside>

        {/* PANEL DERECHO */}
        <section className="up-panel">
          {seccionActiva === 'perfil' && (
            <div className="up-panel-section">
              <div className="up-panel-header">
                <h3>Perfil</h3>
                <p>Actualiza tu nombre y correo electrónico</p>
              </div>

              <div className="up-field">
                <label>Nombre</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>

              <div className="up-field">
                <label>Correo electrónico</label>
                <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
              </div>

              <button className="up-save-btn" onClick={handleGuardarPerfil} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}

          {seccionActiva === 'seguridad' && (
            <div className="up-panel-section">
              <div className="up-panel-header">
                <h3>Seguridad</h3>
                <p>Cambia tu contraseña de acceso</p>
              </div>

              <div className="up-field">
                <label>Contraseña actual</label>
                <input type="password" placeholder="••••••••" value={contrasenaActual} onChange={e => setContrasenaActual(e.target.value)} />
              </div>

              <div className="up-field">
                <label>Nueva contraseña</label>
                <input type="password" placeholder="••••••••" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} />
              </div>

              <div className="up-field">
                <label>Repetir contraseña</label>
                <input type="password" placeholder="••••••••" value={repetirContrasena} onChange={e => setRepetirContrasena(e.target.value)} />
              </div>

              <button className="up-save-btn" onClick={handleGuardarContrasena} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  )
}