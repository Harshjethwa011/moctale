import { useEffect, useState } from "react";
import { getMovie } from "./api/omdb";

const cache = {};

export default function CatalogPoster({ imdbID, title }) {
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    if (!imdbID) return;

    if (cache[imdbID]) {
      setPoster(cache[imdbID]);
      return;
    }

    let active = true;

    getMovie(imdbID)
      .then((movie) => {
        if (!active) return;

        const url =
          movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : null;

        cache[imdbID] = url;
        setPoster(url);
      })
      .catch(() => {
        if (active) setPoster(null);
      });

    return () => {
      active = false;
    };
  }, [imdbID]);

  return (
    <img
      src={
        poster ||
        "https://placehold.co/380x560/111018/A78BFA?text=MOCTALE"
      }
      alt={title}
      loading="lazy"
    />
  );
}
