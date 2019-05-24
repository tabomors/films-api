const logger = (req, res, next) => {
  console.log("Request path:");
  console.log(req.path);
  console.log("Request params:");
  console.log(req.params);
  console.log("Request query:");
  console.log(req.query);
  next();
};

// TODO: dig into error handling
const error = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Server is down" });
};

module.exports = { logger, error };
