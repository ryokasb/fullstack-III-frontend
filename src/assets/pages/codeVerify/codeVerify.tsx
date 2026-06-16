import './codeVerify.css'
import Logo from "../../img/logosmart.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cambiarContraseña } from "../../service/gateway/gatewayService";

export default function CodeVerify() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await cambiarContraseña({ correo, codigo, nuevaContrasena: contraseña });
      setExito(true);
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="codeVerify">
      <img onClick={() => navigate("/")} className="logo-gog-re" src={Logo} alt="logo" />

      <form className="codeverify-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Recuperación</h2>
          <p>Ingresa el código enviado a tu correo</p>
        </div>

        <div className="code-section">
          <label htmlFor="codigo">Código de verificación</label>
          <input
            id="codigo"
            type="text"
            inputMode="numeric"
            placeholder="• • • • • •"
            maxLength={6}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>

        <div className="fields-section">
          <div className="field-group">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              placeholder="usuario@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="contrasena">Nueva contraseña</label>
            <input
              id="contrasena"
              type="password"
              placeholder="••••••••"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="error-msg" style={{ margin: "0 32px" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Cambiar contraseña"}
        </button>
      </form>

      {/* MODAL — dentro del return, fuera del form */}
      {exito && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">✓</div>
            <h3>¡Contraseña actualizada!</h3>
            <p>Tu contraseña fue cambiada exitosamente.</p>
            <button onClick={() => navigate("/login")}>Aceptar</button>
          </div>
        </div>
      )}
    </main>
  );
}