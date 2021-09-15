const wrapper = document.querySelector('.grid');
const elements = [...wrapper.children];
const loadMore = document.querySelector(".load-more");

if (window.innerWidth >= 560) {
	loadMore.addEventListener('click', renderGrid);
	document.addEventListener('DOMContentLoaded', renderGrid);
	window.addEventListener("orientationchange", renderGrid);
	window.addEventListener("resize", debounce(() => {
		renderGrid();
	}));
}

function renderGrid() {
	let WIDTH = 1170;
	let GAP = window.innerWidth <= WIDTH ? 14 : 35;
	let COLUMNS = window.innerWidth <= 820 ? 2 : 3;

	const widthElement = `${(parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) - GAP * 2) / COLUMNS}px`;
	wrapper.removeAttribute('style');
    wrapper.style.maxWidth = `${WIDTH}px`;

    elements.forEach((element) => {
    	element.removeAttribute('style');
    })

	calculateElementPosition(WIDTH, widthElement, COLUMNS, GAP)
	calculateContainerHeight(COLUMNS, GAP);
}

function calculateElementPosition (width, calcWidth, col, indent) {
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
        timer = setTimeout(func, 100, event);
    };
}
