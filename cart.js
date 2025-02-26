// Variables for cart page
let cartItems = []
let products = [] // Declare products variable

// Initialize cart page
document.addEventListener("DOMContentLoaded", () => {
  // Get cart from localStorage
  cartItems = JSON.parse(localStorage.getItem("cart")) || []

  // Fetch products
  fetchProducts().then((productsData) => {
    products = productsData

    // Display cart items
    displayCartItems()

    // Update cart summary
    updateCartSummary()
  })
})

// Display cart items
function displayCartItems() {
  const cartTableBody = document.querySelector(".cart-table tbody")
  const emptyCartMessage = document.querySelector(".empty-cart")
  const cartTable = document.querySelector(".cart-table")
  const cartSummary = document.querySelector(".cart-summary")

  if (!cartTableBody) return

  // Clear cart table body
  cartTableBody.innerHTML = ""

  // Check if cart is empty
  if (cartItems.length === 0) {
    if (cartTable) cartTable.style.display = "none"
    if (cartSummary) cartSummary.style.display = "none"
    if (emptyCartMessage) emptyCartMessage.style.display = "block"
    return
  }

  // Show cart table and summary, hide empty cart message
  if (cartTable) cartTable.style.display = "table"
  if (cartSummary) cartSummary.style.display = "block"
  if (emptyCartMessage) emptyCartMessage.style.display = "none"

  // Display cart items
  cartItems.forEach((item, index) => {
    const product = products.find((p) => p.id === item.id)

    if (!product) return

    const row = document.createElement("tr")
    row.innerHTML = `
            <td>
                <button type="button" class="cart-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </td>
            <td>
                <div class="cart-product">
                    <div class="cart-product-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-product-details">
                        <h4>${item.title}</h4>
                        <p>${item.size ? `سایز: ${item.size}` : ""}</p>
                    </div>
                </div>
            </td>
            <td>${formatPrice(item.price)} تومان</td>
            <td>
                <div class="cart-quantity">
                    <button type="button" class="quantity-button minus" data-index="${index}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" max="10" class="cart-quantity-input" data-index="${index}">
                    <button type="button" class="quantity-button plus" data-index="${index}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
            <td class="cart-item-total">${formatPrice(item.price * item.quantity)} تومان</td>
        `

    cartTableBody.appendChild(row)
  })

  // Add event listeners to cart buttons
  addCartButtonsEventListeners()
}

// Add event listeners to cart buttons
function addCartButtonsEventListeners() {
  // Remove buttons
  const removeButtons = document.querySelectorAll(".cart-remove")
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))

      // Remove item from cart
      cartItems.splice(index, 1)

      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems))

      // Update cart count
      updateCartCount()

      // Display cart items
      displayCartItems()

      // Update cart summary
      updateCartSummary()
    })
  })

  // Quantity buttons
  const minusButtons = document.querySelectorAll(".quantity-button.minus")
  const plusButtons = document.querySelectorAll(".quantity-button.plus")
  const quantityInputs = document.querySelectorAll(".cart-quantity-input")

  minusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))

      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--

        // Update quantity input
        const input = document.querySelector(`.cart-quantity-input[data-index="${index}"]`)
        if (input) input.value = cartItems[index].quantity

        // Update item total
        const itemTotal = document.querySelectorAll(".cart-item-total")[index]
        if (itemTotal)
          itemTotal.textContent = `${formatPrice(cartItems[index].price * cartItems[index].quantity)} تومان`

        // Save cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cartItems))

        // Update cart count
        updateCartCount()

        // Update cart summary
        updateCartSummary()
      }
    })
  })

  plusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))

      if (cartItems[index].quantity < 10) {
        cartItems[index].quantity++

        // Update quantity input
        const input = document.querySelector(`.cart-quantity-input[data-index="${index}"]`)
        if (input) input.value = cartItems[index].quantity

        // Update item total
        const itemTotal = document.querySelectorAll(".cart-item-total")[index]
        if (itemTotal)
          itemTotal.textContent = `${formatPrice(cartItems[index].price * cartItems[index].quantity)} تومان`

        // Save cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cartItems))

        // Update cart count
        updateCartCount()

        // Update cart summary
        updateCartSummary()
      }
    })
  })

  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))

      let quantity = Number.parseInt(this.value)

      if (isNaN(quantity) || quantity < 1) {
        quantity = 1
        this.value = 1
      } else if (quantity > 10) {
        quantity = 10
        this.value = 10
      }

      cartItems[index].quantity = quantity

      // Update item total
      const itemTotal = document.querySelectorAll(".cart-item-total")[index]
      if (itemTotal) itemTotal.textContent = `${formatPrice(cartItems[index].price * cartItems[index].quantity)} تومان`

      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems))

      // Update cart count
      updateCartCount()

      // Update cart summary
      updateCartSummary()
    })
  })
}

// Update cart summary
function updateCartSummary() {
  const subtotalElement = document.getElementById("cart-subtotal")
  const discountElement = document.getElementById("cart-discount")
  const shippingElement = document.getElementById("cart-shipping")
  const totalElement = document.getElementById("cart-total")

  if (!subtotalElement || !totalElement) return

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate discount (for example, 10% discount for orders over 2,000,000 toman)
  let discount = 0
  if (subtotal > 2000000) {
    discount = subtotal * 0.1
  }

  // Calculate shipping (free shipping for orders over 1,000,000 toman)
  const shipping = subtotal > 1000000 ? 0 : 50000

  // Calculate total
  const total = subtotal - discount + shipping

  // Update summary elements
  subtotalElement.textContent = `${formatPrice(subtotal)} تومان`

  if (discountElement) {
    if (discount > 0) {
      discountElement.textContent = `${formatPrice(discount)} تومان`
      discountElement.parentElement.style.display = "flex"
    } else {
      discountElement.parentElement.style.display = "none"
    }
  }

  if (shippingElement) {
    if (shipping > 0) {
      shippingElement.textContent = `${formatPrice(shipping)} تومان`
    } else {
      shippingElement.textContent = "رایگان"
    }
  }

  totalElement.textContent = `${formatPrice(total)} تومان`

  // Update checkout button
  const checkoutBtn = document.querySelector(".checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.disabled = cartItems.length === 0
  }
}

