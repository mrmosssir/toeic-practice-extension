var mongoose = require("mongoose");

module.exports = mongoose.model(
  "Classification",
  new mongoose.Schema({
    id: String,
    title: String,
    is_schedule: String,
    day: String,
  })
);
