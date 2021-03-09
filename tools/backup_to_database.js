const mongoose = require("mongoose");

const config = require("../config");

const Classification = require("./models/classification");
const Vocabulary = require("./models/vocabulary");

const getApi = require("./functions/get_api");

const helpers = require("./functions/utilities");

mongoose.connect(config.database, {
  userNewParser: true,
  userUnifiedTopology: true,
});

Classification.collection.drop();
Vocabulary.collection.drop();

setTimeout(() => {
  getApi.getClassification().then((list) => {
    list.forEach((item) => {
      const classification = new Classification({
        id: item.id,
        title: item.title,
        is_schedule: helpers.classificationFilter(item.title) ? true : false,
        day: helpers.classificationFilter(item.title) ? item.title.split(" ")[1] : null,
      });
      classification.save();
      getApi.getVocabulary(item.id).then((result) => {
        result.forEach((word) => {
          const vocabulary = new Vocabulary({
            classification_id: item.id,
            vocabulary: word.vocabulary,
            example_sentences: word.example_sentences,
          });
          vocabulary.save();
        });
      });
    });
  });
}, 3000);
