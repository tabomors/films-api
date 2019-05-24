const express = require("express");
const {
  multipleFilmsController,
  oneFilmController
} = require("./filmsControllers");

const router = express.Router();

// NOTE: example of usage
// /films?releaseYear=2000
const multipleFilmsApiHandler = async (req, res, next) => {
  let {
    query: { category, releaseYear }
  } = req;
  try {
    const films = await multipleFilmsController(category, releaseYear);
    res.send({ message: films });
  } catch(e) {
    next(e)
  }
};

// NOTE: example of usage
// /films/0
const filmApiHandler = async (req, res, next) => {
  let {
    params: { topRating }
  } = req;
  try {
    const film = await oneFilmController(topRating);
    res.send({ message: film });
  } catch (e) {
    next(e);
  }
};

router.get("/", multipleFilmsApiHandler);
router.get("/:topRating", filmApiHandler);
router.use((err, req, res, next) => {
  // TODO: handle it here if it is operational
  // https://github.com/i0natan/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md
  console.log('Films error:')
  // or pass error to the next middleware
  next(err);
});

module.exports = router;
