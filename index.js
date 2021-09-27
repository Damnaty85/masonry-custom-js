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
			<div class="enlarge-image__close">Close</div>
		</div>
	`)
}

function arrowSliderTemplate() {
    return (`
		<div class="enlarge-image__arrow _enlarge-image__next _hidden">next</div>
		<div class="enlarge-image__arrow _enlarge-image__prev _hidden">prev</div>
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
                imageContainer.style = `width:1000px;left:50%;top:50%;transform: translate(-50%, -50%);`
                image.style.height = `600px`;
                imageContainer.parentElement.insertAdjacentHTML('beforeend', arrowSliderTemplate());

                const next = container.querySelector("._enlarge-image__next");
                const prev = container.querySelector("._enlarge-image__prev");

                setTimeout(() => {
                    imageContainer.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary))
                    next.classList.remove('_hidden');
                    prev.classList.remove('_hidden');
                }, 100)

                const nextElement = parseInt(this.dataset.position) >= images.length - 1 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) + 1;
                const prevElement = parseInt(this.dataset.position) <= 0 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) - 1;

                next.setAttribute('data-next', nextElement);
                prev.setAttribute('data-prev', prevElement);

                changeImage(next, images);
                changeImage(prev, images);
            }, 10)

            closedEnlargeImage('.enlarge-image__close');
        })
    }
}

function changeImage(selector, array) {
    selector.addEventListener('click', function() {
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
                    current.style = `width: 1000px; left: -100%; top: 50%; transform: translate(-50%, -50%);`;
                    let clone = current.cloneNode(true);
                    clone.classList.add('_rerender-image');
                    current.parentElement.insertAdjacentElement('afterbegin', clone);
                    clone.style = `width: 1000px; right: -100%; top: 50%; transform: translate(100%, -50%);`;
                    setTimeout(() => {
                        current.remove();
                        clone.style = `width: 1000px; right: 50%; top: 50%; transform: translate(50%, -50%);`
                        clone.innerHTML = `<img src="${imgSrc}">`;
                        clone.insertAdjacentHTML('beforeend', userDataTemplate(nextName, dateNext, gradeNext, commentaryNext));
                        clone.setAttribute('data-index', this.dataset.next);
                        const calcNext = parseInt(this.dataset.next) === array.length - 1 ? array.length - 1 : parseInt(this.dataset.next) + 1;
                        const calcPrev = parseInt(clone.dataset.index) === 1 ? 0 : parseInt(this.nextElementSibling.dataset.prev) + 1;
                        this.setAttribute('data-next', calcNext);
                        this.nextElementSibling.setAttribute('data-prev', calcPrev);
                        current = clone;
                        setTimeout(() => {
                            current.style = `width:1000px;left:50%;top:50%;transform: translate(-50%, -50%);`;
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
                    current.style = `width: 1000px; left: 100%; top: 50%; transform: translate(100%, -50%);`;
                    let clone = current.cloneNode(true);
                    clone.classList.add('_rerender-image');
                    current.parentElement.insertAdjacentElement('afterbegin', clone);
                    clone.style = `width: 1000px; left: -100%; top: 50%; transform: translate(-100%, -50%);`;
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
                            current.style = `width:1000px;left:50%;top:50%;transform: translate(-50%, -50%);`;
                            current.classList.remove('_rerender-image');
                        })
                    }, 155)
                })
            }
        }
    })
};

function closedEnlargeImage(selector) {
    const close = document.querySelector(selector);

    close.addEventListener('click', () => {
        close.parentElement.remove();
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = `unset`;
    })
}

// function enlargeImageTemplate() {
//     return (` 
// 			<div class="enlarge-image__close">Close<svg><use href="/front/img/review-image/sprite.svg#closeForm"></svg></div>
// 			<div class="enlarge-image__box"></div>
// 			<div class="enlarge-image__arrow _enlarge-image__next"><svg><use href="/front/img/review-image/sprite.svg#arrowMFAnt"></svg></div>
// 			<div class="enlarge-image__arrow _enlarge-image__prev"><svg><use href="/front/img/review-image/sprite.svg#arrowMFAnt"></svg></div>	
// 	`)
// }

