const picturesList = document.querySelector(`.pictures__list`);
const pictures = [...picturesList.querySelectorAll(`.pictures__item`)];
const paginationContainer = document.querySelector(`.pictures__pagination`);
const paginationList = [...paginationContainer.querySelectorAll(`.pictures__pagination-item`)];
const currentCounter = document.querySelector(`.pictures__nav-counter-current`);
const allCounter = document.querySelector(`.pictures__nav-counter-all`);
const prevSlideBtn = document.querySelector(`.pictures__nav-button--prev`);
const nextSlideBtn = document.querySelector(`.pictures__nav-button--next`);

const ANIMATION_TIMEOUT = 1000;
const PREV_DIRECTION = -150;
const NEXT_DIRECTION = 150;
const PAGINATION_MIN_INDEX = 0;
const PAGINATION_MAX_INDEX = 4;
let currentSlide = 0;
let touchStartX = null;
let touchEndX = null;
let isTransitioning = false;

const currentSlidesChange = () => {
  isTransitioning = true;
  pictures[currentSlide].classList.add(`anim-fade-out`);

  if (currentSlide === 0) {
    pictures[currentSlide + 1].classList.add(`anim-fade-out`);
  } else if (currentSlide === pictures.length - 1) {
    pictures[currentSlide - 1].classList.add(`anim-fade-out`);
  } else {
    pictures[currentSlide + 1].classList.add(`anim-fade-out`);
    pictures[currentSlide - 1].classList.add(`anim-fade-out`);
  }

  setTimeout(() => {
    pictures[currentSlide].classList.remove(`anim-fade-out`);
    pictures[currentSlide].classList.remove(`pictures__item--active`);
    paginationList[currentSlide].classList.remove(`pictures__pagination-item--active`);
    if (currentSlide === 0) {
      pictures[currentSlide + 1].classList.remove(`anim-fade-out`);
      pictures[currentSlide + 1].classList.remove(`pictures__item--next`);
    } else if (currentSlide === pictures.length - 1) {
      pictures[currentSlide - 1].classList.remove(`anim-fade-out`);
      pictures[currentSlide - 1].classList.remove(`pictures__item--prev`);
    } else {
      pictures[currentSlide + 1].classList.remove(`anim-fade-out`);
      pictures[currentSlide - 1].classList.remove(`anim-fade-out`);
      pictures[currentSlide - 1].classList.remove(`pictures__item--prev`);
      pictures[currentSlide + 1].classList.remove(`pictures__item--next`);
    }
  }, ANIMATION_TIMEOUT);
};

const changeActiveSlide = () => {
  disableButtons();
  if (currentSlide === 0) {
    pictures[currentSlide].classList.add(`anim-fade-in`, `pictures__item--active`);
    pictures[currentSlide + 1].classList.add(`anim-fade-in`, `pictures__item--next`);
    setTimeout(() => {
      isTransitioning = false;
      pictures[currentSlide].classList.remove(`anim-fade-in`);
      pictures[currentSlide + 1].classList.remove(`anim-fade-in`);
    }, ANIMATION_TIMEOUT);
  } else if (currentSlide === pictures.length - 1) {
    pictures[currentSlide].classList.add(`anim-fade-in`, `pictures__item--active`);
    pictures[currentSlide - 1].classList.add(`anim-fade-in`, `pictures__item--prev`);
    setTimeout(() => {
      isTransitioning = false;
      pictures[currentSlide].classList.remove(`anim-fade-in`);
      pictures[currentSlide - 1].classList.remove(`anim-fade-in`);
    }, ANIMATION_TIMEOUT);
  } else {
    pictures[currentSlide].classList.add(`anim-fade-in`, `pictures__item--active`);
    pictures[currentSlide - 1].classList.add(`anim-fade-in`, `pictures__item--prev`);
    pictures[currentSlide + 1].classList.add(`anim-fade-in`, `pictures__item--next`);
    setTimeout(() => {
      isTransitioning = false;
      pictures[currentSlide].classList.remove(`anim-fade-in`);
      pictures[currentSlide - 1].classList.remove(`anim-fade-in`);
      pictures[currentSlide + 1].classList.remove(`anim-fade-in`);
    }, ANIMATION_TIMEOUT);
  }
};

