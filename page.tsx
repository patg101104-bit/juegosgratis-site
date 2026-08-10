"use client";

import { useMemo, useState } from "react";

type Game = {
  id: string;
  title: string;
  category: string;
  image: string;
  gameUrl: string;
};

const games: Game[] = [
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Carreras",
    image:
      "https://img.gamedistribution.com/a26b2b6473ba418bb208471c66f7f329-512x512.jpeg",
    gameUrl:
      "https://html5.gamedistribution.com/rvvAS300/a26b2b6473ba418bb208471c66f7f329/",
  },
  {
    id: "runner-arcade",
    title: "Runner Arcade",
    category: "Acción",
    image:
      "https://img.gamedistribution.com/f920279c09d54e4f9b8c0c1efdfbe53a-512x512.jpeg",
    gameUrl:
      "https://html5.gamedistribution.com/f920279c09d54e4f9b8c0c1efdfbe53a/",
  },
];

const categories = ["Todos", "Acción", "Carreras", "Arcade", "Puzzle"];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredGames = useMemo(() => {
    const term = search.trim().toLowerCase();

    return games.filter((game) => {
      const matchesSearch =
        !term ||
        game.title.toLowerCase().includes(term) ||
        game.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "Todos" || game.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  function playGame(game: Game) {
    setSelectedGame(game);

    window.setTimeout(() => {
      document
        .getElementById("game-container")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function closeGame() {
    setSelectedGame(null);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="logo" href="/" aria-label="JuegosGratis.site inicio">
          <span className="logo-icon">🎮</span>
          <span>JuegosGratis<span className="logo-domain">.site</span></span>
        </a>

        <div className="search-bar">
          <label htmlFor="game-search" className="sr-only">
            Buscar juegos
          </label>
          <input
            id="game-search"
            type="search"
            placeholder="🔎 Buscar juegos..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div>
            <span className="eyebrow">🎮 JUEGA GRATIS</span>
            <h1>Videojuegos gratis, directamente en tu navegador.</h1>
            <p>
              Descubre juegos de acción, carreras, arcade y mucho más.
              Sin instalaciones complicadas.
            </p>
          </div>
        </section>

        <div className="ad-placeholder" aria-label="Espacio publicitario">
          <span>ESPACIO PUBLICITARIO</span>
        </div>

        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <h2>Juegos</h2>
              <p>{filteredGames.length} juegos disponibles</p>
            </div>
          </div>

          <div className="categories" aria-label="Categorías">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`category-button ${
                  category === item ? "active" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid-games">
              {filteredGames.map((game) => (
                <article
                  className="game-card"
                  key={game.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => playGame(game)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      playGame(game);
                    }
                  }}
                >
                  <div className="game-image-wrap">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="game-image"
                      loading="lazy"
                    />
                    <span className="play-badge">▶ JUGAR</span>
                  </div>

                  <div className="card-info">
                    <h3>{game.title}</h3>
                    <span>{game.category}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔎</div>
              <h3>No encontramos juegos</h3>
              <p>Prueba con otro nombre o categoría.</p>
            </div>
          )}
        </section>

        {selectedGame && (
          <section id="game-container" className="game-container">
            <div className="player-header">
              <div>
                <span className="player-label">AHORA JUGANDO</span>
                <h2>{selectedGame.title}</h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeGame}
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="game-frame-wrap">
              <iframe
                src={selectedGame.gameUrl}
                title={selectedGame.title}
                className="game-frame"
                allowFullScreen
              />
            </div>

            <p className="player-note">
              Si el juego no carga, puede que el proveedor no permita
              reproducirlo dentro de otros sitios.
            </p>
          </section>
        )}

        <div className="ad-placeholder bottom-ad" aria-label="Espacio publicitario">
          <span>ESPACIO PUBLICITARIO</span>
        </div>
      </main>

      <footer className="site-footer">
        <div>
          <strong>🎮 JuegosGratis.site</strong>
          <p>Juegos gratuitos online.</p>
        </div>
        <p>© 2026 JuegosGratis.site · Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}