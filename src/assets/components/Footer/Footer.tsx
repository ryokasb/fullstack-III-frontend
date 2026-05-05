import './Footer.css';
import logo from '../../img/footer-logo.png'

export default function Footer(){
    return<>
    <footer className='Footer'>    
        <div className='logo-izquierda'>
         <img src={logo} alt="" />
        </div>
        <ul>
            <li>Sobre Nosotros</li>
            <li>Contacto</li>
        </ul>
      </footer>
    </>
}