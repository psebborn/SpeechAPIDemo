// Speech to text
// Chrome still has the API under a vendor-prefix
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// Set up recognition.
const recognition = new SpeechRecognition();
// Get the search form from the DOM
const searchForm = document.querySelector(".speech-to-text");
// recognition.continuous = true;
// Return results as they're recognised
recognition.interimResults = true;
const speechResults = document.querySelector(".js-speech-results");
const speechToggle = document.querySelector(".js-toggle-speech");

let isListening = false;

/**
 * Start event
 *
 * Update the button text.
 * Set a flag so we can check for listening later.
 */
recognition.addEventListener("start", (e) => {
  console.log("starting recognition");
  speechToggle.setAttribute("aria-label", "Stop listening");
  speechToggle.classList.add("active");
  isListening = true;
});

/**
 * End Event
 *
 * Update the button text.
 *
 * Submit the form.
 *
 */
recognition.addEventListener("end", (e) => {
  console.log("recognition ended");
  speechToggle.setAttribute("aria-label", "Start listening");
  speechToggle.classList.remove("active");
  isListening = false;
  setTimeout(() => {
    searchForm.submit();
  }, 200);
});

/**
 * onResult event
 *
 * Fired when recognition results come in
 *
 * Update the search form.
 */
recognition.addEventListener("result", (e) => {
  console.log("result", e);

  speechResults.value = e.results[0][0].transcript;
});

/**
 * Toggle the speech recognition.
 *
 */
speechToggle.addEventListener("click", (e) => {
  e.preventDefault();
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
  }

  isListening = !isListening;
});
