"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  renderGrid('.grid');
  eventImageHandler("[data-view-image]");
});
window.addEventListener("orientationchange", debounce(function () {
  renderGrid('.grid');
}));
window.addEventListener("resize", debounce(function () {
  renderGrid('.grid');
}));
var LIMIT_ELEMENT = 5;

function renderGrid(selector) {
  if (document.querySelector(selector)) {
    var wrapper = typeof selector === 'string' ? document.querySelector(selector) : selector;

    var elements = _toConsumableArray(wrapper.children);

    var CONTAINER_WIDTH = 1170;
    var TABLET_WIDTH = 820;
    var MOBILE_WIDTH = 560;
    var INDENT = window.innerWidth <= MOBILE_WIDTH ? 20 : window.innerWidth >= CONTAINER_WIDTH ? 35 : 10;
    var COLUMNS = window.innerWidth <= MOBILE_WIDTH ? 1 : window.innerWidth >= TABLET_WIDTH ? 3 : 2;
    var width = window.innerWidth >= MOBILE_WIDTH ? (parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) - INDENT * 2) / COLUMNS : parseInt(window.getComputedStyle(wrapper).getPropertyValue('width')) / COLUMNS;
    var widthElement = "".concat(width, "px");
    wrapper.removeAttribute('style');
    wrapper.style.maxWidth = "".concat(CONTAINER_WIDTH, "px");
    elements.forEach(function (element) {
      element.removeAttribute('style');
    });
    calculateElementPosition(elements, CONTAINER_WIDTH, widthElement, COLUMNS, INDENT);
    calculateContainerHeight(wrapper, elements, COLUMNS, INDENT);
  } else {
    return false;
  }
}

function calculateElementPosition(elementList, width, calcWidth, col, indent) {
  var top;
  var left;

  for (var i = 1; i < elementList.length; i++) {
    if (window.innerWidth <= width) {
      elementList[0].style.width = calcWidth;
      elementList[i].style.width = calcWidth;
    }

    if (i % col == 0) {
      top = elementList[i - col].offsetTop + elementList[i - col].offsetHeight + indent;
      elementList[i].style.top = "".concat(top, "px");
    } else {
      if (elementList[i - col]) {
        top = elementList[i - col].offsetTop + elementList[i - col].offsetHeight + indent;
        elementList[i].style.top = "".concat(top, "px");
      }

      left = elementList[i - 1].offsetLeft + elementList[i - 1].offsetWidth + indent;
      elementList[i].style.left = "".concat(left + 1, "px");
    }
  }
}

function calculateHeightInColumn(elementList, array, col) {
  if (array.length !== 0) {
    var elementInColumn = Math.ceil(elementList.length / col);
    var wrapperHeight = array.sort(function (a, b) {
      return b - a;
    }).slice(0, elementInColumn).reduce(function (a, b) {
      return a + b;
    });
    return wrapperHeight;
  }

  return false;
}

function calculateContainerHeight(container, elementList, col, indent) {
  var elementsHeightColumnOne = [];
  var elementsHeightColumnTwo = [];
  var elementsHeightColumnThree = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = elementList.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          element = _step$value[1];

      if (index % col == 0) {
        elementsHeightColumnOne.push(element.offsetHeight + indent);
      } else if (index % col == 1) {
        elementsHeightColumnTwo.push(element.offsetHeight + indent);
      } else {
        elementsHeightColumnThree.push(element.offsetHeight + indent);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var heightInColumnOne = calculateHeightInColumn(elementList, elementsHeightColumnOne, col);
  var heightInColumnTwo = calculateHeightInColumn(elementList, elementsHeightColumnTwo, col);
  var heightInColumnThree = calculateHeightInColumn(elementList, elementsHeightColumnThree, col);
  var arrayColumnHeigt = [heightInColumnOne, heightInColumnTwo, heightInColumnThree];
  var height = arrayColumnHeigt.sort(function (a, b) {
    return b - a;
  }).slice(0, 1);
  container.style.height = "".concat(height[0] - indent, "px");
}

function debounce(func) {
  var timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 200, event);
  };
}

function enlargeImageTemplate() {
  return "\n        <div class=\"enlarge-image\">\n            <div class=\"dynamic__container\"></div>\n            <div class=\"enlarge-image__close\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" width=\"20\" height=\"20\">\n                    <path d=\"M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.1677 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632556 19.8731 0.964493 20 1.29619 20C1.62789 20 1.95959 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z\"/>\n                </svg>\n            </div>\n            ".concat(arrowSliderTemplate(), "\n        </div>\n    ");
}

