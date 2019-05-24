const error = (err, req, res, next) => {
  // TODO: handle it here if it is operational
  // https://github.com/i0natan/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md
  console.log("Films error:");
  if (err.isOperational) {
    console.trace(err);
    return res.status(404).send({ message: "No such film(-s)" });
  }
  // or pass error to the next middleware
  next(err);
};

module.exports = { error }