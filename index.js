const $homepage = document.querySelector(".homepage");
const $buypage = document.querySelector(".buypage");
const $offersList = document.querySelector(".offers__list");
const $goBackBtn = document.querySelector(".go-back");
const $navBuyPage = document.querySelector(".nav__buyform");
const $navHomepage = document.querySelector(".nav__homepage");
const $payRadios = document.querySelectorAll("input[name=pay]");
const $nameField = document.querySelector("#name");
const $deliverySelect = document.querySelector("#delivery");
const $form = document.querySelector(".buypage__form");
const $selectedCarDetails = document.querySelector(".buypage__selectedcar");
const $accessoriesList = document.querySelector(".accessories");
const $summaryCart = document.querySelector(".summary__cart");
const $carCost = document.querySelector(".car__cost");
const $accessoriesCost = document.querySelector(".accessories__cost");
const $totalCost = document.querySelector(".total__cost");
const $buyBtn = document.querySelector(".buypage__buyBtn");
const $formError = document.querySelector(".form__error");
const $nav = document.querySelector("nav");

let CARS = [];
let SELECTEDCAR = null;
let CART = [];
const FORMFIELDS = {
  payment: "gotówka",
  name: "",
  date: null,
};
MAXDATE = 14;
const goToFinallPage = () => {
  $nav.style.display = "none";
};

const handleSubmit = (e) => {
  e.preventDefault();
  const { name, date } = FORMFIELDS;
  $formError.innerText = "";
  const splitName = FORMFIELDS.name.split(" ");
  if (name === "") {
    $formError.innerText = "Pole imię i nazwisko nie może być puste";
    return;
  }
  if (splitName.length < 2) {
    $formError.innerText = "Imię i nazwisko musi być oddzielone spacją";
    return;
  }
  if (date === null) {
    $formError.innerText = "Wybierz date!";
    return;
  }
};
const renderPrices = () => {
  const cartCost = CART.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);
  const totalPrice = cartCost + SELECTEDCAR.price;
  $carCost.innerText = SELECTEDCAR.price;
  $accessoriesCost.innerText = cartCost;
  $totalCost.innerText = totalPrice;
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
  $buypage.classList.toggle("active");
  $navBuyPage.classList.toggle("active");
};
const showBuyPage = () => {
  $homepage.classList.remove("active");
  $navHomepage.classList.remove("active");
  $buypage.classList.add("active");
  $navBuyPage.classList.add("active");
};
const showHomePage = () => {
  $homepage.classList.add("active");
  $navHomepage.classList.add("active");
  $buypage.classList.remove("active");
  $navBuyPage.classList.remove("active");
};

const selectCar = (car) => {
  SELECTEDCAR = car;
  CART = [];

  renderCarDetails(car);
  renderCarAccesories(car);
  renderCart();
  renderPrices();

  //chowanie strony
  showBuyPage();
};
const renderCarDetails = (car) => {
  $selectedCarDetails.innerHTML = `
  <img class="selectedcar__img" src="${car.photo}" />
  <div class='selectedcar__details'>
  <p class="selectedcar__brand">Marka: ${car.brand}</p>
  <p class="selectedcar__model">Model: ${car.model}</p>
  <p class="selectedcar__year">Rocznik: ${car.year}</p>
  <p class="selectedcar__power">Moc: ${car.power}</p>
  <p class="selected__mileage">Przebieg: ${car.mileage}</p>
  </div>
  `;
};
const renderCar = (car) => {
  const carCard = document.createElement("div");
  carCard.classList.add("offer__car");
  carCard.innerHTML = ` <img src=${car.photo} alt="" class="car__img" />
  <div class="car__description">
  <p class="car__brand">${car.brand}</p>
    <p class="car__model">${car.model}</h3>
    <p class="car__year">Rok: ${car.year}</p>
    <p class="car__millage">Przebieg: ${car.mileage}</p>
    <p class="car__engine">Moc: ${car.power}</p>
    <p class="car__price">Cena: ${car.price} zł</p>
    </div`;
  const selectButton = document.createElement("button");
  carCard.addEventListener("click", () => {
    selectCar(car);
  });
  selectButton.innerText = "Sprawdź oferte";
  selectButton.className = "car__select";

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
  item.classList.add("accessories__item");
  button.className = "accessories__button";
  button.innerHTML = `<i class="fa-solid fa-plus accessories__button"></i>`;
  price.innerText = accessorie.name;
  name.innerText = `${accessorie.price}zł`;
  button.addEventListener("click", () => {
    const newCart = CART.concat(accessorie);
    CART = newCart;
    renderCarAccesories(car);
    renderCart();
    renderPrices();
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
  CART.forEach(renderCartItem);
};

const renderCartItem = (item) => {
  const cartItem = document.createElement("li");
  cartItem.innerHTML = `
  <p>${item.name}</p>
  <p>${item.price}zł</p>
  `;
  cartItem.className = "summary__item";
  const button = document.createElement("button");
  button.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  button.className = `cart__button`;
  cartItem.appendChild(button);

  button.addEventListener("click", () => {
    const cartAfterRemove = CART.filter((cartItem) => {
      return item.id !== cartItem.id;
    });
    CART = cartAfterRemove;
    renderCarAccesories(SELECTEDCAR);
    renderCart();
    renderPrices();
  });

  $summaryCart.appendChild(cartItem);
};

const getCars = async () => {
  const resp = await fetch("./cars.json");
  const data = await resp.json();
  CARS = data;
  CARS.forEach(renderCar);
};
getCars();
renderDateOptions();

$goBackBtn.addEventListener("click", showHomePage);
$payRadios.forEach((radio) => {
  radio.addEventListener("click", handleCarPaymentOption);
});

$nameField.addEventListener("input", handleNameChange);
$form.addEventListener("submit", handleSubmit);
$deliverySelect.addEventListener("input", (e) => {
  FORMFIELDS.date = e.target.value;
});

$nav.style.display = "none";