function arrowSliderTemplate() {
  return "\n        <div class=\"enlarge-image__arrow _enlarge-image__next _hidden\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 24\" width=\"14\" height=\"24\">\n\t\t        <path d=\"M0.250067 12C0.250067 11.5967 0.405898 11.1935 0.716903 10.8861L10.5085 1.21157C11.1314 0.596144 12.1413 0.596144 12.7639 1.21157C13.3865 1.82675 13.3865 2.82435 12.7639 3.43983L4.09971 12L12.7636 20.5601C13.3862 21.1756 13.3862 22.1731 12.7636 22.7882C12.141 23.4039 11.1311 23.4039 10.5082 22.7882L0.7166 13.1138C0.405544 12.8063 0.250067 12.4031 0.250067 12Z\" fill=\"white\"/>\n\t        </svg>\n        </div>\n        <div class=\"enlarge-image__arrow _enlarge-image__prev _hidden\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 24\" width=\"14\" height=\"24\">\n                <path d=\"M0.250067 12C0.250067 11.5967 0.405898 11.1935 0.716903 10.8861L10.5085 1.21157C11.1314 0.596144 12.1413 0.596144 12.7639 1.21157C13.3865 1.82675 13.3865 2.82435 12.7639 3.43983L4.09971 12L12.7636 20.5601C13.3862 21.1756 13.3862 22.1731 12.7636 22.7882C12.141 23.4039 11.1311 23.4039 10.5082 22.7882L0.7166 13.1138C0.405544 12.8063 0.250067 12.4031 0.250067 12Z\" fill=\"white\"/>\n            </svg>\n        </div>\n    ";
}

function userDataTemplate(name, date, grade, comentary) {
  return "<div class=\"enlarge-image__data\">\n                <div class=\"enlarge-image__wrapper\">\n                    <div class=\"enlarge-image__left\">\n                        <div class=\"enlarge-image__name\">".concat(name, "</div>\n                        <div class=\"enlarge-image__date\">").concat(date, "</div>\n                    </div>\n                    <div class=\"enlarge-image__right\">\n                        <span>\u041E\u0446\u0435\u043D\u043A\u0430 \u0431\u043B\u044E\u0434\u0443</span>\n                        <div class=\"enlarge-image__grade\">").concat(grade, "</div>\n                    </div>\n                </div>\n                <div class=\"enlarge-image__commentary\">").concat(comentary, "</div>\n            </div>");
}

function eventImageHandler(selector) {
  var IMAGE_WIDTH = window.innerWidth <= 1200 ? window.innerWidth / 1.1 : 1000;
  var IMAGE_HEIGHT = 600 / (1000 / IMAGE_WIDTH);

  var images = _toConsumableArray(document.querySelectorAll(selector));

  var scrollWidth = window.innerWidth - document.documentElement.clientWidth;
  var body = document.querySelector('body');

  for (var i = 0; i < images.length; i++) {
    images[i].setAttribute('data-position', i);
    images[i].addEventListener('click', function (evt) {
      var _this = this;

      evt.preventDefault();
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = "".concat(scrollWidth, "px");
      var userPhoto = this.href;
      var userName = this.dataset.name;
      var userDate = this.dataset.date;
      var userGrade = this.dataset.grade;
      var userCommentary = this.dataset.caption;
      body.insertAdjacentHTML('beforeend', enlargeImageTemplate());
      var container = document.querySelector('.enlarge-image');
      var imageContainer = container.querySelector('.dynamic__container');
      var top = this.getBoundingClientRect().top;
      var left = this.getBoundingClientRect().left;
      var width = this.getBoundingClientRect().width;
      var height = this.getBoundingClientRect().height;
      imageContainer.innerHTML = "<img src=\"".concat(userPhoto, "\">");
      imageContainer.setAttribute('data-index', parseInt(this.dataset.position));
      var image = imageContainer.querySelector('img');
      imageContainer.style = "top:".concat(top, "px;left:").concat(left, "px;width:").concat(width, "px;");
      image.style.height = "".concat(height, "px");
      container.classList.add('_opened');
      setTimeout(function () {
        imageContainer.insertAdjacentHTML('beforeend', userDataTemplate(userName, userDate, userGrade, userCommentary));
        var left = window.innerWidth / 2 - IMAGE_WIDTH / 2;
        var top = window.innerHeight / 2 - (IMAGE_HEIGHT + imageContainer.querySelector('.enlarge-image__data').offsetHeight / 2) / 2;
        imageContainer.style = "width:".concat(IMAGE_WIDTH, "px;left:").concat(left, "px;top:").concat(top, "px");
        image.style.height = "".concat(IMAGE_HEIGHT, "px");
        var next = container.querySelector("._enlarge-image__next");
        var prev = container.querySelector("._enlarge-image__prev");
        setTimeout(function () {
          setTimeout(function () {
            imageContainer.querySelector('.enlarge-image__data').classList.add('_showing');
          }, 300);
          next.classList.remove('_hidden');
          prev.classList.remove('_hidden');
          parseInt(imageContainer.dataset.index) === parseInt(next.dataset.next) && next.classList.add('_disabled');
          parseInt(imageContainer.dataset.index) === parseInt(prev.dataset.prev) && prev.classList.add('_disabled');
          new Swipe('.dynamic__container').onLeft(function () {
            next.click();
          }).run();
          new Swipe('.dynamic__container').onRight(function () {
            prev.click();
          }).run();
          imageContainer.addEventListener('click', function (evt) {
            return evt.stopPropagation();
          });
        }, 100);
        var nextElement = parseInt(_this.dataset.position) >= images.length - 1 ? parseInt(_this.dataset.position) : parseInt(_this.dataset.position) + 1;
        var prevElement = parseInt(_this.dataset.position) <= 0 ? parseInt(_this.dataset.position) : parseInt(_this.dataset.position) - 1;
        next.setAttribute('data-next', nextElement);
        prev.setAttribute('data-prev', prevElement);
        changeImage(next, images, IMAGE_WIDTH, IMAGE_HEIGHT);
        changeImage(prev, images, IMAGE_WIDTH, IMAGE_HEIGHT);
      }, 10);
      closedEnlargeImage(".enlarge-image__close", ".enlarge-image");
      closedEnlargeImage(".enlarge-image", ".enlarge-image");
    });
  }
}

