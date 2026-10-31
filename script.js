const cards = document.querySelectorAll(".collections .card");

cards.forEach(function (card) {
  card.addEventListener("click", function (event) {
    if (card.getAttribute("href") === "#") {
      event.preventDefault();
    }

    cards.forEach(function (c) {
      c.classList.remove("is-active");
    });

    card.classList.add("is-active");
  });
});

const products = document.querySelectorAll(".bestsellers .product");
const cartCount = document.querySelector("#cart-count");
const cartOpen = document.querySelector("#cart-open");
const cartPanel = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartClose = document.querySelector(".cart__close");
const cartItems = document.querySelector(".cart__items");
const cartTotal = document.querySelector("#cart-total");
const cartCheckout = document.querySelector(".cart__checkout");

document.body.appendChild(cartOverlay);
document.body.appendChild(cartPanel);

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart = cart.map(function (item) {
  item.qty = item.qty || 1;
  return item;
});

const toast = document.createElement("div");
toast.className = "bag-toast";
document.body.appendChild(toast);

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("is-visible");

  setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 1800);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  let count = 0;
  let total = 0;
  let html = "";

  cart.forEach(function (item, index) {
    count += item.qty;
    total += item.price * item.qty;

    html += `
      <div class="cart-item">
        <div class="cart-item__info">
          <h3>${item.name}${item.qty > 1 ? " × " + item.qty : ""}</h3>
          <p>${item.color}</p>
        </div>
        <div class="cart-item__side">
          <strong>$${item.price * item.qty}</strong>
          <button type="button" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
  });

  if (cart.length === 0) {
    html = '<p class="cart__empty">Your bag is empty.</p>';
  }

  cartItems.innerHTML = html;
  cartTotal.textContent = "$" + total;
  cartCount.textContent = count;
  cartCount.classList.toggle("is-hidden", count === 0);
}

function openCart() {
  cartPanel.classList.add("is-open");
  cartOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

cartOpen.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCart();
  }
});

cartItems.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
});

cartCheckout.addEventListener("click", function () {
  showToast("Checkout is not connected yet");
});

products.forEach(function (product) {
  const button = product.querySelector(".add-btn");
  const swatches = product.querySelectorAll(".swatch");

  swatches.forEach(function (swatch) {
    swatch.addEventListener("click", function () {
      swatches.forEach(function (s) {
        s.classList.remove("is-selected");
      });
      swatch.classList.add("is-selected");
    });
  });

  button.addEventListener("click", function () {
    const name = product.dataset.name;
    const color = product.querySelector(".swatch.is-selected").dataset.color;

    const existing = cart.find(function (item) {
      return item.name === name && item.color === color;
    });

    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        name: name,
        price: Number(product.dataset.price),
        color: color,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    showToast(name + " (" + color + ") added to bag");

    button.textContent = "ADDED ✓";
    setTimeout(function () {
      button.textContent = "ADD TO BAG";
    }, 1500);
  });
});

renderCart();