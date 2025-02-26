// Variables for checkout page
let cartItems = []
let orderTotal = 0

// Initialize checkout page
document.addEventListener("DOMContentLoaded", () => {
  // Get cart from localStorage
  cartItems = JSON.parse(localStorage.getItem("cart")) || []

  // Check if cart is empty
  if (cartItems.length === 0) {
    // Redirect to cart page
    window.location.href = "cart.html"
    return
  }

  // Fetch products
  fetchProducts().then((productsData) => {
    products = productsData

    // Display order summary
    displayOrderSummary()

    // Setup event listeners
    setupCheckoutEventListeners()
  })
})

// Display order summary
function displayOrderSummary() {
    const orderItemsContainer = document.querySelector('.order-items');
    const subtotalElement = document.getElementById('order-subtotal');
    const discountElement = document.getElementById('order-discount');
    const shippingElement = document.getElementById('order-shipping');
    const totalElement = document.getElementById('order-total');
    
    if (!orderItemsContainer || !subtotalElement || !totalElement) return;
    
    // Clear order items container
    orderItemsContainer.innerHTML = '';
    
    // Display order items
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        
        if (!product) return;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="order-item-details">
                <h4>${item.title}</h4>
                <p>${item.size ? `سایز: ${item.size}` : ''}</p>
                <div class="order-item-price">
                    <span>${formatPrice(item.price)} تومان</span>
                    <span>×</span>
                    <span>${item.quantity}</span>
                </div>
            </div>
            <div class="order-item-total">
                ${formatPrice(item.price * item.quantity)} تومان
            </div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate discount (for example, 10% discount for orders over 2,000,000 toman)
    let discount = 0;
    if (subtotal > 2000000) {
        discount = subtotal * 0.1;
    }
    
    // Calculate shipping (free shipping for orders over 1,000,000 toman)
    const shipping = subtotal > 1000000 ? 0 : 50000;
    
    // Calculate total
    orderTotal = subtotal - discount + shipping;
    
    // Update summary elements
    subtotalElement.textContent = `${formatPrice(subtotal)} تومان`;
    
    if (discountElement) {
        if (discount > 0) {
            discountElement.textContent = `${format\

