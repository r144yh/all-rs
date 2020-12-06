// init page

// create icon
const createIconHTML = (icon_name) => {
    return `<i class = "material-icons">${icon_name}</i>`;
}

// create footer
const footer = document.createElement('footer');
footer.classList.add('footer');
document.body.prepend(footer);
footer.insertAdjacentHTML('afterbegin',
    `<div class="container" id="footerContainer">
             <span class="footer__information" id="moveCounter">Moves:</span>
             <span class="footer__information" id="timeCounter">Time:</span>
           </div>`)

// add sound
const sound = document.createElement('audio');
sound.setAttribute('src', 'assets/audio/un.mp3');
sound.id = 'clickBtnSound';
footer.append(sound);

// create main
const main = document.createElement('main');
main.classList.add('main');
document.body.prepend(main);
main.insertAdjacentHTML('afterbegin',
    `<div class="container">
             <button class="nav__btn" id="btn_start">Start</button>
             <button class="nav__btn" id="btn_reset">Reset ${createIconHTML('refresh')}</button>
             <button class="nav__btn" id="btn_sound">${createIconHTML('volume_up')}</button>
           </div>`)
const startText = document.createElement('h2');
startText.innerHTML = 'Click "Start" to start the game';
main.append(startText);

// create numbers's container
const numContainer = document.createElement('div');
numContainer.classList.add('numbers__table');
numContainer.id = 'numCont';
main.insertAdjacentElement('beforeend', numContainer)

// create header
const header = document.createElement('header');
header.classList.add('header');
document.body.prepend(header);

let numberSize = 6.2;
// create variables for change number's position
if (document.documentElement.clientWidth < 768) {
    numberSize = 4;
} else if (document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1280) {
    numberSize = 7.4;
}

if (document.documentElement.clientHeight < 861 && document.documentElement.clientHeight > 649 && document.documentElement.clientWidth > 400) {
    numberSize = 6.4;
}

let timer = 0;
const times = document.getElementById('timeCounter');

const empty = {
    value: 16,
    top: 0,
    left: 0,
    element: null,
}

const gameResult = {
    countClick: 0,
    timeMinute: 0,
    timeSecond: 0,
    soundOn: true,
    start: false,
    finish: false,
}

const moves = document.getElementById('moveCounter');
let randNumbers = [];

