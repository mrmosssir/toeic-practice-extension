const Classification = require("../models/classification");
const Vocabulary = require("../models/vocabulary");

module.exports = {
  classificationFilter: function (title) {
    return title.indexOf("Day") > -1 && title.indexOf("基礎單字") == -1 && title.indexOf("ETS") == -1 ? true : false;
  },
};
