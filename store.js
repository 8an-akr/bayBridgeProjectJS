const itemsUl = document.getElementById("items");
const cartUl = document.getElementById("cart");
const price = document.getElementById("payment");
const clear = document.getElementById("clear");
const itemsCart = document.getElementById("itemsCart");
const store = localStorage.getItem("store");
let items = [];
clear.onclick = () => {
  localStorage.removeItem("store");
  fillItems();
  try {
    rerender();
  } catch (error) {
    setTimeout(() => fillItems(), "1000");
  }
};
itemsCart.appendChild(clear);

fillItems();

async function getItems() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  console.log(data);
  data.forEach((item) => (item.quantity = 10));
  itemsSet = [
    await data.forEach((item) =>
      items.push(
        createItem(
          item.id,
          item.title,
          item.price,
          item.quantity,
          item.category,
          item.description,
          item.image,
          item.rating
        )
      )
    ),
  ];
  createItemList(items);
}

function fillItems() {
  items = [];
  if (store && store[2]) {
    items = JSON.parse(localStorage.getItem("store"));
    createItemList(items);
    rerender();
  } else {
    getItems();
  }
}

function createItem(
  id,
  title,
  price,
  quantity,
  category,
  description,
  image,
  rating,
  amount = 0
) {
  return {
    id,
    title,
    price,
    quantity,
    category,
    description,
    image,
    rating,
    amount,
  };
}

async function createItemList(arr) {
  itemsUl.innerHTML = "";
  await arr.forEach((item) => {
    let itemRow = document.createElement("div");
    itemRow.className = "product-card";
    itemRow.innerHTML = `
    <div class="product-image">
      <img width="100" 
      height="150" src=${item.image} alt="" />
    </div>
    <div class="product-info">
      <h4> ${item.title} </h4> <h5> ${item.price} </h5>
      <h6>
        ✰${item.rating.rate} Sold:${item.rating.count}
      </h6>
    </div>
  `;
    itemRow.onclick = () => {
      if (item.quantity > 0) {
        item.amount++;
        item.quantity--;
        rerender();
      }
    };
    itemsUl.appendChild(itemRow);
  });
}

function createCartList(arr) {
  cartUl.innerHTML = "";
  arr.forEach((item) => {
    if (item.amount > 0) {
      let cartRow = document.createElement("div");
      cartRow.innerText = `${item.title} | ${item.amount} | $${item.price}`;
      cartRow.className = `item`;
      cartRow.id = `${item.id}`;
      cartRow.onclick = () => {
        if (item.amount > 0) {
          item.amount--;
          item.quantity++;
        }
        rerender();
      };
      cartUl.appendChild(cartRow);
    }
  });
}

function createPriceAmount(arr) {
  let cartItems = 0;
  let sum = 0;
  price.innerHTML = "";

  arr.forEach((item) => {
    if (item.amount > 0) {
      cartItems++;
      sum += item.amount * item.price;
    }
  });

  if (cartItems === 0) {
    clear.className = "cart-empty";
    itemsCart.className = "cart-empty";
  } else {
    clear.className = "clear-noDis";
    itemsCart.className = "container";
  }
  if (cartItems > 4 || Boolean(arr.filter((item) => item.amount > 4)[0])) {
    sum = sum * 0.9;
    document.getElementById("discount").className = "discount";
    clear.className = "clear";
  } else {
    document.getElementById("discount").className = "cart-empty";
  }
  let priceRow = document.createElement("div");
  priceRow.innerHTML = `Sum: $${Math.round(sum)}`;
  price.appendChild(priceRow);
}

function rerender() {
  createCartList(items);
  createPriceAmount(items);
  createItemList(items);
  localStorage.setItem("store", JSON.stringify(items));
}
