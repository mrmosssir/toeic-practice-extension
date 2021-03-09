chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  switch (message.methods) {
    case "send-vocabulary":
      const frame = document.querySelector(".quizlet_question_frame");
      if (frame == null) {
        const body = document.querySelector("body");
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
  const choose_select = document.querySelectorAll(".quizlet_question_select");
  choose_select.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.dataset.select == answer) {
        document.querySelector(".quizlet_question_frame").style.display = "none";
        chrome.runtime.sendMessage({ methods: "finish-quiz" });
        item.removeEventListener("click", () => {});
      }
    });
  });
}

function createFrame(message) {
  let select_btn = "";
  message.choose.forEach((item) => {
    select_btn += `<button class="quizlet_question_select" data-select="${item}">${item}</button>`;
  });
  let frame_str = `<div class="quizlet_question_frame">
                      <h2 class="quizlet_question_title">Question</h2>
                      <p class="quizlet_question_main">${message.example_sentences.example_sentences}</p>
                      ${select_btn}
                   </div>`;
  return frame_str;
}
