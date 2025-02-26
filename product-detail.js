// Variables for product detail page
let currentProduct = null
let currentImageIndex = 0
let selectedSize = null
let products = [] // Declare products variable
// Initialize product detail page
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch products
  products = await fetchProducts()

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.has("id") ? Number.parseInt(urlParams.get("id")) : null

  if (!productId) {
    // Redirect to products page if no product ID is provided
    window.location.href = "products.html"
    return
  }

  // Find product by ID
  currentProduct = products.find((p) => p.id === productId)

  if (!currentProduct) {
    // Show error message if product is not found
    showProductNotFound()
    return
  }

  // Display product details
  displayProductDetails()

  // Setup event listeners
  setupProductEventListeners()
})

// Display product not found message
function showProductNotFound() {
  const productDetailSection = document.querySelector(".product-detail-section")

  if (productDetailSection) {
    productDetailSection.innerHTML = `
            <div class="container">
                <div class="product-not-found">
                    <div class="product-not-found-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h2>محصول مورد نظر یافت نشد</h2>
                    <p>متأسفانه محصول مورد نظر شما در سیستم ما موجود نیست.</p>
                    <a href="products.html" class="btn btn-primary">مشاهده همه محصولات</a>
                </div>
            </div>
        `
  }
}

// Display product details
function displayProductDetails() {
  // Update page title
  document.title = `${currentProduct.title} | پوست زیبا`

  // Update breadcrumb and page title
  const pageTitle = document.getElementById("product-title")
  const breadcrumbProductTitle = document.getElementById("breadcrumb-product-title")

  if (pageTitle) pageTitle.textContent = currentProduct.title
  if (breadcrumbProductTitle) breadcrumbProductTitle.textContent = currentProduct.title

  // Update product images
  updateProductImages()

  // Update product info
  updateProductInfo()

  // Update product tabs
  updateProductTabs()
}

