const itemsUl = document.getElementById("items");
const cartUl = document.getElementById("cart");
const price = document.getElementById("payment");
const breakdown = document.getElementById("payment-breakdown");
const clear = document.getElementById("clear");
itemsCart = document.getElementById("itemsCart");
const store = localStorage.getItem("store");
let items = [];
clear.onclick = () => {
  localStorage.removeItem("store");
  console.log("cleared");
  fillItems();
  rerender();
};
itemsCart.appendChild(clear);

fillItems();

async function getItems() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  data.forEach((item) => (item.quantity = 10));
  console.log(data);
  itemsSet = [
    await data.forEach((item) =>
      items.push(createItem(item.id, item.title, item.price, item.quantity))
    ),
  ];
  createItemList(items);
}

function fillItems() {
  items = [];
  if (store && store[2]) {
    items = JSON.parse(localStorage.getItem("store"));
    console.log(items);
    createItemList(items);
    rerender();
  } else {
    getItems();
  }
}

function createItem(id, title, price, quantity, amount = 0) {
  return {
    id: id,
    title: title,
    price: price,
    amount: amount,
    quantity,
  };
}

function createItemList(arr) {
  itemsUl.innerHTML = "";
  arr.forEach((item) => {
    let itemRow = document.createElement("li");
    itemRow.innerText = `${item.title} | ${item.price}$ | ${item.quantity} Items left`;
    itemRow.id = `${item.barcod}`;
    if (item.quantity <= 0) {
      itemRow.className = "grey";
    }
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
      let cartRow = document.createElement("li");
      cartRow.innerText = `${item.title} | ${item.amount}`;
      cartRow.id = `${item.barcod}`;
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
  breakdown.innerHTML = "";
  let receipt = "";
  arr.forEach((item) => {
    console.log(item);
    if (item.amount > 0) {
      cartItems++;
      receipt += `<div>
      ${item.title}   | ${item.amount} |           $${item.price} 
        </div>`;
    }
  });

  arr.forEach((item) => {
    if (item.amount > 0) {
      sum += item.amount * item.price;
    }
  });

  if (cartItems > 4 || Boolean(arr.filter((item) => item.amount > 4)[0])) {
    console.log("you got a discount");
    sum = sum * 0.9;
  }

  let receiptRow = document.createElement("div");
  receiptRow.innerHTML = `${receipt}`;
  breakdown.appendChild(receiptRow);
  let priceRow = document.createElement("div");
  priceRow.innerHTML = `Sum: $${sum}`;
  price.appendChild(priceRow);
}

function rerender() {
  createCartList(items);
  createPriceAmount(items);
  createItemList(items);
  localStorage.setItem("store", JSON.stringify(items));
}
