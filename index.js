let GAP = 35;
let COLUMNS = 3;
let WIDTH = 1170;
let NEW_TOP;
let NEW_LEFT;
const wrapper = document.querySelector('.grid');
const elements = [...wrapper.children];


function renderGrid() {
	const widthElement = `${(parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) - GAP * 2) / COLUMNS}px`;
	if (window.innerWidth <= 1170) {
		GAP = 14;
	}
	if (window.innerWidth <= 768) {
		COLUMNS = 2
	}
    wrapper.style.maxWidth = `${WIDTH}px`;

    for (let i = 1; i < elements.length; i++) {
		if (window.innerWidth <= 960) {
			elements[0].style.maxWidth = widthElement;
        	elements[i].style.maxWidth = widthElement;
		}
        if (i % COLUMNS == 0) {
            NEW_TOP = (elements[i - COLUMNS].offsetTop + elements[i - COLUMNS].offsetHeight) + GAP;
            elements[i].style.top = `${NEW_TOP}px`;
        } else {
            if (elements[i - COLUMNS]) {
                NEW_TOP = (elements[i - COLUMNS].offsetTop + elements[i - COLUMNS].offsetHeight) + GAP;
                elements[i].style.top = `${NEW_TOP}px`;
            }
            NEW_LEFT = (elements[i - 1].offsetLeft + elements[i - 1].offsetWidth) + GAP;
            elements[i].style.left = `${NEW_LEFT + 1}px`;
        }
    }

    calculateContainerHeight();
}

function calculateHeightInColumn(array) {
	if (array.length !== 0) {
		const elementInColumn = elements.length / COLUMNS;
		const wrapperHeight = array.sort((a, b) => b - a).slice(0, elementInColumn).reduce((a, b) => a + b);
		return wrapperHeight;
	}
	return false;
}

function calculateContainerHeight () {
	const elementsHeightColumnOne = [];
    const elementsHeightColumnTwo = [];
    const elementsHeightColumnThree = [];

    for (let [index, element] of elements.entries()) {

		if (index % COLUMNS == 0) {
			elementsHeightColumnOne.push(element.offsetHeight + GAP);
		} else if (index % COLUMNS == 1) {
			elementsHeightColumnTwo.push(element.offsetHeight + GAP);
		} else {
			elementsHeightColumnThree.push(element.offsetHeight + GAP);
		}
    }

	const heightInColumnOne = calculateHeightInColumn(elementsHeightColumnOne);
	const heightInColumnTwo = calculateHeightInColumn(elementsHeightColumnTwo);
	const heightInColumnThree = calculateHeightInColumn(elementsHeightColumnThree);

	const arrayColumnHeigt = [heightInColumnOne, heightInColumnTwo, heightInColumnThree];

	const height = arrayColumnHeigt.sort((a, b) => b - a).slice(0, 1);
	wrapper.style.height = `${height[0] - GAP}px`
}

function debounce(func, counter){
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func, counter, event);
    };
}

const loadMore = document.querySelector(".load-more");

if (window.innerWidth >= 520) {
	loadMore.addEventListener('click', renderGrid);
	window.addEventListener('DOMContentLoaded', renderGrid);
	window.addEventListener("resize", debounce((e) => {
	    renderGrid();
	}), 100);
}
