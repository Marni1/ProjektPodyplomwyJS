const $homepage = document.querySelector(".homepage");
const $buypage = document.querySelector(".buypage");
const $offersList = document.querySelector(".offers__list");
const $goBackBtn = document.querySelector(".go-back");
const $navBuyPage = document.querySelector(".nav__buyform");
const $navHomepage = document.querySelector(".nav__homepage");
const $payRadios = document.querySelectorAll("input[name=pay]");
const $filtersContainer = document.querySelector(".search__filters");
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
const $finalPage = document.querySelector(".finalpage");
const $finalPageHeader = document.querySelector(".finalpage__carname");
const $finalPageImg = document.querySelector(".finalpage__img");
const $finalPageTotalcost = document.querySelector(".finalpage__totalcost");
const $finalPagePaymentMehod = document.querySelector(
  ".finalpage__paymentMehod"
);
const $finalpPageBtn = document.querySelector(".finalpage__btn");
const $searchInput = document.querySelector(".search__input");
const $pageNavigation = document.querySelector(".page__pagination");
const $filterIcon = document.querySelector(".filter_icon");
const $sortSelect = document.querySelector(".sort");

let SORT = "NONE";
let CARS = [];
let SELECTEDCAR = null;
let CART = [];
let FORMFIELDS = {
  payment: "gotówka",
  name: "",
  date: null,
  total: null,
};
let FILTERS = [];
const MAXDATE = 14;
let SEARCH_PHRASE = "";
let pageIndex = 0;
let itemsPerPage = 8;

const resetData = () => {
  FORMFIELDS = {
    payment: "gotówka",
    name: "",
    date: null,
    total: null,
  };
  pageIndex = 0;
  SELECTEDCAR = null;
  CART = [];
  SORT = "NONE";
  $payRadios[0].checked = true;
  $nameField.value = "";
  $deliverySelect.value = "";
  SEARCH_PHRASE = "";
  $searchInput.value = "";
  $sortSelect.value = "NONE";
  $filterIcon.classList.remove("active");
  $filtersContainer.classList.remove("active");
  renderFilterOption();
  renderCars();
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
  showFinallPage();
};

const renderPrices = () => {
  const cartCost = CART.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);
  const totalPrice = cartCost + SELECTEDCAR.price;
  FORMFIELDS.total = totalPrice;
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

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const debouncedSearch = debounce((e) => {
  pageIndex = 0;
  SEARCH_PHRASE = e.target.value;
  renderCars();
});

const handleCarPaymentOption = (e) => {
  FORMFIELDS.payment = e.target.value;
};

const handleNameChange = (e) => {
  FORMFIELDS.name = e.target.value;
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
  $finalPage.classList.remove("active");
  $nav.style.display = "flex";
};

const showFinallPage = () => {
  $homepage.classList.remove("active");
  $navHomepage.classList.remove("active");
  $buypage.classList.remove("active");
  $navBuyPage.classList.remove("active");
  $finalPage.classList.add("active");
  $nav.style.display = "none";
  renderFinalPageInfo();
};

const renderFilterOption = () => {
  $filtersContainer.innerHTML = "";
  const filterOptions = CARS.map((car) => {
    return car.brand;
  });
  const removedDuplicates = filterOptions.filter((filter, index) => {
    const indexOfItem = filterOptions.indexOf(filter);
    return indexOfItem === index;
  });
  removedDuplicates.forEach(renderFilter);
};

const renderFilter = (filterName) => {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  FILTERS.push(filterName);
  div.className = "checkbox__container";
  label.innerText = filterName;
  input.type = "checkbox";
  input.checked = true;
  input.value = filterName;
  input.addEventListener("click", (e) => {
    if (FILTERS.includes(e.target.value)) {
      const newFilter = FILTERS.filter((filter) => {
        return filter !== e.target.value;
      });
      FILTERS = newFilter;
    } else {
      FILTERS.push(e.target.value);
    }
    pageIndex = 0;
    renderCars();
  });
  div.append(label, input);
  $filtersContainer.appendChild(div);
};

const selectCar = (car) => {
  SELECTEDCAR = car;
  CART = [];

  renderCarDetails(car);
  renderCarAccesories(car);
  renderCart();
  renderPrices();
  showBuyPage();
};

const renderCarDetails = (car) => {
  $selectedCarDetails.innerHTML = `
  <img class="selectedcar__img" src="${car.photo}" alt="${car.brand} ${car.model}"/>
  <div class='selectedcar__details'>
  <p class="selectedcar__brand">Marka: ${car.brand}</p>
  <p class="selectedcar__model">Model: ${car.model}</p>
  <p class="selectedcar__year">Rocznik: ${car.year}</p>
  <p class="selectedcar__power">Moc: ${car.power}</p>
  <p class="selected__mileage">Przebieg: ${car.mileage} km</p>
  </div>
  `;
};

