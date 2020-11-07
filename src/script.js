const picturesList = document.querySelector(`.pictures__list`);
const pictures = [...picturesList.querySelectorAll(`.pictures__item`)];
const currentCounter = document.querySelector(`.pictures__nav-counter-current`);
const allCounter = document.querySelector(`.pictures__nav-counter-all`);

const ANIMATION_TIMEOUT = 1000;
let currentSlide = 0;
let touchStartX = null;
let touchEndX = null;
let isTransitioning = true;


currentCounter.textContent = currentSlide + 1;
allCounter.textContent = pictures.length;

picturesList.addEventListener(`touchstart`, (evt) =>{
  touchStartX = evt.targetTouches[0].clientX;
  }
);

picturesList.addEventListener(`touchend`, (evt) => {
  touchEndX = evt.changedTouches[0].clientX;
  handleTouch();
  }
);

const handleTouch = () => {
  const direction = touchStartX - touchEndX;
  if (Math.abs(direction) > 100) {
    currentSlidesChange();
    updateSlides(direction);
  }
};

const updateSlides = (direction) => {
    if (direction < 0) {
      if (currentSlide !== 0) {
        setTimeout(() => {
        currentSlide--;
        changeSlide(currentSlide);
        setCounter(currentSlide);
        }, ANIMATION_TIMEOUT);
      }
    } else if (direction > 0) {
      if (currentSlide !== pictures.length - 1) {
        setTimeout(() => {
          currentSlide++;
          changeSlide(currentSlide);
          setCounter(currentSlide);
        }, ANIMATION_TIMEOUT);
      }
    }
};

const currentSlidesChange = () => {
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

const changeSlide = (currentSlide) => {
  if (currentSlide === 0) {
    pictures[currentSlide].classList.add(`anim-fade-in`, `pictures__item--active`);
    pictures[currentSlide + 1].classList.add(`anim-fade-in`, `pictures__item--next`);
    setTimeout(() => {
      pictures[currentSlide].classList.remove(`anim-fade-in`);
      pictures[currentSlide + 1].classList.remove(`anim-fade-in`);
    }, ANIMATION_TIMEOUT);
  } else if (currentSlide === pictures.length - 1) {
    pictures[currentSlide].classList.add(`anim-fade-in`, `pictures__item--active`);
    pictures[currentSlide - 1].classList.add(`anim-fade-in`, `pictures__item--prev`);
    setTimeout(() => {
      pictures[currentSlide].classList.remove(`anim-fade-in`);
      pictures[currentSlide - 1].classList.remove(`anim-fade-in`);
    }, ANIMATION_TIMEOUT);
  } else {
    pictures[currentSlide].classList.add(`anim-fade-in`, `pictures__item--active`);
    pictures[currentSlide - 1].classList.add(`anim-fade-in`, `pictures__item--prev`);
    pictures[currentSlide + 1].classList.add(`anim-fade-in`, `pictures__item--next`);
    setTimeout(() => {
      pictures[currentSlide].classList.remove(`anim-fade-in`);
      pictures[currentSlide - 1].classList.remove(`anim-fade-in`);
      pictures[currentSlide + 1].classList.remove(`anim-fade-in`);
    }, ANIMATION_TIMEOUT);
  }
};

const setCounter = (currentSlide) => {
  currentCounter.textContent = currentSlide + 1;
};