// function userDataTemplate(name, date, grade, comentary) {
//     return (`<div class="enlarge-image__data">
// 				<div class="enlarge-image__wrapper">
// 					<div class="enlarge-image__left">
// 						<div class="enlarge-image__name">${name}</div>
// 						<div class="enlarge-image__date">${date}</div>
// 					</div>
// 					<div class="enlarge-image__right">
// 						<span>Оценка блюду</span>
// 						<div class="enlarge-image__grade">${grade}Нравится</div>
// 					</div>
// 				</div>
// 				<div class="enlarge-image__commentary">${comentary}</div>
// 			</div>`)
// }

// function eventImageHandler(selector) {
//     const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
//     const images = [...document.querySelectorAll(selector)]
//     const body = document.querySelector('body');

//     const enlargeWidth = 1000;
//     const enlargeHeight = 600;

//     if (images.length !== 0) {
//         const container = document.createElement('div');
//         container.classList.add('enlarge-image');
//         container.style = 'opacity:0;pointer-events:none;';

//         container.insertAdjacentHTML('beforeend', enlargeImageTemplate());

//         body.insertAdjacentElement('beforeend', container);

//         for (let i = 0; i < images.length; i++) {

//             images[i].setAttribute('data-position', i)

//             images[i].addEventListener('click', function(evt) {
//                 evt.preventDefault();
//                 evt.stopPropagation();

//                 document.body.style.overflow = 'hidden';
//                 document.body.style.paddingRight = `${scrollWidth}px`;

//                 const enlargeTop = (window.innerHeight / 2) - (enlargeHeight / 2);
//                 const enlargeLeft = (window.innerWidth / 2) - (enlargeWidth / 2);

//                 const srcBigImage = this.getAttribute('href');
//                 const userName = this.getAttribute('data-name');
//                 const userDate = this.getAttribute('data-date');
//                 const userGrade = this.getAttribute('data-grade');
//                 const userCommentary = this.getAttribute('data-caption');

//                 let imageWrapper = document.createElement('div')
//                 imageWrapper.classList.add('enlarge-image__container');
//                 imageWrapper.setAttribute('data-position', i);
//                 container.querySelector('.enlarge-image__box').insertAdjacentElement('afterbegin', imageWrapper);

//                 const top = this.getBoundingClientRect().top;
//                 const left = this.getBoundingClientRect().left;
//                 const width = this.getBoundingClientRect().width;
//                 const height = this.getBoundingClientRect().height

//                 imageWrapper.style = `top:${top}px;left:${left}px;max-width:${width}px;height:${height}px;`;
//                 imageWrapper.innerHTML = `<img src="${srcBigImage}">`

//                 setTimeout(() => {
//                     container.style = 'opacity:1;';
//                     setTimeout(() => {
//                         imageWrapper.style = `top:${enlargeTop}px;left:${enlargeLeft}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;
//                         imageWrapper.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary));
//                         setTimeout(() => {
//                             const descriptionHeight = parseInt(getComputedStyle(container.querySelector('.enlarge-image__data')).height);
//                             imageWrapper.style.top = `${enlargeTop - (descriptionHeight / 2)}px`;
//                         }, 150)
//                     })
//                 }, 200)


//                 const next = container.querySelector("._enlarge-image__next");
//                 const prev = container.querySelector("._enlarge-image__prev");

//                 let j = Number(this.getAttribute('data-position'));

//                 i === images.length - 1 ? next.classList.add('_disabled') : next.classList.remove('_disabled')
//                 i === 0 ? prev.classList.add('_disabled') : prev.classList.remove('_disabled')

//                 next.addEventListener('click', (evt) => {
//                     if (j === images.length - 1) {
//                         return false;
//                     } else {
//                         prev.classList.remove('_disabled');
//                         const nextElement = images[j += 1];

//                         const userNameNext = nextElement.getAttribute('data-name');
//                         const userDateNext = nextElement.getAttribute('data-date');
//                         const userGradeNext = nextElement.getAttribute('data-grade');
//                         const userCommentaryNext = nextElement.getAttribute('data-caption');

//                         imageWrapper.style = `left:-${window.innerWidth}px;top:${enlargeTop}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;

//                         const cloneImageWrapper = imageWrapper.cloneNode(true);
//                         cloneImageWrapper.setAttribute('data-position', j);
//                         cloneImageWrapper.classList.add('_next');

//                         resetCopies(j - 1, '.enlarge-image__container', 'data-position');

//                         container.querySelector('.enlarge-image__box').insertAdjacentElement('afterbegin', cloneImageWrapper);

