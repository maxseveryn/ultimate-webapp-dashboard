const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

const pomodoroBtn = document.getElementById("pomodoro");
const shortBrakeBtn = document.getElementById("short-brake");
const longBrakeBtn = document.getElementById("long-brake");

const workCycleBtn = document.getElementById("work-cycle");
const autoPlayBtn = document.getElementById("auto-cycle");

const timerHeader = document.querySelector(".timer-header");
const totalCyclesText = document.querySelector(".total-pomodoro-cycles");

const pomodoroBtnText = pomodoroBtn.innerText;
const shortBrakeBtnText = shortBrakeBtn.innerText;
const longBrakeBtnText = longBrakeBtn.innerText;
const workCycleBtnText = workCycleBtn.innerText;

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
timeUp.volume = 0.1;

const shortBreakDuration = 300;
const longBreakDuration = 900;
const workDuration = 1500;

let startTime = workDuration;
let timeLeft = startTime;
let interval;

let pomodoroCycleCount = 0;
let cycleAutoPlay = false;
let isCycleRunning = false;
let timerCompleteCallback = null;

let timerMode = "work";

let timerColor;

let totalCycles = 0;

const updateTimer = () => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formated = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  timer.innerHTML = formated;

  document.title = `${formated} | ${getModeLabel(timerMode)}`;

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

      if (typeof timerCompleteCallback === "function") {
        timerCompleteCallback();
      } else {
        timeLeft = startTime;
        updateTimer();
      }
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

function workCycle() {
  workCycleBtn.classList.add("active");
  pomodoroCycleCount = 0;
  isCycleRunning = true;
  timerCompleteCallback = () => {
    runNextCycleStep();
  };
  switchMode("work", workDuration);
  startTimer();
}

function runNextCycleStep() {
  if (!isCycleRunning) {
    return;
  }

  if (timerMode === "work") {
    pomodoroCycleCount++;

    if (pomodoroCycleCount % 4 === 0) {
      switchMode("long", longBreakDuration);
      if (!cycleAutoPlay) {
        isCycleRunning = false;
      }
      workCycleBtn.classList.remove("active");
      totalCycles++;
      localStorage.setItem("totalPomodoroCycles", totalCycles);
      totalCyclesText.innerHTML = `Total Pomodoro Cycles: ${totalCycles}`;
    } else {
      switchMode("short", shortBreakDuration);
    }
  } else {
    switchMode("work", workDuration);
  }

  startTimer();

  timerCompleteCallback = () => {
    runNextCycleStep();
  };
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

function getModeLabel(mode) {
  switch (mode) {
    case "work":
      return "Work";
    case "short":
      return "Short Brake";
    case "long":
      return "Long Brake";
    default:
      return "Pomodoro Timer";
  }
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", () => {
  isCycleRunning = false;
  switchMode("work", workDuration);
  resetTimer();
});

pomodoroBtn.addEventListener("click", () => switchMode("work", workDuration));
shortBrakeBtn.addEventListener("click", () =>
  switchMode("short", shortBreakDuration)
);
longBrakeBtn.addEventListener("click", () =>
  switchMode("long", longBreakDuration)
);

workCycleBtn.addEventListener("click", () => {
  workCycle();
});

autoPlayBtn.addEventListener("click", () => {
  cycleAutoPlay = !cycleAutoPlay;
  autoPlayBtn.setAttribute("aria-pressed", cycleAutoPlay ? "true" : "false");

  cycleAutoPlay
    ? autoPlayBtn.classList.add("active")
    : autoPlayBtn.classList.remove("active");
});

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

workCycleBtn.addEventListener("mouseenter", () => {
  workCycleBtn.innerText = "(25 m + 5 m)*4 + 15 m";
});

workCycleBtn.addEventListener("mouseleave", () => {
  workCycleBtn.innerText = workCycleBtnText;
});

const savedTotal = localStorage.getItem("totalPomodoroCycles");
if (savedTotal !== null) {
  totalCycles = Number(savedTotal);
  totalCyclesText.innerHTML = `Total Pomodoro Cycles: ${totalCycles}`;
}
updateTimer();
