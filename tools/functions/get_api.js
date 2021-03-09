const request = require("request");
const cheerio = require("cheerio");

module.exports = {
  getClassification: function () {
    const options = {
      url: "https://quizlet.com/webapi/3.2/feed/90657204/created-sets?perPage=100",
      headers: {
        "User-Agent": "*",
      },
    };
    return new Promise((resolve, reject) => {
      request.get(options, (error, response) => {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(response.body).responses[0].models.set;
          let title = [];
          let result = data.filter((item) => {
            let enable = title.indexOf(item.title) === -1;
            if (enable) {
              title.push(item.title);
              item.index = parseInt(item.title.split(" ")[1]);
            }
            return enable;
          });
          resolve(
            result.sort((pre, next) => {
              return pre.index < next.index ? -1 : pre.index > next.index ? 1 : 0;
            })
          );
        } else {
          reject(error);
        }
      });
    });
  },
  getVocabulary: function (id) {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://quizlet.com/tw/${id}`,
        headers: {
          "User-Agent": "*",
        },
      };
      request.get(options, (error, response) => {
        let $ = cheerio.load(response.body);
        let body = $(".SetPageTerm-content");
        let content = [];
        for (let index = 0; index < body.length; index += 1) {
          let vocabulary = body[index].children[0].children[0].children[0].children[0].children[0].data;
          let example = body[index].children[1].children[0].children[0].children[0].children;
          let example_sentences = "";
          let example_index = 0;
          while (example[example_index] != null) {
            example_sentences += example[example_index].name != "br" ? example[example_index].data : "<br>";
            example_index += 1;
          }

          content.push({
            vocabulary: vocabulary,
            example_sentences: example_sentences,
          });
        }
        resolve(content);
      });
    });
  },
};
