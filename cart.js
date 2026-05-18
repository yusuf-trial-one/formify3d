const FORMIFY_ORDERS_URL = "https://script.google.com/macros/s/AKfycbwLsalix6gLTAznN9OCzDDFUhonmvugfVndzLhcuLGQftANAJRxEwiSN9DEiG4M6Uz6jw/exec";

const PRODUCTS = [
  ["fidget-star","Fidget Star",2,"Fidgets","images/star.jpeg","A pocket-size star that flips and clicks — perfect for focus and fun."],
  ["joystick","Joystick",2,"Fidgets","images/joystick.jpeg","Click, tilt and roll — a satisfying mini joystick for restless thumbs."],
  ["infinity-cube","Infinity Cube",2,"Fidgets","images/infinity_cube.jpeg","Flip forever — an endlessly foldable cube for focus and relaxation."],
  ["cool-passthrough","Cool Passthrough Fidget",2,"Fidgets","images/Cool passthrough fidget.jpeg","Hypnotic motion with a smooth pass-through feel — super tactile."],
  ["bee","Fidget Bee",2,"Fidgets","images/Bee.jpeg","Buzz-worthy fidget with articulated body segments for a snappy feel."],
  ["shark","Flexi Shark",2,"Fidgets","images/Shark.jpeg","A bendy, flexible shark that swims across your desk."],
  ["phone-holder","Phone Holder",2,"Helpers","images/Phone holder.jpeg","A useful stand for keeping your phone at a better angle."],
  ["rabbit","Rabbit",2,"Fun Prints","images/Rabbit.jpeg","A cute decorative print that works well as a small gift."],
  ["orange-pumpkin","Orange Pumpkin",2,"Seasonal","images/Orange_pumpkin.jpeg","A clean seasonal pumpkin print with bright colour."],
  ["halloween-pumpkin","Halloween Pumpkin",2,"Seasonal","images/Halwoeen_pumpkin.jpeg","A spooky themed print for Halloween displays."],
  ["rocket","Rocket",2,"Fun Prints","images/Rocket.jpeg","A bright model-style print with a fun display shape."],
  ["snake","Snake",2,"Fun Prints","images/fakesnake.jpeg","A flexible snake-style print for movement and play."],
  ["clicking-fidget","Clicking Fidget",2,"Fidgets","images/clicking fidget.jpeg","A simple satisfying fidget made for repeated clicks."],
  ["red-pumpkin","Red Pumpkin",2,"Seasonal","images/red pumpkin.jpeg","A different pumpkin colour option with strong visual impact."],
  ["tulip","Tulip",2,"Decor","images/Tulip.jpeg","A shiny green decorative tulip with a clean sculptural shape."],
  ["skull","Skull",2,"Decor","images/Skull.jpeg","A detailed multicolour skull print with a bold finish."],
  ["gold-infinity-cube","Gold Infinity Cube",2,"Fidgets","images/Gold Infinity Cube.jpeg","A gold version of the infinity cube with a premium look."],
  ["honeycomb-box","Honeycomb Box",2,"Helpers","images/Honeycomb box.jpeg","A useful storage box with a honeycomb pattern and sliding lid."],
  ["glow-scythe","Glow Scythe",2,"Custom","images/Glow in the dark scythe.jpeg","A clean scythe-style prop print with a glow-in-the-dark look."],
  ["gold-fidget-star","Gold Fidget Star",2,"Fidgets","images/Fidget star.jpeg","A gold star fidget with layered geometric lines."],
  ["elephant","Elephant",2,"Decor","images/Elephant.jpeg","A stylised elephant print with a smooth curved design."],
  ["surprise-sign","Element of Surprise",2,"Custom","images/Element of surprise sign.jpeg","A funny science-style sign print with raised lettering."],
  ["baby-dragon","Baby Dragon",2,"Fun Prints","images/Cute baby dragon.jpeg","A colourful articulated dragon-style print with lots of detail."],
  ["boat","Boat",2,"Model","images/Boat.jpeg","A classic red 3D printed boat model."]
].map(([id,name,price,category,image,description]) => ({id,name,price,category,image,description}));

