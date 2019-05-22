const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_CONNECTION_STRING,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.error("Can't connect to database!");
      return;
    }
    console.log("MongoDb is connected!");
  }
);

module.exports = mongoose;
