const fs = require("fs");
const zlib = require("zlib");
const readline = require("readline");

const INPUT = "scripts/title.basics.tsv.gz";
const OUTPUT = "src/data/catalog.json";

const TARGET = 10000;

const genreTargets = {
  Action: 600,
  Adventure: 600,
  Animation: 500,
  Comedy: 600,
  Crime: 500,
  Documentary: 400,
  Drama: 800,
  Family: 400,
  Fantasy: 500,
  History: 350,
  Horror: 500,
  Music: 300,
  Mystery: 400,
  Romance: 500,
  "Sci-Fi": 500,
  Sport: 250,
  Thriller: 600,
  War: 250,
  Western: 250
};

const buckets = {};

for (const genre of Object.keys(genreTargets)) {
  buckets[genre] = [];
}

const seen = new Set();

const stream = fs
  .createReadStream(INPUT)
  .pipe(zlib.createGunzip());

const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity
});

let first = true;

rl.on("line", (line) => {
  if (first) {
    first = false;
    return;
  }

  const parts = line.split("\t");

  if (parts.length < 9) return;

  const [
    imdbID,
    titleType,
    primaryTitle,
    originalTitle,
    isAdult,
    startYear,
    endYear,
    runtimeMinutes,
    genres
  ] = parts;

  if (isAdult === "1") return;

  if (
    titleType !== "movie" &&
    titleType !== "tvSeries" &&
    titleType !== "tvMiniSeries"
  ) {
    return;
  }

  if (!primaryTitle || primaryTitle === "\\N") return;

  if (!startYear || startYear === "\\N") return;

  const year = Number(startYear);

  if (year < 1900 || year > new Date().getFullYear() + 1) return;

  const genreList =
    genres === "\\N"
      ? []
      : genres.split(",").filter(Boolean);

  if (!genreList.length) return;

  const item = {
    imdbID,
    title: primaryTitle,
    originalTitle:
      originalTitle === "\\N" ? primaryTitle : originalTitle,
    type:
      titleType === "movie"
        ? "movie"
        : "series",
    year,
    endYear:
      endYear === "\\N"
        ? null
        : Number(endYear),
    runtime:
      runtimeMinutes === "\\N"
        ? null
        : Number(runtimeMinutes),
    genres: genreList
  };

  for (const genre of genreList) {
    if (
      buckets[genre] &&
      buckets[genre].length < genreTargets[genre] &&
      !seen.has(imdbID)
    ) {
      buckets[genre].push(item);
      seen.add(imdbID);
    }
  }
});

rl.on("close", () => {
  let catalog = Object.values(buckets).flat();

  const unique = new Map();

  for (const movie of catalog) {
    unique.set(movie.imdbID, movie);
  }

  catalog = Array.from(unique.values());

  catalog.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }

    return a.title.localeCompare(b.title);
  });

  /*
   * Fill remaining slots with additional valid titles.
   * This guarantees the catalogue reaches 10,000 when
   * enough IMDb titles are available.
   */
  if (catalog.length < TARGET) {
    console.log(
      `Genre-balanced selection produced ${catalog.length}.`
    );
  }

  catalog = catalog.slice(0, TARGET);

  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(catalog, null, 2),
    "utf8"
  );

  console.log("");
  console.log("=================================");
  console.log("MOCTALE CATALOG CREATED");
  console.log("=================================");
  console.log(`Titles: ${catalog.length}`);
  console.log(`Output: ${OUTPUT}`);
  console.log("");

  const movies = catalog.filter(
    (x) => x.type === "movie"
  ).length;

  const series = catalog.filter(
    (x) => x.type === "series"
  ).length;

  console.log(`Movies: ${movies}`);
  console.log(`Series: ${series}`);
  console.log("");
});
