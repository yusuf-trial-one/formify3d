const FORMIFY_ORDERS_URL = "https://script.google.com/macros/s/AKfycbwLsalix6gLTAznN9OCzDDFUhonmvugfVndzLhcuLGQftANAJRxEwiSN9DEiG4M6Uz6jw/exec";

const PRODUCTS = [
  ["fidget-star","Fidget Star",2,"Fidgets","images/star.jpeg","A pocket-size star that flips and clicks — perfect for focus and fun."],
  ["joystick","Joystick",2,"Fidgets","images/joystick.jpeg","Click, tilt and roll — a satisfying mini joystick for restless thumbs."],
  ["infinity-cube","Infinity Cube",2,"Fidgets","images/infinity_cube.jpeg","Flip forever — an endlessly foldable cube for focus and relaxation."],
  ["cool-passthrough","Cool Passthrough Fidget",2,"Fidgets","images/Cool passthrough fidget.jpeg","Hypnotic motion with a smooth pass-through feel — super tactile."],
  ["bee","Fidget Bee",2,"Fidgets","images/Bee.jpeg","Buzz-worthy fidget with articulated body segments for a snappy feel."],
  ["shark","Flexi Shark",2,"Fidgets","images/Shark.jpeg","A bendy, flexible shark that swims across your desk."],
  ["clicking-fidget","Clicking Fidget",2,"Fidgets","images/clicking fidget.jpeg","A simple satisfying fidget made for repeated clicks."],
  ["gold-fidget-star","Gold Fidget Star",2,"Fidgets","images/Fidget star.jpeg","A gold star fidget with layered geometric lines."],

  ["phone-holder","Phone Holder",2,"Household Helpers","images/Phone holder.jpeg","A useful stand for keeping your phone at a better angle."],
  ["honeycomb-box","Honeycomb Box",2,"Household Helpers","images/Honeycomb box.jpeg","A useful storage box with a honeycomb pattern and sliding lid."],
  ["orange-pumpkin","Orange Pumpkin",2,"Household Helpers","images/Orange_pumpkin.jpeg","A clean seasonal decoration with bright colour."],
  ["halloween-pumpkin","Halloween Pumpkin",2,"Household Helpers","images/Halwoeen_pumpkin.jpeg","A spooky themed print for Halloween displays."],
  ["red-pumpkin","Red Pumpkin",2,"Household Helpers","images/red pumpkin.jpeg","A different pumpkin colour option with strong visual impact."],
  ["boat","Boat",2,"Household Helpers","images/Boat.jpeg","A classic red 3D printed boat model."],

  ["protein-model","Protein Model",2,"Protein Models","images/Element of surprise sign.jpeg","A custom educational model for school science projects."],
  ["element-sign","Element of Surprise Sign",2,"Protein Models","images/Element of surprise sign.jpeg","A funny science-style sign print with raised lettering."],
  ["rocket","Rocket",2,"Protein Models","images/Rocket.jpeg","A bright model-style print with a fun display shape."],
  ["rabbit","Rabbit",2,"Protein Models","images/Rabbit.jpeg","A cute decorative print that works well as a small gift."],
  ["snake","Snake",2,"Protein Models","images/fakesnake.jpeg","A flexible snake-style print for movement and play."],
  ["tulip","Tulip",2,"Protein Models","images/Tulip.jpeg","A shiny green decorative tulip with a clean sculptural shape."],
  ["skull","Skull",2,"Protein Models","images/Skull.jpeg","A detailed multicolour skull print with a bold finish."],
  ["elephant","Elephant",2,"Protein Models","images/Elephant.jpeg","A stylised elephant print with a smooth curved design."],
  ["baby-dragon","Baby Dragon",2,"Protein Models","images/Cute baby dragon.jpeg","A colourful articulated dragon-style print with lots of detail."]
].map(([id,name,price,category,image,description]) => ({id,name,price,category,image,description}));

function getCart(){return JSON.parse(localStorage.getItem("formifyCart")||"[]");}
function saveCart(cart){localStorage.setItem("formifyCart",JSON.stringify(cart));updateCartCount();renderMiniCart("contactMiniCart");}
function updateCartCount(){const c=getCart().reduce((s,i)=>s+Number(i.quantity||0),0);document.querySelectorAll("[data-cart-count]").forEach(e=>e.textContent=c);}
function money(v){return "£"+Number(v||0).toFixed(2);}

function addToCart(productId, colour, quantity){
  const p=PRODUCTS.find(x=>x.id===productId); if(!p)return;
  const cart=getCart(); const col=colour||"Any colour"; const qty=Math.max(1,Number(quantity||1));
  const existing=cart.find(i=>i.id===productId&&i.colour===col);
  if(existing) existing.quantity+=qty;
  else cart.push({id:p.id,name:p.name,price:p.price,image:p.image,colour:col,quantity:qty});
  saveCart(cart); showToast(p.name+" added to cart");
}

function showToast(msg){
  let t=document.querySelector(".cart-toast");
  if(!t){t=document.createElement("div");t.className="cart-toast";document.body.appendChild(t);}
  t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);
}

function productCard(p){
  return `
    <article class="shop-card">
      <div class="shop-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="shop-body">
        <span class="shop-tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong class="shop-price">${money(p.price)}</strong>
        <label class="shop-label">Colour
          <select data-colour="${p.id}">
            <option>Any colour</option><option>Red</option><option>Orange</option><option>Yellow</option><option>Green</option><option>Blue</option><option>Purple</option><option>Black</option><option>White</option><option>Rainbow / multicolour</option>
          </select>
        </label>
        <label class="shop-label">Quantity
          <input data-qty="${p.id}" type="number" min="1" value="1">
        </label>
        <button class="cart-add-btn" data-add="${p.id}" type="button"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
      </div>
    </article>`;
}

