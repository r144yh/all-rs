const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: '',
        capsLock: false,
        volume: true,
        ru: false,
        shift: false,
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        // Setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                    this._focusCursor();
                });
            });
        });
    },

    // private method, create all Html
    _createKeys(keyLayout) {
        const fragment = document.createDocumentFragment();
        if (this.properties.shift === false) {
            if (!this.properties.ru) {
                keyLayout = [
                    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                    "*", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "/",
                    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
                    "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
                    "volume", "space", "language", "shift"
                ];
            } else {
                keyLayout = [
                    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "/",
                    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "enter",
                    "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "э", "?",
                    "volume", "space", ",", ".", "language", "shift"
                ];
            }
        } else {
            if (!this.properties.ru) {
                keyLayout = [
                    "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
                    "+", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "/",
                    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
                    "done", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?",
                    "volume", "space", "language", "shift"
                ];
            } else {
                keyLayout = [
                    "!", "'", "№", ";", "%", ":", "_", "*", "(", ")", "backspace",
                    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "/",
                    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "enter",
                    "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "э", "?",
                    "volume", "space", "-", "=", "language", "shift"
                ];
            }
        }


        // Create Html for an icon
        const createIconHTML = (icon_name) => {
            return `<i class = "material-icons">${icon_name}</i>`;
        }

        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', '/', 'enter', '?'].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key) {
                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('backspace');

                    keyElement.addEventListener('click', () => {
                        console.log(key)
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                        this._createSound('backspace');
                    });
                    break;

                case 'shift':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = `Shift ${createIconHTML('upgrade')}`;

                    if (this.properties.shift === true) {
                        keyElement.classList.add('keyboard__key--dark');
                    } else {
                        keyElement.classList.remove('keyboard__key--dark');
                    }

                    keyElement.addEventListener('click', () => {
                        this._createSound('shift');
                        this.properties.shift = !this.properties.shift;

                        this.elements.keysContainer.innerHTML = '';
                        this.elements.keysContainer.append(this._createKeys());
                        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
                    });
                    break;

                case 'caps':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');

                    keyElement.addEventListener('click', () => {
                        this._createSound('caps');
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                    });
                    break;

                case 'enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_return');

                    keyElement.addEventListener('click', () => {
                        this._createSound('enter');
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconHTML('space_bar');

                    keyElement.addEventListener('click', () => {
                        this._createSound('space');
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });
                    break;

                case 'done':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                    keyElement.innerHTML = createIconHTML('check_circle');

                    keyElement.addEventListener('click', () => {
                        this._createSound('done');
                        this.close();
                        this._triggerEvent('onclose');
                    });
                    break;

                case 'volume':
                    keyElement.innerHTML = (this.properties.volume) ? createIconHTML('volume_up') : createIconHTML('volume_off');
                    keyElement.classList.add('keyboard__key--wide');

                    keyElement.addEventListener('click', () => {
                        this._createSound('key');
                        this.properties.volume = !this.properties.volume
                        if (!this.properties.volume) {
                            keyElement.classList.add('keyboard__key--volumeOff');
                        } else {
                            keyElement.classList.remove('keyboard__key--volumeOff')
                        }
                        keyElement.innerHTML = (this.properties.volume) ? createIconHTML('volume_up') : createIconHTML('volume_off');
                    });
                    break;

                case 'language':
                    keyElement.textContent = (this.properties.ru) ? 'ru' : 'en';
                    keyElement.classList.add('keyboard__key--wide');

                    keyElement.addEventListener('click', () => {
                        this._createSound('arrow');
                        this.properties.ru = !this.properties.ru;
                        this.elements.keysContainer.innerHTML = '';
                        this.elements.keysContainer.append(this._createKeys());
                        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener('click', () => {
                        if (this.properties.shift === true && this.properties.capsLock === true) {
                            this.properties.value += key.toLowerCase();
                        } else if (this.properties.shift === true && this.properties.capsLock === false) {
                            this.properties.value += key.toUpperCase();
                        } else {
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        }
                        if (this.properties.ru) {
                            this._createSound('keyRu');
                        } else {
                            this._createSound('key');
                        }
                        this._triggerEvent('oninput');
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    },

    // trigger for eventHandler
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _createSound(soundName) {
        const sound = document.getElementById(soundName);
        if (this.properties.volume) {
            sound.play();
        }
    },

    _focusCursor() {
        let cursorPos = document.querySelector('.use-keyboard-input');
        cursorPos.focus()
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },

    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    }
};

window.addEventListener('DOMContentLoaded', function () {
    keyboard.init();
});