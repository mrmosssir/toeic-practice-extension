const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const config = require("./config");

const Classification = require("./tools/models/classification");
const Vocabulary = require("./tools/models/vocabulary");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/* json" }));

mongoose.connect(config.database, {
  userNewParser: true,
  userUnifiedTopology: true,
});

app.get("/classifications", (request, response) => {
  Classification.find({}, (error, classification) => {
    if (error) throw error;
    if (classification !== null) {
      response.send(classification);
    }
  });
});

app.get("/vocabularies", (request, response) => {
  Vocabulary.find({}, (error, vocabularies) => {
    if (error) throw error;
    if (vocabularies !== null) {
      response.send(vocabularies);
    }
  });
});

app.get("/vocabulary/*", (request, response) => {
  let id = request.params[0];
  if (id == "" || id == null || !id) response.send({ success: false, message: "Classification ID is null" });
  Vocabulary.find({ classification_id: id }, (error, vocabularies) => {
    if (error) throw error;
    if (vocabularies !== null) {
      response.send(vocabularies);
    }
  });
});

app.listen(3002);
