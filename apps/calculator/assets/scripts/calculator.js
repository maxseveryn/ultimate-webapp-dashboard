const display = document.getElementById("calculator-display");

const clickSound = new Audio("assets/sounds/click.wav");
clickSound.volume = 0.2;

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

const allButtons = document.querySelectorAll("button");

allButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playClickSound();
  });
});

function appendToDisplay(input) {
  const operators = ["+", "*", "/", "%", "."];
  const lastChar = display.value.slice(-1);

  if (display.value === "Error") {
    display.value = "";
  }

  if (display.value === "" && operators.includes(input)) return;

  if (operators.includes(input) && operators.includes(lastChar)) return;

  display.value += input;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    const result = Function(`"use strict"; return (${display.value})`)();
    display.value = result;
  } catch (error) {
    display.value = "Error";
  }
}

function backSpace() {
  display.value = display.value.slice(0, -1);
}

function root() {
  const num = parseFloat(display.value);
  display.value = !isNaN(num) ? Math.sqrt(num) : "Error";
}

function sqr() {
  const num = parseFloat(display.value);
  display.value = !isNaN(num) ? num ** 2 : "Error";
}

function percent() {
  const num = parseFloat(display.value);
  display.value = !isNaN(num) ? num / 100 : "Error";
}
