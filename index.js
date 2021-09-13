let GAP = 20;
let COLUMNS = 3;
let WIDTH = 1170;
let NEW_TOP;
let NEW_LEFT;
const wrapper = document.querySelector('.grid');
const elements = wrapper.querySelectorAll('.grid__item');
const loadMore = document.querySelector('.load-more')

function debounce(func){
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
    };
}

function renderGrid() {
    wrapper.style.maxWidth = `${WIDTH}px`;
    // рассчет ширины элемента
    // const widthElement = `${(parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) - GAP * 2) / COLUMNS}px`;

    const elementsHeightColumnOne = [];
    const elementsHeightColumnTwo = [];
    const elementsHeightColumnThree = [];

    for (let i = 1; i < elements.length; i++) {
        // присваеваем первому элементу и остальным расчитанную ширину
        // elements[0].style.width = widthElement;
        // elements[i].style.width = widthElement;
        if (i % COLUMNS == 0) {
            NEW_TOP = (elements[i - COLUMNS].offsetTop + elements[i - COLUMNS].offsetHeight) + GAP;
            elements[i].style.top = `${NEW_TOP}px`;
        } else {
            if (elements[i - COLUMNS]) {
                NEW_TOP = (elements[i - COLUMNS].offsetTop + elements[i - COLUMNS].offsetHeight) + GAP;
                elements[i].style.top = `${NEW_TOP}px`;
            }
            NEW_LEFT = (elements[i - 1].offsetLeft + elements[i - 1].offsetWidth) + GAP;
            elements[i].style.left = `${NEW_LEFT}px`;
        }
    }

    elements.forEach((element, index) => {
        if (index % COLUMNS == 0) {
            elementsHeightColumnOne.push(element.offsetHeight + GAP);
        } else if (index % COLUMNS == 1) {
            elementsHeightColumnTwo.push(element.offsetHeight + GAP);
        } else {
            elementsHeightColumnThree.push(element.offsetHeight + GAP);
        }
    })

    function calculateHeightInColumn(array) {
        if (array.length !== 0) {
            const elementInColumn = elements.length / COLUMNS;
            const wrapperHeight = array.sort((a, b) => b - a).slice(0, elementInColumn).reduce((a, b) => a + b);
            return wrapperHeight;
        }
        return false;
    }

    const heightInColumnOne = calculateHeightInColumn(elementsHeightColumnOne);
    const heightInColumnTwo = calculateHeightInColumn(elementsHeightColumnTwo);
    const heightInColumnThree = calculateHeightInColumn(elementsHeightColumnThree);

    const arrayColumnHeigt = [heightInColumnOne, heightInColumnTwo, heightInColumnThree];

    wrapper.style.height = `${arrayColumnHeigt.sort((a, b) => b - a).slice(0, 1)}px`
}

window.addEventListener('DOMContentLoaded', renderGrid, false);
window.addEventListener("resize", debounce((e) => {
    renderGrid();
}));
loadMore.addEventListener('click', renderGrid, false);