const renderCar = (car) => {
  const carCard = document.createElement("div");
  carCard.classList.add("offer__car");
  carCard.innerHTML = ` <img src=${car.photo} alt="${car.brand} ${car.model}" class="car__img" />
  <div class="car__description">
  <p class="car__brand">${car.brand}</p>
    <p class="car__model">${car.model}</h3>
    <p class="car__year">Rok: ${car.year}</p>
    <p class="car__millage">Przebieg: ${car.mileage} km</p>
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

const sortOption = (sortValue) => {
  switch (sortValue) {
    case "NONE":
      return (a, b) => 1;

    case "PRICEDESC":
      return (a, b) => a.price - b.price;

    case "PRICEASC":
      return (a, b) => b.price - a.price;

    case "MILDESC":
      return (a, b) => b.mileage - a.mileage;

    case "MILASC":
      return (a, b) => a.mileage - b.mileage;
  }
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

const renderCars = () => {
  $offersList.innerHTML = "";
  const filteredCars = CARS.filter((car) => {
    return FILTERS.includes(car.brand);
  });
  const filteredCarsBySearch = filteredCars.filter(({ brand, model }) => {
    const carBrandLowerCase = brand.toLowerCase();
    const carModelLowetcase = model.toLowerCase();
    const searchPhraseLowerCase = SEARCH_PHRASE.toLowerCase();
    return (
      carBrandLowerCase.includes(searchPhraseLowerCase) ||
      carModelLowetcase.includes(searchPhraseLowerCase)
    );
  });
  const sortedCars = filteredCarsBySearch.sort(sortOption(SORT));
  if (sortedCars.length === 0) {
    renderNoOffersMessage();
    renderPageNav(filteredCarsBySearch);
    return;
  }
  for (
    let i = pageIndex * itemsPerPage;
    i < pageIndex * itemsPerPage + itemsPerPage;
    i++
  ) {
    if (!sortedCars[i]) {
      break;
    }
    renderCar(sortedCars[i]);
  }
  renderPageNav(sortedCars);
};

const renderNoOffersMessage = () => {
  const text = document.createElement("p");
  text.innerText = "BRAK OFERT";
  text.className = "offers__message";
  $offersList.appendChild(text);
};

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

const renderFinalPageInfo = () => {
  $finalPageHeader.innerText = `${SELECTEDCAR.brand} ${SELECTEDCAR.model}`;
  $finalPageImg.src = SELECTEDCAR.photo;
  $finalPageImg.setAttribute(
    "alt",
    `${SELECTEDCAR.brand} ${SELECTEDCAR.model}`
  );
  $finalPagePaymentMehod.innerText = FORMFIELDS.payment;
  $finalPageTotalcost.innerText = FORMFIELDS.total;
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

const renderPageNav = (list) => {
  $pageNavigation.innerHTML = "";
  for (let i = 0; i < list.length / itemsPerPage; i++) {
    const span = document.createElement("span");
    span.innerHTML = i + 1;
    span.className = "page";
    span.addEventListener("click", (e) => {
      pageIndex = e.target.innerHTML - 1;
      renderCars();
    });
    if (i === pageIndex) {
      span.className = "page__active";
    }
    $pageNavigation.append(span);
  }
};

const getCars = async () => {
  const resp = await fetch("./cars.json");
  const data = await resp.json();
  CARS = data;
  renderFilterOption();
};

$goBackBtn.addEventListener("click", showHomePage);
$payRadios.forEach((radio) => {
  radio.addEventListener("click", handleCarPaymentOption);
});
$nameField.addEventListener("input", handleNameChange);
$form.addEventListener("submit", handleSubmit);
$deliverySelect.addEventListener("input", (e) => {
  FORMFIELDS.date = e.target.value;
});
$buyBtn.addEventListener("click", handleSubmit);
$finalpPageBtn.addEventListener("click", () => {
  showHomePage();
  resetData();
});
$searchInput.addEventListener("input", debouncedSearch);
$filterIcon.addEventListener("click", () => {
  $filtersContainer.classList.toggle("active");
  $filterIcon.classList.toggle("active");
});

$sortSelect.addEventListener("input", (e) => {
  SORT = e.target.value;
  renderCars();
});

window.addEventListener("load", async () => {
  await getCars();
  renderCars();
  renderDateOptions();
});
