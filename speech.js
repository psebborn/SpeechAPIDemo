const synth = window.speechSynthesis;
// Speech Synthesis

// Grab the form from the DOM
const ttsForm = document.querySelector(".js-tts");
const ttsInput = document.querySelector("#texttospeech");
const voiceList = document.createElement("select");
const wrapper = document.createElement("div");
const label = document.createElement("label");
label.setAttribute("for", "voicelist");
label.textContent = "Choose a voice";

voiceList.setAttribute("id", "voicelist");
wrapper.appendChild(label);
wrapper.appendChild(voiceList);
let voices = [];

/**
 * Get all the available voices from the browser and populate in a list.
 *
 * This varies from browser to browser, so dynamically creating is safest.
 */
function populateVoiceList() {
  voices = synth.getVoices(); // This is where we actually get the voices.

  // Build up the list into a dropdown
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.voiceURI;
    option.textContent = `${voice.name} (${voice.lang})`;
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    if (voice.default) {
      option.textContent += " - Default";
    }

    voiceList.appendChild(option);
  });
}

populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

ttsForm.insertBefore(wrapper, ttsForm.firstElementChild);

ttsForm.addEventListener("submit", (e) => {
  // Speak the text with a default voice.
  const speakme = new SpeechSynthesisUtterance(ttsInput.value);
  const selectedVoice = voiceList.selectedOptions[0].getAttribute("data-name");

  voices.forEach((v, index) => {
    if (v.name === selectedVoice) {
      speakme.voice = voices[index];
    }
  });

  synth.speak(speakme);
  e.preventDefault();
});

// Speech to text
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// Set up recognition.
const recognition = new SpeechRecognition();
// recognition.continuous = true;
recognition.interimResults = true;
const speechResults = document.querySelector(".js-speech-results");
const speechToggle = document.querySelector(".js-toggle-speech");
let isListening = false;

recognition.addEventListener("start", (e) => {
  console.log("starting recognition");
  speechToggle.textContent = "Stop listening";
  isListening = true;
});

recognition.addEventListener("end", (e) => {
  console.log("recognition ended");
  speechToggle.textContent = "Start listening";
  isListening = false;
  console.log(e);
});

recognition.addEventListener("result", (e) => {
  console.log("result", e);

  speechResults.textContent = e.results[0][0].transcript;
});

speechToggle.addEventListener("click", (e) => {
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
  }

  isListening = !isListening;

  e.preventDefault();
});