function startGame() {
    timer = window.setInterval(startGameTimer, 1000);

    const numbers = [];


    createRand();

    function createRand() {
        randNumbers = [...Array(16).keys()].sort(() => Math.random() - 0.5);

        if (checkSolution() === false) {
            createRand();
        }
    }

    // count clicks
    moves.innerHTML = `Moves: ${gameResult.countClick}`;

    //count time
    times.innerHTML = `Time: ${addZero(gameResult.timeMinute)}:${addZero(gameResult.timeSecond)}`;

    function changePos(index) {
        const btn = numbers[index];

        // the difference of coordinates to find adjacent cells
        const leftDiff = Math.abs(empty.left - btn.left);
        const topDiff = Math.abs(empty.top - btn.top);

        if (leftDiff + topDiff > 1) return;

        if (gameResult.soundOn === true) {
            sound.play();
        }

        btn.element.style.left = `${empty.left * numberSize}rem`;
        btn.element.style.top = `${empty.top * numberSize}rem`;

        const emptyLeft = empty.left;
        const emptyTop = empty.top;
        empty.left = btn.left;
        empty.top = btn.top;

        empty.element.style.left = `${empty.left * numberSize}rem`;
        empty.element.style.top = `${empty.top * numberSize}rem`;

        btn.left = emptyLeft;
        btn.top = emptyTop;

        // count clicks
        gameResult.countClick++;
        moves.innerHTML = `Moves: ${gameResult.countClick}`;

        // check end game
        const isFinished = numbers.every(btn => {
            return btn.value === (btn.top * 4 + btn.left) + 1;
        });

        if (isFinished) {
            gameResult.finish = true;
            const finishText = document.createElement('h1');
            finishText.innerHTML = `Ура! Вы решили головоломку за ${addZero(gameResult.timeMinute)}:${addZero(gameResult.timeSecond)} и ${gameResult.countClick} ходов`;
            window.clearInterval(timer);
            header.append(finishText);
        }
    }

// create number's field
    for (let i = 0; i <= 15; i++) {
        const btn = document.createElement('button');
        btn.setAttribute('draggable', 'true');
        const left = i % 4;
        const top = (i - left) / 4;


        if (randNumbers[i] === 0) {
            btn.classList.add('empty');
            btn.innerHTML = '';

            empty.top = top;
            empty.left = left;
            empty.element = btn;

            numbers[i] = empty;
        } else {
            const value = randNumbers[i];
            btn.classList.add('btn');
            btn.id = `btn${i}`
            btn.innerHTML = value;
            numbers.push({
                value: value,
                left: left,
                top: top,
                element: btn,
            });
        }

        btn.style.left = `${left * numberSize}rem`;
        btn.style.top = `${top * numberSize}rem`;

        numContainer.append(btn);

        btn.addEventListener('click', () => {
            changePos(i);
        });

        // drag and drop
        btn.addEventListener('mousedown', (elem) => {
            document.addEventListener('dragstart', function (elem) {
                elem.target.style.opacity = 0;
            }, false);

            document.addEventListener('dragend', function (elem) {
                elem.target.style.opacity = 1;
            }, false);

            document.addEventListener('dragover', function (elem) {
                elem.preventDefault();
            }, false);

            document.addEventListener('dragenter', function (elem) {
                if (elem.target.className === 'empty') {
                    elem.target.style.borderColor = "#23d5ab";
                }
            },false);

            document.addEventListener('dragleave', function (elem) {
                if (elem.target.className === 'empty') {
                    elem.target.style.borderColor = "rgba(255, 254, 163, 0.1)"; //#fffff6
                }
            },false);

            document.addEventListener('drop', function (elem) {
                elem.preventDefault();
                if (elem.target.className === 'empty') {
                    elem.target.style.borderColor = "rgba(255, 254, 163, 0.1)";
                }
            },false);
        })
    }
}

function startGameTimer() {
    gameResult.timeSecond++
    if (gameResult.timeSecond === 60) {
        gameResult.timeMinute++;
        gameResult.timeSecond = 0;
    }
    times.innerHTML = `Time: ${addZero(gameResult.timeMinute)}:${addZero(gameResult.timeSecond)}`
}

function addZero(num) {
    return (parseInt(num, 10) < 10 ? '0' : '') + num;
}

const startBtn = document.getElementById('btn_start');
startBtn.addEventListener('click', () => {
    startGame();
    gameResult.start = true;
    startText.style.display = 'none';
    resetBtn.style.visibility = 'visible';
    times.style.visibility = 'visible';
    moves.style.visibility = 'visible';
    startBtn.style.visibility = 'hidden';
});

const resetBtn = document.getElementById('btn_reset');
resetBtn.addEventListener('click', () => {
    const table = document.getElementById('numCont');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    gameResult.countClick = 0;
    window.clearInterval(timer);
    gameResult.timeSecond = 0;
    gameResult.timeMinute = 0;
    if (gameResult.finish === true) {
        gameResult.finish = false;
        header.removeChild(header.firstChild);
    }
    startGame();
});

if (gameResult.start === false) {
    resetBtn.style.visibility = 'hidden';
    times.style.visibility = 'hidden';
    moves.style.visibility = 'hidden';
}

const changeSound = document.getElementById('btn_sound');
changeSound.addEventListener('click', () => {
    if (gameResult.soundOn === true) {
        gameResult.soundOn = false;
        changeSound.innerHTML = `${createIconHTML('volume_off')}`;
    } else {
        gameResult.soundOn = true;
        changeSound.innerHTML = `${createIconHTML('volume_up')}`;
    }
});

function checkSolution() {
    let counter = 0;
    for (let i = 0; i < randNumbers.length; i++) {
        if (randNumbers[i] === 0) {
            counter += 1 + i / 4;
        } else {
            for (let j = 0; j < i; j++) {
                if (randNumbers[j] > randNumbers[i]) {
                    counter++
                }
            }
        }
    }
    return (counter & 1) ? false : true;
}