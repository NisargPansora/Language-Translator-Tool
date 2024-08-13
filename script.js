
const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});








function runOCR() {
    const imageUpload = document.getElementById('imageUpload');
    const output = document.getElementById('output');
    let file = imageUpload.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        Tesseract.recognize(event.target.result)
            .then(function(result) {
                output.innerHTML = result.text;
            });
    };
    reader.readAsDataURL(file);
}











// Get the text area, listen button, and live text div
let textArea = document.getElementById("text");
let listenButton = document.getElementById("listen-button");
let liveTextDiv = document.getElementById("live-text");
let fromTextArea = document.querySelector("output");

// Flag to track the recognition state
let isListening = false;

// SpeechRecognition object
let recognition = new webkitSpeechRecognition() || new SpeechRecognition();

// Set properties for continuous recognition and interim results
recognition.continuous = true;
recognition.interimResults = true;

// Event listener for result event
recognition.onresult = function(event) {
  let interimTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      interimTranscript += event.results[i][0].transcript;
    }
  }
  // Display the recognized text in the liveTextDiv
  liveTextDiv.innerText = "Live Text: " + interimTranscript;
  // Pass the recognized text to the fromTextArea
  updateLiveText(interimTranscript);
};

// Event listener for end event
recognition.onend = function() {
  // Update button text and set listening state to false
  listenButton.innerText = "Start Listening";
  listenButton.classList.remove("stopped"); // Remove the "stopped" class
  isListening = false;
};

// Add an event listener to the listen button
listenButton.addEventListener("click", function() {
  if (!isListening) {
    // Start recognition
    recognition.start();
    // Update button text and set listening state to true
    listenButton.innerText = "Stop Listening";
    isListening = true;
  } else {
    // Stop recognition
    recognition.stop();
    // Add the "stopped" class to change the button color
    listenButton.classList.add("stopped");
  }
});

// Function to update the value of the fromTextArea
function updateLiveText(value) {
  fromTextArea.value = value;

}