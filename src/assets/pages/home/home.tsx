import './home.css'
import Footer from '../../components/Footer/Footer'
import { useEffect, useState } from 'react'
import { getProductos } from '../../service/gateway/gatewayService'
import type { Producto } from '../../service/gateway/Dto/Dtos'
import { useNavigate } from 'react-router-dom'
import Ofertalogo from "../../img/iconos-links/ofertas-logo.png";
import Nllogo from "../../img/iconos-links/nl-logo.png";
import Jplogo from "../../img/iconos-links/jp-logo.png";
import { gameImages } from '../../utils/gameImage'

export default function Home() {
  const navigate = useNavigate()
  const [destacados, setDestacados] = useState<Producto[]>([])

  useEffect(() => {
    getProductos()
      .then(productos => {
        const top = [...productos]
          .sort((a, b) => b.precio - a.precio)
          .slice(0, 4) // los 4 más caros
        setDestacados(top)
      })
      .catch(() => console.error("Error al cargar destacados"))
  }, [])

  return (
    <>
      <main className="home">
        <section id="hero">
          <div className='text-content'>
            <h3 className='title-hero'>Descubre los <br /> mejores juegos</h3>
            <p className='hero-subtitle'>
              Explora nuestra tienda y encuentra increibles<br />
              ofertas en los ultimos y mejores Videojuegos
            </p>
            <button className='button-hero' onClick={() => navigate('/Games')}>Ver Ofertas</button>
          </div>
        </section>

        <section id="links">
          <article>
            <button onClick={() => navigate('/Games')} ><img className='ofertas-logo' src={Ofertalogo} alt="" /></button>
          </article>
          <article>
            <button><img className='nllogo' src={Nllogo} alt="" /></button>
          </article>
          <article>
            <button onClick={() => navigate('/Games')} ><img className='Jplogo' src={Jplogo} alt="" /></button>
          </article>
        </section>

        <section id="games">
          <h3>Juegos Destacados</h3>

          <article className="games-container">
            {destacados.length === 0 ? (
              <p>Cargando destacados...</p>
            ) : (
              destacados.map(producto => (
                <div key={producto.id} className="game-card">
                  <img
                                src={gameImages[producto.nombre] || `https://placehold.co/300x400/0a1433/c9a227?text=${encodeURIComponent(producto.nombre)}`}
                                alt={producto.nombre}
                             />
                  <h4>{producto.nombre}</h4>
                  <p>${producto.precio.toLocaleString('es-CL')}</p>
                  <button onClick={() => navigate(`/product/${producto.id}`)}>Ver más</button>
                </div>
              ))
            )}
          </article>
        </section>

        <Footer />
      </main>
    </>
  )
}