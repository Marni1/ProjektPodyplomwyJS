const $homepage = document.querySelector(".homepage");
const $buyform = document.querySelector(".buypage");
const $offersList = document.querySelector(".offers__list");
const $goBackBtn = document.querySelector(".go-back");
const $navBuyForm = document.querySelector(".nav__buyform");
const $navHomepage = document.querySelector(".nav__homepage");
const $payRadios = document.querySelectorAll("input[name=pay]");
const $nameField = document.querySelector("#name");
const $form = document.querySelector(".buypage__form");

let CARS = [];
let SELECTEDCAR = null;
const FORMFIELDS = {
  payment: "gotówka",
  name: "",
  date: null,
};

const handleCarPaymentOption = (e) => {
  FORMFIELDS.payment = e.target.value;
  console.log(FORMFIELDS);
};
const handleNameChange = (e) => {
  FORMFIELDS.name = e.target.value;
  console.log(FORMFIELDS);
};
console.log($payRadios);
const changePages = () => {
  $homepage.classList.toggle("active");
  $navHomepage.classList.toggle("active");
  $buyform.classList.toggle("active");
  $navBuyForm.classList.toggle("active");
};

const selectCar = (car) => {
  selectedCar = car;
  //render na innej stronie

  //chowanie strony
  changePages();
};

const renderCar = (car) => {
  const carCard = document.createElement("div");
  carCard.classList.add("offer__car");
  carCard.innerHTML = ` <img src=${car.photo} alt="" class="car__img" />
    <h3 class="car__model">${car.name}</h3>
    <p class="car__brand">${car.brand}</p>
    <p class="car__price">${car.price}</p>`;
  const selectButton = document.createElement("button");
  selectButton.innerText = "Sprawdź oferte";
  selectButton.className = "car__select";
  selectButton.addEventListener("click", () => {
    selectCar(car);
  });
  carCard.appendChild(selectButton);
  $offersList.appendChild(carCard);
};
const renderCars = (carsList, filter) => {};

const getCars = async () => {
  const resp = await fetch("./cars.json");
  const data = await resp.json();
  CARS = data;
  CARS.forEach(renderCar);
};

getCars();

$goBackBtn.addEventListener("click", changePages);
$payRadios.forEach((radio) => {
  radio.addEventListener("click", handleCarPaymentOption);
});
$nameField.addEventListener("input", handleNameChange);
