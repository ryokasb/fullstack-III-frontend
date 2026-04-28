import './NavBar.css';
import logo from '../../img/logosmart.png'
import { FaShoppingCart } from "react-icons/fa";

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
             <FaShoppingCart size={25}/>
        </div>
      </nav>
    </>
}