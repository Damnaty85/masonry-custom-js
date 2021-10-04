    document.addEventListener('DOMContentLoaded', () => {
        renderGrid('.grid');
        eventImageHandler("[data-view-image]");

        const loadMore = document.querySelector(".load-more");
        loadMore.addEventListener('click', renderGrid);
    });

    window.addEventListener("orientationchange", debounce(() => {
        renderGrid('.grid');
    }));

    window.addEventListener("resize", debounce(() => {
        renderGrid('.grid');
    }));

    function renderGrid(selector) {
        if (document.querySelector(selector)) {
            const wrapper = document.querySelector(selector);
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
                <div class="enlarge-image__close"><svg><use href="/front/img/review-image/sprite.svg#closeForm"></svg></div>
                ${arrowSliderTemplate()};
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
        const IMAGE_WIDTH = window.innerWidth <= 1200 ? window.innerWidth / 1.1 : 1000
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
                    const transition = window.innerWidth < 560 && `transition:unset`;
                    imageContainer.style = `width:${IMAGE_WIDTH}px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);${transition}`;
                    image.style.height = `${IMAGE_HEIGHT}px`;

                    const next = container.querySelector("._enlarge-image__next");
                    const prev = container.querySelector("._enlarge-image__prev");

                    setTimeout(() => {
                        imageContainer.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary));
                        next.classList.remove('_hidden');
                        prev.classList.remove('_hidden');

                        detectionSwipe(imageContainer);
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
                        current.style = `width: ${imageWidth}px; left: -100%; top: 50%; transform: translate3d(-50%, -50%, 0);`;
                        let clone = current.cloneNode(true);
                        clone.classList.add('_rerender-image');
                        current.parentElement.insertAdjacentElement('afterbegin', clone);
                        clone.style = `width: ${imageWidth}px; right: -100%; top: 50%; transform: translate3d(100%, -50%, 0);`;
                        setTimeout(() => {
                            current.remove();
                            clone.style = `width: ${imageWidth}px; right: 50%; top: 50%; transform: translate3d(50%, -50%, 0);`
                            clone.innerHTML = `<img src="${imgSrc}">`;
                            clone.insertAdjacentHTML('beforeend', userDataTemplate(nextName, dateNext, gradeNext, commentaryNext));
                            clone.setAttribute('data-index', this.dataset.next);
                            const calcNext = parseInt(this.dataset.next) === array.length - 1 ? array.length - 1 : parseInt(this.dataset.next) + 1;
                            const calcPrev = parseInt(clone.dataset.index) === 1 ? 0 : parseInt(this.nextElementSibling.dataset.prev) + 1;
                            this.setAttribute('data-next', calcNext);
                            this.nextElementSibling.setAttribute('data-prev', calcPrev);
                            current = clone;
                            setTimeout(() => {
                                current.style = `width:${imageWidth}px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);`;
                                current.classList.remove('_rerender-image');
                                detectionSwipe(current);
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
                        current.style = `width: ${imageWidth}px; left: 100%; top: 50%; transform: translate3d(100%, -50%, 0);`;
                        let clone = current.cloneNode(true);
                        clone.classList.add('_rerender-image');
                        current.parentElement.insertAdjacentElement('afterbegin', clone);
                        clone.style = `width: ${imageWidth}px; left: -100%; top: 50%; transform: translate3d(-100%, -50%, 0);`;
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
                                current.style = `width:${imageWidth}px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);`;
                                current.classList.remove('_rerender-image');
                                detectionSwipe(current);
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


    function detectionSwipe(swipeElement) {
        let startPoint = {};
        let nowPoint;

        swipeElement.addEventListener('touchstart', function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            startPoint.x = evt.changedTouches[0].pageX;
            startPoint.y = evt.changedTouches[0].pageY;
        }, false);

        swipeElement.addEventListener('touchmove', function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            const next = document.querySelector("._enlarge-image__next");
            const prev = document.querySelector("._enlarge-image__prev");
            let otk = {};
            nowPoint = evt.changedTouches[0];
            otk.x = nowPoint.pageX - startPoint.x;
            swipeElement.style.left = `${nowPoint.pageX}px`

            if (Math.abs(otk.x) > window.innerWidth / 4) {

                if (nowPoint.pageX <= startPoint.x) {
                    // console.log(`свайп влево`)
                    next.click()
                }

                if (nowPoint.pageX >= startPoint.x) {
                    // console.log(`свайп вправо`)
                    prev.click()
                }

                startPoint = {
                    x: nowPoint.pageX
                };
            }

        }, false);

        swipeElement.addEventListener('touchend', function(evt) {
            setTimeout(() => {
                swipeElement.style.left = `50%`;
            }, 300)
        }, false);
    }
