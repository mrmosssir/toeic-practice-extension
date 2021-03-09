"use strict";

var dom_classification = document.querySelector(".classification");
var enable_switch = document.querySelector('#enable_switch');
var enable_switch_input = document.querySelector('#enable_switch_input'); // const btn_mode = document.querySelector(".btn-mode");

window.onload = function () {
  chrome.runtime.sendMessage({
    methods: "get-classifications"
  });
  chrome.storage.sync.get("enable", function (result) {
    if (result.enable) updateEnableSwitch(result.enable);
  });
}; // btn_mode.addEventListener("click", (e) => {
//   const switch_classification = document.querySelectorAll('[data-enable="false"]');
//   console.log(switch_classification);
//   switch_classification.forEach((item) => {
//     item.style.display = "none";
//   });
// });


enable_switch_input.addEventListener("change", function (e) {
  chrome.storage.sync.set({
    enable: e.target.checked
  });
  updateEnableSwitch(e.target.checked);
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.methods) {
    case "send-classifications":
      message.data.forEach(function (item) {
        dom_classification.innerHTML += "<li data-id=\"".concat(item.id, "\" data-enable=\"").concat(item.is_schedule, "\">").concat(item.title, "</li>");
      });
      break;

    default:
      break;
  }
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "loading") {
    chrome.tabs.executeScript({
      file: "content.js"
    });
  }
});

function updateEnableSwitch(checked) {
  if (checked) enable_switch.classList.add('active');else enable_switch.classList.remove('active');
}