import './store.css'

export default function Store() {
  return (
    <main className="store">

      <aside className="filters">
        <h3 className="filters__title">Filtros</h3>

        <div className="filters__group">
          <span className="filters__label">Plataforma</span>
          <button className="filters__btn active">Todas</button>
          <button className="filters__btn">PC</button>
          <button className="filters__btn">PlayStation</button>
          <button className="filters__btn">Xbox</button>
          <button className="filters__btn">Nintendo</button>
        </div>

        <div className="filters__group">
          <span className="filters__label">Género</span>
          <button className="filters__btn">Acción</button>
          <button className="filters__btn">RPG</button>
          <button className="filters__btn">Deportes</button>
          <button className="filters__btn">Aventura</button>
          <button className="filters__btn">Estrategia</button>
        </div>

        <div className="filters__group">
          <span className="filters__label">Precio</span>
          <button className="filters__btn">Menos de $5.000</button>
          <button className="filters__btn">$5.000 – $15.000</button>
          <button className="filters__btn">Más de $15.000</button>
        </div>


        <button className="filters__clear">Limpiar filtros</button>
      </aside>

      <section className="cards-section">
        <h2 className="section-title">Juegos <span>Key</span></h2>

        <div className="cards-grid">

          {/* Card 1 */}
          <article className="card">
            <div className="card__img-wrap">
              <img src="https://placehold.co/300x400/0a1433/c9a227?text=GAME" alt="Game cover" />
              <div className="card__platform">
                <img src="" alt="Platform" />
              </div>
              <span className="card__badge badge--sale">−15%</span>
            </div>
            <div className="card__body">
              <span className="card__region">Región</span>
              <p className="card__title">Nombre del Juego</p>
              <div className="card__price-row">
                <span className="card__price">$0.000</span>
                <span className="card__price-old">$0.000</span>
              </div>
              <button className="card__btn">Comprar</button>
            </div>
            <button className="card__wish" aria-label="Añadir a favoritos">♡</button>
          </article>

          {/* Card 2 – agotado */}
          <article className="card is-sold-out">
            <div className="card__img-wrap">
              <img src="https://placehold.co/300x400/0a1433/c9a227?text=GAME" alt="Game cover" />
              <div className="card__platform">
                <img src="" alt="Platform" />
              </div>
              <div className="card__sold-out-overlay"><span>Agotado</span></div>
            </div>
            <div className="card__body">
              <span className="card__region">Región</span>
              <p className="card__title">Nombre del Juego</p>
              <div className="card__price-row">
                <span className="card__price">$0.000</span>
              </div>
              <button className="card__btn" disabled>No disponible</button>
            </div>
            <button className="card__wish" aria-label="Añadir a favoritos">♡</button>
          </article>

          {/* Card 3 – nuevo */}
          <article className="card">
            <div className="card__img-wrap">
              <img src="https://placehold.co/300x400/0a1433/c9a227?text=GAME" alt="Game cover" />
              <div className="card__platform">
                <img src="" alt="Platform" />
              </div>
              <span className="card__badge badge--new">Nuevo</span>
            </div>
            <div className="card__body">
              <span className="card__region">Región</span>
              <p className="card__title">Nombre del Juego</p>
              <div className="card__price-row">
                <span className="card__price">$0.000</span>
              </div>
              <button className="card__btn">Comprar</button>
            </div>
            <button className="card__wish" aria-label="Añadir a favoritos">♡</button>
          </article>

          {/* Card 4 – popular */}
          <article className="card">
            <div className="card__img-wrap">
              <img src="https://placehold.co/300x400/0a1433/c9a227?text=GAME" alt="Game cover" />
              <div className="card__platform">
                <img src="" alt="Platform" />
              </div>
              <span className="card__badge badge--hot">Popular</span>
            </div>
            <div className="card__body">
              <span className="card__region">Región</span>
              <p className="card__title">Nombre del Juego</p>
              <div className="card__price-row">
                <span className="card__price">$0.000</span>
                <span className="card__price-old">$0.000</span>
              </div>
              <button className="card__btn">Comprar</button>
            </div>
            <button className="card__wish" aria-label="Añadir a favoritos">♡</button>
          </article>

          {/* Card 5 */}
          <article className="card">
            <div className="card__img-wrap">
              <img src="https://placehold.co/300x400/0a1433/c9a227?text=GAME" alt="Game cover" />
              <div className="card__platform">
                <img src="" alt="Platform" />
              </div>
            </div>
            <div className="card__body">
              <span className="card__region">Región</span>
              <p className="card__title">Nombre del Juego</p>
              <div className="card__price-row">
                <span className="card__price">$0.000</span>
              </div>
              <button className="card__btn">Comprar</button>
            </div>
            <button className="card__wish" aria-label="Añadir a favoritos">♡</button>
          </article>

        </div>
      </section>

    </main>
  )
}