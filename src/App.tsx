import NavBar from './assets/components/NavBar/NavBar.tsx'
import Footer from './assets/components/Footer/Footer.tsx'
import Home from './assets/pages/home/home.tsx'

function App() {
  return (
    <div className="layout">
      <NavBar />
      <main className="contenido">
         <Home/>
      </main>
    </div>
  )
}

export default App