const path = require("path");
const fs = require("fs");
const express = require("express");
// const bodyParser = require("body-parser");

const app = express();

// TODO: Remove it in prod
app.use(express.static(path.join(__dirname, "public")));

// NOTE: don't need it for now
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/films", (_, res) => {
  fs.readFile(path.join("public", "films.json"), "utf8", (err, data) => {
    if (err) {
      res.sendStatus(500, { message: "Internal server error" });
      return;
    }
    const films = JSON.parse(data);
    res.send({ message: films });
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
