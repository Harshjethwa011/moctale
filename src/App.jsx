import { useMemo, useState } from "react";
import { searchMovies, getMovie } from "./api/omdb";
import KageScene from "./KageScene";
import CatalogPoster from "./CatalogPoster";
import catalog from "./data/catalog.json";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [genre, setGenre] = useState("All");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredCatalog = useMemo(() => {
    let results = catalog;

    if (type !== "all") {
      results = results.filter(
        (item) => item.type === type
      );
    }

    if (genre !== "All") {
      results = results.filter((item) =>
        item.genres?.some(
          (g) =>
            g.toLowerCase() === genre.toLowerCase()
        )
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();

      results = results.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.originalTitle
            ?.toLowerCase()
            .includes(q)
      );
    }

    return results.slice(0, 24);
  }, [query, type, genre]);

  async function handleSearch(e) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);

    try {
      const results = await searchMovies(query);

      console.log("SEARCH RESULTS:", results);

      setMovies(results);
    } catch (error) {
      console.error("SEARCH ERROR:", error);
      setMovies([]);
    }

    setLoading(false);
  }

  async function openMovie(imdbID) {
    try {
      const movie = await getMovie(imdbID);
      setSelectedMovie(movie);
    } catch (error) {
      console.error("MOVIE ERROR:", error);
    }
  }

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="premium-nav">

        <div className="logo">
          MOCTA<span>LE</span>
        </div>

        <form
          onSubmit={handleSearch}
          className="search-box"
        >
          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search movies & series..."
          />

          <button type="submit">
            ⌕
          </button>
        </form>

      </nav>

      {/* HERO */}

      <KageScene />

      <main className="movie-section">

        {/* HEADER */}

        <div className="section-top">

          <div>

            <p className="section-label">
              MOCTALE WORLD
            </p>

            <h2>
              {query
                ? `Searching for "${query}"`
                : "Explore thousands of stories."}
            </h2>

          </div>

        </div>

        {/* TYPE FILTER */}

        <div className="filter-row">

          <button
            className={
              type === "all"
                ? "filter active"
                : "filter"
            }
            onClick={() => setType("all")}
          >
            ALL
          </button>

          <button
            className={
              type === "movie"
                ? "filter active"
                : "filter"
            }
            onClick={() => setType("movie")}
          >
            MOVIES
          </button>

          <button
            className={
              type === "series"
                ? "filter active"
                : "filter"
            }
            onClick={() => setType("series")}
          >
            SERIES
          </button>

        </div>

        {/* GENRE FILTER */}

        <div className="genre-row">

          {GENRES.map((item) => (

            <button
              key={item}
              className={
                genre === item
                  ? "genre active"
                  : "genre"
              }
              onClick={() => setGenre(item)}
            >
              {item}
            </button>

          ))}

        </div>

        {/* OMDB RESULTS */}

        {query && (

          <section>

            <div className="section-heading">

              <p className="section-label">
                OMDB
              </p>

              <h2>
                Search results
              </h2>

            </div>

            {loading && (

              <div className="status">
                SEARCHING...
              </div>

            )}

            {!loading &&
              movies.length === 0 && (

                <div className="status">
                  No OMDb results found.
                </div>

            )}

            <div className="movie-grid">

              {movies.map((movie) => (

                <article
                  className="movie-card"
                  key={movie.imdbID}
                  onClick={() =>
                    openMovie(movie.imdbID)
                  }
                >

                  <div className="poster-wrap">

                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://placehold.co/380x560/111018/A78BFA?text=MOCTALE"
                      }
                      alt={movie.Title}
                      loading="lazy"
                    />

                    <div className="poster-overlay">

                      <span>
                        VIEW DETAILS
                      </span>

                    </div>

                  </div>

                  <div className="movie-info">

                    <h3>
                      {movie.Title}
                    </h3>

                    <div>

                      <span>
                        {movie.Year}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {movie.Type}
                      </span>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          </section>

        )}

        {/* LOCAL CATALOGUE */}

        <section>

          <div className="section-heading">

            <p className="section-label">
              {catalog.length.toLocaleString()} TITLES
            </p>

            <h2>
              {genre === "All"
                ? "The Moctale catalogue."
                : `${genre} stories.`}
            </h2>

            <p className="catalog-count">
              Showing {filteredCatalog.length} titles
            </p>

          </div>

          <div className="movie-grid">

            {filteredCatalog.map((movie) => (

              <article
                className="movie-card"
                key={movie.imdbID}
                onClick={() =>
                  openMovie(movie.imdbID)
                }
              >

                <div className="poster-wrap">

                  <CatalogPoster
                    imdbID={movie.imdbID}
                    title={movie.title}
                  />

                  <div className="poster-overlay">

                    <span>
                      VIEW DETAILS
                    </span>

                  </div>

                </div>

                <div className="movie-info">

                  <h3>
                    {movie.title}
                  </h3>

                  <div>

                    <span>
                      {movie.year || "—"}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {movie.type === "series"
                        ? "Series"
                        : "Movie"}
                    </span>

                  </div>

                  <small>
                    {movie.genres?.join(" • ")}
                  </small>

                </div>

              </article>

            ))}

          </div>

        </section>

      </main>

      {/* MOVIE DETAILS MODAL */}

      {selectedMovie && (

        <div
          className="modal"
          onClick={() =>
            setSelectedMovie(null)
          }
        >

          <div
            className="modal-box"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close"
              onClick={() =>
                setSelectedMovie(null)
              }
            >
              ×
            </button>

            <img
              className="modal-poster"
              src={
                selectedMovie.Poster !== "N/A"
                  ? selectedMovie.Poster
                  : "https://placehold.co/380x560/111018/A78BFA?text=MOCTALE"
              }
              alt={selectedMovie.Title}
            />

            <div className="modal-info">

              <p className="modal-label">
                {selectedMovie.Genre}
              </p>

              <h2>
                {selectedMovie.Title}
              </h2>

              <div className="modal-meta">

                <span>
                  {selectedMovie.Year}
                </span>

                <span>
                  {selectedMovie.Runtime}
                </span>

                <strong>
                  ★ {selectedMovie.imdbRating}
                </strong>

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