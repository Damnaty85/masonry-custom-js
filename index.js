document.addEventListener('DOMContentLoaded', () => {
    renderGrid('.grid');
    eventImageHandler("[data-view-image]");
});

window.addEventListener("orientationchange", debounce(() => {
    renderGrid('.grid');
}));

window.addEventListener("resize", debounce(() => {
    renderGrid('.grid');
}));

const LIMIT_ELEMENT = 5;

function renderGrid(selector) {
    if (document.querySelector(selector)) {
        const wrapper = typeof (selector) === 'string' ? document.querySelector(selector) : selector;
        const elements = [...wrapper.children];

        const CONTAINER_WIDTH = 1170;
        const TABLET_WIDTH = 820;
        const MOBILE_WIDTH = 560;

        let INDENT = window.innerWidth <= MOBILE_WIDTH ? 20 : window.innerWidth >= CONTAINER_WIDTH ? 35 : 10;
        let COLUMNS = window.innerWidth <= MOBILE_WIDTH ? 1 : window.innerWidth >= TABLET_WIDTH ? 3 : 2;

        let width = window.innerWidth >= MOBILE_WIDTH ? (parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) - INDENT * 2) / COLUMNS : parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) / COLUMNS;

        const widthElement = `${width}px`;

        wrapper.removeAttribute('style');
        wrapper.style.maxWidth = `${CONTAINER_WIDTH}px`;

        elements.forEach((element) => {
            element.removeAttribute('style');
        })

        calculateElementPosition(elements, CONTAINER_WIDTH, widthElement, COLUMNS, INDENT)
        calculateContainerHeight(wrapper, elements, COLUMNS, INDENT);


    } else {
        return false;
    }
}

function calculateElementPosition(elementList, width, calcWidth, col, indent) {
    let top;
    let left;
    for (let i = 1; i < elementList.length; i++) {
        if (window.innerWidth <= width) {
            elementList[0].style.width = calcWidth;
            elementList[i].style.width = calcWidth;
        }
        if (i % col == 0) {
            top = (elementList[i - col].offsetTop + elementList[i - col].offsetHeight) + indent;
            elementList[i].style.top = `${top}px`;
        } else {
            if (elementList[i - col]) {
                top = (elementList[i - col].offsetTop + elementList[i - col].offsetHeight) + indent;
                elementList[i].style.top = `${top}px`;
            }
            left = (elementList[i - 1].offsetLeft + elementList[i - 1].offsetWidth) + indent;
            elementList[i].style.left = `${left + 1}px`;
        }
    }
}

function calculateHeightInColumn(elementList, array, col) {
    if (array.length !== 0) {
        const elementInColumn = Math.ceil(elementList.length / col);
        const wrapperHeight = array.sort((a, b) => b - a).slice(0, elementInColumn).reduce((a, b) => a + b);
        return wrapperHeight;
    }
    return false;
}

function calculateContainerHeight(container, elementList, col, indent) {
    const elementsHeightColumnOne = [];
    const elementsHeightColumnTwo = [];
    const elementsHeightColumnThree = [];

    for (let [index, element] of elementList.entries()) {

        if (index % col == 0) {
            elementsHeightColumnOne.push(element.offsetHeight + indent);
        } else if (index % col == 1) {
            elementsHeightColumnTwo.push(element.offsetHeight + indent);
        } else {
            elementsHeightColumnThree.push(element.offsetHeight + indent);
        }
    }

    const heightInColumnOne = calculateHeightInColumn(elementList, elementsHeightColumnOne, col);
    const heightInColumnTwo = calculateHeightInColumn(elementList, elementsHeightColumnTwo, col);
    const heightInColumnThree = calculateHeightInColumn(elementList, elementsHeightColumnThree, col);

    const arrayColumnHeigt = [heightInColumnOne, heightInColumnTwo, heightInColumnThree];
    const height = arrayColumnHeigt.sort((a, b) => b - a).slice(0, 1);

    container.style.height = `${height[0] - indent}px`
}

function debounce(func) {
    var timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 200, event);
    };
}

function enlargeImageTemplate() {
    return (`
        <div class="enlarge-image">
            <div class="dynamic__container"></div>
            <div class="enlarge-image__close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                    <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.1677 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632556 19.8731 0.964493 20 1.29619 20C1.62789 20 1.95959 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z"/>
                </svg>
            </div>
            ${arrowSliderTemplate()}
        </div>
    `)
}

