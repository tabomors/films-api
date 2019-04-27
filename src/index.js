const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const categories = JSON.parse(fs.readFileSync(path.join("public", "categories.json"), "utf-8"))
const releasedYears = JSON.parse(fs.readFileSync(
  path.join("public", "releasedYears.json"),
  "utf-8"
));

const app = express();

// TODO: Remove it in prod
app.use(express.static(path.join(__dirname, "public")));

// TODO: configure cors
app.use(cors());

app.get("/films", (req, res) => {
  const { query: { category: filmCategory, released: fileReleaseYear } } = req; 

  fs.readFile(path.join("public", "films.json"), "utf8", (err, data) => {
    if (err) {
      res.sendStatus(500, { message: "Internal server error" });
      return;
    }
    const films = JSON.parse(data);
    const filmsByCategory = filmCategory
      ? films
          .map(film => Object.assign(film, { category: findParamByFilmId(categories, film.id) }))
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
});

// NOTE: example of usage 
// /film/0?name&id&foo - will give you name and id
// /film/0 - will give you all content of the particular film
app.get("/film/:id", (req, res) => {
  const {
    params: { id: filmId },
    query
  } = req;

  fs.readFile(path.join("public", `${filmId}.json`), "utf8", (err, data) => {
    if (err) {
      res.sendStatus(500, { message: "Internal server error" });
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
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is listening on the port ${PORT}`);
});

function findParamByFilmId(lookupTable, filmId) {
  return Object.keys(lookupTable).find(param => {
    const raw = lookupTable[param];
    return raw.includes(filmId);
  })
}