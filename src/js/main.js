"use strict";

import calculator from "./modules/calculator";
import card from "./modules/card";
import form from "./modules/form";
import modal from "./modules/modal";
import slider from "./modules/slider";
import tabs from "./modules/tabs";
import timer from "./modules/timer";

document.addEventListener("DOMContentLoaded", () => {
  calculator();
  card();
  form("form");
  modal("[data-modal]", ".modal");
  slider({
    container: ".offer__slide",
    slide: ".offer__slider",
    nextArrow: ".offer__slider-next",
    prevArrow: ".offer__slider-prev",
    totalCounter: "#total",
    currentCounter: "#current",
    wrapper: ".offer__slider-wrapper",
    field: ".offer__slider-inner",
  });
  tabs(
    ".tabheader__item",
    ".tabcontent",
    ".tabheader__items",
    "tabheader__item_active"
  );
  timer(".timer", "2022-03-01");
});
