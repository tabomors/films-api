const { findManyFilms, findOneFilm } = require("./filmsDAL");

async function multipleFilmsController(categories, releaseYear) {
  releaseYear = parseInt(releaseYear, 10);
  const entries = Object.entries({ categories, releaseYear }).filter(
    ([_, value]) => value
  );
  const queryOptions =
    entries && entries.length
      ? entries.reduce(
          (acc, [key, value]) => Object.assign(acc, { [key]: value }),
          {}
        )
      : {};
  const films = await findManyFilms(queryOptions);
  return films;
}

async function oneFilmController(tr) {
  const topRating = parseInt(tr, 10);
  if (!topRating) {
    throw new Error("Given topRating is invalid!");
  }
  const film = await findOneFilm(topRating);
  return film;
}

module.exports = {
  multipleFilmsController,
  oneFilmController
};
