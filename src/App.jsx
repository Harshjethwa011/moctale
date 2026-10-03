import { Search } from "lucide-react";
import { useState } from "react";
import { searchMovies, getMovie } from "./api/omdb";
import KageScene from "./KageScene";

const TYPES = ["all", "movie", "series"];

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();

    const value = query.trim();

    if (!value) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setSelectedMovie(null);

    try {
      const results = await searchMovies(value);

      const filtered =
        type === "all"
          ? results
          : results.filter((movie) => movie.Type === type);

      setMovies(filtered);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setError(err.message || "Unable to search movies.");
    } finally {
      setLoading(false);
    }
  }

  async function openMovie(imdbID) {
    try {
      setError("");

      const movie = await getMovie(imdbID);

      setSelectedMovie(movie);
    } catch (err) {
      console.error("MOVIE ERROR:", err);
      setError(err.message || "Unable to load movie details.");
    }
  }

  function handleTypeChange(value) {
    setType(value);

    if (!movies.length) return;

    if (value === "all") {
      return;
    }

    setMovies((current) =>
      current.filter((movie) => movie.Type === value)
    );
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
            placeholder="Search movies & series..."
          />

          <button type="submit" aria-label="Search"><Search size={20} strokeWidth={2} /></button>
        </form>
      </nav>

      <KageScene />

      <main className="movie-section">
        <div className="section-top">
          <div>
            <p className="section-label">MOCTALE SEARCH</p>

            <h2>
              {query
                ? `Results for "${query}"`
                : "Discover your next story."}
            </h2>

            <p className="catalog-count">
              Search the Moctale movie & series database.
            </p>
          </div>
        </div>

        <div className="filter-row">
          {TYPES.map((item) => (
            <button
              key={item}
              className={
                type === item
                  ? "filter active"
                  : "filter"
              }
              onClick={() => handleTypeChange(item)}
            >
              {item === "all"
                ? "ALL"
                : item === "movie"
                ? "MOVIES"
                : "SERIES"}
            </button>
          ))}
        </div>

        {!query && (
          <div className="status">
            Search for a movie or series to begin.
          </div>
        )}

        {loading && (
          <div className="status">
            SEARCHING MOCTALE...
          </div>
        )}

        {error && !loading && (
          <div className="status">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          query &&
          movies.length === 0 && (
            <div className="status">
              No movies or series found.
            </div>
          )}

        {!loading && movies.length > 0 && (
          <section>
            <div className="section-heading">
              <p className="section-label">
                {movies.length} RESULTS
              </p>

              <h2>Search results.</h2>
            </div>

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
                        movie.Poster &&
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://placehold.co/380x560/111018/A78BFA?text=MOCTALE"
                      }
                      alt={movie.Title}
                      loading="lazy"
                    />

                    <div className="poster-overlay">
                      <span>VIEW DETAILS</span>
                    </div>
                  </div>

                  <div className="movie-info">
                    <h3>{movie.Title}</h3>

                    <div>
                      <span>{movie.Year}</span>
                      <span>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span>
                      <span>
                        {movie.Type === "series"
                          ? "Series"
                          : "Movie"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
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
              ÃƒÆ’Ã¢â‚¬â€
            </button>

            <img
              className="modal-poster"
              src={
                selectedMovie.Poster &&
                selectedMovie.Poster !== "N/A"
                  ? selectedMovie.Poster
                  : "https://placehold.co/380x560/111018/A78BFA?text=MOCTALE"
              }
              alt={selectedMovie.Title}
            />

            <div className="modal-info">
              <p className="modal-label">
                {selectedMovie.Genre !== "N/A"
                  ? selectedMovie.Genre
                  : "MOCTALE"}
              </p>

              <h2>{selectedMovie.Title}</h2>

              <div className="modal-meta">
                <span>{selectedMovie.Year}</span>

                {selectedMovie.Runtime !== "N/A" && (
                  <span>{selectedMovie.Runtime}</span>
                )}

                {selectedMovie.imdbRating !== "N/A" && (
                  <strong>
                    ? {selectedMovie.imdbRating}
                  </strong>
                )}
              </div>

              {selectedMovie.Plot !== "N/A" && (
                <p className="plot">
                  {selectedMovie.Plot}
                </p>
              )}

              {selectedMovie.Director !== "N/A" && (
                <p>
                  <b>Director</b>
                  <br />
                  {selectedMovie.Director}
                </p>
              )}

              {selectedMovie.Writer !== "N/A" && (
                <p>
                  <b>Writer</b>
                  <br />
                  {selectedMovie.Writer}
                </p>
              )}

              {selectedMovie.Actors !== "N/A" && (
                <p>
                  <b>Cast</b>
                  <br />
                  {selectedMovie.Actors}
                </p>
              )}

              {selectedMovie.Language !== "N/A" && (
                <p>
                  <b>Language</b>
                  <br />
                  {selectedMovie.Language}
                </p>
              )}

              {selectedMovie.Country !== "N/A" && (
                <p>
                  <b>Country</b>
                  <br />
                  {selectedMovie.Country}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
