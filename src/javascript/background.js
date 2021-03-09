window.onload = () => {
  getAllVocabulary().then((result) => {
    chrome.storage.local.set({ vocabularies: result });
    chrome.storage.sync.set({ quiz: false });
    chrome.storage.sync.get("enable", (result) => {
      if (!result.enable) chrome.storage.sync.set({ enable: false });
    });
  });
};

// chrome.runtime.onInstalled.addListener((detail) => {
//   browser.runtime.getBackgroundPage();
// })

setInterval(() => {
  chrome.storage.sync.get('last_quiz', (result) => {
    if (Date.now() - result.last_quiz > 900000) chrome.storage.sync.set({ quiz: true });
  })
  chrome.storage.sync.get(["quiz", "enable"], (result) => {
    if (!result.quiz && result.enable) setTheme();
  });
}, 600000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.methods) {
    case "get-classifications":
      getClassifications();
      break;
    case "finish-quiz":
      chrome.storage.sync.set({ quiz: false });
      break;
    default:
      break;
  }
});

function setTheme() {
  chrome.storage.local.get("vocabularies", (result) => {
    let vocabularies = result.vocabularies;
    let rand = Math.floor(Math.random() * vocabularies.length);
    let rand_choose_1 = Math.floor(Math.random() * vocabularies.length);
    let rand_choose_2 = Math.floor(Math.random() * vocabularies.length);
    let rand_choose_3 = Math.floor(Math.random() * vocabularies.length);
    let choose = [vocabularies[rand].vocabulary, vocabularies[rand_choose_1].vocabulary, vocabularies[rand_choose_2].vocabulary, vocabularies[rand_choose_3].vocabulary];
    choose.sort();
    chrome.tabs.query({ active: true }, (tabs) => {
      console.log(tabs[0].id);
      if (tabs[0] != undefined) {
        chrome.tabs.sendMessage(tabs[0].id, { methods: "send-vocabulary", example_sentences: vocabularies[rand], choose: choose });
        chrome.storage.sync.set({ quiz: true });
      }
    });
    chrome.storage.sync.set({ last_quiz: Date.now() });
  });
}

function getAllVocabulary() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.response != "" && this.response != null) {
        resolve(this.response);
      }
    };
    xhr.open("GET", "http://10.0.88.135:3002/vocabularies");
    xhr.responseType = "json";
    xhr.send();
  });
}

function getClassifications() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.response != "" && this.response != null) {
      chrome.runtime.sendMessage({ methods: "send-classifications", data: this.response });
    }
  };
  xhr.open("GET", "http://10.0.88.135:3002/classifications");
  xhr.responseType = "json";
  xhr.send();
}
