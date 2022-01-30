"use strict";

function card() {
  // Card

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
}

module.exports = card;