// Update product images
function updateProductImages() {
  const mainImage = document.getElementById("main-product-image")
  const thumbnailContainer = document.querySelector(".thumbnail-images")

  if (!mainImage || !thumbnailContainer) return

  // Set main image
  mainImage.src = currentProduct.images[0]
  mainImage.alt = currentProduct.title

  // Clear thumbnail container
  thumbnailContainer.innerHTML = ""

  // Add thumbnails
  currentProduct.images.forEach((image, index) => {
    const thumbnail = document.createElement("div")
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`
    thumbnail.innerHTML = `<img src="${image}" alt="${currentProduct.title} - تصویر ${index + 1}">`

    // Add click event to thumbnail
    thumbnail.addEventListener("click", function () {
      // Update main image
      mainImage.src = image

      // Update active thumbnail
      document.querySelectorAll(".thumbnail").forEach((thumb) => thumb.classList.remove("active"))
      this.classList.add("active")

      // Update current image index
      currentImageIndex = index
    })

    thumbnailContainer.appendChild(thumbnail)
  })
}

// Update product info
function updateProductInfo() {
  // Update product title
  const detailProductTitle = document.getElementById("detail-product-title")
  if (detailProductTitle) detailProductTitle.textContent = currentProduct.title

  // Update product SKU
  const productSku = document.getElementById("product-sku")
  if (productSku) productSku.textContent = currentProduct.sku

  // Update product rating
  const ratingStars = document.querySelector(".product-rating .stars")
  const ratingCount = document.querySelector(".product-rating .rating-count")

  if (ratingStars) ratingStars.innerHTML = generateStars(currentProduct.rating)
  if (ratingCount) ratingCount.textContent = `${currentProduct.ratingCount} نظر`

  // Update product price
  const productPrice = document.getElementById("product-price")
  const productOldPrice = document.getElementById("product-old-price")

  if (productPrice) productPrice.textContent = `${formatPrice(currentProduct.price)} تومان`

  if (productOldPrice) {
    if (currentProduct.oldPrice) {
      productOldPrice.textContent = `${formatPrice(currentProduct.oldPrice)} تومان`
      productOldPrice.style.display = "inline-block"
    } else {
      productOldPrice.style.display = "none"
    }
  }

  // Update product short description
  const productShortDesc = document.getElementById("product-short-desc")
  if (productShortDesc) productShortDesc.textContent = currentProduct.shortDescription

  // Update product variations (sizes)
  const variationOptions = document.querySelector(".variation-options")

  if (variationOptions && currentProduct.sizes && currentProduct.sizes.length > 0) {
    variationOptions.innerHTML = ""

    currentProduct.sizes.forEach((sizeOption, index) => {
      const label = document.createElement("label")
      label.className = "variation-option"
      label.innerHTML = `
                <input type="radio" name="size" value="${sizeOption.size}" ${index === 0 ? "checked" : ""}>
                <span>${sizeOption.size}</span>
            `

      // Add change event to size option
      label.querySelector("input").addEventListener("change", function () {
        if (this.checked) {
          selectedSize = sizeOption.size

          // Update price based on selected size
          if (productPrice) productPrice.textContent = `${formatPrice(sizeOption.price)} تومان`

          if (productOldPrice) {
            if (sizeOption.oldPrice) {
              productOldPrice.textContent = `${formatPrice(sizeOption.oldPrice)} تومان`
              productOldPrice.style.display = "inline-block"
            } else {
              productOldPrice.style.display = "none"
            }
          }
        }
      })

      variationOptions.appendChild(label)
    })

    // Set initial selected size
    selectedSize = currentProduct.sizes[0].size
  }

  // Update product meta info
  const productCategory = document.getElementById("product-category")
  const productBrand = document.getElementById("product-brand")
  const productSkinType = document.getElementById("product-skin-type")

  if (productCategory) {
    const categoryMap = {
      cleansers: "پاک کننده",
      moisturizers: "مرطوب کننده",
      serums: "سرم",
      sunscreens: "ضد آفتاب",
      masks: "ماسک",
    }

    productCategory.textContent = categoryMap[currentProduct.category] || currentProduct.category
  }

  if (productBrand) productBrand.textContent = currentProduct.brand

  if (productSkinType) {
    const skinTypeMap = {
      normal: "پوست معمولی",
      dry: "پوست خشک",
      oily: "پوست چرب",
      combination: "پوست مختلط",
      sensitive: "پوست حساس",
      all: "همه انواع پوست",
      dehydrated: "پوست کم آب",
    }

    const skinTypes = currentProduct.skinType.map((type) => skinTypeMap[type] || type).join("، ")
    productSkinType.textContent = skinTypes
  }
}

// Update product tabs
function updateProductTabs() {
  // Update description tab
  const descriptionTab = document.getElementById("description")
  if (descriptionTab) {
    descriptionTab.innerHTML = `
            <div class="product-description">
                ${currentProduct.description
                  .split("\n")
                  .map((paragraph) => `<p>${paragraph}</p>`)
                  .join("")}
                <h4>مزایا:</h4>
                <ul>
                    <li>روشن کننده پوست</li>
                    <li>کاهش لک‌های تیره</li>
                    <li>افزایش شادابی پوست</li>
                    <li>آنتی‌اکسیدان قوی</li>
                    <li>کمک به تولید کلاژن</li>
                </ul>
            </div>
        `
  }

  // Update ingredients tab
  const ingredientsTab = document.getElementById("ingredients")
  if (ingredientsTab) {
    ingredientsTab.innerHTML = `
            <div class="product-ingredients">
                <p>${currentProduct.ingredients}</p>
            </div>
        `
  }

  // Update how to use tab
  const howToUseTab = document.getElementById("how-to-use")
  if (howToUseTab) {
    howToUseTab.innerHTML = `
            <div class="product-how-to-use">
                <p>${currentProduct.howToUse}</p>
            </div>
        `
  }

  // Update reviews tab (static for now)
  const reviewsTab = document.getElementById("reviews")
  if (reviewsTab) {
    reviewsTab.innerHTML = `
            <div class="product-reviews">
                <div class="review-summary">
                    <div class="review-average">
                        <div class="average-rating">${currentProduct.rating.toFixed(1)}</div>
                        <div class="stars">${generateStars(currentProduct.rating)}</div>
                        <div class="total-reviews">${currentProduct.ratingCount} نظر</div>
                    </div>
                    <div class="review-bars">
                        <div class="review-bar">
                            <span class="bar-label">5 ستاره</span>
                            <div class="bar-container">
                                <div class="bar" style="width: 70%"></div>
                            </div>
                            <span class="bar-count">30</span>
                        </div>
                        <div class="review-bar">
                            <span class="bar-label">4 ستاره</span>
                            <div class="bar-container">
                                <div class="bar" style="width: 20%"></div>
                            </div>
                            <span class="bar-count">8</span>
                        </div>
                        <div class="review-bar">
                            <span class="bar-label">3 ستاره</span>
                            <div class="bar-container">
                                <div class="bar" style="width: 5%"></div>
                            </div>
                            <span class="bar-count">2</span>
                        </div>
                        <div class="review-bar">
                            <span class="bar-label">2 ستاره</span>
                            <div class="bar-container">
                                <div class="bar" style="width: 2.5%"></div>
                            </div>
                            <span class="bar-count">1</span>
                        </div>
                        <div class="review-bar">
                            <span class="bar-label">1 ستاره</span>
                            <div class="bar-container">
                                <div class="bar" style="width: 2.5%"></div>
                            </div>
                            <span class="bar-count">1</span>
                        </div>
                    </div>
                </div>
                <div class="review-form-container">
                    <h4>نظر خود را ثبت کنید</h4>
                    <form id="review-form">
                        <div class="form-group">
                            <label for="review-rating">امتیاز شما:</label>
                            <div class="rating-select">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="review-name">نام:</label>
                            <input type="text" id="review-name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="review-email">ایمیل:</label>
                            <input type="email" id="review-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="review-content">نظر شما:</label>
                            <textarea id="review-content" class="form-control" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">ثبت نظر</button>
                    </form>
                </div>
                <div class="reviews-list">
                    <h4>نظرات کاربران</h4>
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-author">مریم احمدی</div>
                            <div class="review-date">1402/03/15</div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                        <div class="review-content">
                            <p>این محصول فوق‌العاده است! بعد از یک هفته استفاده، پوستم روشن‌تر و شاداب‌تر شده است. به همه دوستانم پیشنهاد می‌کنم.</p>
                        </div>
                    </div>
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-author">علی محمدی</div>
                            <div class="review-date">1402/02/20</div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                        </div>
                        <div class="review-content">
                            <p>محصول خوبی است اما قیمت آن کمی بالاست. با این حال، نتیجه خوبی روی پوست من داشته و از خرید آن راضی هستم.</p>
                        </div>
                    </div>
                </div>
            </div>
        `

    // Add event listeners to rating stars
    const ratingStars = document.querySelectorAll(".rating-select i")
    ratingStars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = Number.parseInt(this.getAttribute("data-rating"))

        // Update stars
        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = "fas fa-star"
          } else {
            s.className = "far fa-star"
          }
        })
      })

      star.addEventListener("mouseover", function () {
        const rating = Number.parseInt(this.getAttribute("data-rating"))

        // Update stars on hover
        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = "fas fa-star"
          } else {
            s.className = "far fa-star"
          }
        })
      })
    })

    // Add event listener to review form
    const reviewForm = document.getElementById("review-form")
    if (reviewForm) {
      reviewForm.addEventListener("submit", function (e) {
        e.preventDefault()

        // Show success message
        showNotification("نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.", "success")

        // Reset form
        this.reset()

        // Reset rating stars
        ratingStars.forEach((star) => {
          star.className = "far fa-star"
        })
      })
    }
  }
}

// Setup product event listeners
function setupProductEventListeners() {
  // Tab buttons
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Update active tab pane
      tabPanes.forEach((pane) => pane.classList.remove("active"))
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Quantity buttons
  const minusBtn = document.querySelector(".quantity-button.minus")
  const plusBtn = document.querySelector(".quantity-button.plus")
  const quantityInput = document.getElementById("product-quantity")

  if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })

    plusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1
      }
    })

    quantityInput.addEventListener("change", function () {
      const currentValue = Number.parseInt(this.value)
      if (isNaN(currentValue) || currentValue < 1) {
        this.value = 1
      } else if (currentValue > 10) {
        this.value = 10
      }
    })
  }

  // Add to cart button
  const addToCartBtn = document.getElementById("add-to-cart")

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(document.getElementById("product-quantity").value)
      addToCart(currentProduct.id, quantity, selectedSize)
    })
  }

  // Wishlist button
  const wishlistBtn = document.querySelector(".wishlist-btn")

  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", function () {
      // Add to wishlist (to be implemented)
      showNotification("به لیست علاقه‌مندی‌ها اضافه شد", "success")

      // Toggle heart icon
      const heartIcon = this.querySelector("i")
      if (heartIcon.classList.contains("far")) {
        heartIcon.classList.remove("far")
        heartIcon.classList.add("fas")
      } else {
        heartIcon.classList.remove("fas")
        heartIcon.classList.add("far")
      }
    })
  }
}

// Generate star rating HTML
function generateStars(rating) {
  let starsHTML = ""
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  // Add half star if needed
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

async function fetchProducts() {
  // Replace this with your actual fetch logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "محصول تستی 1",
          sku: "SKU123",
          rating: 4.5,
          ratingCount: 40,
          price: 250000,
          oldPrice: 300000,
          shortDescription: "توضیح کوتاه محصول 1",
          description: "توضیحات کامل محصول 1",
          images: ["image1.jpg", "image2.jpg"],
          sizes: [
            { size: "S", price: 250000, oldPrice: 300000 },
            { size: "M", price: 270000 },
            { size: "L", price: 290000 },
          ],
          category: "cleansers",
          brand: "برند 1",
          skinType: ["normal", "dry"],
          ingredients: "آب، روغن",
          howToUse: "طریقه استفاده",
        },
        {
          id: 2,
          title: "محصول تستی 2",
          sku: "SKU456",
          rating: 3.8,
          ratingCount: 25,
          price: 180000,
          shortDescription: "توضیح کوتاه محصول 2",
          description: "توضیحات کامل محصول 2",
          images: ["image3.jpg", "image4.jpg"],
          sizes: [
            { size: "30ml", price: 180000 },
            { size: "50ml", price: 220000 },
          ],
          category: "serums",
          brand: "برند 2",
          skinType: ["oily", "combination"],
          ingredients: "آب، ویتامین",
          howToUse: "طریقه استفاده",
        },
      ])
    }, 500)
  })
}

function formatPrice(price) {
  return price.toLocaleString()
}

function showNotification(message, type) {
  alert(message)
}

function addToCart(productId, quantity, selectedSize) {
  alert(`محصول با شناسه ${productId}، تعداد ${quantity} و سایز ${selectedSize} به سبد خرید اضافه شد.`)
}

