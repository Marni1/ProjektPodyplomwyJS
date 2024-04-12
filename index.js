const $offersList = document.querySelector(".offers__list");


let CARS = [];
const renderCar = (car) => {
  const carCard = document.createElement("div");
  carCard.classList.add("offer__car");
  carCard.innerHTML = ` <img src=${car.photo} alt="" class="car__img" />
    <h3 class="car__model">${car.name}</h3>
    <p class="car__brand">${car.brand}</p>
    <p class="car__price">${car.price}</p>
    <button class="car__select">Sprawdź oferte</button>`;
  $offersList.appendChild(carCard);
};
const getCars = async () => {
  const resp = await fetch("./cars.json");
  const data = await resp.json();
  CARS = data;
  CARS.forEach(renderCar);
};

getCars();
