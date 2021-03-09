"use strict";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);

  switch (message.methods) {
    case "send-vocabulary":
      var frame = document.querySelector(".quizlet_question_frame");

      if (frame == null) {
        var body = document.querySelector("body");
        body.innerHTML += createFrame(message);
        document.querySelector(".quizlet_question_frame").style.display = "block";
        setListener(message.example_sentences.vocabulary);
      } else {
        frame.innerHTML = createFrame(message);
        document.querySelector(".quizlet_question_frame").style.display = "block";
        setListener(message.example_sentences.vocabulary);
      }

      break;

    default:
      break;
  }
});

function setListener(answer) {
  var choose_select = document.querySelectorAll(".quizlet_question_select");
  choose_select.forEach(function (item) {
    item.addEventListener("click", function (e) {
      if (e.target.dataset.select == answer) {
        document.querySelector(".quizlet_question_frame").style.display = "none";
        chrome.runtime.sendMessage({
          methods: "finish-quiz"
        });
        item.removeEventListener("click", function () {});
      }
    });
  });
}

function createFrame(message) {
  var select_btn = "";
  message.choose.forEach(function (item) {
    select_btn += "<button class=\"quizlet_question_select\" data-select=\"".concat(item, "\">").concat(item, "</button>");
  });
  var frame_str = "<div class=\"quizlet_question_frame\">\n                      <h2 class=\"quizlet_question_title\">Question</h2>\n                      <p class=\"quizlet_question_main\">".concat(message.example_sentences.example_sentences, "</p>\n                      ").concat(select_btn, "\n                   </div>");
  return frame_str;
}