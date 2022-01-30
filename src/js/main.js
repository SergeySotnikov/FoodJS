"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //tabs

  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsParent = document.querySelector(".tabheader__items"),
    tabsContent = document.querySelectorAll(".tabcontent");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target === item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //timer

  const dedline = Date.parse("2022-02-30");

  function getTimeRemaining(endTime) {
    const t = endTime - Date.parse(new Date());
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((t / (1000 * 60)) % 60);
    const seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function setClock(selector, endTime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timerInterval = setInterval(updateClock, 1000);

    function updateClock() {
      const t = getTimeRemaining(endTime);
      days.innerHTML = t.days;
      hours.innerHTML = t.hours;
      minutes.innerHTML = t.minutes;
      seconds.innerHTML = t.seconds;

      if (t.total <= 0) {
        clearInterval(timerInterval);
      }
    }

    updateClock();
  }

  setClock(".timer", dedline);

  // modal

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal();
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") === "") {
      closeModal();
    }
  });

  function openModal() {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  // card
  class Card {
    constructor(src, alt, title, desc, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.desc = desc;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 2.45;
      this.changeToBYN();
    }

    changeToBYN() {
      this.price = (this.price * this.transfer).toFixed(2);
    }

    render() {
      const element = document.createElement("div");
      element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.desc}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> BYN/день</div>
                    </div>
                </div>`;
      this.parent.append(element);
    }
  }

  //Get resource from card is from server
  const getResource = async (url) => {
    const result = await fetch(url);

    if (!result.ok) {
      throw new Error(`Could not fetch ${url}, status: ${result.status} `);
    }

    return await result.json();
  };

  getResource(" http://localhost:3000/menu").then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new Card(
        img,
        altimg,
        title,
        descr,
        price,
        ".menu__field .container"
      ).render();
    });
  });

  //forms
  const forms = document.querySelectorAll("form");

  const message = {
    loading: "Загрузка",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так....",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  //POST
  const postData = async (url, data) => {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });

    return await result.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("div");
      statusMessage.classList.add("status");
      statusMessage.textContent = message.loading;
      form.append(statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((request) => {
          console.log(request);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.classList.add("hide");
    openModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
        <div class ="modal__content"> 
            <div class="modal__close" data-close="">×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.remove("hide");
      closeModal();
    }, 3000);
  }

  //SLIDER

  const slides = document.querySelectorAll(".offer__slide"),
    slider = document.querySelector(".offer__slider"),
    previews = document.querySelector(".offer__slider-prev"),
    next = document.querySelector(".offer__slider-next"),
    totalSlides = document.querySelector("#total"),
    currentSlides = document.querySelector("#current"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesField = document.querySelector(".offer__slider-inner"),
    width = window.getComputedStyle(slidesWrapper).width;
  console.log();

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

  // Calculator
  const result = document.querySelector(".calculating__result span");

  let sex, height, weight, age, ratio;

  if (localStorage.getItem("sex")) {
    sex = localStorage.getItem("sex");
  } else {
    sex = "famele";
    localStorage.setItem("sex", "famele");
  }

  if (localStorage.getItem("ratio")) {
    ratio = localStorage.getItem("ratio");
  } else {
    ratio = 1.375;
    localStorage.setItem("ratio", 1.375);
  }

  function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((item) => {
      item.classList.remove(activeClass);

      if (item.getAttribute("id") === localStorage.getItem("sex")) {
        item.classList.add(activeClass);
      }
      if (item.getAttribute("data-ratio") === localStorage.getItem("ratio")) {
        item.classList.add(activeClass);
      }
    });
  }

  initLocalSettings("#gender div", "calculating__choose-item_active");
  initLocalSettings(
    ".calculating__choose_big div",
    "calculating__choose-item_active"
  );

  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = `____`;
      return;
    }
    if (sex === "famele") {
      result.textContent = Math.round(
        (447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
      );
    } else {
      result.textContent = Math.round(
        (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
      );
    }
  }

  calcTotal();

  function getStaticInformation(parentSelector, activeClass) {
    const elements = document.querySelectorAll(`${parentSelector} div`);

    elements.forEach((item) => {
      item.addEventListener("click", (event) => {
        if (event.target.getAttribute("data-ratio")) {
          ratio = +event.target.getAttribute("data-ratio");
          localStorage.setItem(
            "ratio",
            +event.target.getAttribute("data-ratio")
          );
        } else {
          sex = event.target.getAttribute("id");
          localStorage.setItem("sex", event.target.getAttribute("id"));
        }

        elements.forEach((item) => {
          item.classList.remove(activeClass);
        });

        event.target.classList.add(activeClass);

        calcTotal();
      });
    });
  }

  getStaticInformation("#gender", "calculating__choose-item_active");
  getStaticInformation(
    ".calculating__choose_big",
    "calculating__choose-item_active"
  );

  function getDynamicInformation(selector) {
    const input = document.querySelector(selector);

    input.addEventListener("input", () => {
      if (input.value.match(/\D/g)) {
        input.style.border = "1px solid red";
      } else {
        input.style.border = "none";
      }

      switch (input.getAttribute("id")) {
        case "height":
          height = +input.value;
          break;
        case "weight":
          weight = +input.value;
          break;
        case "age":
          age = +input.value;
          break;
      }
      calcTotal();
    });
  }

  getDynamicInformation("#height");
  getDynamicInformation("#weight");
  getDynamicInformation("#age");
});
