// reviews js start
const wrapper = document.querySelector('.grid');
const elements = [...wrapper.children];
const loadMore = document.querySelector(".load-more");


loadMore.addEventListener('click', renderGrid);
document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    eventImageHandler("[data-view-image]");
});
window.addEventListener("orientationchange", debounce(() => {
    renderGrid();
}));
window.addEventListener("resize", debounce(() => {
    renderGrid();
}));

function renderGrid() {
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

    calculateElementPosition(CONTAINER_WIDTH, widthElement, COLUMNS, INDENT)
    calculateContainerHeight(COLUMNS, INDENT);
}

function calculateElementPosition(width, calcWidth, col, indent) {
    let top;
    let left;
    for (let i = 1; i < elements.length; i++) {
        if (window.innerWidth <= width) {
            elements[0].style.width = calcWidth;
            elements[i].style.width = calcWidth;
        }
        if (i % col == 0) {
            top = (elements[i - col].offsetTop + elements[i - col].offsetHeight) + indent;
            elements[i].style.top = `${top}px`;
        } else {
            if (elements[i - col]) {
                top = (elements[i - col].offsetTop + elements[i - col].offsetHeight) + indent;
                elements[i].style.top = `${top}px`;
            }
            left = (elements[i - 1].offsetLeft + elements[i - 1].offsetWidth) + indent;
            elements[i].style.left = `${left + 1}px`;
        }
    }
}

function calculateHeightInColumn(array, col) {
    if (array.length !== 0) {
        const elementInColumn = elements.length / col;
        const wrapperHeight = array.sort((a, b) => b - a).slice(0, elementInColumn).reduce((a, b) => a + b);
        return wrapperHeight;
    }
    return false;
}

