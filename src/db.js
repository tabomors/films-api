const mongoose = require("mongoose");
require("dotenv").config();

const connectionStr = process.env.DB_CONNECTION_STRING || "mongodb://localhost/filmsDb";

mongoose.connect(
  connectionStr,
  { useNewUrlParser: true, dbName: "filmsDb", useCreateIndex: true },
  err => {
    if (err) {
      console.error("Can't connect to database!", connectionStr);
      console.error(err);
      return;
    }
    console.log("MongoDb is connected!");
  }
);

module.exports = mongoose;
