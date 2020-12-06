const numbers = document.querySelectorAll('.number'),
    operations = document.querySelectorAll('.operator'),
    clearBtns = document.querySelectorAll('.clear-btn'),
    display = document.getElementById('display'),
    error = document.getElementById('error'),
    minusBtn = document.getElementById('minus'),
    pointBtn = document.getElementById('decimal');

let MemoryNowNumber = 0,
    MemoryNewNumber = false,
    MemoryNowOperation = '',
    MinusOperator = false;

for (let i = 0; i < numbers.length; i++) {
    let number = numbers[i];
    number.addEventListener('click', function (elem) {
        numberPress(elem.target.textContent);
        error.hidden = true;
    });
}

for (let i = 0; i < operations.length; i++) {
    let operation = operations[i];
    operation.addEventListener('click', function (elem) {
        operationPress(elem.target.textContent);
    });
}

for (let i = 0; i < clearBtns.length; i++) {
    let clearBtn = clearBtns[i];
    clearBtn.addEventListener('click', function (elem) {
        clearPress(elem.target.id);
        error.hidden = true;
    });
}

pointBtn.addEventListener('click', decimalPress);

minusBtn.addEventListener('click', function (elem) {
    display.value = '-' + display.value;
    MemoryNewNumber = false;
});


function numberPress(number) {
    if (MemoryNewNumber) {
        display.value = number;
        MemoryNewNumber = false;
    } else {
        if (display.value === '0') {
            display.value = number;
        } else {
            display.value += number;
        }
    }
}

function operationPress(symbol) {
    let localOperationMemory = display.value;
    localOperationMemory = Number(localOperationMemory);
    error.hidden = true;
    if (MemoryNewNumber && MemoryNowOperation !== '=') {
        if (MemoryNowOperation === '√') {
            MemoryNowNumber = Math.sqrt(MemoryNowNumber);
            display.value = MemoryNowNumber;
            MemoryNowOperation = symbol;
        } else {
            display.value = MemoryNowNumber;
        }
    } else {
        MemoryNewNumber = true;
        if (MemoryNowOperation === '+') {
            MemoryNowNumber += (localOperationMemory);
        } else if (MemoryNowOperation === '-') {
            MemoryNowNumber -= (localOperationMemory);
        } else if (MemoryNowOperation === '*') {
            MemoryNowNumber *= (localOperationMemory);
        } else if (MemoryNowOperation === '/') {
            MemoryNowNumber /= (localOperationMemory);
        } else if (MemoryNowOperation === '^') {
            MemoryNowNumber = Math.pow(MemoryNowNumber, localOperationMemory);
        } else {
            MemoryNowNumber = (localOperationMemory);
        }
        display.value = MemoryNowNumber;
        MemoryNowOperation = symbol;
    }
    if (isNaN(MemoryNowNumber)) {
        error.hidden = false;
        display.value = '0'
    }
}

function decimalPress(arguments) {
    let localDecimalMemory = display.value;
    error.hidden = true;
    if (MemoryNewNumber) {
        localDecimalMemory = '0.';
        MemoryNewNumber = false;
    } else {
        if (localDecimalMemory.indexOf('.') === -1) {
            localDecimalMemory += '.';
        }
    }

    display.value = localDecimalMemory;
}

function clearPress(id) {
    if (id === 'ce') {
        display.value = '0';
        MemoryNewNumber = true;
        error.hidden = true;
    } else if (id === 'c') {
        display.value = '0';
        MemoryNewNumber = true;
        MemoryNowNumber = 0;
        MemoryNowOperation = '';
        error.hidden = true;
    }
}