function arrowSliderTemplate() {
    return (`
        <div class="enlarge-image__arrow _enlarge-image__next _hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 24" width="14" height="24">
		        <path d="M0.250067 12C0.250067 11.5967 0.405898 11.1935 0.716903 10.8861L10.5085 1.21157C11.1314 0.596144 12.1413 0.596144 12.7639 1.21157C13.3865 1.82675 13.3865 2.82435 12.7639 3.43983L4.09971 12L12.7636 20.5601C13.3862 21.1756 13.3862 22.1731 12.7636 22.7882C12.141 23.4039 11.1311 23.4039 10.5082 22.7882L0.7166 13.1138C0.405544 12.8063 0.250067 12.4031 0.250067 12Z" fill="white"/>
	        </svg>
        </div>
        <div class="enlarge-image__arrow _enlarge-image__prev _hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 24" width="14" height="24">
                <path d="M0.250067 12C0.250067 11.5967 0.405898 11.1935 0.716903 10.8861L10.5085 1.21157C11.1314 0.596144 12.1413 0.596144 12.7639 1.21157C13.3865 1.82675 13.3865 2.82435 12.7639 3.43983L4.09971 12L12.7636 20.5601C13.3862 21.1756 13.3862 22.1731 12.7636 22.7882C12.141 23.4039 11.1311 23.4039 10.5082 22.7882L0.7166 13.1138C0.405544 12.8063 0.250067 12.4031 0.250067 12Z" fill="white"/>
            </svg>
        </div>
    `)
}

function userDataTemplate(name, date, grade, comentary) {
    return (`<div class="enlarge-image__data">
                <div class="enlarge-image__wrapper">
                    <div class="enlarge-image__left">
                        <div class="enlarge-image__name">${name}</div>
                        <div class="enlarge-image__date">${date}</div>
                    </div>
                    <div class="enlarge-image__right">
                        <span>Оценка блюду</span>
                        <div class="enlarge-image__grade">${grade}</div>
                    </div>
                </div>
                <div class="enlarge-image__commentary">${comentary}</div>
            </div>`)
}

