import { addEventDelegate } from "../../scripts/eventdelegate/_eventdelegate.js";

//turn 128 seconds into 2:08
const getTimeCodeFromNum = (num) => {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
};

const findAudio = (element) => {
  const audioPlayer = element.closest(".audio-player"),
    audio = audioPlayer.querySelector("audio");

  return audio;
};

const play = (button) => {
  // find the audio element
  const audio = findAudio(button);

  const playPause = () => {
    if (audio.paused) {
      button.classList.remove("play");
      button.classList.add("pause");
      audio.play();
    } else {
      button.classList.remove("pause");
      button.classList.add("play");
      audio.pause();
    }
  };

  if (audio.src === "") {
    // then the audio hasn't been loaded yet
    loadAudio(audio);

    playPause();
  } else {
    // then the audio has been loaded and we can
    // proceed with play/pause functionality
    playPause();
  }
};

addEventDelegate("click", ".audio-player .toggle-play", play);

const loadAudio = (audio) => {
  const src = audio.dataset.src;
  audio.src = src;

  audio.addEventListener(
    "loadeddata",
    () => {
      const audioPlayer = audio.parentNode;

      audioPlayer.querySelector(".time .length").textContent =
        getTimeCodeFromNum(audio.duration);

      audioPlayer.querySelector(".time .current").textContent = "0:00";
      audio.volume = 0.75;
    },
    false
  );

  setInterval(() => {
    monitorProgress(audio);
  }, 500);
};

// click on timeline to skip around
const scrub = (timeline, e) => {
  const audio = findAudio(timeline);

  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
  audio.currentTime = timeToSeek;
};

addEventDelegate("click", ".audio-player .timeline", scrub);

// //click volume slider to change volume

const changeVolume = (volumeSlider, e) => {
  const audio = findAudio(volumeSlider);

  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width =
    newVolume * 100 + "%";
};

// check audio percentage and update time accordingly
const monitorProgress = (audio) => {
  const audioPlayer = audio.parentNode;

  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
};

const muteUnmute = (button) => {
  const audio = findAudio(button);

  audio.muted = !audio.muted;

  if (audio.muted) {
    button.classList.add("mute");
  } else {
    button.classList.remove("mute");
  }
};

addEventDelegate("click", ".audio-player .volume-button", muteUnmute);

const adjustVolume = (volumeSlider, e) => {
  const audio = findAudio(volumeSlider),
    audioPlayer = audio.parentNode;

  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width =
    newVolume * 100 + "%";
};

addEventDelegate(
  "click",
  ".audio-player .controls .volume-slider",
  adjustVolume
);