function getCart() {
  return JSON.parse(localStorage.getItem("formifyCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("formifyCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
}

function money(value) {
  return "£" + Number(value || 0).toFixed(2);
}

function addToCart(productId, colour, quantity) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const chosenColour = colour || "Any colour";
  const chosenQuantity = Math.max(1, Number(quantity || 1));

  const existing = cart.find(item => item.id === productId && item.colour === chosenColour);
  if (existing) {
    existing.quantity += chosenQuantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      colour: chosenColour,
      quantity: chosenQuantity
    });
  }

  saveCart(cart);
  showToast(product.name + " added to cart");
}

function showToast(message) {
  let toast = document.querySelector(".cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "cart-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderProductGrid(containerId, products = PRODUCTS) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products.map(product => `
    <article class="shop-card">
      <div class="shop-media"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
      <div class="shop-body">
        <span class="shop-tag">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong class="shop-price">${money(product.price)}</strong>

        <label class="shop-label">Colour
          <select data-colour="${product.id}">
            <option value="Any colour">Any colour</option>
            <option value="Red">Red</option>
            <option value="Orange">Orange</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Blue">Blue</option>
            <option value="Purple">Purple</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Rainbow / multicolour">Rainbow / multicolour</option>
          </select>
        </label>

        <label class="shop-label">Quantity
          <input data-qty="${product.id}" type="number" min="1" value="1">
        </label>

        <button class="cart-add-btn" data-add="${product.id}" type="button">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </article>
  `).join("");

  container.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.add;
      const colour = container.querySelector(`[data-colour="${id}"]`).value;
      const quantity = container.querySelector(`[data-qty="${id}"]`).value;
      addToCart(id, colour, quantity);
    });
  });
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const emptyCartEl = document.getElementById("emptyCart");
  if (!cartItemsEl || !cartTotalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartTotalEl.textContent = money(0);
    if (emptyCartEl) emptyCartEl.style.display = "block";
    return;
  }

  if (emptyCartEl) emptyCartEl.style.display = "none";

  cartItemsEl.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-main">
        <h3>${item.name}</h3>
        <p>Colour: ${item.colour}</p>
        <p>${money(item.price)} each</p>
      </div>
      <div class="cart-controls">
        <input type="number" min="1" value="${item.quantity}" data-cart-qty="${index}">
        <button type="button" data-remove="${index}">Remove</button>
      </div>
    </div>
  `).join("");

  cartItemsEl.querySelectorAll("[data-cart-qty]").forEach(input => {
    input.addEventListener("change", () => {
      const cart = getCart();
      cart[Number(input.dataset.cartQty)].quantity = Math.max(1, Number(input.value || 1));
      saveCart(cart);
      renderCart();
    });
  });

  cartItemsEl.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      const cart = getCart();
      cart.splice(Number(button.dataset.remove), 1);
      saveCart(cart);
      renderCart();
    });
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalEl.textContent = money(total);
}

function createOrderId() {
  const d = new Date();
  return "F3D-" + d.getFullYear().toString().slice(-2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") + "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase();
}

async function submitCartOrder(event) {
  event.preventDefault();

  const cart = getCart();
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const form = event.target;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = createOrderId();

  const order = {
    orderId,
    name: form.name.value.trim(),
    emailPhone: form.emailPhone.value.trim(),
    address: form.address.value.trim(),
    notes: form.notes.value.trim(),
    items: cart.map(item => `${item.name} x${item.quantity} (${item.colour})`).join(" | "),
    total: money(total)
  };

  if (!order.name || !order.emailPhone || !order.address) {
    alert("Please fill in your name, email/phone, and delivery address.");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Sending order...";

  try {
    await fetch(FORMIFY_ORDERS_URL, {
      method: "POST",
      body: JSON.stringify(order)
    });

    localStorage.removeItem("formifyCart");
    window.location.href = "order-thanks.html?order=" + encodeURIComponent(orderId);
  } catch (error) {
    alert("Sorry, the order could not be sent. Please try again.");
    submitButton.disabled = false;
    submitButton.textContent = "Send Order";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  const cartForm = document.getElementById("cartForm");
  if (cartForm) {
    renderCart();
    cartForm.addEventListener("submit", submitCartOrder);
  }
});
