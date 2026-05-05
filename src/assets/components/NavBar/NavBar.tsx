import './NavBar.css';
import logo from '../../img/logosmart.png'
import { FaShoppingCart } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";

export default function NavBar(){
    return<>
    <nav className='barra-navegacion'>    
        <div className='logo-izquierda'>
         <img src={logo} alt="" />
        </div>
          <div className='busqueda'>
        <input type="search" placeholder='Buscar' name="" id="" />
        </div>
        <ul>
            <li>Inicio</li>
            <li>Ofertas</li>
            <li>Contacto</li>
        </ul>
        <div className='carrito'>
             <FaShoppingCart size={22}/>
        </div>
        <div className='inicio-sesion'>
            <button className='button-iniciosesion'><VscAccount size={25}/>Iniciar Sesion</button>
        </div>
      </nav>
    </>
}