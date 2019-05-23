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
const error = (err, req, res) => {
  console.log('here')
  if (err) {
    console.log('common error')
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { logger, error };
