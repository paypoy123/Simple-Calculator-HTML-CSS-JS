const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function formatNumber(number) {
  // Pastikan number adalah string
  number = number.toString();

  // Pisahkan bagian integer dan desimal
  let [integerPart, decimalPart] = number.split(',');

  // Hapus pemisah ribuan pada bagian integer
  integerPart = integerPart.replace(/\./g, '');

  // Tambahkan pemisah ribuan pada bagian integer
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Gabungkan kembali bagian integer dan desimal jika ada
  if (decimalPart !== undefined) {
    return integerPart + ',' + decimalPart;
  } else {
    return integerPart;
  }
}

function updateDisplay() {
  const display = document.querySelector('.calculator-display');
  display.value = formatNumber(calculator.displayValue);
}

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    // Hapus pemisah ribuan sebelum menambahkan digit baru
    const cleanedValue = displayValue.replace(/\./g, '');
    calculator.displayValue =
      cleanedValue === '0' ? digit : cleanedValue + digit;
  }

  updateDisplay();
}

function inputDecimal(dot) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand) {
    // Jika memulai angka baru, tambahkan '0,' untuk desimal
    calculator.displayValue = '0' + dot;
    calculator.waitingForSecondOperand = false;
  } else if (!displayValue.includes(',')) {
    calculator.displayValue += dot;
  }

  updateDisplay();
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  // Konversi displayValue ke angka numerik
  const inputValue = parseFloat(
    displayValue.replace(/\./g, '').replace(',', '.')
  );

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (nextOperator === '√') {
    if (inputValue < 0) {
      calculator.displayValue = 'Error';
      calculator.firstOperand = null;
      calculator.operator = null;
      calculator.waitingForSecondOperand = false;
    } else {
      const result = Math.sqrt(inputValue);
      calculator.displayValue = result.toString().replace('.', ',');
      calculator.firstOperand = result;
      calculator.operator = null;
      calculator.waitingForSecondOperand = true;
    }
    updateDisplay();
    return;
  }

  if (nextOperator === '%') {
    let result;
    if (
      firstOperand !== null &&
      operator &&
      !calculator.waitingForSecondOperand
    ) {
      const percentage = (firstOperand * inputValue) / 100;
      result = calculate(firstOperand, percentage, operator);
    } else {
      result = inputValue / 100;
    }
    calculator.displayValue = result.toString().replace('.', ',');
    calculator.firstOperand = result;
    calculator.operator = null;
    calculator.waitingForSecondOperand = true;
    updateDisplay();
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    calculator.displayValue = result.toString().replace('.', ',');
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;

  updateDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case '*':
      return firstOperand * secondOperand;
    case '/':
      return firstOperand / secondOperand;
    default:
      return secondOperand;
  }
}

function handleEquals() {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(
    displayValue.replace(/\./g, '').replace(',', '.')
  );

  if (operator == null || calculator.waitingForSecondOperand) {
    return;
  }

  const result = calculate(firstOperand, inputValue, operator);

  calculator.displayValue = result.toString().replace('.', ',');
  calculator.firstOperand = result;
  calculator.operator = null;
  calculator.waitingForSecondOperand = false;

  updateDisplay();
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;

  updateDisplay();
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;

  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.value);
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(',');
    return;
  }

  if (target.classList.contains('all-clear')) {
    resetCalculator();
    return;
  }

  if (target.classList.contains('equal-sign')) {
    handleEquals();
    return;
  }

  inputDigit(target.value);
});
