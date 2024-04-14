const $homepage = document.querySelector(".homepage");
const $buyform = document.querySelector(".buypage");
const $offersList = document.querySelector(".offers__list");
const $goBackBtn = document.querySelector(".go-back");
const $navBuyForm = document.querySelector(".nav__buyform");
const $navHomepage = document.querySelector(".nav__homepage");
const $payRadios = document.querySelectorAll("input[name=pay]");
const $nameField = document.querySelector("#name");
const $deliverySelect = document.querySelector("#delivery");
const $form = document.querySelector(".buypage__form");
const $selectedCarDetails = document.querySelector(".buypage__selectedcar");
const $accessoriesList = document.querySelector(".accessories");
const $summaryCart = document.querySelector(".summary__cart");

let CARS = [];
let SELECTEDCAR = null;
let CART = [];
const FORMFIELDS = {
  payment: "gotówka",
  name: "",
  date: null,
};
MAXDATE = 14;

const calculateTotalPRICE = () => {
  const cartCost = CART.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);
  console.log(cartCost);
};
const generateDate = (daysaHead = 0) => {
  const date = new Date();
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + daysaHead);
  const convertedNewDate = newDate.toLocaleDateString();
  return convertedNewDate;
};
const renderDateOptions = () => {
  for (let i = 1; i <= MAXDATE; i++) {
    let option = document.createElement("option");
    const date = generateDate(i);
    option.value = date;
    option.innerText = date;
    if (i === 1) {
      FORMFIELDS.date = date;
    }
    $deliverySelect.appendChild(option);
  }
};

const handleCarPaymentOption = (e) => {
  FORMFIELDS.payment = e.target.value;
  console.log(FORMFIELDS);
};
const handleNameChange = (e) => {
  FORMFIELDS.name = e.target.value;
  console.log(FORMFIELDS);
};
const changePages = () => {
  $homepage.classList.toggle("active");
  $navHomepage.classList.toggle("active");
  $buyform.classList.toggle("active");
  $navBuyForm.classList.toggle("active");
};

const selectCar = (car) => {
  SELECTEDCAR = car;

  renderCarDetails(car);
  renderCarAccesories(car);

  //chowanie strony
  changePages();
};
const renderCarDetails = (car) => {
  $selectedCarDetails.innerHTML = `
  <img class="selectedcar__img" />
  <p class="selectedcar__brand">${car.brand}</p>
  <p class="selectedcar__model">${car.model}</p>
  <p class="selectedcar__year">${car.year}</p>
  <p class="selectedcar__power">${car.power}</p>
  <p class="selected__mileage">${car.mileage}</p>
  
  `;
};
const renderCar = (car) => {
  const carCard = document.createElement("div");
  carCard.classList.add("offer__car");
  carCard.innerHTML = ` <img src=${car.photo} alt="" class="car__img" />
  <p class="car__brand">${car.brand}</p>
    <p class="car__model">${car.model}</h3>
    <p class="car__year">Rok: ${car.year}</p>
    <p class="car__millage">Przebieg: ${car.mileage}</p>
    <p class="car__engine">Moc: ${car.power}</p>
    <p class="car__price">Cena: ${car.price}</p>`;
  const selectButton = document.createElement("button");
  selectButton.innerText = "Sprawdź oferte";
  selectButton.className = "car__select";
  selectButton.addEventListener("click", () => {
    selectCar(car);
  });
  carCard.appendChild(selectButton);
  $offersList.appendChild(carCard);
};
const renderCarAccesories = (car) => {
  $accessoriesList.innerHTML = "";
  const accesories = car.accessories.filter((accessorie) => {
    return !CART.find((item) => {
      return item.id === accessorie.id;
    });
  });
  if (accesories.length === 0) {
    const info = document.createElement("li");
    info.innerText = "Samochód nie posiada więcej dodatków";
    $accessoriesList.appendChild(info);
    return;
  }
  accesories.forEach((accesorie) => renderAcessorie(accesorie, car));
};

const renderAcessorie = (accessorie, car) => {
  const item = document.createElement("li");
  const price = document.createElement("p");
  const name = document.createElement("p");
  const button = document.createElement("button");
  button.innerText = "+";
  price.innerText = accessorie.name;
  name.innerText = accessorie.price;
  button.addEventListener("click", () => {
    const newCart = CART.concat(accessorie);
    CART = newCart;
    renderCarAccesories(car);
    renderCart();
    calculateTotalPRICE();
  });
  item.append(price, name, button);
  $accessoriesList.appendChild(item);
};
const renderCars = (carsList, filter) => {};
const renderCart = () => {
  $summaryCart.innerHTML = "";
  if (CART.length === 0) {
    const info = document.createElement("li");
    info.innerText = "Brak wybranych akcesoriów";
    $summaryCart.appendChild(info);
    return;
  }
  CART.forEach((item) => {
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `
    <p>${item.name}</p>
    <p>${item.price}</p>
    `;
    const button = document.createElement("button");
    button.innerText = "-";
    cartItem.appendChild(button);
    button.addEventListener("click", () => {
      const cartAfterRemove = CART.filter((cartItem) => {
        return item.id !== cartItem.id;
      });
      CART = cartAfterRemove;
      renderCarAccesories(SELECTEDCAR);
      renderCart();
      calculateTotalPRICE();
    });

    $summaryCart.appendChild(cartItem);
  });
};

const getCars = async () => {
  const resp = await fetch("./cars.json");
  const data = await resp.json();
  CARS = data;
  CARS.forEach(renderCar);
};
getCars();
renderDateOptions();

$goBackBtn.addEventListener("click", changePages);
$payRadios.forEach((radio) => {
  radio.addEventListener("click", handleCarPaymentOption);
});
$nameField.addEventListener("input", handleNameChange);
