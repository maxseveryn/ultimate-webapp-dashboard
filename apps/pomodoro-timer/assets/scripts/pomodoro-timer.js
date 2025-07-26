const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

const pomodoroBtn = document.getElementById("pomodoro");
const shortBrakeBtn = document.getElementById("short-brake");
const longBrakeBtn = document.getElementById("long-brake");

const timerHeader = document.querySelector(".timer-header");

const pomodoroBtnText = pomodoroBtn.innerText;
const shortBrakeBtnText = shortBrakeBtn.innerText;
const longBrakeBtnText = longBrakeBtn.innerText;

const timer = document.getElementById("timer");

const circle = document.querySelector(".progress-ring-circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

const timeUp = new Audio("assets/sounds/time-up.mp3");
timeUp.volume = 0.2;

let startTime = 1500;
let timeLeft = startTime;
let interval;

let timerMode = "work";

let timerColor;

const updateTimer = () => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const percent = ((startTime - timeLeft) / startTime) * 100;
  setProgress(percent);
};

const startTimer = () => {
  stopBtn.disabled = false;
  timer.style.color = timerColor;
  clearInterval(interval);
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(interval);
      playSound();
      alert("Time's up!");
      timeLeft = startTime;
      updateTimer();
    }
  }, 1000);
};

const stopTimer = () => {
  timerColor = timer.style.color;
  timer.style.color = "#808080";
  clearInterval(interval);
  stopBtn.disabled = true;
};

const resetTimer = () => {
  timer.style.color = timerColor;
  stopBtn.disabled = false;
  clearInterval(interval);
  timeLeft = startTime;
  updateTimer();
};

function playSound() {
  timeUp.currentTime = 0;
  timeUp.play();
}

function setTimer(time) {
  startTime = time;
  timeLeft = startTime;
}

function updateTimerColor(timerMode) {
  const timerHeader = document.querySelector(".timer-header");

  timerHeader.classList.remove("hover-red", "hover-green", "hover-blue");

  switch (timerMode) {
    case "work":
      setColor("#ff4d4d", "hover-red");
      break;
    case "short":
      setColor("#4caf50", "hover-green");
      break;
    case "long":
      setColor("#2196f3", "hover-blue");
      break;
  }

  function setColor(color, hoverClass) {
    timerColor = color;
    circle.style.stroke = color;
    timer.style.color = color;
    timerHeader.classList.add(hoverClass);
  }
}

function switchMode(mode, time) {
  resetTimer();
  timerMode = mode;
  setTimer(time);
  updateTimer();
  updateTimerColor(timerMode);
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

pomodoroBtn.addEventListener("click", () => switchMode("work", 1500));
shortBrakeBtn.addEventListener("click", () => switchMode("short", 300));
longBrakeBtn.addEventListener("click", () => switchMode("long", 900));

pomodoroBtn.addEventListener("mouseenter", () => {
  pomodoroBtn.innerText = "25:00";
});

pomodoroBtn.addEventListener("mouseleave", () => {
  pomodoroBtn.innerText = pomodoroBtnText;
});

shortBrakeBtn.addEventListener("mouseenter", () => {
  shortBrakeBtn.innerText = "5:00";
});

shortBrakeBtn.addEventListener("mouseleave", () => {
  shortBrakeBtn.innerText = shortBrakeBtnText;
});

longBrakeBtn.addEventListener("mouseenter", () => {
  longBrakeBtn.innerText = "15:00";
});

longBrakeBtn.addEventListener("mouseleave", () => {
  longBrakeBtn.innerText = longBrakeBtnText;
});

updateTimer();
