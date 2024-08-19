"use strict"

import { useDynamicAdapt } from "../js/dynamicAdapt.js";

useDynamicAdapt();

// ========================= Меню-бургер ======================
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.icon-menu');
    const menu = document.querySelector('.header__menu');

    function closeMenu() {
        menu.classList.remove('menu-open');
        menuBtn.classList.remove('menu-open');
        document.body.style.overflow = 'auto';
    }

    menuBtn.addEventListener('click', function () {
        menu.classList.toggle('menu-open');
        menuBtn.classList.toggle('menu-open');
        if (menu.classList.contains('menu-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    const menuItems = document.querySelectorAll('.menu__link');

    menuItems.forEach(function (item) {
        item.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.header__menu') && !e.target.closest('.icon-menu')) {
            closeMenu();
        }
    });
});

// ===================== валідація та відпрвка email ======================

const form = document.querySelector('.main-block__form .form');
const emailInput = form.querySelector('input[type="text"]');
const submitButton = form.querySelector('button[type="submit"]');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    return emailRegex.test(email);
}

function showError(input, message) {
    input.classList.add('error');
    let errorElement = input.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function removeError(input) {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

emailInput.addEventListener('focus', function () {
    this.placeholder = '';
});

emailInput.addEventListener('blur', function () {
    if (this.value === '') {
        this.placeholder = 'Enter your email';
    }
});

emailInput.addEventListener('input', function () {
    removeError(this);
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (email === '') {
        showError(emailInput, 'Email is required');
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Please enter a valid email');
    } else {
        removeError(emailInput);
        // sendMail(email);
        // submitButton.removeAttribute('disabled');
        console.log(email);
        form.reset(); // Розкоментуйте, якщо хочете скинути форму після успішної відправки
    }
});

// async function sendMail(email) {
//     try {
//         submitButton.setAttribute('disabled', '');
//         const response = await fetch('sendmail.php', { method: 'POST', body: email });
//         if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
//         const result = await response.json();
//         alert(result);

//     }
//     catch (error) {
//         console.error(error)
//     }
// }

// =================================== анімація іконок =======================

/*
Предмету, який рухатиметься за мишею, вказати атрибут data-prlx-mouse.

Якщо потрібно додаткові налаштування - вказати
Атрибут                                         Значення за замовчуванням
-------------------------------------------------------------------------------------------------------------------
data-prlx-cx="коефіцієнт_х"                      100                         значення більше - менше відсоток зсуву
data-prlx-cy="коефіцієнт_y"                     100                         значення більше - менше відсоток зсуву
data-prlx-dxr data-prlx-dyr                                                             проти осі X
data-prlx-dyr                                                               проти осі Y
data-prlx-a="швидкість_анімації"                50                          більше значення – більше швидкість

Якщо потрібно зчитувати рух миші в блоці-батьку - тому батькові вказати атрибут data-prlx-mouse-wrapper
Якщо в паралакс картинка - розтягнути її на >100%. 
Наприклад:
    width: 130%;
    height: 130%;
    top: -15%;
    left: -15%;
*/

class MousePRLX {
    constructor() {
        this.paralaxMouseInit();
    }

    paralaxMouseInit() {
        const paralaxMouse = document.querySelectorAll('[data-prlx-mouse]');

        paralaxMouse.forEach(el => {
            const paralaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');

            // Коеф. X 
            const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
            // Коеф. У 
            const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
            // Напр. Х
            const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
            // Напр. У
            const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
            // Швидкість анімації
            const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;

            // Оголошення змінних
            let positionX = 0, positionY = 0;
            let coordXprocent = 0, coordYprocent = 0;

            setMouseParallaxStyle();

            // Перевіряю на наявність батька, в якому зчитуватиметься становище миші
            if (paralaxMouseWrapper) {
                mouseMoveParalax(paralaxMouseWrapper);
            } else {
                mouseMoveParalax();
            }

            function setMouseParallaxStyle() {
                const distX = coordXprocent - positionX;
                const distY = coordYprocent - positionY;
                positionX = positionX + (distX * paramAnimation / 1000);
                positionY = positionY + (distY * paramAnimation / 1000);
                el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0);`;
                requestAnimationFrame(setMouseParallaxStyle);
            }

            function mouseMoveParalax(wrapper = window) {
                wrapper.addEventListener("mousemove", function (e) {
                    const offsetTop = el.getBoundingClientRect().top + window.scrollY;
                    if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
                        // Отримання ширини та висоти блоку
                        const parallaxWidth = window.innerWidth;
                        const parallaxHeight = window.innerHeight;
                        // Нуль посередині
                        const coordX = e.clientX - parallaxWidth / 2;
                        const coordY = e.clientY - parallaxHeight / 2;
                        // Отримуємо відсотки
                        coordXprocent = coordX / parallaxWidth * 100;
                        coordYprocent = coordY / parallaxHeight * 100;
                    }
                });
            }
        });
    }
}

// Створення екземпляру класу для ініціалізації
new MousePRLX();

// ============================================ header scroll ==================================

let addWindowScrollEvent = false;

function headerScroll() {
    addWindowScrollEvent = true;
    const header = document.querySelector('header.header');
    const headerShow = header.hasAttribute('data-scroll-show');
    const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
    const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
    let scrollDirection = 0;
    let timer;
    document.addEventListener("windowScroll", function (e) {
        const scrollTop = window.scrollY;
        clearTimeout(timer);
        if (scrollTop >= startPoint) {
            !header.classList.contains('header-scroll') ? header.classList.add('header-scroll') : null;
            if (headerShow) {
                if (scrollTop > scrollDirection) {
                    // downscroll code
                    header.classList.contains('header-show') ? header.classList.remove('header-show') : null;
                } else {
                    // upscroll code
                    !header.classList.contains('header-show') ? header.classList.add('header-show') : null;
                }
                timer = setTimeout(() => {
                    !header.classList.contains('header-show') ? header.classList.add('header-show') : null;
                }, headerShowTimer);
            }
        } else {
            header.classList.contains('header-scroll') ? header.classList.remove('header-scroll') : null;
            if (headerShow) {
                header.classList.contains('header-show') ? header.classList.remove('header-show') : null;
            }
        }
        scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
    });
}

headerScroll();

setTimeout(() => {
    if (addWindowScrollEvent) {
        let windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", function (e) {
            document.dispatchEvent(windowScroll);
        });
    }
}, 0);

// ============================================= Paralax ============================================

/*
Параметри data-атрибутів для налаштування ефекту паралаксу:

1. Для батьківського елемента ([data-prlx-parent]):
   - data-prlx-smooth: Визначає плавність анімації. За замовчуванням 15. Більше значення - більш плавний ефект.
   - data-prlx-center: Визначає точку відліку для паралаксу. Можливі значення:
      * "top": верхня точка екрану
      * "center": центр екрану (за замовчуванням)
      * "bottom": нижня точка екрану
    data-prlx-disable-width="992"  
 
2. Для дочірніх елементів ([data-prlx]):
   - data-axis: Визначає вісь руху. Можливі значення:
      * "v": вертикальний рух (за замовчуванням)
      * "h": горизонтальний рух
   - data-direction: Визначає напрямок руху. Якщо не вказано, рух відбувається в протилежному напрямку прокрутки.
   - data-coefficient: Коефіцієнт швидкості руху. За замовчуванням 5. Менше значення - швидший рух.
   - data-properties: Додаткові CSS властивості трансформації, які будуть додані до елемента.
*/

class Parallax {
    constructor(elements) {
        if (elements.length) {
            this.elements = Array.from(elements).map((el) => (
                new Parallax.Each(el)
            ));
        }
    }
}

Parallax.Each = class {
    constructor(parent) {
        this.parent = parent;
        this.elements = this.parent.querySelectorAll('[data-prlx]');
        this.animation = this.animationFrame.bind(this);
        this.offset = 0;
        this.value = 0;
        this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
        // Set to 0 if attribute is not present, meaning parallax is always enabled
        this.disableWidth = parent.dataset.prlxDisableWidth ? Number(parent.dataset.prlxDisableWidth) : 0;
        this.setEvents();
    }

    setEvents() {
        this.animationID = window.requestAnimationFrame(this.animation);
    }

    animationFrame() {
        const windowWidth = window.innerWidth;

        // Check if parallax should be disabled based on screen width
        if (windowWidth < this.disableWidth) {
            this.elements.forEach(el => {
                el.style.transform = 'none';
            });
            this.animationID = window.requestAnimationFrame(this.animation);
            return;
        }

        const topToWindow = this.parent.getBoundingClientRect().top;
        const heightParent = this.parent.offsetHeight;
        const heightWindow = window.innerHeight;
        const positionParent = {
            top: topToWindow - heightWindow,
            bottom: topToWindow + heightParent,
        }
        const centerPoint = this.parent.dataset.prlxCenter || 'center';

        if (positionParent.top < 30 && positionParent.bottom > -30) {
            switch (centerPoint) {
                case 'top':
                    this.offset = -1 * topToWindow;
                    break;
                case 'center':
                    this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
                    break;
                case 'bottom':
                    this.offset = heightWindow - (topToWindow + heightParent);
                    break;
            }
        }

        this.value += (this.offset - this.value) / this.smooth;
        this.animationID = window.requestAnimationFrame(this.animation);

        this.elements.forEach(el => {
            const parameters = {
                axis: el.dataset.axis || 'v',
                direction: el.dataset.direction ? el.dataset.direction + '1' : '-1',
                coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                additionalProperties: el.dataset.properties || '',
            }
            this.parameters(el, parameters);
        });
    }

    parameters(el, parameters) {
        if (parameters.axis == 'v') {
            el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`;
        } else if (parameters.axis == 'h') {
            el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
        }
    }
}

// Ініціалізація паралаксу
if (document.querySelectorAll('[data-prlx-parent]')) {
    new Parallax(document.querySelectorAll('[data-prlx-parent]'));
}


// ==================================================================== spoiler ======================================================================
export function spollers() {
    const spollersArray = document.querySelectorAll('[data-spollers]');
    if (spollersArray.length > 0) {
        // Отримання звичайних слойлерів
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        // Ініціалізація звичайних слойлерів
        if (spollersRegular.length) {
            initSpollers(spollersRegular);
        }
        // Отримання слойлерів з медіа-запитами
        let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
        if (mdQueriesArray && mdQueriesArray.length) {
            mdQueriesArray.forEach(mdQueriesItem => {
                // Подія
                mdQueriesItem.matchMedia.addEventListener("change", function () {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
        }
        // Ініціалізація
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add('_spoller-init');
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove('_spoller-init');
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }
        // Робота з контентом
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
            if (spollerTitles.length) {
                spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute('tabindex');
                        if (!spollerTitle.classList.contains('_spoller-active')) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }
        function setSpollerAction(e) {
            const el = e.target;
            if (el.closest('[data-spoller]')) {
                const spollerTitle = el.closest('[data-spoller]');
                const spollersBlock = spollerTitle.closest('[data-spollers]');
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (!spollersBlock.querySelectorAll('._slide').length) {
                    if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle('_spoller-active');
                    _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                }
                e.preventDefault();
            }
        }
        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
                spollerActiveTitle.classList.remove('_spoller-active');
                _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
            }
        }
        // Закриття при кліку поза спойлером
        const spollersClose = document.querySelectorAll('[data-spoller-close]');
        if (spollersClose.length) {
            document.addEventListener("click", function (e) {
                const el = e.target;
                if (!el.closest('[data-spollers]')) {
                    spollersClose.forEach(spollerClose => {
                        const spollersBlock = spollerClose.closest('[data-spollers]');
                        if (spollersBlock.classList.contains('_spoller-init')) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove('_spoller-active');
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                        }
                    });
                }
            });
        }
    }
}

// Унікалізація масиву
export function uniqArray(array) {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
}

// Обробка медіа запитів з атрибутів
export function dataMediaQueries(array, dataSetValue) {
    // Отримання об'єктів з медіа-запитами
    const media = Array.from(array).filter(function (item, index, self) {
        if (item.dataset[dataSetValue]) {
            return item.dataset[dataSetValue].split(",")[0];
        }
    });
    // Ініціалізація об'єктів з медіа-запитами
    if (media.length) {
        const breakpointsArray = [];
        media.forEach(item => {
            const params = item.dataset[dataSetValue];
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });
        // Отримуємо унікальні брейкпоінти
        let mdQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mdQueries = uniqArray(mdQueries);
        const mdQueriesArray = [];

        if (mdQueries.length) {
            // Працюємо з кожним брейкпоінтом
            mdQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);
                // Об'єкти з потрібними умовами
                const itemsArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                mdQueriesArray.push({
                    itemsArray,
                    matchMedia
                })
            });
            return mdQueriesArray;
        }
    }
}

// Допоміжні модулі плавного розкриття та закриття об'єкта ======================================================================================================================================================================
export let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty('height') : null;
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            !showmore ? target.style.removeProperty('overflow') : null;
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
            // Створюємо подію 
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}

export let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}

export let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty('height') : null;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
            // Створюємо подію
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}

spollers();