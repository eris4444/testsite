// Variables for products page
let currentCategory = 'all';
let currentSkinType = 'all';
let currentBrand = 'all';
let currentPriceRange = { min: 0, max: Infinity };
let currentSort = 'popularity';
let viewMode = 'grid';
let products = [];
let filteredProducts = [];
let displayedProducts = 0;
let productsPerLoad = 6; // Number of products to load each time
let isLoading = false;

// Declare fetchProducts function (assuming it's defined elsewhere or fetched)
// async function fetchProducts() {
//   // Replace this with your actual product fetching logic
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const mockProducts = [
//         {
//           id: 1,
//           title: "Product 1",
//           category: "cleansers",
//           skinType: ["normal"],
//           brand: "سی‌گل",
//           price: 100000,
//           oldPrice: 120000,
//           rating: 4.5,
//           ratingCount: 10,
//           isNew: true,
//           discount: 10,
//           images: ["image1.jpg"],
//         },
//         {
//           id: 2,
//           title: "Product 2",
//           category: "moisturizers",
//           skinType: ["dry"],
//           brand: "هیدرودرم",
//           price: 150000,
//           oldPrice: null,
//           rating: 3.8,
//           ratingCount: 5,
//           isNew: false,
//           discount: 0,
//           images: ["image2.jpg"],
//         },
//         {
//           id: 3,
//           title: "Product 3",
//           category: "serums",
//           skinType: ["oily"],
//           brand: "اوسرین",
//           price: 200000,
//           oldPrice: 250000,
//           rating: 4.2,
//           ratingCount: 12,
//           isNew: true,
//           discount: 20,
//           images: ["image3.jpg"],
//         },
//         {
//           id: 4,
//           title: "Product 4",
//           category: "sunscreens",
//           skinType: ["combination"],
//           brand: "سینره",
//           price: 120000,
//           oldPrice: null,
//           rating: 4.9,
//           ratingCount: 20,
//           isNew: false,
//           discount: 0,
//           images: ["image4.jpg"],
//         },
//         {
//           id: 5,
//           title: "Product 5",
//           category: "masks",
//           skinType: ["sensitive"],
//           brand: "لافارر",
//           price: 180000,
//           oldPrice: 200000,
//           rating: 3.5,
//           ratingCount: 8,
//           isNew: true,
//           discount: 5,
//           images: ["image5.jpg"],
//         },
//         {
//           id: 6,
//           title: "Product 6",
//           category: "cleansers",
//           skinType: ["normal"],
//           brand: "سی‌گل",
//           price: 90000,
//           oldPrice: null,
//           rating: 4.0,
//           ratingCount: 15,
//           isNew: false,
//           discount: 0,
//           images: ["image6.jpg"],
//         },
//         {
//           id: 7,
//           title: "Product 7",
//           category: "moisturizers",
//           skinType: ["dry"],
//           brand: "هیدرودرم",
//           price: 160000,
//           oldPrice: 180000,
//           rating: 4.7,
//           ratingCount: 25,
//           isNew: true,
//           discount: 15,
//           images: ["image7.jpg"],
//         },
//         {
//           id: 8,
//           title: "Product 8",
//           category: "serums",
//           skinType: ["oily"],
//           brand: "اوسرین",
//           price: 220000,
//           oldPrice: null,
//           rating: 3.9,
//           ratingCount: 7,
//           isNew: false,
//           discount: 0,
//           images: ["image8.jpg"],
//         },
//         {
//           id: 9,
//           title: "Product 9",
//           category: "sunscreens",
//           skinType: ["combination"],
//           brand: "سینره",
//           price: 130000,
//           oldPrice: 150000,
//           rating: 4.3,
//           ratingCount: 18,
//           isNew: true,
//           discount: 12,
//           images: ["image9.jpg"],
//         },
//       ]
//       resolve(mockProducts)
//     }, 500)
//   })
// }

// Declare formatPrice function
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Declare showNotification function
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Declare addToCart function
function addToCart(productId, quantity = 1, size = null) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && (size ? item.size === size : true)
    );
    
    if (existingItemIndex > -1) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null);
        const selectedSizeData = product.sizes ? product.sizes.find(s => s.size === selectedSize) : null;
        
        cart.push({
            id: product.id,
            title: product.title,
            price: selectedSizeData ? selectedSizeData.price : product.price,
            image: product.images[0],
            quantity: quantity,
            size: selectedSize
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showNotification('محصول با موفقیت به سبد خرید اضافه شد', 'success');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Initialize products page
document.addEventListener('DOMContentLoaded', async function() {
    // Fetch products
    products = await fetchProducts();
    
    // Initialize filtered products
    filteredProducts = [...products];
    
    // Initialize filters from URL parameters
    initializeFiltersFromURL();
    
    // Apply filters
    applyFilters();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup infinite scroll
    setupInfiniteScroll();
});

// Initialize filters from URL parameters
function initializeFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get category from URL
    if (urlParams.has('category')) {
        currentCategory = urlParams.get('category');
        
        // Check the corresponding checkbox
        const categoryCheckbox = document.querySelector(`input[type="checkbox"][value="${currentCategory}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    // Get skin type from URL
    if (urlParams.has('skinType')) {
        currentSkinType = urlParams.get('skinType');
        
        // Check the corresponding checkbox
        const skinTypeCheckbox = document.querySelector(`input[type="checkbox"][value="${currentSkinType}"]`);
        if (skinTypeCheckbox) {
            skinTypeCheckbox.checked = true;
        }
    }
    
    // Get brand from URL
    if (urlParams.has('brand')) {
        currentBrand = urlParams.get('brand');
        
        // Check the corresponding checkbox
        const brandCheckbox = document.querySelector(`input[type="checkbox"][value="${currentBrand}"]`);
        if (brandCheckbox) {
            brandCheckbox.checked = true;
        }
    }
    
    // Get price range from URL
    if (urlParams.has('minPrice') && urlParams.has('maxPrice')) {
        currentPriceRange.min = parseInt(urlParams.get('minPrice'));
        currentPriceRange.max = parseInt(urlParams.get('maxPrice'));
        
        // Set price range inputs
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        
        if (minPriceInput && maxPriceInput) {
            minPriceInput.value = currentPriceRange.min;
            maxPriceInput.value = currentPriceRange.max;
        }
    }
    
    // Get sort from URL
    if (urlParams.has('sort')) {
        currentSort = urlParams.get('sort');
        
        // Set sort select
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.value = currentSort;
        }
    }
}

// Setup event listeners for filters and sorting
function setupEventListeners() {
    // Category filters
    const categoryCheckboxes = document.querySelectorAll('.category-list input[type="checkbox"][value]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentCategory = this.value;
                
                // Uncheck other category checkboxes
                categoryCheckboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });
                
                // Reset displayed products count
                displayedProducts = 0;
                
                // Apply filters
                applyFilters();
            }
        });
    });
    
    // Skin type filters
    const skinTypeCheckboxes = document.querySelectorAll('.category-list input[type="checkbox"][value^="normal"], .category-list input[type="checkbox"][value^="dry"], .category-list input[type="checkbox"][value^="oily"], .category-list input[type="checkbox"][value^="combination"], .category-list input[type="checkbox"][value^="sensitive"]');
    skinTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentSkinType = this.value;
                
                // Uncheck other skin type checkboxes
                skinTypeCheckboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });
                
                // Reset displayed products count
                displayedProducts = 0;
                
                // Apply filters
                applyFilters();
            }
        });
    });
    
    // Brand filters
    const brandCheckboxes = document.querySelectorAll('.category-list input[type="checkbox"][value^="brand"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentBrand = this.value;
                
                // Uncheck other brand checkboxes
                brandCheckboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });
                
                // Reset displayed products count
                displayedProducts = 0;
                
                // Apply filters
                applyFilters();
            }
        });
    });
    
    // Price range filter
    const applyPriceFilterBtn = document.getElementById('apply-price-filter');
    if (applyPriceFilterBtn) {
        applyPriceFilterBtn.addEventListener('click', function() {
            const minPrice = document.getElementById('min-price').value;
            const maxPrice = document.getElementById('max-price').value;
            
            currentPriceRange.min = minPrice ? parseInt(minPrice) : 0;
            currentPriceRange.max = maxPrice ? parseInt(maxPrice) : Infinity;
            
            // Reset displayed products count
            displayedProducts = 0;
            
            // Apply filters
            applyFilters();
        });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            
            // Reset displayed products count
            displayedProducts = 0;
            
            // Apply filters
            applyFilters();
        });
    }
    
    // View switcher
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            viewMode = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            
            const productsContainer = document.getElementById('products-container');
            if (productsContainer) {
                productsContainer.className = 'products-grid';
            }
        });
        
        listViewBtn.addEventListener('click', function() {
            viewMode = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            
            const productsContainer = document.getElementById('products-container');
            if (productsContainer) {
                productsContainer.className = 'products-list';
            }
        });
    }
    
    // Mobile filter toggle
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileFilterToggle && sidebar) {
        mobileFilterToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                !mobileFilterToggle.contains(event.target)) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreProducts();
        });
    }
}

// Setup infinite scroll
function setupInfiniteScroll() {
    window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        // Check if user has scrolled to the bottom
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            loadMoreProducts();
        }
    });
}

// Load more products
function loadMoreProducts() {
    if (isLoading || displayedProducts >= filteredProducts.length) return;
    
    isLoading = true;
    
    // Show loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
    
    // Simulate loading delay
    setTimeout(() => {
        // Load next batch of products
        const nextBatch = filteredProducts.slice(displayedProducts, displayedProducts + productsPerLoad);
        displayProducts(nextBatch, true);
        
        // Update displayed products count
        displayedProducts += nextBatch.length;
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Hide load more button if all products are displayed
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? 'none' : 'block';
        }
        
        isLoading = false;
    }, 500);
}

// Apply filters and update product display
function applyFilters() {
    // Filter products
    filteredProducts = products.filter(product => {
        // Filter by category
        if (currentCategory !== 'all' && product.category !== currentCategory) {
            return false;
        }
        
        // Filter by skin type
        if (currentSkinType !== 'all' && !product.skinType.includes(currentSkinType)) {
            return false;
        }
        
        // Filter by brand
        if (currentBrand !== 'all') {
            const brandValue = currentBrand.replace('brand', '');
            const brandMap = {
                '1': 'سی‌گل',
                '2': 'هیدرودرم',
                '3': 'اوسرین',
                '4': 'سینره',
                '5': 'لافارر'
            };
            
            if (product.brand !== brandMap[brandValue]) {
                return false;
            }
        }
        
        // Filter by price range
        if (product.price < currentPriceRange.min || product.price > currentPriceRange.max) {
            return false;
        }
        
        return true;
    });
    
    // Sort products
    sortProducts();
    
    // Update URL with filters
    updateURL();
    
    // Reset displayed products container
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = '';
    }
    
    // Display initial batch of products
    const initialBatch = filteredProducts.slice(0, productsPerLoad);
    displayProducts(initialBatch, false);
    
    // Update displayed products count
    displayedProducts = initialBatch.length;
    
    // Update load more button visibility
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? 'none' : 'block';
    }
    
    // Update products count
    updateProductsCount();
}

// Sort products based on current sort option
function sortProducts() {
    switch (currentSort) {
        case 'popularity':
            // Sort by rating and rating count
            filteredProducts.sort((a, b) => (b.rating * b.ratingCount) - (a.rating * a.ratingCount));
            break;
        case 'price-low':
            // Sort by price (low to high)
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            // Sort by price (high to low)
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // Sort by isNew flag
            filteredProducts.sort((a, b) => {
                if (a.isNew && !b.isNew) return -1;
                if (!a.isNew && b.isNew) return 1;
                return 0;
            });
            break;
    }
}

// Update URL with current filters
function updateURL() {
    const urlParams = new URLSearchParams();
    
    if (currentCategory !== 'all') {
        urlParams.set('category', currentCategory);
    }
    
    if (currentSkinType !== 'all') {
        urlParams.set('skinType', currentSkinType);
    }
    
    if (currentBrand !== 'all') {
        urlParams.set('brand', currentBrand);
    }
    
    if (currentPriceRange.min > 0) {
        urlParams.set('minPrice', currentPriceRange.min);
    }
    
    if (currentPriceRange.max < Infinity) {
        urlParams.set('maxPrice', currentPriceRange.max);
    }
    
    if (currentSort !== 'popularity') {
        urlParams.set('sort', currentSort);
    }
    
    const newURL = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
}

// Display products
function displayProducts(productsToDisplay, append = false) {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    // Clear container if not appending
    if (!append) {
        productsContainer.innerHTML = '';
    }
    
    // Check if there are products to display
    if (filteredProducts.length === 0 && !append) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <div class="no-products-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>محصولی یافت نشد</h3>
                <p>لطفاً فیلترهای خود را تغییر دهید یا همه محصولات را مشاهده کنید.</p>
                <button type="button" class="btn btn-primary" id="reset-filters">نمایش همه محصولات</button>
            </div>
        `;
        
        // Add event listener to reset filters button
        const resetFiltersBtn = document.getElementById('reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                // Reset all filters
                currentCategory = 'all';
                currentSkinType = 'all';
                currentBrand = 'all';
                currentPriceRange = { min: 0, max: Infinity };
                currentSort = 'popularity';
                
                // Reset displayed products count
                displayedProducts = 0;
                
                // Uncheck all checkboxes
                document.querySelectorAll('.category-list input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                });
                
                // Check 'all' category checkbox
                const allCategoryCheckbox = document.querySelector('.category-list input[type="checkbox"][value="all"]');
                if (allCategoryCheckbox) {
                    allCategoryCheckbox.checked = true;
                }
                
                // Clear price range inputs
                const minPriceInput = document.getElementById('min-price');
                const maxPriceInput = document.getElementById('max-price');
                if (minPriceInput && maxPriceInput) {
                    minPriceInput.value = '';
                    maxPriceInput.value = '';
                }
                
                // Reset sort select
                const sortSelect = document.getElementById('sort-by');
                if (sortSelect) {
                    sortSelect.value = 'popularity';
                }
                
                // Apply filters
                applyFilters();
            });
        }
        
        return;
    }
    
    // Display products
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Calculate discount percentage
        const discountPercentage = product.discount > 0 ? product.discount : (product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.title}">
                <div class="product-badges">
                    ${product.isNew ? '<span class="badge badge-new">جدید</span>' : ''}
                    ${discountPercentage > 0 ? `<span class="badge badge-sale">${discountPercentage}% تخفیف</span>` : ''}
                </div>
                <div class="product-actions">
                    <button type="button" class="action-btn quick-view-btn" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="action-btn add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button type="button" class="action-btn wishlist-btn" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category === 'cleansers' ? 'پاک کننده' : 
                                              product.category === 'moisturizers' ? 'مرطوب کننده' : 
                                              product.category === 'serums' ? 'سرم' : 
                                              product.category === 'sunscreens' ? 'ضد آفتاب' : 
                                              product.category === 'masks' ? 'ماسک' : product.category}</div>
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.title}</a>
                </h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">${product.ratingCount} نظر</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)} تومان</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)} تومان</span>` : ''}
                </div>
                <a href="product-detail.html?id=${product.id}" class="btn btn-primary product-btn">مشاهده محصول</a>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to product buttons
    addProductButtonsEventListeners();
}

// Generate star rating HTML
function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Add event listeners to product buttons
function addProductButtonsEventListeners() {
    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            // Show quick view modal (to be implemented)
            showNotification('این قابلیت در حال توسعه است', 'info');
        });
    });
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
    
    // Wishlist buttons
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            // Add to wishlist (to be implemented)
            showNotification('به لیست علاقه‌مندی‌ها اضافه شد', 'success');
            
            // Toggle heart icon
            const heartIcon = this.querySelector('i');
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
        });
    });
}

// Update products count
function updateProductsCount() {
    const productsCountElement = document.getElementById('products-total');
    
    if (productsCountElement) {
        productsCountElement.textContent = filteredProducts.length;
    }
}

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