function calculateContainerHeight(col, indent) {
    const elementsHeightColumnOne = [];
    const elementsHeightColumnTwo = [];
    const elementsHeightColumnThree = [];

    for (let [index, element] of elements.entries()) {

        if (index % col == 0) {
            elementsHeightColumnOne.push(element.offsetHeight + indent);
        } else if (index % col == 1) {
            elementsHeightColumnTwo.push(element.offsetHeight + indent);
        } else {
            elementsHeightColumnThree.push(element.offsetHeight + indent);
        }
    }

    const heightInColumnOne = calculateHeightInColumn(elementsHeightColumnOne, col);
    const heightInColumnTwo = calculateHeightInColumn(elementsHeightColumnTwo, col);
    const heightInColumnThree = calculateHeightInColumn(elementsHeightColumnThree, col);

    const arrayColumnHeigt = [heightInColumnOne, heightInColumnTwo, heightInColumnThree];

    const height = arrayColumnHeigt.sort((a, b) => b - a).slice(0, 1);
    wrapper.style.height = `${height[0] - indent}px`
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
			<div class="enlarge-image__close"><svg><use href="/front/img/review-image/sprite.svg#closeForm"></svg></div>
		</div>
	`)
}

function arrowSliderTemplate() {
    return (`
		<div class="enlarge-image__arrow _enlarge-image__next _hidden"><svg><use href="/front/img/review-image/sprite.svg#arrowMFAnt"></div>
		<div class="enlarge-image__arrow _enlarge-image__prev _hidden"><svg><use href="/front/img/review-image/sprite.svg#arrowMFAnt"></div>
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
						<div class="enlarge-image__grade">${grade}Нравится</div>
					</div>
				</div>
				<div class="enlarge-image__commentary">${comentary}</div>
			</div>`)
}

function eventImageHandler(selector) {
    const IMAGE_WIDTH = window.innerWidth <= 1200 ? window.innerWidth / 1.2 : 1000
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
                imageContainer.style = `width:${IMAGE_WIDTH}px;left:50%;top:50%;transform: translate(-50%, -50%);`
                image.style.height = `${IMAGE_HEIGHT}px`;
                imageContainer.parentElement.insertAdjacentHTML('beforeend', arrowSliderTemplate());

                const next = container.querySelector("._enlarge-image__next");
                const prev = container.querySelector("._enlarge-image__prev");

                setTimeout(() => {
                    imageContainer.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary))
                    next.classList.remove('_hidden');
                    prev.classList.remove('_hidden');

                    let startPoint={};
                    let nowPoint;
                    let ldelay;

                    imageContainer.addEventListener('touchstart', function(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        startPoint.x = evt.changedTouches[0].pageX;
                        startPoint.y = evt.changedTouches[0].pageY;
                        ldelay = new Date();
                    }, false);

                    imageContainer.addEventListener('touchmove', function(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        let otk = {};
                        nowPoint = evt.changedTouches[0];
                        otk.x = nowPoint.pageX - startPoint.x;

                        if(Math.abs(otk.x) > 200){
                            if(otk.x < 0){
                                imageContainer.style.left = `${nowPoint.pageX}px`
                                console.log(`право, ${nowPoint.pageX}`)
                            }
                            if(otk.x > 0){
                                imageContainer.style.left = `${nowPoint.pageX}px`
                                console.log(`лево, ${nowPoint.pageX}`)
                            }
                            startPoint={
                                x: nowPoint.pageX,
                                y: nowPoint.pageY
                            };
                        }
                    }, false);

                    imageContainer.addEventListener('touchend', function(evt) {
                        imageContainer.style = `width:${IMAGE_WIDTH}px;left:50%;top:50%;transform: translate(-50%, -50%);`
                    }, false);



                }, 100)

                const nextElement = parseInt(this.dataset.position) >= images.length - 1 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) + 1;
                const prevElement = parseInt(this.dataset.position) <= 0 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) - 1;

                next.setAttribute('data-next', nextElement);
                prev.setAttribute('data-prev', prevElement);

                changeImage(next, images, IMAGE_WIDTH);
                changeImage(prev, images, IMAGE_WIDTH);
            }, 10)

            closedEnlargeImage(".enlarge-image__close", ".enlarge-image");
            closedEnlargeImage(".enlarge-image", ".enlarge-image");
        })
    }
}

function changeImage(selector, array, imageWidth) {
    selector.addEventListener('click', function(evt) {
        evt.stopPropagation();
        let current = document.querySelector('[data-index]');
        let j = Number(current.dataset.index);
        if (this.dataset.next) {
            if (Number(current.dataset.index) !== Number(this.dataset.next)) {
                let next = array[j += 1];

                const imgSrc = next.getAttribute('href');
                const nextName = next.dataset.name;
                const dateNext = next.dataset.date;
                const gradeNext = next.dataset.grade;
                const commentaryNext = next.dataset.caption;

                setTimeout(() => {
                    current.style = `width: ${imageWidth}px; left: -100%; top: 50%; transform: translate(-50%, -50%);`;
                    let clone = current.cloneNode(true);
                    clone.classList.add('_rerender-image');
                    current.parentElement.insertAdjacentElement('afterbegin', clone);
                    clone.style = `width: ${imageWidth}px; right: -100%; top: 50%; transform: translate(100%, -50%);`;
                    setTimeout(() => {
                        current.remove();
                        clone.style = `width: ${imageWidth}px; right: 50%; top: 50%; transform: translate(50%, -50%);`
                        clone.innerHTML = `<img src="${imgSrc}">`;
                        clone.insertAdjacentHTML('beforeend', userDataTemplate(nextName, dateNext, gradeNext, commentaryNext));
                        clone.setAttribute('data-index', this.dataset.next);
                        const calcNext = parseInt(this.dataset.next) === array.length - 1 ? array.length - 1 : parseInt(this.dataset.next) + 1;
                        const calcPrev = parseInt(clone.dataset.index) === 1 ? 0 : parseInt(this.nextElementSibling.dataset.prev) + 1;
                        this.setAttribute('data-next', calcNext);
                        this.nextElementSibling.setAttribute('data-prev', calcPrev);
                        current = clone;
                        setTimeout(() => {
                            current.style = `width:${imageWidth}px;left:50%;top:50%;transform: translate(-50%, -50%);`;
                            current.classList.remove('_rerender-image');
                        })
                    }, 155)
                })
            }
        }
        if (this.dataset.prev) {
            if (Number(current.dataset.index) !== Number(this.dataset.prev)) {
                let prev = array[j -= 1];

                const imgSrc = prev.getAttribute('href');
                const prevName = prev.dataset.name;
                const datePrev = prev.dataset.date;
                const gradePrev = prev.dataset.grade;
                const commentaryPrev = prev.dataset.caption;

                setTimeout(() => {
                    current.style = `width: ${imageWidth}px; left: 100%; top: 50%; transform: translate(100%, -50%);`;
                    let clone = current.cloneNode(true);
                    clone.classList.add('_rerender-image');
                    current.parentElement.insertAdjacentElement('afterbegin', clone);
                    clone.style = `width: ${imageWidth}px; left: -100%; top: 50%; transform: translate(-100%, -50%);`;
                    setTimeout(() => {
                        current.remove();
                        clone.innerHTML = `<img src="${imgSrc}">`;
                        clone.insertAdjacentHTML('beforeend', userDataTemplate(prevName, datePrev, gradePrev, commentaryPrev));
                        clone.setAttribute('data-index', this.dataset.prev);
                        const calcPrev = parseInt(clone.dataset.index) === 0 ? 0 : parseInt(this.dataset.prev) - 1;
                        const calcNext = parseInt(clone.dataset.index) === array.length - 2 ? array.length - 1 : parseInt(this.previousElementSibling.dataset.next) - 1;
                        this.setAttribute('data-prev', calcPrev);
                        this.previousElementSibling.setAttribute('data-next', calcNext);
                        current = clone;
                        setTimeout(() => {
                            current.style = `width:${imageWidth}px;left:50%;top:50%;transform: translate(-50%, -50%);`;
                            current.classList.remove('_rerender-image');
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
