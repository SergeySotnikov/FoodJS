"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const calculator = require("./modules/calculator"),
    card = require("./modules/card"),
    form = require("./modules/form"),
    modal = require("./modules/modal"),
    slider = require("./modules/slider"),
    tabs = require("./modules/tabs"),
    timer = require("./modules/timer");

  calculator();
  card();
  form();
  modal();
  slider();
  tabs();
  timer();
});
