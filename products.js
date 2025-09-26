// Hijabs Products Data
const hijabsProducts = [
    {
        id: 1,
        name: "Premium Elegant Hijab",
        price: 250,
        originalPrice: 300,
        currency: "LE",
        image: "hijab-sage-green.jpeg",
        description: "Beautiful premium hijab with elegant drape and luxurious feel. Perfect for any occasion with its sophisticated style and comfortable fit.",
        colors: ["Light Gray", "White", "Cream", "Beige"],
        material: "Premium Fabric",
        size: "Standard Size",
        inStock: true,
        featured: true,
        rating: 4.9,
        reviews: 87
    }
];

// Function to create product card HTML
function createProductCard(product) {
    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    return `
        <div class="product-card ${!product.inStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.featured ? '<div class="product-badge featured">Featured</div>' : ''}
                ${discountPercentage > 0 ? `<div class="product-badge discount">-${discountPercentage}%</div>` : ''}
                ${!product.inStock ? '<div class="product-badge out-of-stock-badge">Out of Stock</div>' : ''}
                <div class="product-overlay">
                    <button class="btn primary-btn quick-view-btn" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-details">
                    <span class="product-material">${product.material}</span>
                    <span class="product-size">${product.size}</span>
                </div>
                <div class="product-colors">
                    ${product.colors.map(color => `<span class="color-dot" style="background-color: ${getColorCode(color)}" title="${color}"></span>`).join('')}
                </div>
                <div class="product-pricing">
                    <span class="current-price">${product.price} ${product.currency || 'LE'}</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">${product.originalPrice} ${product.currency || 'LE'}</span>` : ''}
                </div>
                <button class="btn primary-btn add-to-cart-btn" ${!product.inStock ? 'disabled' : ''} onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
}

// Function to get color codes for color dots
function getColorCode(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Navy': '#000080',
        'Burgundy': '#800020',
        'Cream': '#F5F5DC',
        'Light Gray': '#D3D3D3',
        'Dusty Rose': '#DCAE96',
        'Sage Green': '#9CAF88',
        'Blush Pink': '#FE828C',
        'Lavender': '#E6E6FA',
        'Mint': '#98FB98',
        'Ivory': '#FFFFF0',
        'Charcoal': '#36454F',
        'Mocha': '#967117',
        'Taupe': '#483C32',
        'Deep Purple': '#673AB7',
        'Emerald': '#50C878',
        'Gold': '#FFD700',
        'Silver': '#C0C0C0',
        'Soft Pink': '#F8BBD9',
        'Baby Blue': '#89CFF0',
        'Peach': '#FFCBA4',
        'Lilac': '#C8A2C8',
        'Forest Green': '#228B22',
        'Maroon': '#800000',
        'Royal Blue': '#4169E1',
        'Chocolate': '#D2691E',
        'Natural Beige': '#F5F5DC',
        'Olive': '#808000',
        'Terracotta': '#E2725B',
        'Stone Gray': '#928E85'
    };
    return colorMap[colorName] || '#CCCCCC';
}

// Function to load products
function loadHijabsProducts() {
    const productsGrid = document.getElementById('hijabs-products');
    const productsCount = document.getElementById('products-count');
    
    if (productsGrid) {
        productsGrid.innerHTML = hijabsProducts.map(product => createProductCard(product)).join('');
        
        if (productsCount) {
            productsCount.textContent = `${hijabsProducts.length} Product${hijabsProducts.length !== 1 ? 's' : ''}`;
        }
    }
}

// Cart functionality
function getCartKey() {
    // Get user-specific cart key
    if (window.authService && window.authService.getCurrentUser()) {
        const user = window.authService.getCurrentUser();
        return `zahoor_cart_${user.id}`;
    }
    return 'zahoor_cart'; // fallback for non-authenticated users
}

let cart = JSON.parse(localStorage.getItem(getCartKey())) || [];

// Quick view function
function quickView(productId) {
    const product = hijabsProducts.find(p => p.id === productId);
    if (product) {
        alert(`Quick View: ${product.name}\n\nPrice: ${product.price} ${product.currency}\nMaterial: ${product.material}\nSize: ${product.size}\n\n${product.description}`);
        // TODO: Implement proper modal for quick view
    }
}

