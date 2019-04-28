function findParamByFilmId(lookupTable, filmId) {
  return Object.keys(lookupTable).find(param => {
    const raw = lookupTable[param];
    return raw.includes(filmId);
  });
}

module.exports = {
  findParamByFilmId
};