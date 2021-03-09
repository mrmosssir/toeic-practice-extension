var mongoose = require("mongoose");

module.exports = mongoose.model(
  "vocabulary",
  new mongoose.Schema({
    classification_id: String,
    vocabulary: String,
    example_sentences: String,
  })
);