//                         cloneImageWrapper.style = `left:${window.innerWidth}px;top:${enlargeTop}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;
//                         cloneImageWrapper.innerHTML = `<img src="${nextElement.getAttribute('href')}">`;
//                         cloneImageWrapper.insertAdjacentHTML('beforeend', userDataTemplate(userNameNext, userDateNext, userGradeNext, userCommentaryNext));

//                         next.classList.add('_disabled');

//                         setTimeout(() => {
//                             imageWrapper.remove();
//                             cloneImageWrapper.style = `left:${window.innerWidth}px;top:${enlargeTop}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;;
//                             setTimeout(() => {
//                                 imageWrapper = cloneImageWrapper;
//                                 cloneImageWrapper.classList.remove('_next');
//                                 cloneImageWrapper.style = `top:${enlargeTop}px;left:${enlargeLeft}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;
//                                 if (j === images.length - 1) {
//                                     next.classList.add('_disabled');
//                                 } else {
//                                     next.classList.remove('_disabled');
//                                 }
//                             })
//                         }, 150)
//                     }
//                 })

//                 prev.addEventListener('click', (evt) => {
//                     if (j === 0) {
//                         return false;
//                     } else {
//                         next.classList.remove('_disabled');
//                         const prevElement = images[j -= 1];

//                         const userNamePrev = prevElement.getAttribute('data-name');
//                         const userDatePrev = prevElement.getAttribute('data-date');
//                         const userGradePrev = prevElement.getAttribute('data-grade');
//                         const userCommentaryPrev = prevElement.getAttribute('data-caption');

//                         imageWrapper.style = `left:${window.innerWidth}px;top:${enlargeTop}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;

//                         const cloneImageWrapper = imageWrapper.cloneNode(true);
//                         cloneImageWrapper.setAttribute('data-position', j)
//                         cloneImageWrapper.classList.add('_prev');

//                         cloneImageWrapper.setAttribute('data-position', j)

//                         resetCopies(j, '.enlarge-image__container', 'data-position');

//                         container.querySelector('.enlarge-image__box').insertAdjacentElement('afterbegin', cloneImageWrapper);

//                         cloneImageWrapper.style = `left:-${window.innerWidth}px;top:${enlargeTop}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;
//                         cloneImageWrapper.innerHTML = `<img src="${prevElement.getAttribute('href')}">`
//                         cloneImageWrapper.insertAdjacentHTML('beforeend', userDataTemplate(userNamePrev, userDatePrev, userGradePrev, userCommentaryPrev));

//                         prev.classList.add('_disabled');

//                         setTimeout(() => {
//                             imageWrapper.remove();
//                             cloneImageWrapper.style = `left:-${window.innerWidth}px;top:${enlargeTop}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;
//                             setTimeout(() => {
//                                 imageWrapper = cloneImageWrapper;
//                                 cloneImageWrapper.classList.remove('_prev');
//                                 imageWrapper.style = `top:${enlargeTop}px;left:${enlargeLeft}px;max-width:${enlargeWidth}px;height:${enlargeHeight}px;`;
//                                 if (j === 0) {
//                                     prev.classList.add('_disabled');
//                                 } else {
//                                     prev.classList.remove('_disabled');
//                                 }
//                             })
//                         }, 150)
//                     }
//                 })
//             })
//         }
//         closeEnlargeImage(container);
//     }
// }

// function resetCopies(index, selector, attribute) {
//     if (document.querySelector(selector)) {
//         const containers = document.querySelectorAll(selector);

//         if (containers.length >= 1) {
//             containers.forEach((item) => {
//                 if (index !== item.getAttribute(attribute)) {
//                     setTimeout(() => {
//                         item.remove();
//                     }, 225)
//                 }
//             })
//         }
//     }
// }

// function closeEnlargeImage(selector) {
//     selector.querySelector('.enlarge-image__close').addEventListener('click', () => {
//         if (document.querySelector('.enlarge-image__container')) {
//             setTimeout(() => {
//                 const images = document.querySelectorAll('.enlarge-image__container');
//                 images.forEach((it) => {
//                     it.style.opacity = '0'
//                 })
//                 selector.style = 'opacity:0;pointer-events:none;';
//                 setTimeout(() => {
//                     images.forEach((it) => {
//                         it.remove();
//                     })
//                 }, 250)
//             }, 200)
//         }
//         document.body.style.overflow = 'unset';
//         document.body.style.paddingRight = `unset`;
//     })
// }
