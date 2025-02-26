// Global variables
const cart = JSON.parse(localStorage.getItem("cart")) || []
let products = []

// Fetch products from JSON file
async function fetchProducts() {
  try {
    const response = await fetch("../data/products.json")
    const data = await response.json()
    products = data.products
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Update cart count
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count")
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  cartCountElements.forEach((element) => {
    element.textContent = totalItems
  })
}

// Format price with commas
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Add to cart function
function addToCart(productId, quantity = 1, size = null) {
  const product = products.find((p) => p.id === productId)

  if (!product) {
    console.error("Product not found")
    return
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id === productId && (size ? item.size === size : true))

  if (existingItemIndex > -1) {
    // Update quantity if product already in cart
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item to cart
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null)
    const selectedSizeData = product.sizes.find((s) => s.size === selectedSize)

    cart.push({
      id: product.id,
      title: product.title,
      price: selectedSizeData ? selectedSizeData.price : product.price,
      image: product.images[0],
      quantity: quantity,
      size: selectedSize,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show success message
  showNotification("محصول با موفقیت به سبد خرید اضافه شد", "success")
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".notification")

  if (!notification) {
    notification = document.createElement("div")
    notification.className = "notification"
    document.body.appendChild(notification)
  }

  // Set notification content and type
  notification.textContent = message
  notification.className = `notification ${type}`

  // Show notification
  notification.classList.add("show")

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart count
  updateCartCount()

  // Mobile menu toggle
  const menuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")
  const closeMenu = document.querySelector(".close-menu")

  if (menuToggle && mobileMenu && closeMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("active")
    })

    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
    })
  }

  // Back to top button
  const backToTopBtn = document.querySelector(".back-to-top")

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show")
      } else {
        backToTopBtn.classList.remove("show")
      }
    })

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Newsletter form
  const newsletterForm = document.getElementById("newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("newsletter-email").value

      if (email) {
        showNotification("با تشکر از عضویت شما در خبرنامه", "success")
        newsletterForm.reset()
      }
    })
  }
})

