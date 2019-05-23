const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema({
  topRating: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    default: null
  },
  certificate: {
    type: String
  },
  duration: {
    type: Number
  },
  categories: [{ type: String }],
  rating: {
    type: Number
  },
  description: {
    type: String
  },
  director: {
    type: String
  },
  stars: [{ type: String }],
  votes: {
    type: String
  },
  gross: {
    type: String
  },
  smallPoster: {
    type: String
  },
  bigPoster: {
    type: String
  }
});

module.exports = mongoose.model("Film", filmSchema);
