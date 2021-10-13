const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector(".cart-overlay")
const cartItems = document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")
const cartContent = document.querySelector(".cart-content")
const productsDOM = document.querySelector(".products-center")

// cart
let cart = []

// get products from the server 
async function getProducts() {
    if(!localStorage.getItem("products")){
        try {
            let result = await fetch('https://fakestoreapi.com/products')
            let data = await result.json()
            return data
        } catch(error){
        console.log(error)
        }
    } else {
        return JSON.parse(localStorage.getItem("products"))
    }
    
}
// save products from the server to localstorage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products))
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

//get products from localstore
function getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"))
    return products.find(product => product.id == id)
}

document.addEventListener("DOMContentLoaded", () => {
    getProducts().then(data => {
        displayProducts(data);
        saveProducts(data)
    })

    productsDOM.addEventListener("click", (event) => {
        let btn = event.target.closest(".bag-btn")
        let id = btn.dataset.id
        if(!btn) return
        if(cart.find(product => product.id == id)){
            event.target.innerHTML = "In Cart";
            console.log(btn)
            btn.disabled = true;
        }
        event.target.innerHTML = "In Cart";
        btn.disabled = true;
        let cartItem = {...getProduct(id), amount: 1}
        cart = [...cart, cartItem]
        console.log(cart)
        
    })
})