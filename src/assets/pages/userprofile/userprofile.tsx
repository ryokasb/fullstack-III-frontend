import './userprofile.css'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'
import { actualizarUsuario, cambiarContrasenaSinCodigo } from '../../service/gateway/gatewayService'
import Swal from 'sweetalert2'

export default function Userprofile() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const iniciales = usuario.nombre
    ? usuario.nombre.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const [modalPerfil, setModalPerfil] = useState(false)
  const [modalSeguridad, setModalSeguridad] = useState(false)

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
      setModalPerfil(false)
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
      setModalSeguridad(false)
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
      <div className="up-hero">
        <div className="up-avatar">{iniciales}</div>
        <p className="up-name">{usuario.nombre || 'Usuario'}</p>
        <p className="up-email">{usuario.correo || ''}</p>
        <span className="up-rol">{usuario.rol || 'Cliente'}</span>
      </div>

      <div className="up-cards">
        <div className="up-card" onClick={() => setModalPerfil(true)}>
          <div className="up-card-icon"><FaUser /></div>
          <p className="up-card-title">Perfil</p>
          <p className="up-card-desc">Nombre y correo electrónico</p>
          <FaChevronRight className="up-card-arrow" />
        </div>
        <div className="up-card" onClick={() => setModalSeguridad(true)}>
          <div className="up-card-icon"><FaLock /></div>
          <p className="up-card-title">Seguridad</p>
          <p className="up-card-desc">Contraseña y acceso</p>
          <FaChevronRight className="up-card-arrow" />
        </div>
      </div>

      {modalPerfil && (
        <div className="modal-overlay" onClick={() => setModalPerfil(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar perfil</h3>
            </div>
            <div className="modal-field">
              <label className="modal-label">Nombre</label>
              <input className="modal-input" type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Correo</label>
              <input className="modal-input" type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
            </div>
            <button className="modal-btn" onClick={handleGuardarPerfil} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {modalSeguridad && (
        <div className="modal-overlay" onClick={() => setModalSeguridad(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cambiar contraseña</h3>
            </div>
            <div className="modal-field">
              <label className="modal-label">Contraseña actual</label>
              <input className="modal-input" type="password" placeholder="••••••••" value={contrasenaActual} onChange={e => setContrasenaActual(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Nueva contraseña</label>
              <input className="modal-input" type="password" placeholder="••••••••" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Repetir contraseña</label>
              <input className="modal-input" type="password" placeholder="••••••••" value={repetirContrasena} onChange={e => setRepetirContrasena(e.target.value)} />
            </div>
            <button className="modal-btn" onClick={handleGuardarContrasena} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}