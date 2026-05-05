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
      <section id='games'>
       <h3>Juegos Destacados</h3>

       <article>
        
       </article>

       </section>
    <Footer />
</>
)
}