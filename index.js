    document.addEventListener('DOMContentLoaded', () => {
        renderGrid('.grid');
        eventImageHandler("[data-view-image]");

        if (document.querySelector('.grid')) {
            const loadMore = document.querySelector(".load-more");
            loadMore.addEventListener('click', renderGrid);
        }


        let lazyImages = [].slice.call(document.querySelectorAll(".lazy-image"));

        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach( (entry) => {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove(".lazy-image");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            lazyImages.forEach((lazyImage) => {
                lazyImageObserver.observe(lazyImage);
            });
        }
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
                ${arrowSliderTemplate()}
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
        const IMAGE_WIDTH = window.innerWidth <= 1200 ? window.innerWidth / 1.1 : 1000;
        const IMAGE_HEIGHT = 600 / (1000 / IMAGE_WIDTH);

        const images = [...document.querySelectorAll(selector)]
        const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
        const body = document.querySelector('body');

        for (let i = 0; i < images.length; i++) {
            images[i].setAttribute('data-position', i);

            images[i].addEventListener('click', function(evt) {
                evt.preventDefault();

                document.body.classList.add('_no-scrolling');
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
                    imageContainer.style = `width:${IMAGE_WIDTH}px;left:${(window.innerWidth/2) - (IMAGE_WIDTH/2)}px;top:${(window.innerHeight/2) - (IMAGE_HEIGHT/2)}px;`;
                    image.style.height = `${IMAGE_HEIGHT}px`;

                    const next = container.querySelector("._enlarge-image__next");
                    const prev = container.querySelector("._enlarge-image__prev");

                    setTimeout(() => {
                        imageContainer.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary));
                        setTimeout(() => {
                            imageContainer.querySelector('.enlarge-image__data').classList.add('_showing');
                            imageContainer.style = `width:${IMAGE_WIDTH}px;left:${(window.innerWidth/2) - (IMAGE_WIDTH/2)}px;top:${(window.innerHeight/2) - ((IMAGE_HEIGHT)/2) - imageContainer.querySelector('.enlarge-image__data').offsetHeight}px;`;
                        }, 200)
                        next.classList.remove('_hidden');
                        prev.classList.remove('_hidden');

                        parseInt(imageContainer.dataset.index) === parseInt(next.dataset.next) && next.classList.add('_disabled');
                        parseInt(imageContainer.dataset.index) === parseInt(prev.dataset.prev) && prev.classList.add('_disabled');

                        (new Swipe(imageContainer)).onLeft(function() { 
                            next.click();
                         }).run();
    
                        (new Swipe(imageContainer)).onRight(function() { 
                            prev.click();
                        }).run();

                        imageContainer.addEventListener('click', (evt) => evt.stopPropagation());

                    }, 100)

                    const nextElement = parseInt(this.dataset.position) >= images.length - 1 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) + 1;
                    const prevElement = parseInt(this.dataset.position) <= 0 ? parseInt(this.dataset.position) : parseInt(this.dataset.position) - 1;

                    next.setAttribute('data-next', nextElement);
                    prev.setAttribute('data-prev', prevElement);

                    slidingImage(next, images, IMAGE_WIDTH, IMAGE_HEIGHT);
                    slidingImage(prev, images, IMAGE_WIDTH, IMAGE_HEIGHT);

                }, 10)

                closedEnlargeImage(".enlarge-image__close", ".enlarge-image");
                closedEnlargeImage(".enlarge-image", ".enlarge-image");
            })
        }
    }

    function slidingImage(selector, array, imageWidth, imageHeight) {
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

                    (() => {
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
                            (() => {
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
                            })();
                        }, 155)
                    })();
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

                    (() => {
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
                            (() => {
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
                            })();
                        }, 155)
                    })();
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
            document.body.classList.remove('_no-scrolling');
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