function eventImageHandler(selector) {
    const IMAGE_WIDTH = window.innerWidth <= 1200 ? window.innerWidth / 1.1 : 1000;
    const IMAGE_HEIGHT = 600 / (1000 / IMAGE_WIDTH);

    const images = [...document.querySelectorAll(selector)]
    const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    const body = document.querySelector('body');

    for (let i = 0; i < images.length; i++) {
        images[i].setAttribute('data-position', i);

        images[i].addEventListener('click', function(evt) {
            evt.preventDefault();

            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollWidth}px`;

            const userPhoto = this.href;
            const userName = this.dataset.name;
            const userDate = this.dataset.date;
            const userGrade = this.dataset.grade;
            const userCommentary = this.dataset.caption;

            body.insertAdjacentHTML('beforeend', enlargeImageTemplate());

            const container = document.querySelector('.enlarge-image');
            const imageContainer = container.querySelector('.dynamic__container');

            const top = this.getBoundingClientRect().top;
            const left = this.getBoundingClientRect().left;
            const width = this.getBoundingClientRect().width;
            const height = this.getBoundingClientRect().height;

            imageContainer.innerHTML = `<img src="${userPhoto}">`;
            imageContainer.setAttribute('data-index', parseInt(this.dataset.position));
            const image = imageContainer.querySelector('img');

            imageContainer.style = `top:${top}px;left:${left}px;width:${width}px;`
            image.style.height = `${height}px`;

            container.classList.add('_opened');

            setTimeout(() => {
                imageContainer.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary));

                const left = (window.innerWidth/2) - (IMAGE_WIDTH/2);
                const top = (window.innerHeight/2) - ((IMAGE_HEIGHT + (imageContainer.querySelector('.enlarge-image__data').offsetHeight)/2)/2);
                
                imageContainer.style = `width:${IMAGE_WIDTH}px;left:${left}px;top:${top}px`;
                image.style.height = `${IMAGE_HEIGHT}px`;

                const next = container.querySelector("._enlarge-image__next");
                const prev = container.querySelector("._enlarge-image__prev");

                setTimeout(() => {
                    
                    setTimeout(() => {
                        imageContainer.querySelector('.enlarge-image__data').classList.add('_showing');
                    }, 300)
                    next.classList.remove('_hidden');
                    prev.classList.remove('_hidden');

                    parseInt(imageContainer.dataset.index) === parseInt(next.dataset.next) && next.classList.add('_disabled');
                    parseInt(imageContainer.dataset.index) === parseInt(prev.dataset.prev) && prev.classList.add('_disabled');

                    (new Swipe('.dynamic__container')).onLeft(function() { 
                        next.click();
                     }).run();

                     (new Swipe('.dynamic__container')).onRight(function() { 
                        prev.click();
                     }).run();

                    imageContainer.addEventListener('click', (evt) => evt.stopPropagation());
                }, 100)

                const nextElement = parseInt(this.dataset.position) >= images.length - 1 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) + 1;
                const prevElement = parseInt(this.dataset.position) <= 0 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) - 1;

                next.setAttribute('data-next', nextElement);
                prev.setAttribute('data-prev', prevElement);

                changeImage(next, images, IMAGE_WIDTH, IMAGE_HEIGHT);
                changeImage(prev, images, IMAGE_WIDTH, IMAGE_HEIGHT);

            }, 10)

            closedEnlargeImage(".enlarge-image__close", ".enlarge-image");
            closedEnlargeImage(".enlarge-image", ".enlarge-image");
        })
    }
}

function changeImage(selector, array, imageWidth, imageHeight = 277) {
    selector.addEventListener('click', function(evt) {
        evt.stopPropagation();
        let current = document.querySelector('[data-index]');
        let j = Number(current.dataset.index);
        if (this.dataset.next) {
            const thisButton = this;
            if (Number(current.dataset.index) !== Number(this.dataset.next)) {
                let next = array[j += 1];

                const imgSrc = next.getAttribute('href');
                const nextName = next.dataset.name;
                const dateNext = next.dataset.date;
                const gradeNext = next.dataset.grade;
                const commentaryNext = next.dataset.caption;

                setTimeout(() => {
                    current.style = `width: ${imageWidth}px; left: -100%; top: 50%; transform: translate3d(-50%, -50%, 0);`;
                    let clone = current.cloneNode(true);
                    clone.classList.add('_rerender-image');
                    current.parentElement.insertAdjacentElement('afterbegin', clone);
                    clone.style = `width: ${imageWidth}px; right: -100%; top: 50%; transform: translate3d(100%, -50%, 0);`;
                    setTimeout(() => {
                        current.remove();
                        clone.style = `width: ${imageWidth}px; right: 50%; top: 50%; transform: translate3d(50%, -50%, 0);`
                        clone.innerHTML = `<img src="${imgSrc}">`;
                        clone.querySelector('img').style.height = `${imageHeight}px`;
                        clone.insertAdjacentHTML('beforeend', userDataTemplate(nextName, dateNext, gradeNext, commentaryNext));
                        clone.querySelector('.enlarge-image__data').classList.add('_showing');
                        clone.setAttribute('data-index', this.dataset.next);
                        
                        const calcNext = parseInt(this.dataset.next) === array.length - 1 ? array.length - 1 : parseInt(this.dataset.next) + 1;
                        const calcPrev = parseInt(clone.dataset.index) === 1 ? 0 : parseInt(this.nextElementSibling.dataset.prev) + 1;
                        this.setAttribute('data-next', calcNext);
                        this.nextElementSibling.setAttribute('data-prev', calcPrev);
                        current = clone;
                        setTimeout(() => {
                            current.style = `width:${imageWidth}px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);`;
                            current.classList.remove('_rerender-image');

                            (new Swipe(current)).onLeft(function() { 
                                thisButton.click();
                             }).run();

                             (new Swipe(current)).onRight(function() { 
                                thisButton.nextElementSibling.click();
                             }).run();

                            current.addEventListener('click', (evt) => evt.stopPropagation());
                            
                            parseInt(current.dataset.index) === parseInt(this.dataset.next) && this.classList.add('_disabled');
                            this.nextElementSibling.classList.contains('_disabled') && this.nextElementSibling.classList.remove('_disabled');
                        })
                    }, 155)
                })
            }
        }
        if (this.dataset.prev) {
            const thisButton = this;
            if (Number(current.dataset.index) !== Number(this.dataset.prev)) {
                let prev = array[j -= 1];

                const imgSrc = prev.getAttribute('href');
                const prevName = prev.dataset.name;
                const datePrev = prev.dataset.date;
                const gradePrev = prev.dataset.grade;
                const commentaryPrev = prev.dataset.caption;

                setTimeout(() => {
                    current.style = `width: ${imageWidth}px; left: 100%; top: 50%; transform: translate3d(100%, -50%, 0);`;
                    let clone = current.cloneNode(true);
                    clone.classList.add('_rerender-image');
                    current.parentElement.insertAdjacentElement('afterbegin', clone);
                    clone.style = `width: ${imageWidth}px; left: -100%; top: 50%; transform: translate3d(-100%, -50%, 0);`;
                    setTimeout(() => {
                        current.remove();
                        clone.innerHTML = `<img src="${imgSrc}">`;
                        clone.querySelector('img').style.height = `${imageHeight}px`;
                        clone.insertAdjacentHTML('beforeend', userDataTemplate(prevName, datePrev, gradePrev, commentaryPrev));
                        clone.querySelector('.enlarge-image__data').classList.add('_showing');
                        clone.setAttribute('data-index', this.dataset.prev);
                        
                        const calcPrev = parseInt(clone.dataset.index) === 0 ? 0 : parseInt(this.dataset.prev) - 1;
                        const calcNext = parseInt(clone.dataset.index) === array.length - 2 ? array.length - 1 : parseInt(this.previousElementSibling.dataset.next) - 1;
                        this.setAttribute('data-prev', calcPrev);
                        this.previousElementSibling.setAttribute('data-next', calcNext);
                        current = clone;
                        setTimeout(() => {
                            current.style = `width:${imageWidth}px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);`;
                            current.classList.remove('_rerender-image');

                            (new Swipe(current)).onLeft(function() { 
                                thisButton.previousElementSibling.click();
                             }).run();

                             (new Swipe(current)).onRight(function() { 
                                thisButton.click();
                             }).run();

                             current.addEventListener('click', (evt) => evt.stopPropagation());

                            parseInt(clone.dataset.index) === parseInt(this.dataset.prev) && this.classList.add('_disabled');
                            this.previousElementSibling.classList.contains('_disabled') && this.previousElementSibling.classList.remove('_disabled');
                        })
                    }, 155)
                })
            }
        }
    })
};

function closedEnlargeImage(selector, elementClose) {
    const close = document.querySelector(selector);
    const elementClosed = document.querySelector(elementClose);

    document.addEventListener('keydown', (evt) => {
        if (evt.code === "Escape") {
            elementClosed.remove();
        }
    });

    close.addEventListener('click', () => {
        elementClosed.remove();
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = `unset`;
    })
}

class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof (element) === 'string' ? document.querySelector(element) : element;
        this.element.addEventListener('touchstart', function (evt) {
            this.xDown = evt.touches[0].clientX;
            this.yDown = evt.touches[0].clientY;
        }.bind(this), false);
    }
    onLeft(callback) {
        this.onLeft = callback;
        return this;
    };

    onRight(callback) {
        this.onRight = callback;
        return this;
    };

    onUp(callback) {
        this.onUp  =  callback;
        return this;
    };
      
    onDown(callback) {
        this.onDown  =  callback;
        return this;
    };

    handleTouchMove (evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }
        let xUp = evt.touches[0].clientX;
        let yUp = evt.touches[0].clientY; 
        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if (Math.abs(this.xDiff) !==  0) {
            if (this.xDiff > 2) {
                typeof (this.onLeft) === "function" && this.onLeft();
            } else  if (this.xDiff < -2) {
                typeof (this.onRight) === "function" && this.onRight();
            }
        }

        if (Math.abs(this.yDiff) !== 0) {
            if (this.yDiff > 2) {
                typeof (this.onUp) === "function" && this.onUp();
            } else  if (this.yDiff < -2) {
              typeof (this.onDown) === "function" && this.onDown();
            }
        }

        this.xDown = null;
        this.yDown = null;
    };

    run() {
        this.element.addEventListener('touchmove', function (evt) {
            this.handleTouchMove(evt);
        }.bind(this), false);
    };
}