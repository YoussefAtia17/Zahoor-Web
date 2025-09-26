// Cart Page Functionality

// Local authentication check for cart page
function isUserLoggedInCart() {
    // Check if authService is available and user is signed in
    if (window.authService && typeof window.authService.isSignedIn === 'function') {
        return window.authService.isSignedIn();
    }

    // Fallback: check if products.js isUserLoggedIn function is available
    if (typeof isUserLoggedIn === 'function') {
        return isUserLoggedIn();
    }

    // Final fallback: check localStorage directly
    const user = localStorage.getItem('zahoor_user') || sessionStorage.getItem('zahoor_user');
    return user !== null;
}

// Load cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth service completely and use localStorage directly
    console.log('Cart page loading...');

    // Check localStorage directly for user data (more reliable)
    const hasUserData = localStorage.getItem('zahoor_user') ||
                       sessionStorage.getItem('zahoor_user') ||
                       document.querySelector('#profile-box')?.style.display !== 'none';

    if (hasUserData) {
        console.log('User data found, loading cart...');
        loadCartPage();
        updateCartSummary();
    } else {
        console.log('No user data found, showing login required');
        showLoginRequiredPage();
    }
});

// Show login required message for cart page
function showLoginRequiredPage() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = `
        <div class="login-required-cart">
            <div class="login-required-content">
                <i class="fas fa-lock"></i>
                <h2>Sign In Required</h2>
                <p>You need to be signed in to view your shopping cart and make purchases.</p>
                <div class="login-actions">
                    <a href="signin.html" class="btn primary-btn">Sign In</a>
                    <a href="signup.html" class="btn secondary-btn">Create Account</a>
                </div>
                <a href="index.html" class="back-home">
                    <i class="fas fa-arrow-left"></i>
                    Back to Home
                </a>
            </div>
        </div>
    `;
}

// Load cart items on cart page
function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItemsCount = document.getElementById('cart-items-count');

    // Load cart from localStorage directly (safer)
    const cartKey = 'zahoor_cart'; // Use simple key for now
    const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cartData.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-page">
                <i class="fas fa-shopping-bag"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="hijabs.html" class="btn primary-btn">
                    <i class="fas fa-plus"></i>
                    Start Shopping
                </a>
            </div>
        `;
        cartItemsCount.textContent = '0 items';
        return;
    }
    
    cartItemsCount.textContent = `${cartData.length} item${cartData.length !== 1 ? 's' : ''}`;

    cartItemsContainer.innerHTML = cartData.map(item => `
        <div class="cart-page-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">${item.price} ${item.currency}</p>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button onclick="updateCartQuantityPage(${item.id}, -1)" class="quantity-btn minus">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button onclick="updateCartQuantityPage(${item.id}, 1)" class="quantity-btn plus">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button onclick="removeFromCartPage(${item.id})" class="remove-item-btn">
                        <i class="fas fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
            <div class="item-total">
                <span class="total-price">${item.price * item.quantity} ${item.currency}</span>
            </div>
        </div>
    `).join('');
}

// Update cart quantity on cart page
function updateCartQuantityPage(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCartPage(productId);
        } else {
            localStorage.setItem(getCartKey(), JSON.stringify(cart));
            loadCartPage();
            updateCartSummary();
            updateCartUI();
        }
    }
}

// Remove from cart on cart page
function removeFromCartPage(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    loadCartPage();
    updateCartSummary();
    updateCartUI();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = calculateCartTotal();
    const shipping = 0; // Free shipping
    const tax = Math.round(subtotal * 0.14); // 14% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `${subtotal} LE`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'Free' : `${shipping} LE`;
    document.getElementById('cart-tax').textContent = `${tax} LE`;
    document.getElementById('cart-total').textContent = `${total} LE`;
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Cart is Empty';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to Checkout';
        checkoutBtn.onclick = proceedToCheckoutPage;
    }
}

// Proceed to checkout from cart page
function proceedToCheckoutPage() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = calculateCartTotal() + Math.round(calculateCartTotal() * 0.14);
    alert(`Checkout functionality will be implemented here.\n\nTotal: ${total} LE\nItems: ${cart.length}\n\nThis will redirect to payment processing.`);
    // TODO: Implement actual checkout process
}