const setCounter = () => {
  currentCounter.textContent = currentSlide + 1;
};

const disableButtons = () => {
  if (currentSlide === 0) {
    prevSlideBtn.setAttribute(`disabled`, `true`);
  } else if (currentSlide === pictures.length - 1) {
    nextSlideBtn.setAttribute(`disabled`, `true`);
  } else {
    prevSlideBtn.removeAttribute(`disabled`);
    nextSlideBtn.removeAttribute(`disabled`);
  }
};

const changePagination = () => {
  const visiblePaginationList = [...paginationContainer.querySelectorAll(`.pictures__pagination-item--visible`)];
  if (currentSlide < +visiblePaginationList[PAGINATION_MIN_INDEX].dataset.id) {
    visiblePaginationList.forEach((elm) => {
      elm.classList.remove(`pictures__pagination-item--visible`);
    });
    for (let i = currentSlide; i <= currentSlide + PAGINATION_MAX_INDEX; i++) {
      paginationList[i].classList.add(`pictures__pagination-item--visible`);
    }
  } else if (currentSlide > +visiblePaginationList[PAGINATION_MAX_INDEX].dataset.id) {
    visiblePaginationList.forEach((elm) => {
      elm.classList.remove(`pictures__pagination-item--visible`);
    });
    for (let i = currentSlide; i >= currentSlide - PAGINATION_MAX_INDEX; i--) {
      paginationList[i].classList.add(`pictures__pagination-item--visible`);
    }
  }

  const currentActiveItem = paginationContainer.querySelector(`.pictures__pagination-item--active`);
  if (currentActiveItem) {
    currentActiveItem.classList.remove(`pictures__pagination-item--active`);
  }
  setTimeout(() => {
    paginationList[currentSlide].classList.add(`pictures__pagination-item--active`);
  }, ANIMATION_TIMEOUT);
};

const changeSlide = () => {
  changeActiveSlide();
  changePagination();
  setCounter();
};

const updateSlides = (direction) => {
  currentSlidesChange();
  if (direction < 0) {
    if (currentSlide !== 0) {
      setTimeout(() => {
        currentSlide--;
        changeSlide();
      }, ANIMATION_TIMEOUT);
    }
  } else if (direction > 0) {
    if (currentSlide !== pictures.length - 1) {
      setTimeout(() => {
        currentSlide++;
        changeSlide();
      }, ANIMATION_TIMEOUT);
    }
  }
};

const handleTouch = () => {
  const direction = touchStartX - touchEndX;
  if (Math.abs(direction) > 100) {
    updateSlides(direction);
  }
};

currentCounter.textContent = currentSlide + 1;
allCounter.textContent = pictures.length;

disableButtons();

picturesList.addEventListener(`touchstart`, (evt) => {
  if (!isTransitioning) {
    touchStartX = evt.targetTouches[0].clientX;
  }
});

picturesList.addEventListener(`touchend`, (evt) => {
  if (!isTransitioning) {
    touchEndX = evt.changedTouches[0].clientX;
    handleTouch();
  }
});

prevSlideBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (!isTransitioning) {
    updateSlides(PREV_DIRECTION);
  }
});

nextSlideBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (!isTransitioning) {
    updateSlides(NEXT_DIRECTION);
  }
});

paginationContainer.addEventListener(`click`, (evt) => {
  if (!isTransitioning) {
    const elm = evt.target.closest(`.pictures__pagination-item`);
    currentSlidesChange();
    setTimeout(() => {
      currentSlide = +elm.dataset.id;
      changeSlide();
    }, ANIMATION_TIMEOUT);
  }
});
