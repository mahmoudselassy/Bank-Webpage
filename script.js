'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnsTab = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const featuresSec = document.querySelector('#section--1');
// pop up
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// learn more btn scroll
btnScrollTo.addEventListener('click', function () {
  featuresSec.scrollIntoView({ behavior: 'smooth' });
});
// scrolling to alll sections
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const sec = document.querySelector(e.target.getAttribute('href'));
  sec.scrollIntoView({ behavior: 'smooth' });
});
// 3 tabs handling
btnsTab.addEventListener('click', function (e) {
  if (!e.target.closest('.operations__tab')) return;
  const tabNum = e.target.closest('.operations__tab').getAttribute('data-tab');
  const currentTab = document.querySelector('.operations__tab--active');
  const currentTabCont = document.querySelector('.operations__content--active');
  const nextTab = document.querySelector(`.operations__tab--${tabNum}`);
  const nextTabCont = document.querySelector(`.operations__content--${tabNum}`);
  currentTab.classList.remove('operations__tab--active');
  currentTabCont.classList.remove('operations__content--active');
  nextTab.classList.add('operations__tab--active');
  nextTabCont.classList.add('operations__content--active');
});
// header link at hover
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
    const logo = hovered.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(function (link) {
      if (link !== hovered) {
        link.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', e => handleHover(e, 0.5));
nav.addEventListener('mouseout', e => handleHover(e, 1));
//sticky nav bar
window.addEventListener('scroll', function () {
  if (this.scrollY > 450) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
// reveal section
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
document.querySelectorAll('.section').forEach(function (sec) {
  sectionObserver.observe(sec);
});
// reveal images
const revealImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.setAttribute('src', entry.target.getAttribute('data-src'));
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0.9,
});
document.querySelectorAll('.features__img').forEach(function (img) {
  imgObserver.observe(img);
});
//slider
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const updateDots = function () {
  document.querySelector('.dots__dot--active').classList.remove('dots__dot--active');
  document.querySelector(`button[data-slide="${curSlide}"]`).classList.add('dots__dot--active');
};
const sliderDir = function (curSlide) {
  slides.forEach(function (s, i) {
    s.style.transform = `translateX(${100 * `${i - curSlide}`}%)`;
  });
};
const slideLeft = function () {
  if (curSlide === 0) {
    curSlide = slides.length - 1;
  } else {
    curSlide--;
  }
  sliderDir(curSlide);
  updateDots();
};
const slideRight = function () {
  curSlide++;
  curSlide = curSlide % slides.length;
  sliderDir(curSlide);
  updateDots();
};
sliderDir(0);
sliderBtnLeft.addEventListener('click', slideLeft);
sliderBtnRight.addEventListener('click', slideRight);
document.addEventListener('keydown', function (e) {
  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      break;
    case 'ArrowRight':
      slideRight();
      break;
  }
});
//dots
const dots = document.querySelector('.dots');
slides.forEach(function (_, i) {
  dots.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
});
dots.firstElementChild.classList.add('dots__dot--active');
dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const pressedBtn = e.target;
    const btnOrder = Number(pressedBtn.getAttribute('data-slide'));
    if (btnOrder > curSlide) {
      while (btnOrder !== curSlide) {
        slideRight();
      }
    } else if (btnOrder < curSlide) {
      while (btnOrder !== curSlide) {
        slideLeft();
      }
    }
    updateDots();
  }
});