function changeImage(selector, array, imageWidth) {
  var imageHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 277;
  selector.addEventListener('click', function (evt) {
    var _this2 = this;

    evt.stopPropagation();
    var current = document.querySelector('[data-index]');
    var j = Number(current.dataset.index);

    if (this.dataset.next) {
      var thisButton = this;

      if (Number(current.dataset.index) !== Number(this.dataset.next)) {
        var next = array[j += 1];
        var imgSrc = next.getAttribute('href');
        var nextName = next.dataset.name;
        var dateNext = next.dataset.date;
        var gradeNext = next.dataset.grade;
        var commentaryNext = next.dataset.caption;
        setTimeout(function () {
          current.style = "width: ".concat(imageWidth, "px; left: -100%; top: 50%; transform: translate3d(-50%, -50%, 0);");
          var clone = current.cloneNode(true);
          clone.classList.add('_rerender-image');
          current.parentElement.insertAdjacentElement('afterbegin', clone);
          clone.style = "width: ".concat(imageWidth, "px; right: -100%; top: 50%; transform: translate3d(100%, -50%, 0);");
          setTimeout(function () {
            current.remove();
            clone.style = "width: ".concat(imageWidth, "px; right: 50%; top: 50%; transform: translate3d(50%, -50%, 0);");
            clone.innerHTML = "<img src=\"".concat(imgSrc, "\">");
            clone.querySelector('img').style.height = "".concat(imageHeight, "px");
            clone.insertAdjacentHTML('beforeend', userDataTemplate(nextName, dateNext, gradeNext, commentaryNext));
            clone.querySelector('.enlarge-image__data').classList.add('_showing');
            clone.setAttribute('data-index', _this2.dataset.next);
            var calcNext = parseInt(_this2.dataset.next) === array.length - 1 ? array.length - 1 : parseInt(_this2.dataset.next) + 1;
            var calcPrev = parseInt(clone.dataset.index) === 1 ? 0 : parseInt(_this2.nextElementSibling.dataset.prev) + 1;

            _this2.setAttribute('data-next', calcNext);

            _this2.nextElementSibling.setAttribute('data-prev', calcPrev);

            current = clone;
            setTimeout(function () {
              current.style = "width:".concat(imageWidth, "px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);");
              current.classList.remove('_rerender-image');
              new Swipe(current).onLeft(function () {
                thisButton.click();
              }).run();
              new Swipe(current).onRight(function () {
                thisButton.nextElementSibling.click();
              }).run();
              current.addEventListener('click', function (evt) {
                return evt.stopPropagation();
              });
              parseInt(current.dataset.index) === parseInt(_this2.dataset.next) && _this2.classList.add('_disabled');
              _this2.nextElementSibling.classList.contains('_disabled') && _this2.nextElementSibling.classList.remove('_disabled');
            });
          }, 155);
        });
      }
    }

    if (this.dataset.prev) {
      var _thisButton = this;

      if (Number(current.dataset.index) !== Number(this.dataset.prev)) {
        var prev = array[j -= 1];

        var _imgSrc = prev.getAttribute('href');

        var prevName = prev.dataset.name;
        var datePrev = prev.dataset.date;
        var gradePrev = prev.dataset.grade;
        var commentaryPrev = prev.dataset.caption;
        setTimeout(function () {
          current.style = "width: ".concat(imageWidth, "px; left: 100%; top: 50%; transform: translate3d(100%, -50%, 0);");
          var clone = current.cloneNode(true);
          clone.classList.add('_rerender-image');
          current.parentElement.insertAdjacentElement('afterbegin', clone);
          clone.style = "width: ".concat(imageWidth, "px; left: -100%; top: 50%; transform: translate3d(-100%, -50%, 0);");
          setTimeout(function () {
            current.remove();
            clone.innerHTML = "<img src=\"".concat(_imgSrc, "\">");
            clone.querySelector('img').style.height = "".concat(imageHeight, "px");
            clone.insertAdjacentHTML('beforeend', userDataTemplate(prevName, datePrev, gradePrev, commentaryPrev));
            clone.querySelector('.enlarge-image__data').classList.add('_showing');
            clone.setAttribute('data-index', _this2.dataset.prev);
            var calcPrev = parseInt(clone.dataset.index) === 0 ? 0 : parseInt(_this2.dataset.prev) - 1;
            var calcNext = parseInt(clone.dataset.index) === array.length - 2 ? array.length - 1 : parseInt(_this2.previousElementSibling.dataset.next) - 1;

            _this2.setAttribute('data-prev', calcPrev);

            _this2.previousElementSibling.setAttribute('data-next', calcNext);

            current = clone;
            setTimeout(function () {
              current.style = "width:".concat(imageWidth, "px;left:50%;top:50%;transform: translate3d(-50%, -50%, 0);");
              current.classList.remove('_rerender-image');
              new Swipe(current).onLeft(function () {
                _thisButton.previousElementSibling.click();
              }).run();
              new Swipe(current).onRight(function () {
                _thisButton.click();
              }).run();
              current.addEventListener('click', function (evt) {
                return evt.stopPropagation();
              });
              parseInt(clone.dataset.index) === parseInt(_this2.dataset.prev) && _this2.classList.add('_disabled');
              _this2.previousElementSibling.classList.contains('_disabled') && _this2.previousElementSibling.classList.remove('_disabled');
            });
          }, 155);
        });
      }
    }
  });
}

