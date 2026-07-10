import './adminhome.css'
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { AiFillTags } from "react-icons/ai";

export default function AdminHome() {
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const cards = [
    {
      icon: <FaBoxOpen size={28} />,
      label: 'Productos',
      description: 'Crea, edita y elimina juegos del catálogo. Administra stock, precios y descripciones.',
      action: () => navigate('/productmanager'),
      accent: '#1a3aff',
      glow: 'rgba(26, 58, 255, 0.35)',
    },
    {
      icon: <FaUsers size={28} />,
      label: 'Usuarios',
      description: 'Consulta y administra las cuentas registradas en la plataforma.',
      action: () => navigate('/usermanager'),
      accent: '#00d4ff',
      glow: 'rgba(0, 212, 255, 0.3)',
    },
     {
      icon: <AiFillTags size={28} />,
      label: 'Ventas',
      description: 'Consulta y administra todas las ventas.',
      action: () => navigate('/salesadministrator'),
      accent: '#00d4ff',
      glow: 'rgba(0, 212, 255, 0.3)',
    },
  ];

  return (
    <main className="adminhome">
      {}
      <div className="adminhome__grid" />

      <div className="adminhome__content">

        {}
        <div className="adminhome__badge">
          <FaShieldAlt size={12} />
          Panel de Administración
        </div>

        {}
        <div className="adminhome__hero">
          <h1 className="adminhome__title">
            Bienvenido,<br />
            <span className="adminhome__name">
              {usuario?.nombre}
            </span>
          </h1>
          <p className="adminhome__subtitle">
            Desde aquí puedes gestionar todos los recursos de la plataforma.
          </p>
        </div>

        {}
        <div className="adminhome__cards">
          {cards.map((card, i) => (
            <button
              key={card.label}
              className="adminhome__card"
              style={{ animationDelay: `${i * 120}ms`, '--card-accent': card.accent, '--card-glow': card.glow } as React.CSSProperties}
              onClick={card.action}
            >
              <div className="adminhome__card-icon">
                {card.icon}
              </div>
              <div className="adminhome__card-body">
                <span className="adminhome__card-label">{card.label}</span>
                <p className="adminhome__card-desc">{card.description}</p>
              </div>
              <FaArrowRight className="adminhome__card-arrow" size={16} />
            </button>
          ))}
        </div>

      </div>
    </main>
  );
}