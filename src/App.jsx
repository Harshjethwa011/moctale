import { useState } from "react";
import { searchMovies, getMovie } from "./api/omdb";
import KageScene from "./KageScene";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (error) {
      console.error(error);
      setMovies([]);
    }

    setLoading(false);
  }

  async function openMovie(id) {
    try {
      const movie = await getMovie(id);
      setSelectedMovie(movie);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="app">

      <nav className="premium-nav">
        <div className="logo">
          MOCTA<span>LE</span>
        </div>

        <form onSubmit={handleSearch} className="search-box">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
          />
          <button type="submit">?</button>
        </form>
      </nav>

      <KageScene />

      <main className="movie-section">

        <div className="section-top">
          <div>
            <p className="section-label">
              {query ? "SEARCH RESULTS" : "MOVIE DISCOVERY"}
            </p>

            <h2>
              {query
                ? `Movies matching "${query}"`
                : "Discover your next story."}
            </h2>
          </div>
        </div>

        {loading && (
          <div className="status">
            SEARCHING OMDB...
          </div>
        )}

        {!loading && query && movies.length === 0 && (
          <div className="status">
            No movies found.
          </div>
        )}

        <div className="movie-grid">

          {movies.map((movie) => (
            <article
              className="movie-card"
              key={movie.imdbID}
              onClick={() => openMovie(movie.imdbID)}
            >
              <div className="poster-wrap">

                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://placehold.co/380x560/111018/A78BFA?text=NO+POSTER"
                  }
                  alt={movie.Title}
                />

                <div className="poster-overlay">
                  <span>VIEW DETAILS</span>
                </div>

              </div>

              <div className="movie-info">
                <h3>{movie.Title}</h3>

                <div>
                  <span>{movie.Year}</span>
                  <span>•</span>
                  <span>{movie.Type}</span>
                </div>
              </div>
            </article>
          ))}

        </div>

      </main>

      {selectedMovie && (
        <div
          className="modal"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>

            <img
              className="modal-poster"
              src={selectedMovie.Poster}
              alt={selectedMovie.Title}
            />

            <div className="modal-info">

              <p className="modal-label">
                {selectedMovie.Genre}
              </p>

              <h2>{selectedMovie.Title}</h2>

              <div className="modal-meta">
                <span>{selectedMovie.Year}</span>
                <span>{selectedMovie.Runtime}</span>
                <strong>? {selectedMovie.imdbRating}</strong>
              </div>

              <p className="plot">
                {selectedMovie.Plot}
              </p>

              <p>
                <b>Director</b>
                <br />
                {selectedMovie.Director}
              </p>

              <p>
                <b>Cast</b>
                <br />
                {selectedMovie.Actors}
              </p>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
