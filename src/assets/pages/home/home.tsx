import './home.css'
import Footer from '../../components/Footer/Footer'
import { MdLocalOffer } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";
import Ofertalogo from "../../img/iconos-links/ofertas-logo.png";
import Nllogo from "../../img/iconos-links/nl-logo.png";
import Jplogo from "../../img/iconos-links/jp-logo.png";
export default function home(){



return(
<>
    <section id="hero">
      <div className='text-content'>
          <h3 className='title-hero'>Descubre los <br/> mejores juegos</h3>
        <p className='hero-subtitle'>Explora nuestra tienda y encuentra increibles<br/>
            ofertas en los ultimos y mejores Videojuegos
        </p>
          <button className='button-hero'>Ver Ofertas</button>
      </div>
    </section>

    <section id="links">


      <article>
        <button><img className='ofertas-logo' src={Ofertalogo} alt="" /></button>
      </article>

      <article>
        <button><img className='nllogo' src={Nllogo} alt="" /></button>
      </article>

      <article>
        <button><img className='Jplogo' src={Jplogo} alt="" /></button>
      </article>

    </section>
     <section id="games">
  <h3>Juegos Destacados</h3>

  <article className="games-container">

    <div className="game-card">
      <img src="/img/game1.png" alt="God of War" />
      <h4>God of War</h4>
      <p>$29.990</p>
      <button>Ver más</button>
    </div>

    <div className="game-card">
      <img src="/img/game2.png" alt="Elden Ring" />
      <h4>Elden Ring</h4>
      <p>$39.990</p>
      <button>Ver más</button>
    </div>

    <div className="game-card">
      <img src="/img/game3.png" alt="Spider-Man 2" />
      <h4>Spider-Man 2</h4>
      <p>$49.990</p>
      <button>Ver más</button>
    </div>

    <div className="game-card">
      <img src="/img/game4.png" alt="Resident Evil 4" />
      <h4>Resident Evil 4</h4>
      <p>$34.990</p>
      <button>Ver más</button>
    </div>

  </article>
</section>
    <Footer />
</>
)
}