const calculator = document.querySelector(".calculator");
const calculatorDisplay = document.querySelector(".display-value");
const inputBtns = document.querySelectorAll("button");
const reset = document.querySelector(".reset");

let firstValue = 0;
let operatorValue = "";
let awaitingNextValue = false;

const calculate = {
    "/": (firstNumber, secondNumber) => firstNumber / secondNumber,
    "*": (firstNumber, secondNumber) => firstNumber * secondNumber,
    "+": (firstNumber, secondNumber) => firstNumber + secondNumber,
    "-": (firstNumber, secondNumber) => firstNumber - secondNumber,
    "=": (firstNumber, secondNumber) => secondNumber,
};

const sendNumberValue = (number) => {
    if (awaitingNextValue) {
        calculatorDisplay.textContent = number;
        awaitingNextValue = false;
    } else {
        const displayValue = calculatorDisplay.textContent;
        calculatorDisplay.textContent =
            displayValue === "0" ? number : displayValue + number;
    }
};

const resetAll = () => {
    firstValue = 0;
    operatorValue = "";
    awaitingNextValue = false;
    calculatorDisplay.textContent = "0";
};

const addDecimal = () => {
    if (awaitingNextValue) return;

    if (!calculatorDisplay.textContent.includes(".")) {
        calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
    }
};

const roundToFixedAuto = (number) => {
    const epsilon = 1e-10; // додаткова точність
    let precision = 0;

    while (Math.abs(number - parseFloat(number.toFixed(precision))) > epsilon) {
        precision++;
    }

    return parseFloat(number.toFixed(precision));
};

const useOperator = (operator) => {
    const currentValue = Number(calculatorDisplay.textContent);

    if (operatorValue && awaitingNextValue) {
        operatorValue = operator;
        return;
    }

    if (!firstValue) {
        firstValue = currentValue;
    } else {
        const calculateted = calculate[operatorValue](firstValue, currentValue);

        if (!isFinite(calculateted)) {
            const result = "rUSSIA";
            calculatorDisplay.textContent = result;
            calculator.classList.add("broken");
            reset.classList.add("show");
            return;
        }

        const result = roundToFixedAuto(calculateted);
        calculatorDisplay.textContent = result;
        firstValue = result;
    }

    awaitingNextValue = true;
    operatorValue = operator;
};

// eventListeners
inputBtns.forEach((inputBtn) => {
    switch (true) {
        case inputBtn.classList.length === 0:
            inputBtn.addEventListener("click", () =>
                sendNumberValue(inputBtn.value)
            );
            break;
        case inputBtn.classList.contains("operator"):
            inputBtn.addEventListener("click", () =>
                useOperator(inputBtn.value)
            );
            break;
        case inputBtn.classList.contains("decimal"):
            inputBtn.addEventListener("click", () => addDecimal());
            break;
        case inputBtn.classList.contains("clear"):
            inputBtn.addEventListener("click", resetAll);
            break;
        case inputBtn.classList.contains("reset"):
            inputBtn.addEventListener("click", () => {
                window.location = window.location;
            });
            break;
    }
});
