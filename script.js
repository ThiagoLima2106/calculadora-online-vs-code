
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let first = null;        // primeiro número
let operator = null;     // operação atual (+, -, ×, ÷)
let waitingNext = false; // aguardando próximo número
let current = "0";       // texto exibido

function updateDisplay(value = current) {
  display.textContent = value.toString().slice(0, 16);
}

function inputDigit(d) {
  if (waitingNext) {
    current = d;
    waitingNext = false;
  } else {
    current = current === "0" ? d : current + d;
  }
  updateDisplay();
}

function inputDot() {
  if (waitingNext) {
    current = "0.";
    waitingNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateDisplay();
}

function setOperator(op) {
  const value = parseFloat(current);
  if (operator && waitingNext) {
    operator = op; // trocar de operador antes de digitar o próximo número
    return;
  }
  if (first === null) {
    first = value;
  } else if (!waitingNext) {
    first = compute(first, value, operator);
    updateDisplay(first);
  }
  operator = op;
  waitingNext = true;
}

function compute(a, b, op) {
  if (op === "add") return a + b;
  if (op === "subtract") return a - b;
  if (op === "multiply") return a * b;
  if (op === "divide") return b === 0 ? NaN : a / b;
  return b;
}

function clearAll() {
  first = null;
  operator = null;
  waitingNext = false;
  current = "0";
  updateDisplay();
}

function invertSign() {
  current = (parseFloat(current) * -1).toString();
  updateDisplay();
}

function percent() {
  current = (parseFloat(current) / 100).toString();
  updateDisplay();
}

function equal() {
  if (operator === null) return;
  const value = parseFloat(current);
  const result = compute(first, value, operator);
  current = String(result);
  first = null;
  operator = null;
  waitingNext = false;
  updateDisplay();
}

// clicks
keys.addEventListener("click", (e) => {
  const t = e.target;
  if (t.matches("button[data-num]")) inputDigit(t.dataset.num);
  if (t.matches("button[data-dot]")) inputDot();
  if (t.matches("button[data-op]")) setOperator(t.dataset.op);
  if (t.matches("button[data-action='clear']")) clearAll();
  if (t.matches("button[data-action='invert']")) invertSign();
  if (t.matches("button[data-action='percent']")) percent();
  if (t.matches("button[data-action='equal']")) equal();
});

// teclado
window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/\d/.test(k)) inputDigit(k);
  if (k === ".") inputDot();
  if (k === "+" || k === "-" || k === "*" || k === "/") {
    const map = { "+": "add", "-": "subtract", "*": "multiply", "/": "divide" };
    setOperator(map[k]);
  }
  if (k === "Enter" || k === "=") equal();
  if (k === "Escape") clearAll();
  if (k === "%") percent();
});
updateDisplay();
