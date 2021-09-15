const wrapper = document.querySelector('.grid');
const elements = [...wrapper.children];
const loadMore = document.querySelector(".load-more");

if (window.innerWidth >= 521) {
	loadMore.addEventListener('click', renderGrid);
	document.addEventListener('DOMContentLoaded', renderGrid);
	window.addEventListener("orientationchange", function() {
		renderGrid();
	});
	window.addEventListener("resize", renderGrid);
}

function renderGrid() {
	let WIDTH = 1170;
	let GAP = window.innerWidth <= WIDTH ? 14 : 35;
	let COLUMNS = window.innerWidth <= 768 ? 2 : 3;
	let NEW_TOP;
	let NEW_LEFT;

	const widthElement = `${(parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) - GAP * 2) / COLUMNS}px`;
    	wrapper.style.maxWidth = `${WIDTH}px`;

    for (let i = 1; i < elements.length; i++) {
	if (window.innerWidth <= WIDTH) {
		elements[0].style.width = widthElement;
        	elements[i].style.width = widthElement;
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

	calculateContainerHeight(COLUMNS, GAP);
}

function calculateHeightInColumn(array, col) {
	if (array.length !== 0) {
		const elementInColumn = elements.length / col;
		const wrapperHeight = array.sort((a, b) => b - a).slice(0, elementInColumn).reduce((a, b) => a + b);
		return wrapperHeight;
	}
	return false;
}

function calculateContainerHeight (col, indent) {
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

function debounce(func){
    var timer;
    return function(event){
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 500, event);
    };
}
