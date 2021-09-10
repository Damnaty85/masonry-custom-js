const GAP = 10;
const COLUMNS = 3;
let WIDTH = 1500;
let NEW_TOP;
let NEW_LEFT;
const wrapper = document.querySelector('.grid');
const elements = wrapper.querySelectorAll('.grid__item');

function renderGrid() {
    wrapper.style.maxWidth = `${WIDTH}px`;
    const widthElement = `${parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) / COLUMNS - GAP}px`
    for (let i = 1; i < elements.length; i++) {
        elements[0].style.width = widthElement;
        elements[i].style.width = widthElement;
        if (i % COLUMNS == 0) {
            NEW_TOP = (elements[i - COLUMNS].offsetTop + elements[i - COLUMNS].offsetHeight) + GAP;
            elements[i].style.top = `${NEW_TOP}px`;
        } else {
            if (elements[i - COLUMNS]) {
                NEW_TOP = (elements[i - COLUMNS].offsetTop + elements[i - COLUMNS].offsetHeight) + GAP;
                elements[i].style.top = `${NEW_TOP}px`;
            }
            NEW_LEFT = (elements[i - 1].offsetLeft + elements[i - 1].offsetWidth) + GAP + 1;
            elements[i].style.left = `${NEW_LEFT}px`;
        }
    }
}

window.addEventListener('DOMContentLoaded', renderGrid, false);
window.addEventListener('resize', function () {
    window.clearInterval();
    setInterval(() => {
        renderGrid();
    }, 100)
});

// const positionGridItems = () => {
//     const grid = document.querySelector(".grid");
//     const rowSize = parseInt(getComputedStyle(grid).getPropertyValue("grid-auto-rows"), 10);
//     const rowGap = 10 ? 10 : parseInt(getComputedStyle(grid).getPropertyValue("grid-gap"), 10);
//     const gridItems = grid.querySelectorAll('.grid__item');
//
//     console.log(getComputedStyle(grid))
//
//     gridItems.forEach((item) => {
//         const rowSpan = Math.ceil(
//             (item.offsetHeight + rowGap) / (rowSize + rowGap)
//         );
//         item.style.setProperty("--row-span", rowSpan);
//     });
// };
//
// window.addEventListener("DOMContentLoaded", positionGridItems);
// window.addEventListener("resize", positionGridItems);
