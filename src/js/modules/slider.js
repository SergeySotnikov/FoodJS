"use strict";

function slider({
  container,
  slide,
  nextArrow,
  prevArrow,
  totalCounter,
  currentCounter,
  wrapper,
  field,
}) {
  //SLIDER

  const slides = document.querySelectorAll(container),
    slider = document.querySelector(slide),
    previews = document.querySelector(prevArrow),
    next = document.querySelector(nextArrow),
    totalSlides = document.querySelector(totalCounter),
    currentSlides = document.querySelector(currentCounter),
    slidesWrapper = document.querySelector(wrapper),
    slidesField = document.querySelector(field),
    width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex;
  let offset = 0;
  let margin = 20;

  //Carousel Slider

  slidesField.style.width = 100 * slides.length + margin * slides.length + "%";
  slidesField.style.display = "flex";
  slidesField.style.transition = "0.5s all";

  slidesWrapper.style.width = width;
  slidesWrapper.style.overflow = "hidden";

  slides.forEach((slide) => {
    slide.style.width = width;
    slide.style.marginRight = `${margin}px`;
    slide.style.overflow = "hidden";
  });

  slider.style.position = "relative";

  const dotsWrapper = document.createElement("ol"),
    dots = [];
  dotsWrapper.classList.add("carousel-dots-wrapper");
  slider.append(dotsWrapper);

  slides.forEach((item, index) => {
    const dot = document.createElement("li");
    dot.setAttribute("data-slide-to", index + 1);
    dot.style.cssText = `
          box-sizing: content-box;
          flex: 0 1 auto;
          width: 30px;
          height: 6px;
          margin-right: 3px;
          margin-left: 3px;
          cursor: pointer;
          background-color: #fff;
          background-clip: padding-box;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          opacity: .5;
          transition: opacity .6s ease;
      `;

    if (index === 0) {
      dot.style.opacity = "1";
    }

    dotsWrapper.append(dot);
    dots.push(dot);
  });

  if (slides.length < 10) {
    totalSlides.textContent = `0${slides.length}`;
  } else {
    totalSlides.textContent = `${slides.length}`;
  }

  function countSlideIndex(offset) {
    slideIndex = offset / (+width.slice(0, width.length - 2) + margin);

    if (slideIndex < 10) {
      currentSlides.textContent = `0${slideIndex + 1}`;
    } else {
      currentSlides.textContent = `${slideIndex + 1}`;
    }

    dots.forEach((dot) => (dot.style.opacity = ".5"));
    dots[slideIndex].style.opacity = "1";
  }

  countSlideIndex(offset);

  dots.forEach((dot) => {
    dot.addEventListener("click", (event) => {
      const slideTo = event.target.getAttribute("data-slide-to");
      slideIndex = slideTo;
      offset = (+width.slice(0, width.length - 2) + margin) * (slideTo - 1);
      countSlideIndex(offset);
      slidesField.style.transform = `translateX(-${offset}px)`;
    });
  });

  next.addEventListener("click", () => {
    if (
      offset ===
      (+width.slice(0, width.length - 2) + margin) * (slides.length - 1)
    ) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2) + margin;
    }

    countSlideIndex(offset);

    slidesField.style.transform = `translateX(-${offset}px)`;
  });

  previews.addEventListener("click", () => {
    if (offset === 0) {
      offset =
        (+width.slice(0, width.length - 2) + margin) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2) + margin;
    }

    countSlideIndex(offset);

    slidesField.style.transform = `translateX(-${offset}px)`;
  });

  //Simple slider

  /*  showSlides(slideIndex);

      if (slides.length<10) {
          totalSlides.textContent = `0${slides.length}`;
      } else {
          totalSlides.textContent = `${slides.length}`;
      }

      function showSlides(i) {

          if (i > slides.length) {
              slideIndex = 1;
          }
          if (i < 1) {
              slideIndex = slides.length;
          }

          slides.forEach(item => item.style.display = 'none');
          slides[slideIndex-1].style.display = 'block';

          if (slides.length<10) {
              currentSlides.textContent = `0${slideIndex}`;
          } else {
              currentSlides.textContent = `${slideIndex}`;
          }

      }

      function plusSlides(n) {
          showSlides(slideIndex += n);
      }

      previews.addEventListener('click', ()=>{
          plusSlides(-1);
      });

      next.addEventListener('click', ()=>{
          plusSlides(1);
      });*/
}

export default slider;
