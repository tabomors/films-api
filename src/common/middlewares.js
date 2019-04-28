const logger = (req, res, next) => {
  console.log("Request path:");
  console.log(req.path);
  console.log("Request params:");
  console.log(req.params);
  console.log("Request query:");
  console.log(req.query);
  next();
};

module.exports = { logger };
