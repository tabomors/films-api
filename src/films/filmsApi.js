const express = require("express");
const { findManyFilms, findOneFilm } = require("./filmsDAL");

const router = express.Router();

// NOTE: example of usage
// /films?releaseYear=2000
const multipleFilmsApiHandler = async (req, res) => {
  let {
    query: { category, releaseYear }
  } = req;

  // TODO: move it to controller?
  releaseYear = parseInt(releaseYear, 10);
  const entries = Object.entries({ categories: category, releaseYear }).filter(
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
  res.send({ message: films });
};

// NOTE: example of usage
// /films/0
const filmApiHandler = async (req, res) => {
  let {
    params: { topRating }
  } = req;

  // TODO: move it to controller?
  topRating = parseInt(topRating, 10);
  const film = await findOneFilm(topRating);
  res.send({ message: film });
};

router.get("/", multipleFilmsApiHandler);
router.get("/:topRating", filmApiHandler);

module.exports = router;
