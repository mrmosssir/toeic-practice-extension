const dom_classification = document.querySelector(".classification");

const enable_switch = document.querySelector('#enable_switch');
const enable_switch_input = document.querySelector('#enable_switch_input');

// const btn_mode = document.querySelector(".btn-mode");

window.onload = () => {
  chrome.runtime.sendMessage({ methods: "get-classifications" });
  chrome.storage.sync.get("enable", (result) => {
    if (result.enable) updateEnableSwitch(result.enable);
  })
};

// btn_mode.addEventListener("click", (e) => {
//   const switch_classification = document.querySelectorAll('[data-enable="false"]');
//   console.log(switch_classification);
//   switch_classification.forEach((item) => {
//     item.style.display = "none";
//   });
// });

enable_switch_input.addEventListener("change", (e) => {
  chrome.storage.sync.set({ enable: e.target.checked });
  updateEnableSwitch(e.target.checked);
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.methods) {
    case "send-classifications":
      message.data.forEach((item) => {
        dom_classification.innerHTML += `<li data-id="${item.id}" data-enable="${item.is_schedule}">${item.title}</li>`;
      });
      break;
    default:
      break;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "loading") {
    chrome.tabs.executeScript({ file: "content.js" });
  }
});

function updateEnableSwitch(checked) {
  if (checked) enable_switch.classList.add('active');
  else enable_switch.classList.remove('active');
}
