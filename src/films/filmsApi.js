const { findParamByFilmId } = require("../common/utils");
const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router()

// TODO: Move to DAL
const categories = JSON.parse(
  fs.readFileSync(path.join("public", "categories.json"), "utf-8")
);
const releasedYears = JSON.parse(
  fs.readFileSync(path.join("public", "releasedYears.json"), "utf-8")
);

// NOTE: /films?released=2000
const multipleFilmsApiHandler = (req, res) => {
  const {
    query: { category: filmCategory, released: fileReleaseYear }
  } = req;
  // TODO: move it from API handler
  fs.readFile(path.join("public", "films.json"), "utf8", (err, data) => {
    if (err) {
      res.status(500).send({ error: "Internal server error" });
      return;
    }
    const films = JSON.parse(data);
    const filmsByCategory = filmCategory
      ? films
          .map(film =>
            Object.assign(film, {
              category: findParamByFilmId(categories, film.id)
            })
          )
          .filter(({ category }) => category === filmCategory)
          .map(film => Object.assign(film, { category: filmCategory }))
      : films;

    const filmsByReleaseYear = fileReleaseYear
      ? filmsByCategory
          .map(film =>
            Object.assign(film, {
              released: findParamByFilmId(releasedYears, film.id)
            })
          )
          .filter(({ released }) => released === fileReleaseYear)
          .map(film => Object.assign(film, { released: fileReleaseYear }))
      : filmsByCategory;
    res.send({ message: filmsByReleaseYear });
  });
};

// NOTE: example of usage
// /films/0?name&id&foo - will give you name and id
// /films/0 - will give you all content of the particular film
const filmApiHandler = (req, res) => {
  const {
    params: { id: filmId },
    query
  } = req;

  fs.readFile(path.join("public", `${filmId}.json`), "utf8", (err, data) => {
    if (err) {
      res.status(500).send({ error: `There is no films with id ${filmId}` });
      return;
    }
    const film = JSON.parse(data);
    if (Object.keys(query).length === 0) {
      res.send({ message: film });
      return;
    }
    const ALLOWED_USER_PARAMS = ["name", "category", "rating", "id"];
    const filmDataToSend = Object.keys(query).reduce((acc, userParam) => {
      return ALLOWED_USER_PARAMS.includes(userParam)
        ? Object.assign(acc, { [userParam]: film[userParam] })
        : acc;
    }, {});
    res.send({ message: filmDataToSend });
  });
};

router.get("/", multipleFilmsApiHandler);
router.get("/:id", filmApiHandler);

module.exports = router;