;

function closedEnlargeImage(selector, elementClose) {
  var close = document.querySelector(selector);
  var elementClosed = document.querySelector(elementClose);
  document.addEventListener('keydown', function (evt) {
    if (evt.code === "Escape") {
      elementClosed.remove();
    }
  });
  close.addEventListener('click', function () {
    elementClosed.remove();
    document.body.style.overflow = 'unset';
    document.body.style.paddingRight = "unset";
  });
}

var Swipe =
/*#__PURE__*/
function () {
  function Swipe(element) {
    _classCallCheck(this, Swipe);

    this.xDown = null;
    this.yDown = null;
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.element.addEventListener('touchstart', function (evt) {
      this.xDown = evt.touches[0].clientX;
      this.yDown = evt.touches[0].clientY;
    }.bind(this), false);
  }

  _createClass(Swipe, [{
    key: "onLeft",
    value: function onLeft(callback) {
      this.onLeft = callback;
      return this;
    }
  }, {
    key: "onRight",
    value: function onRight(callback) {
      this.onRight = callback;
      return this;
    }
  }, {
    key: "onUp",
    value: function onUp(callback) {
      this.onUp = callback;
      return this;
    }
  }, {
    key: "onDown",
    value: function onDown(callback) {
      this.onDown = callback;
      return this;
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(evt) {
      if (!this.xDown || !this.yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      this.xDiff = this.xDown - xUp;
      this.yDiff = this.yDown - yUp;

      if (Math.abs(this.xDiff) !== 0) {
        if (this.xDiff > 2) {
          typeof this.onLeft === "function" && this.onLeft();
        } else if (this.xDiff < -2) {
          typeof this.onRight === "function" && this.onRight();
        }
      }

      if (Math.abs(this.yDiff) !== 0) {
        if (this.yDiff > 2) {
          typeof this.onUp === "function" && this.onUp();
        } else if (this.yDiff < -2) {
          typeof this.onDown === "function" && this.onDown();
        }
      }

      this.xDown = null;
      this.yDown = null;
    }
  }, {
    key: "run",
    value: function run() {
      this.element.addEventListener('touchmove', function (evt) {
        this.handleTouchMove(evt);
      }.bind(this), false);
    }
  }]);

  return Swipe;
}();