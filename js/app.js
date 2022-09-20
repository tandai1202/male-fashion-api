const cartContainer = document.querySelector(".cart-container");
const productList = document.querySelector(".product-list");
const cartList = document.querySelector(".cart-list");
const cartCountInfo = document.querySelector("#cart-count-info");
const cartTotalValue = document.querySelector("#cart-total-value");

let cartItemId = 1;

function eventListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    loadJSon();
    loadCart();
  });

  document.querySelector(".navbar-toggler").addEventListener("click", () => {
    document.querySelector(".navbar-collapse").classList.toggle("show-navbar");
  });

  document.getElementById("cart-btn").addEventListener("click", () => {
    cartContainer.classList.toggle("show-cart-container");
  });

  productList.addEventListener("click", purchaseProduct);

  cartList.addEventListener("click", deleteProduct);
}

eventListeners();

function loadJSon() {
  fetch("https://fakestoreapi.com/products")
    .then((repsonse) => repsonse.json())
    .then((data) => {
      let html = "";
      if (data) {
        data.forEach((product) => {
          html += `
          <div class="product-item" data-product-id="${product.id}">
            <div class="product-image">
              <img
                src="${product.image}"
                alt="product image"
              />
              <div class="product-btns">
                <button type="button"  id="add-cart-btn" class="add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Add To Cart
                </button>
                <button type="button">More Info</button>
              </div>
            </div>
            <div class="product-content">
              <h3 class="product-name">
                ${product.title}
              </h3>
              <p>$<span class="product-price">${product.price}</span></p>
            </div>
          </div>
          `;
          productList.innerHTML = html;
        });
      }
    })
    .catch((error) => {
      alert(`Dữ liệu lỗi`);
    });
}

function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemId = 1;
  } else {
    cartItemId = products[products.length - 1].id;
    cartItemId++;
  }
  products.forEach((product) => addToCartList(product));
  updateCartInfo();
}

function purchaseProduct(e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    let product = e.target.parentElement.parentElement.parentElement;
    getProductInfo(product);
  }
}

function getProductInfo(product) {
  const productID = product.dataset.productId;
  const productName = product.querySelector(".product-name").textContent;
  const productPrice = product.querySelector(".product-price").textContent;
  const productImg = product.querySelector(".product-image img").src;

  let productInfo = {
    id: cartItemId,
    name: productName,
    imgSrc: productImg,
    price: productPrice,
    productID: productID,
    count: 1,
  };
  cartItemId++;
  addToCartList(productInfo);
  saveProductInStrorage(productInfo);
}

function addToCartList(product) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-cart-id", `${product.id}`);
  cartItem.innerHTML = `
      <img
        src="${product.imgSrc}"
        alt="product image"
      />
      <div class="cart-item-info">
        <h3 class="cart-item-name">
          ${product.name}
        </h3>
        <span class="cart-item-price">$${product.price}</span>
      </div>

      <button type="button" class="cart-item-del-btn">
        <i class="fas fa-times"></i>
      </button>
  `;
  cartList.appendChild(cartItem);
}

function deleteProduct(e) {
  let cartItem;
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.parentElement;
    cartItem.remove();
  } else if (e.target.tagName === "I") {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove();
  } else {
    return;
  }

  let products = getProductFromStorage();
  console.log(products);
  let updatedProducts = products.filter((product) => {
    return product.id !== parseInt(cartItem.dataset.cartId);
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  updateCartInfo();
}

function getProductFromStorage() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
}

function saveProductInStrorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem("products", JSON.stringify(products));
  updateCartInfo();
}

function updateCartInfo() {
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}

function findCartInfo() {
  let products = getProductFromStorage();
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price);
    return (acc += price);
  }, 0);

  return {
    total: total,
    productCount: products.length,
  };
}

// function updateProductInCart(product) {
//   const products = getProductFromStorage();
//   for (let i = 0; i < products.length; i++) {
//     if (products[i].productID == product.productID) {
//       console.log("first");
//       products[i].conut += 1;
//       products[i].price = products[i].basePrice * products[i].count;
//       return;
//     }
//   }
//   products.push(product);
// }

// updateProductInCart();

// saveProductInStrorage();
