const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector(".cart-overlay")
const cartItems = document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")
const cartContent = document.querySelector(".cart-content")
const productsDOM = document.querySelector(".products-center")

const product = document.querySelector(".product")
const testBtn = document.querySelector(".test")
const div = document.querySelector(".div")

// cart
let cart = []

async function getProducts() {
    try {
        let result = await fetch('https://fakestoreapi.com/products')
        let data = await result.json()
        return data
    } catch(error){
    console.log(error)
    }
}

// get products from the server 
// async function getProducts() {
//     if(!localStorage.getItem("products")){
//         try {
//             let result = await fetch('https://fakestoreapi.com/products')
//             let data = await result.json()
//             return data
//         } catch(error){
//         console.log(error)
//         }
//     } else {
//         return JSON.parse(localStorage.getItem("products"))
//     }
    
// }
// save products from the server to localstorage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products))
}

//get products from localstore
function getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"))
    return products.find(product => product.id == id)
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
}

function getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
}

//add products to the HTML
function displayProducts(products) {
    let result = "";
    products.forEach(product => {
        result += `
        <!-- single product -->    
        <article class="product">
                <div class="img-container">
                    <img src="${product.image}" alt="product" class="product-img" height="50px" width="50px">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart">add to bag</i>
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>
            <!-- end of single product -->
        `;
    });
    productsDOM.innerHTML = result;
}

function showCart() {
    cartOverlay.classList.add("transparentBcg")
    cartDOM.classList.add("showCart")
}

function hideCart() {
    cartOverlay.classList.remove("transparentBcg")
    cartDOM.classList.remove("showCart")
}

function addCartItem(cartItem) {
    let div = document.createElement("div");
    div.classList.add("cart-item")
    div.innerHTML = `
        <img src="${cartItem.image}" alt="product" height="75px" width="75px">
            <div>
                <h4>${cartItem.title}</h4>
                <h5>${cartItem.price}</h5>
                <span class="remove-item" data-id=${cartItem.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up"></i>
                <p class="item-amount">${cartItem.amount}</p>
                <i class="fas fa-chevron-down"></i>
            </div>`
    cartContent.appendChild(div)
}

function setCartValues(cart) {
    let tempTotalPrice = 0;
    let itemsTotal = 0;
    cart.forEach((item) => {
        tempTotalPrice += item.amount * item.price
        itemsTotal += item.amount
    })
    cartTotal.innerText = parseFloat(tempTotalPrice.toFixed(2))
    cartItems.innerText = itemsTotal
}

function populateCart(cart) {
    cart.forEach((item) => addCartItem(item))
}

function menuBtnsHandler(event) {
    let btn = event.target.closest(".bag-btn")
        if(btn.disabled || !btn) return
        let id = btn.dataset.id
        let inCart = cart.find(product => product.id == id)
        if(inCart){
            event.target.innerHTML = "In Cart";
            btn.disabled = true;
            return
        }
        event.target.innerHTML = "In Cart";
        btn.disabled = true;

        let cartItem = {...getProduct(id), amount: 1}
        cart = [...cart, cartItem]
        saveCart(cart)
        //add product to the cart
        setCartValues(cart)
        addCartItem(cartItem)
}

function setupAPP() {
    cart = getCart();
    setCartValues(cart)
    populateCart(cart)
    cartBtn.addEventListener("click", showCart)
    closeCartBtn.addEventListener("click", hideCart)

}

function cartLogic() {
    clearCartBtn.addEventListener("click", clearCartBtnHandler)
}

function clearCartBtnHandler() {
    let cartItems = cart.map(item => item.id)
    cartItems.forEach(id => removeItem(id))
    while(cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0])
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id != id)
    console.log(cart)
    setCartValues(cart)
    saveCart(cart)
}

document.addEventListener("DOMContentLoaded", () => {
    setupAPP();
    getProducts()
    .then(data => {
        displayProducts(data);
        saveProducts(data)
    })
    .then(() => {
        productsDOM.addEventListener("click", menuBtnsHandler)
        cartLogic()
    })


    
})