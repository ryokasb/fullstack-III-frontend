import './passwordrecovery.css'
import Logo from "../../img/logosmart.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { solicitarRecuperacion } from "../../service/gateway/gatewayService";
import { Mail, Send } from 'lucide-react'; 

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await solicitarRecuperacion(correo);
      navigate("/code-verify"); // o la ruta que corresponda
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="Passrecovery">
      <img onClick={() => navigate("/")} className="logo-gog-re" src={Logo} alt="logo" />

      <form className="recovery-form" onSubmit={handleSubmit}>
  <div className="form-header">
    <div className="form-icon">
      <Mail size={22} />
    </div>
    <h2>Recuperar contraseña</h2>
    <p>Te enviaremos un código de verificación a tu correo electrónico.</p>
  </div>

  <div className="form-body">
    <div className="field-group">
      <label className="field-label" htmlFor="correo">Correo electrónico</label>
      <div className="input-icon-wrap">
        <input
          id="correo"
          type="email"
          placeholder="usuario@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>

    </div>

    {error && <p className="error-msg">{error}</p>}

    <button type="submit" disabled={loading}>
      <Send size={17} />
      {loading ? "Enviando..." : "Enviar código"}
    </button>
  </div>
</form>
    </main>
  );
}