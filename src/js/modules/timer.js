"use strict";

function timer(id, deadline) {
  //Timer

  const dedline = Date.parse(deadline);

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
      days.innerHTML = `${t.days}`;
      hours.innerHTML = `${t.hours}`;
      minutes.innerHTML = `${t.minutes}`;
      seconds.innerHTML = `${t.seconds}`;

      if (t.total <= 0) {
        clearInterval(timerInterval);
      }
    }

    updateClock();
  }

  setClock(id, dedline);
}

export default timer;
