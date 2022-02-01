"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const mobileNav = document.querySelector(".open-mobile-nav");
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const mainNav = document.querySelector(".main-nav");

const header = document.querySelector(".header");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

/**************************************************************************
    Modal Window --> Sign-up window
**************************************************************************/

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

// console.log(btnCloseModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/**************************************************************************
    Implementing Navigation Smooth Scrolling on Page
**************************************************************************/

// Navigation menu links
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (
    e.target.classList.contains("nav__link") &&
    !e.target.classList.contains("nav__link--btn")
  ) {
    const id = e.target.getAttribute("href");
    console.log("Nav smooth scroll -->", id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Learn more button in hero section
document
  .querySelector(".btn--scroll-to")
  .addEventListener("click", function (e) {
    e.preventDefault();

    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });

/**************************************************************************
    Implementing Navigation Menu Fade Animation
**************************************************************************/

const handleHover = function (e, opacity) {
  if (
    e.target.classList.contains("nav__link") ||
    e.target.classList.contains("nav__logo")
  ) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = opacity;
    });
    if (e.target.classList.contains("nav__link")) {
      const logo = link.closest(".nav").querySelector("img");
      logo.style.opacity = opacity;
    }
  }
};

nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

/**************************************************************************
    Implementing Sticky Navigation Menu On-Scroll
**************************************************************************/
// Make nav bar sticky shortly before header section ends and disappear shortly before it starts again when scrolling

if (window.innerWidth > 430) {
  const navHeight = nav.getBoundingClientRect().height;
  console.log(navHeight);

  const stickyNav = function (entries) {
    const [entry] = entries;
    console.log("entry:", entry);

    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
}
/**************************************************************************
    Mobile Navigation
**************************************************************************/
mobileNav.addEventListener("click", function () {
  burger.classList.toggle("open");
  mainNav.classList.toggle("open");
});
/**************************************************************************
    Reveal Sections On-Scroll
**************************************************************************/

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  // Remove observer after task is completed to help with speed perfomance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/**************************************************************************
    Lazy Loading Images -- for better speed performance
**************************************************************************/

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  // Remove observer after task is completed to help with speed perfomance
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

/**************************************************************************
    Activating Operations' Tabbed Component
**************************************************************************/

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/**************************************************************************
    Building Out the Reviews Slider
**************************************************************************/

// Turn slider functionality into one big function
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Callback functions for slider arrow buttons
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers for arrow buttons
  btnLeft.addEventListener("click", prevSlide);
  btnRight.addEventListener("click", nextSlide);

  //Event handlers for the keyboard left and right keys
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide(); //using short-circuiting to achieve the same if-statement result
  });

  // Event handler for slider dots
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