// Add to cart function
function addToCart(productId) {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        showLoginRequired();
        return;
    }

    const product = hijabsProducts.find(p => p.id === productId);
    if (product && product.inStock) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency || 'LE',
                image: product.image,
                quantity: 1
            });
        }

        // Save cart to localStorage with user-specific key
        localStorage.setItem(getCartKey(), JSON.stringify(cart));

        // Update cart UI
        updateCartUI();

        // Show success message
        showCartSuccess(product.name);
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    // Check if user is authenticated via Supabase auth system
    if (window.authService && window.authService.isSignedIn()) {
        return true;
    }

    // Fallback check for localStorage/sessionStorage
    const user = localStorage.getItem('zahoor_user') || sessionStorage.getItem('zahoor_user');
    return user !== null;
}

// Show login required message
function showLoginRequired() {
    alert("You need to be signed in to add items to your cart.\n\nPlease sign in to your account or create a new account to start shopping.");
}

// Show cart coming soon message
function showCartComingSoon() {
    alert("🛒 Shopping Cart\n\nCart functionality is coming soon!\nWe're working on implementing the full shopping cart experience.\n\nItems in cart: " + cart.length + "\nStay tuned for updates! 🚀");
}



// Show cart success message
function showCartSuccess(productName) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast success';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>Added "${productName}" to cart!</span>
            <a href="cart.html" class="view-cart-btn">View Cart</a>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Update cart UI (cart icon badge)
function updateCartUI() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    let cartCountElement = document.querySelector('.cart-count');

    if (!cartCountElement) {
        // Create cart icon in header if it doesn't exist
        const nav = document.querySelector('nav ul');
        const cartLi = document.createElement('li');
        cartLi.style.setProperty('--i', '7');
        cartLi.innerHTML = `
            <span class="cart-display" data-cart-nav="true">
                <i class="fas fa-shopping-cart"></i>
                <span>Cart</span>
                <span class="cart-count">${cartCount}</span>
            </span>
        `;

        // Add click event listener separately to avoid conflicts
        const cartDisplay = cartLi.querySelector('.cart-display');
        cartDisplay.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            console.log('Cart clicked, showing coming soon message...');

            // Show coming soon message
            showCartComingSoon();
        }, true); // Use capture phase
        nav.appendChild(cartLi);
        cartCountElement = cartLi.querySelector('.cart-count');
    } else {
        cartCountElement.textContent = cartCount;
    }

    // Show/hide count based on cart count
    cartCountElement.style.display = cartCount > 0 ? 'inline-block' : 'none';
}

// Show cart modal
function showCart() {
    if (!isUserLoggedIn()) {
        showLoginRequired();
        return;
    }

    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Your Cart</h3>
                <button class="close-modal" onclick="closeCartModal()">&times;</button>
            </div>
            <div class="cart-modal-body">
                ${cart.length === 0 ? '<p class="empty-cart">Your cart is empty</p>' : generateCartHTML()}
            </div>
            ${cart.length > 0 ? `
                <div class="cart-modal-footer">
                    <div class="cart-total">
                        <strong>Total: ${calculateCartTotal()} LE</strong>
                    </div>
                    <button class="btn primary-btn checkout-btn" onclick="proceedToCheckout()">
                        <i class="fas fa-credit-card"></i> Proceed to Checkout
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    document.body.appendChild(cartModal);
    setTimeout(() => cartModal.classList.add('show'), 10);
}

// Generate cart HTML
function generateCartHTML() {
    return cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price} ${item.currency}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateCartQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 1)" class="quantity-btn">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart quantity
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem(getCartKey(), JSON.stringify(cart));
            updateCartUI();
            // Refresh cart modal if open
            const cartModal = document.querySelector('.cart-modal');
            if (cartModal) {
                closeCartModal();
                showCart();
            }
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    updateCartUI();

    // Refresh cart modal if open
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        closeCartModal();
        showCart();
    }
}

// Close cart modal
function closeCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert(`Checkout functionality will be implemented here.\n\nTotal: ${calculateCartTotal()} LE\nItems: ${cart.length}`);
    // TODO: Implement checkout process
}

// Load user's cart when they sign in
function loadUserCart() {
    if (isUserLoggedIn()) {
        cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
        updateCartUI();
    }
}

// Initialize products when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadHijabsProducts();
    loadUserCart(); // Load user's cart
    updateCartUI(); // Initialize cart UI on page load

    // Listen for auth state changes
    if (window.authService) {
        // Check periodically if user logged in (simple approach)
        setInterval(() => {
            if (isUserLoggedIn()) {
                loadUserCart();
            }
        }, 1000);
    }
});
