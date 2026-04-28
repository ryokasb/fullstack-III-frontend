import './home.css'
import Footer from '../../components/Footer/Footer'
import { MdLocalOffer } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";
export default function home(){



return(
<>
    <section id="hero">
      <div className='text-content'>
          <h3 className='title-hero'>Descubre Los <br/> Mejores Juegos</h3>
        <p>Explora nuestra tienda y encuentra increibles<br/>
            ofertas en los ultimos y mejores Videojuegos
          </p>
          <button className='button-hero'>Ver Ofertas</button>
      </div>
    </section>

    <section id="links">


      <article>
        <button><MdLocalOffer/><h3>Ofertas</h3></button>
      </article>

      <article>
        <button><FaBoxOpen/><h3>Nuevos Lanzamientos</h3></button>
      </article>

      <article>
        <button><GiLaurelsTrophy/><h3>Juegos Populares</h3></button>
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