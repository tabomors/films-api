const Film = require('./models/Film');

function findManyFilms(opts) {
  return Film.find(opts);
}

function findOneFilm(topRating) {
  return Film.find({ topRating });
}

module.exports = { findManyFilms, findOneFilm };