const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query) {
  if (!query.trim()) return [];

  if (!API_KEY) {
    throw new Error("OMDb API key is missing");
  }

  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  console.log("OMDb search response:", data);

  if (data.Response === "False") {
    throw new Error(data.Error || "OMDb search failed");
  }

  return data.Search || [];
}

export async function getMovie(imdbID) {
  if (!API_KEY) {
    throw new Error("OMDb API key is missing");
  }

  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
  );

  const data = await response.json();

  console.log("OMDb movie response:", data);

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found");
  }

  return data;
}