function renderProductGrid(containerId, products=PRODUCTS){
  const c=document.getElementById(containerId); if(!c)return;
  c.innerHTML=products.map(productCard).join("");
  c.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>{
    const id=b.dataset.add;
    addToCart(id,c.querySelector(`[data-colour="${id}"]`).value,c.querySelector(`[data-qty="${id}"]`).value);
  }));
}

function setupProductFilters(containerId){
  const buttons=document.querySelectorAll("[data-product-filter]");
  if(!buttons.length)return;
  const show=(filter)=>{
    buttons.forEach(b=>b.classList.toggle("active",b.dataset.productFilter===filter));
    const selected=filter==="all" ? PRODUCTS : PRODUCTS.filter(p=>p.category===filter);
    renderProductGrid(containerId,selected);
    const title=document.getElementById("productSectionTitle");
    if(title) title.textContent = filter==="all" ? "All Products" : filter;
  };
  buttons.forEach(b=>b.addEventListener("click",()=>show(b.dataset.productFilter)));
  show("all");
}

function renderCart(){
  const items=document.getElementById("cartItems"), total=document.getElementById("cartTotal"), empty=document.getElementById("emptyCart");
  if(!items||!total)return; const cart=getCart();
  if(!cart.length){items.innerHTML="";total.textContent=money(0);if(empty)empty.style.display="block";return;}
  if(empty)empty.style.display="none";
  items.innerHTML=cart.map((i,n)=>`<div class="cart-item"><img src="${i.image}" alt="${i.name}"><div><h3>${i.name}</h3><p>Colour: ${i.colour}</p><p>${money(i.price)} each</p></div><div class="cart-controls"><input type="number" min="1" value="${i.quantity}" data-cart-qty="${n}"><button type="button" data-remove="${n}">Remove</button></div></div>`).join("");
  items.querySelectorAll("[data-cart-qty]").forEach(inp=>inp.addEventListener("change",()=>{const cart=getCart();cart[Number(inp.dataset.cartQty)].quantity=Math.max(1,Number(inp.value||1));saveCart(cart);renderCart();}));
  items.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{const cart=getCart();cart.splice(Number(btn.dataset.remove),1);saveCart(cart);renderCart();}));
  total.textContent=money(cart.reduce((s,i)=>s+i.price*i.quantity,0));
}

function renderMiniCart(containerId){
  const box=document.getElementById(containerId); if(!box)return;
  const cart=getCart(); const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
  if(!cart.length){
    box.innerHTML=`<div class="mini-cart-empty"><p>Your cart is empty.</p><a href="products.html">Browse products</a></div>`;
    return;
  }
  box.innerHTML=`
    <div class="mini-cart-list">
      ${cart.map((i,n)=>`<div class="mini-cart-item"><img src="${i.image}" alt="${i.name}"><div><strong>${i.name}</strong><span>x${i.quantity} • ${i.colour}</span></div><button type="button" data-mini-remove="${n}">×</button></div>`).join("")}
    </div>
    <div class="mini-cart-total"><span>Total</span><strong>${money(total)}</strong></div>
    <a class="mini-cart-checkout" href="cart.html">View Cart / Checkout</a>`;
  box.querySelectorAll("[data-mini-remove]").forEach(btn=>btn.addEventListener("click",()=>{const cart=getCart();cart.splice(Number(btn.dataset.miniRemove),1);saveCart(cart);}));
}

function createOrderId(){const d=new Date();return "F3D-"+d.getFullYear().toString().slice(-2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+Math.random().toString(36).slice(2,7).toUpperCase();}
async function postToOrdersApi(data){const r=await fetch(FORMIFY_ORDERS_URL,{method:"POST",body:JSON.stringify(data)});return await r.json();}

async function submitCartOrder(e){
  e.preventDefault();
  const cart=getCart(); if(!cart.length){alert("Your cart is empty.");return;}
  const form=e.target; const total=cart.reduce((s,i)=>s+i.price*i.quantity,0); const quantity=cart.reduce((s,i)=>s+i.quantity,0);
  const order={action:"createCheckout",orderId:createOrderId(),quantity,name:form.name.value.trim(),emailPhone:form.emailPhone.value.trim(),address:form.address.value.trim(),notes:form.notes.value.trim(),items:cart.map(i=>`${i.name} x${i.quantity} (${i.colour})`).join(" | "),total:money(total)};
  if(!order.name||!order.emailPhone||!order.address){alert("Please fill in your name, email/phone, and delivery address.");return;}
  const btn=form.querySelector("button[type='submit']"); btn.disabled=true; btn.textContent="Opening Stripe...";
  try{const checkout=await postToOrdersApi(order); if(!checkout.url) throw new Error("No Stripe URL returned"); window.location.href=checkout.url;}
  catch(err){console.error(err);alert("Sorry, checkout could not start. Please try again.");btn.disabled=false;btn.textContent="Checkout with Stripe";}
}

document.addEventListener("DOMContentLoaded",()=>{
  updateCartCount();
  setupProductFilters("productGrid");
  renderMiniCart("contactMiniCart");
  const f=document.getElementById("cartForm");
  if(f){renderCart();f.addEventListener("submit",submitCartOrder);}
});
